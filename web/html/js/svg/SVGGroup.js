/**
 * Utilities para gestionar un elemento grupo de SVG
 * 
 * NOTA RESPECTO A LAS UNIDADES DE MEDICIÓN
 * Existen dos tipos de unidades:
 * - u.p. : unidades de pantalla. Son los píxeles de pantalla y son invariantes 
 *          a los zooms: un píxel es un píxel.
 * - u.v. : unidades del visor. Depende del zoom. Cuando zoom=1, las u.p.=u.v
 *          Si zoom=2, 50u.v. = 100u.p.
 * W = Ancho (u.p.) del grupo
 * H = Alto (u.p.) del grupo
 *           
 * TODO : Mirarse a fondo Raphäel e integrar ahí
 * 
 * @return
 */
function SVGGroup(id, W, H) {
	this.group = YAHOO.util.Dom.get(id);
	
	// Tamaño del visor
	this.visorW = W;
	this.visorH = H;
	
	// Offsets del centro desplazado
	// Inicialmente, lo queremos en el centro
	// Se miden en u.p.	
	this.offsetX = W/2;
	this.offsetY = H/2;
	
	// Nivel de zoom actual
	this.zoom = 1;
	
	// Offset con el puntero para evitar problemas con los eventos
	/*
	this.pointerOffsetX = 0;
	this.pointerOffsetY = 0;
	*/
	
	// Niveles de zoom permitidos
	this.minZoom=0.1;
	this.maxZoom=10;
	
	// Evento cuando hay zoom
	this.eventZoom = null;
	
	// Mostramos el grupo con el offset inicial
	this.translate(0,0);
	
	// Nos vamos guardando los paths que creamos
	this.paths = new Array();
	// El ind del path que estamos mostrando (para el play)
	// TODO : ¿no podemos eliminarla?
	this.indPath = 0;
	
	// Nos guardamos la config inicial para cuando hagamos limpia()
	this.iniZoom    = this.zoom;
	this.iniOffsetX = this.offsetX;
	this.iniOffsetY = this.offsetY;
}

SVGGroup.prototype.addElement = function (ele) {
	this.group.appendChild(ele); 
}

SVGGroup.prototype.setEventZoom = function (eventZoom) {
	this.eventZoom = eventZoom;
}

/**
 * Realiza un desplazamiento de (dX, dY) medido en u.p.
 */
SVGGroup.prototype.translate = function (dX, dY) {
	this.offsetX += dX;
	this.offsetY += dY;
	
	// Modificamos la propiedad transform del grupo
	//var currTransform = svg.getAttribute('transform');
	var transform = 'scale (' + this.zoom + ') translate(' + this.offsetX/this.zoom + ' ' + this.offsetY/this.zoom + ')';
	this.group.setAttribute('transform', transform);
	
	Logger.getInstance().lowDebug("OFFSET (" + this.offsetX + "," + this.offsetY + ")", "logOffset");
}

/**
 * Zoom radial con centro en X,Y, medidas en u.p.
 * 
 * Pej. si estamos mostrando un área de 600px X 600px y queremos hacer el zoom 
 * radial con el centro el del visor, X e Y será 300. 
 */
SVGGroup.prototype.zoomRadial = function (delta, X, Y) {
	if ( this.minZoom && (this.zoom + delta)<this.minZoom ||
		 this.maxZoom && (this.zoom + delta)>this.maxZoom )
		return;
	
	var newZoom = this.zoom + delta;
	var factor = newZoom/this.zoom;
	
	// Cambiamos los stroke-width
	// NOTA : Lo hacemos así en vez de mantener una lista de paths para
	// que resulte más sencillo el edit
	if ( TOOLBOX.isZoomChangeStrokeWidth() ) {
		YAHOO.util.Dom.getElementsBy(function(ele) {return true;}, "path", this.group, function(ele, factor) {
			ele.setAttribute("stroke-width", ele.getAttribute("stroke-width")/factor);
		}, factor);
	}

	
	if ( this.eventZoom ) {
		this.eventZoom.fire({newZoom:newZoom, oldZoom:this.zoom});
	}
	// Esta es la transformación que vamos a llevar a cabo (que será, ya te lo
	// digo yo, un escalado y una traslación)
	
	// Cuando esta operación se lleva a cabo, el grupo está afectado por un 
	// zoom de 'zoom' y un offset de (offsetX, offsetY).
	//
	// El punto que ocupa las coordenadas X,Y (vamos, el centro del visor) son, 
	// en u.v. (para este zoom, recordar que las u.v. dependen del nivel de zoom)
	// P = (X-offsetX)/zoom
	// Cuando le apliquemos el newZoom, el punto P' que estará ahí será
	// P' = (X-offsetX)/newZoom
	// Ahora bien, si queremos hacer un zoom radial, queremos que el en centro 
	// esté el punto P, no P'. Para lograrlo, tenemos que aplicar un desplazamiento,
	// medido en u.v., de P-P', o lo que es lo mismo
	// desp (u.v.) = P-P' = (X-offsetX)/zoom - (X-offsetX)/newZoom
	// Ahora bien, lo que quiero es medirlo en u.p., por lo que tengo quer 
	// multiplicarlo por newZoom. Esto me dará lo que tengo que incrementar el offset
	// incOffset = ((X-offsetX)/zoom - (X-offsetX)/newZoom)*newZoom
	// por lo que el nuevo oofset será
	// newOffset = offsetX - ((X-offsetX)/zoom - (X-offsetX)/newZoom)*newZoom
	
	var incOffsetX = ( (X-this.offsetX)/this.zoom - (X-this.offsetX)/newZoom ) * newZoom;
	var incOffsetY = ( (Y-this.offsetY)/this.zoom - (Y-this.offsetY)/newZoom ) * newZoom;
	
	this.offsetX -= incOffsetX;
	this.offsetY -= incOffsetY;
	this.zoom     = newZoom;
	
	Logger.getInstance().lowDebug(this.zoom, "logZoom");
	Logger.getInstance().lowDebug("(" + this.offsetX + "," + this.offsetY + ")", "logOffset");
	
	var transform = 'scale (' + this.zoom + ') translate(' + this.offsetX/this.zoom + ' ' + this.offsetY/this.zoom + ')';
	this.group.setAttribute('transform', transform);
	
	// Modificamos el valor de stroke-with según el zoom
	
}

SVGGroup.prototype.createLine = function(group, inicio, style ) {
	var puntos = "M";
	puntos += (inicio[0] - this.offsetX)/this.zoom;
	puntos += ',';
	puntos += (inicio[1] - this.offsetY)/this.zoom;
	puntos += ' L';
	
	var p  = document.createElementNS(SVGUtil.SVG_NAMESPACE,"path");
	p.setAttribute('d', puntos);
	if ( style ) {
		p.setAttribute('style' , style);
	}
    group.appendChild(p);
    // Nos guardamos el elemento creado
    //this.paths.push(p);
    
    Logger.getInstance().lowDebug("START PATH : " + puntos , "logUv");
	
	return p;
}

/** Transforma las coordenadas de un punto teniendo en cuanta el offset y 
 * el zoom actual
 */
SVGGroup.prototype.transformaCoordenadas = function(punto) {
	return [(punto[0] - this.offsetX)/this.zoom,(punto[1] - this.offsetY )/this.zoom];
}

SVGGroup.prototype.addPoint2Line = function(path, punto) {
	if ( path==null ) return;
	
	var puntoPath = "";
	puntoPath += (punto[0] - this.offsetX)/this.zoom ;
	puntoPath += ',';
	puntoPath += (punto[1] - this.offsetY )/this.zoom ;
	puntoPath += ' ';
	
	path.setAttribute('d', path.getAttribute('d')+puntoPath);
	
	Logger.getInstance().lowDebug("ADD POINT : " + puntoPath, "logUv");
}

SVGGroup.prototype.add2Line = function(path, msg) {
	if ( path==null ) return;
	
	path.setAttribute('d', path.getAttribute('d')+msg);	
}


/**
 * Volvemos al grupo inicial
 */
SVGGroup.prototype.limpia = function() {
	// Ocultamos todos
	/*
	for ( var ind = 0; ind < this.paths.length; ind++) {
		var path = this.paths[ind];
		YAHOO.util.Dom.addClass(path,"oculto");
	}
	*/
	// Eliminamos todos los hijos
	if ( this.group.hasChildNodes() )
	{
	    while ( this.group.childNodes.length >= 1 )
	    {
	    	this.paths.push(this.group.firstChild.cloneNode(true));
	    	this.group.removeChild( this.group.firstChild );       
	    } 
	}
	// Regresamos a las condiciones iniciales de offset y zoom
	this.zoom    = this.iniZoom;
	this.offsetX = this.iniOffsetX;
	this.offsetY = this.iniOffsetY;
	this.translate(0,0);	
}

SVGGroup.prototype.play = function() {
	this.limpia();
	this.indPath = 0;
	this.playWithTimer();
}

// Funciones "internas"
SVGGroup.prototype.playWithTimer = function() {
	var myself = this;
	setTimeout(function(){
		if ( myself.indPath < myself.paths.length ) {
			// Mostramos un path
			// YAHOO.util.Dom.removeClass(myself.paths[myself.indPath],"oculto");
			myself.group.appendChild(myself.paths[myself.indPath]);			
			
			// Nos guardamos la imagen
			// Primero la ponemos en un canvas HTML5
			alert("POR AQUI NO DEBERIA PASAR SVGGroup.prototype.playWithTimer");
		    var svg_xml = (new window.XMLSerializer()).serializeToString(document.getElementById("mySVG"));			
			canvg('html5canvas', svg_xml);
			// y luego usamos el método toDataUrl
			var canvas = YAHOO.util.Dom.get('html5canvas');
			//window.open(canvas.toDataURL());
			
			// Submit form
		    YAHOO.util.Connect.asyncRequest('POST', '../php/saveSvg.php', {
				success: function(o) { },
	      		failure: function(o) { alert("Error : " + o.responseText); }
		    }, "image=" + svg_xml + "&ind="+myself.indPath);
		    /*
			var form = document.forms.saveImage;
			form.image.value = canvas.toDataURL();
			form.ind.value = myself.indPath;
			form.submit();
			*/
			//alert(canvas.toDataURL());
			/*
			// Creamos un elemento img
			var sequence = YAHOO.util.Dom.get('sequence');
			var img = document.createElement("img");
			sequence.appendChild(img);
			*/
			
			++myself.indPath;
			myself.playWithTimer();
		}
	},1000);
}

/**
 * Guarda el SVG
 */
SVGGroup.prototype.saveSvg = function() {
	alert("POR AQUI NO DEBERIA PASAR SVGGroup.prototype.saveSvg");
	
    var svg_xml = (new window.XMLSerializer()).serializeToString(document.getElementById("mySVG"));			
    YAHOO.util.Connect.asyncRequest('POST', '../php/saveSvg.php', {
		success: function(o) { },
  		failure: function(o) { alert("Error : " + o.responseText); }
    }, "image=" + svg_xml + "&ind="+this.paths.length);
	
}