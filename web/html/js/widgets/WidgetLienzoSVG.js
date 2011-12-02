/**
 * Lienzo como SVG
 *  
 * @return
 */
function WidgetLienzoSVG() {
	WidgetLienzoSVG.superclass.constructor.call(this);
	
	// DOM con el SVG
	this.eSVG

	// El objeto SVGGroup
	// TODO - Lo necesitamos porque este elemento lleva "la cuenta" del zoom 
	// y de la posición, y lo necesitamos para crear las líneas de manera correcta.
	// Lo suyo es "despojarle" de esta responsabilidad y que SVGGroup sólo 
	// fuese el interface al elemento <group>
	this.svgGroup = null;
	
	// elemento svg del texto
	this.svgFooterText = null;
	
	// widget con el preview del vídeo
	this.widgetVideo = null;
	
	// Campo input con el texto svg
	this.eSvgText = YAHOO.util.Dom.get("svgText");
	
	// línea actual
	this.currLine = null;
	
	// número puntos que nos saltamos
	// Ahora es configurable
	// this.totJump=10;
	// indJump
	this.indJump=0;
	
	// paths creados
	// this.paths = new Array();
	// Para el save
	this.ind2Save=0;
	this.lastSaveTime=null;
	
	// Visor SVG
	this.visorSVG = null;
	
	// Background del lienzo
	this.background = null;
}
YAHOO.lang.extend(WidgetLienzoSVG, WidgetLienzo);

// TODO (lo llama WidgetVideoFotograma cuando Edit)
WidgetLienzoSVG.prototype.refresh = function(eSVG) {
	this.eSVG = YAHOO.util.Dom.get("mySVG");
	this.eGroup   = YAHOO.util.Dom.get("mainGroup");
	this.svgGroup = new SVGGroup("mainGroup", 640, 480);
	if ( this.eventZoom ) {
		this.svgGroup.setEventZoom(this.eventZoom);
	}
	this.svgFooterText = YAHOO.util.Dom.get("footerText");
}

WidgetLienzoSVG.prototype.render = function() {
	WidgetLienzoSVG.superclass.render.call(this);

	// TODO
	this.eSVG = YAHOO.util.Dom.get("mySVG");
	this.eGroup   = YAHOO.util.Dom.get("mainGroup");
	this.svgGroup = new SVGGroup("mainGroup", 640, 480);
	if ( this.eventZoom ) {
		this.svgGroup.setEventZoom(this.eventZoom);
	}
	this.svgFooterText = YAHOO.util.Dom.get("footerText");
	//this.svgGroup = new SVGGroup("mainGroup", 0, 0);
	
	// Background
	var fondoNegro = new SVGRect();
	fondoNegro.render();
	this.background = fondoNegro.getDom(); 
	
	// Campo SVG text
	if ( this.eSvgText ) {
		// TODO ¿se pueden pasar parámetros al KeyListener)
		var myself = this;
	    new YAHOO.util.KeyListener(
	    		this.eSvgText, 
	    		{
	    			ctrl:false, 
	    			keys:13 
	    		},
	            { 
	    		  fn : function(event) {
	    				 var text = myself.eSvgText.value;
	    				 myself.writeText(myself.eSvgText.value);
	    			   }
	    		}
	    ).enable();
	}
	
	// Visor SVG
	if ( this.isLocal ) {
		this.visorSVG = new WidgetVisorSVG();
		this.visorSVG.setVisor("visorMovie");
		this.visorSVG.setLienzo(this);
		this.visorSVG.render();
	// Widget Video
	} else {
		this.widgetVideo = new WidgetVideoHTML5();
		this.widgetVideo.setWidth(640);
		this.widgetVideo.setHeight(480);
		this.widgetVideo.setContainer("visorMovie");
		this.widgetVideo.render();
	}
	
	// Marcamos el centro
	/*
	var path = this.svgGroup.createLine(this.eGroup, [350,190], 0, 0, this.style);
	this.svgGroup.addPoint2Line(path, [360,200], 0, 0);
	this.svgGroup.addPoint2Line(path, [350,210], 0, 0);
	this.svgGroup.addPoint2Line(path, [340,200], 0, 0);
	this.svgGroup.addPoint2Line(path, [350,190], 0, 0);
	*/
	// Por defecto, fondo negro
	//this.addFondoNegro();
	
	// Limpiamos (ya está limpio, pero es para limpiar los datos del servidor)
	this.limpia();
}

/* Limpia el lienzo */
WidgetLienzoSVG.prototype.limpia = function() {
	// Borramos todo el lienzo
	this.svgGroup.limpia();
    // Reset de algunas variables
	this.ind2Save=0;
	this.lastSaveTime=null;
	
	if ( this.isLocal ) {
		this.visorSVG.limpia();
	} else {
		// Ocultamos el preview de la peli
		this.widgetVideo.hide();
		// Limpiamos los datos del servidor
	    YAHOO.util.Connect.asyncRequest('POST', '../php/cleanData.php', {
			success: function(o) { },
	  		failure: function(o) { alert("Error : " + o.responseText); }
	    });
	}
	
	// Nos guardamos el primero fotograma
	// this.save(false);
}

WidgetLienzoSVG.prototype.play = function() {
	if ( this.isLocal ) {
		//alert("play local");
		this.visorSVG.play();
	} else {
		// this.svgGroup.play();
		// Generate Movie
		var myself = this;
	    YAHOO.util.Connect.asyncRequest('POST', '../php/generateMovie.php', {
			success: function(o) { 
	    		alert("Película generada con éxito...");
	    		// Mostramos el preview de la peli
	    	    myself.widgetVideo.show("../data/movie/peli.ogv");
	        },
	  		failure: function(o) { alert("Error : " + o.responseText); }
	    });
	}
}


/*
//Obtain a portion of the graphic data  
WidgetLienzoSVG.prototype.getImageData = function(w, h) {       

  // Not all browsers implement createImageData. On such browsers  
  // we obtain the ImageData object using the getImageData method.   
  // The worst-case scenario is to create an object *similar* to  
  // the ImageData object and hope for the best luck.       
  if (this.context.createImageData) {        
    return this.context.createImageData(w, h);       
  } else if (this.context.getImageData) {         
    return this.context.getImageData(0, 0, w, h);       
  } else {         
    return {'width' : w, 'height' : h, 'data' : new Array(w*h*4)};       
  }   
}  

//Draw a pixel on the canvas     
WidgetLienzoSVG.prototype.drawPoint = function(x, y) {            
  // Calculate the pixel offset from the coordinates       
  var idx = (x + (y * this.imgd.width)) * 4;        

  // Modify the graphic data       
  this.imgd.data[idx] = 0;     // Red       
  this.imgd.data[idx+1] = 0;   // Green       
  this.imgd.data[idx+2] = 0;   // Blue       
  this.imgd.data[idx+3] = 255; // Alpha channel     
}      
*/

// ---------------------------------------------------------------- WidgetLienzo
WidgetLienzoSVG.prototype.startPath = function(punto) {
	this.currLine = this.svgGroup.createLine(this.eGroup, punto);
	TOOLBOX.applyStyle(this.currLine);
}

WidgetLienzoSVG.prototype.addPoint2Path = function(punto, addOnlyCoordinates) {
	++this.indJump;
	// Si añadimos un punto al path es porque la herramienta activa es la de 
	// líneas y ésta tiene definida el atributo de num. puntos a saltar
	var numPuntosSaltar = TOOLBOX.getPaintToolActiva().getNumPuntosSaltar(); 
	if ( numPuntosSaltar==0 || this.indJump==numPuntosSaltar ) {
		this.svgGroup.addPoint2Line(this.currLine, punto);
		this.indJump=0;
	}
}

WidgetLienzoSVG.prototype.endPath = function(punto) {
	this.svgGroup.addPoint2Line(this.currLine, punto);
	// TODO - Mejorar
	// Llama a la función de suavizado de la línea
	// Si está activa la opción de suavizar paths, lo ejecutamos
	if ( TOOLBOX.isSuavizarPath() ) {
		parsePath(this.currLine);
	}
	this.currLine = null;
	
	// Ahora debería capturar el path que se acaba de crear y guardarlo en la 
	// lista, para cuando haga el play()
	// Un truqui es que es el último hijo del elemento grupo
	//alert("Se añade un path");
	//this.paths.push(this.eGroup.lastChild);
	// Guardamos el SVG
	this.save(true);
}

WidgetLienzoSVG.prototype.translate = function (dX, dY) {
	this.svgGroup.translate(dX, dY);
	if ( TOOLBOX.isMoveCreaFotogramas() ) {
		this.save(false);
	}
}

WidgetLienzoSVG.prototype.doZoom = function (delta) {
	this.svgGroup.zoomRadial(delta/5, 350, 200);
	if ( TOOLBOX.isZoomCreaFotogramas() ) {
		this.save(false);
	}
}
/*
WidgetLienzoSVG.prototype.save = function () {
	// Codificamos base64 la imagen SVG 
    // https://developer.mozilla.org/en/XMLSerializer
    // http://en.wikipedia.org/wiki/SVG#Native_support
    // https://developer.mozilla.org/en/DOM/window.btoa
    var svg_xml = (new window.XMLSerializer()).serializeToString(document.getElementById("mySVG"));
    document.getElementById("svgContent").value = svg_xml; 
    var imgBase64 = window.btoa(svg_xml);
    var mimetype="data:image/svg+xml";

    // Creamos un objeto Image con esa imagen
    var img = new Image();
    img.src = mimetype + ";base64," + imgBase64;
    
    // Opcional : Colocamos esta imagen en un Canvas HTML5
    img.onload = function() {
    	var canvas = document.getElementById("myCanvas");
    	var ctx = canvas.getContext('2d');
        // after this, Canvas’ origin-clean is DIRTY
        ctx.drawImage(img, 0, 0);
        var strDataURI = canvas.toDataURL();
        alert(strDataURI);
    }
}
*/
WidgetLienzoSVG.prototype.save = function(isPathChanged) {
	// Sólo grabamos si lo que ha cambiado es un path o ha pasado 
	// un tiempo prudencial
	var now = (new Date()).getTime();
	if ( !isPathChanged && this.lastSaveTime && (now-this.lastSaveTime) < 500 ) return;
	this.lastSaveTime=now;
	
	var templequeLevel  = TOOLBOX.getTemblequeLevel();
	var actionOnSave    = TOOLBOX.getActionWhenMouseReleased();
	
	if ( this.isLocal ) {
		this.visorSVG.addFotograma(this.eSVG, isPathChanged, templequeLevel , actionOnSave);
	} else {
		// Vamos a calcular cuantos ficheros vamos a generar
		var numFiles2Generate;
	    // Si es un save por path, el número de pasos es el número de arcos
	    if ( isPathChanged ) {
	    	var dAttr = YAHOO.util.Dom.getAttribute(this.eGroup.lastChild, "d");
	    	// Contamos el número de veces aparece 'C'
	    	numFiles2Generate = dAttr.split(/C/gi).length - 1;
	    // Si no, sólo es un cambio	
	    } else {
	    	numFiles2Generate=1;
	    }
	    
	    Logger.getInstance().log("save [" + this.ind2Save + "]. numFiles2Generate : " + numFiles2Generate + " ...");  
	    // Incrementamos el índice (lo hacemos ahora para evitar problemas de 
	    // sincronía, aunque no sé si esto sirve)
	    var myInd = this.ind2Save;
	    this.ind2Save += numFiles2Generate; 
		
	    var svg_xml = (new window.XMLSerializer()).serializeToString(document.getElementById("mySVG"));			
	    YAHOO.util.Connect.asyncRequest('POST', '../php/saveSvg.php', 
	    {
		  success: function(o) { 
	    	var data = YAHOO.lang.JSON.parse(o.responseText);
	    	Logger.getInstance().log("FIN save [" + data.startInd + "]. endInd : " + data.endInd); 
	      },
	      failure: function(o) { alert("Error : " + o.responseText); }
	    }, "image="              + svg_xml + 
	       "&ind="               + myInd   + 
	       "&numFiles2Generate=" + numFiles2Generate +  
	       "&isPathChanged="     + (isPathChanged ? "1" : "0") + 
	       "&temblequeLevel="    + templequeLevel + 
	       "&actionOnSave="      + actionOnSave
	    );
	}
}

/**
 * Escribe un texto en la parte inferior
 */
WidgetLienzoSVG.prototype.writeText = function(text) {
	// TODO - Truco para borrar
	// Parace que textNode.nodeValue = ""; NO borra
	if ( !text || text.length==0 ) text =" ";
	var textNode = this.svgFooterText.firstChild; 
	if ( textNode==null ) {
		textNode = document.createTextNode(text);
		this.svgFooterText.appendChild(textNode);
	} else {
		textNode.nodeValue = text;
	}
	this.save(false);
}

WidgetLienzoSVG.prototype.drawCirculo = function (centro) {
	var cirulo = new SVGCirculo();
	cirulo.setCentro(this.svgGroup.transformaCoordenadas(centro));
	// Nos la jugamos: como estamos dibujando círculos la herramienta activa 
	// será.... la de dibujar círculos ¿no?
	cirulo.setRadio(TOOLBOX.getPaintToolActiva().getRadio());
	TOOLBOX.applyStyle(cirulo);
	cirulo.render();
	this.svgGroup.addElement(cirulo.getDom());
	this.save(false);
}

// FONDO NEGRO
WidgetLienzoSVG.prototype.addFondoNegro = function () {
	// Se tiene que añadir antes del elemento <g>
	this.eSVG.insertBefore(this.background, this.eGroup);
}

WidgetLienzoSVG.prototype.removeFondoNegro = function () {
	this.eSVG.removeChild(this.background);	
}
