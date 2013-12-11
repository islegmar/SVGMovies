/**
 * Utilities varias de SVG
 */
function SVGUtil() {
	// Posicionamiento de las líneas de texto
	//this.margin = 5;
	//this.interlineado = 10;
}

SVGUtil.SVG_NAMESPACE = "http://www.w3.org/2000/svg";
SVGUtil.XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";
SVGUtil.SIN30 = Math.sin(Math.PI/6);
SVGUtil.COS30 = Math.cos(Math.PI/6);

SVGUtil.DIRECCIONES = ['N', 'NE', 'SE', 'S', 'SW', 'NW'];


SVGUtil.prototype.svg2Img = function (domSvg, html5canvas) {
	// Codificamos base64 la imagen SVG 
    // https://developer.mozilla.org/en/XMLSerializer
    // http://en.wikipedia.org/wiki/SVG#Native_support
    // https://developer.mozilla.org/en/DOM/window.btoa
    var svg_xml = (new window.XMLSerializer()).serializeToString(domSvg);
    //document.getElementById("svgContent").value = svg_xml; 
    var imgBase64 = window.btoa(svg_xml);
    var mimetype="data:image/svg+xml";

    // Creamos un objeto Image con esa imagen
    var img = new Image();
    img.src = mimetype + ";base64," + imgBase64;
    
    // Opcional : Colocamos esta imagen en un Canvas HTML5
    img.onload = function() {
    	var ctx = html5canvas.getContext('2d');
        // after this, Canvas’ origin-clean is DIRTY
        ctx.drawImage(img, 0, 0);
        var strDataURI = canvas.toDataURL();
        alert(strDataURI);
    }
}



// -------------------------------- REPASAR --------------------------------- //

/**
 * Devuelve un elemento que representa un hexágono, con centro en 'center' y radio r
 * Los textos los pongo en las aristas. Es un mapa con las llaves los puntos cardinales:
 * N, NE, SE, S, SW y NW
 */
SVGUtil.addHexagon = function(svgGroup, X, Y, r, style, textos, id) {
    // Todo lo meto en un grupo
    var myGroup  = document.createElementNS(SVGUtil.SVG_NAMESPACE,"g");
    myGroup.setAttribute('transform','translate(' + (X) + ',' + (Y) + ')');
    
    // Background
    //var bgPattern = SVGUtil.createPattern(id, 'http://www.mcfarlanes-figures.com/image-files/the-spirit-logo.jpg', 2*r, 2*r);
    // TODO : Los colores......
    var bgPattern = SVGUtil.createColorPattern(id, 2*r, 2*r, 'grey');
    myGroup.appendChild(bgPattern);

    // Ahora creo el hexágono
	var w = r*SVGUtil.SIN30;
	var h = r*SVGUtil.COS30;
	
	var puntos= "";
	puntos+= (-w) + "," + (-h) + " ";
	puntos+= (+w) + "," + (-h) + " ";
	puntos+= (+r) + "," + (+0) + " ";
	puntos+= (+w) + "," + (+h) + " ";
	puntos+= (-w) + "," + (+h) + " ";
	puntos+= (-r) + "," + (+0) + " ";
	
	var p  = document.createElementNS(SVGUtil.SVG_NAMESPACE,"polygon");
	p.setAttribute('points', puntos);
	p.setAttribute('style' , style);
	if ( bgPattern ) {
		p.setAttribute('fill' , 'url(#' + bgPattern.id + ')');
	}
	
    // TODO : Arreglar un poco 
    svgGroup.addElement(myGroup);
	myGroup.appendChild(p);
	
	
	// Creamos el espacio para las líneas
	// TODO : Mejorar
	var margin = 6;
	var interlineado = 4;
	
	// Función para calcular las coordenadas del texto cuando éste es el N.
	// A partir de esa posiciñon, se determinan dos ángulos:
	// - angOrigen      : determina lo que tenemos que rotar éste punto para obtener
	//                    la nueva posición.
	// - angOrientacion : determina lo que giramos el texto sobre el NUEVO origen
	// ang está en grados
	function getCoorde(numLinea, ang) {
		// Coordenadas en el 0,0 del N (sin rotar)
		var x=-(r-margin-(numLinea+1)*interlineado)*SVGUtil.SIN30;
		var y=-(r-margin-(numLinea+1)*interlineado)*SVGUtil.COS30;
		var angRad = (Math.PI*ang)/180;
		
		//return [X+(x*Math.cos(angRad) - y*Math.sin(angRad)),Y+(x*Math.sin(angRad) + y*Math.cos(angRad))];
		return [(x*Math.cos(angRad) - y*Math.sin(angRad)),(x*Math.sin(angRad) + y*Math.cos(angRad))];
	}
	
	// TODO : ¿No hay una manera más elegante?
	for(var indDirec=0; indDirec<SVGUtil.DIRECCIONES.length; ++indDirec) {
		var key = SVGUtil.DIRECCIONES[indDirec];
		var angOrigen = 0;
		var angOrientacion = null;
		switch (key) {
		case 'N':
			angOrigen = 0;
			break;
		case 'NE':
			angOrigen = 60;
			angOrientacion = 60;
			break;
		case 'SE':
			angOrigen = 180;
			angOrientacion = -60;
			break;
		case 'S':
			angOrigen = 240;
			break;
		case 'SW':
			angOrigen = 300;
			angOrientacion = 60;				
			break;
		case 'NW':
			angOrigen = 300;
			angOrientacion = -60;
			break;
		default:
			alert("Key '" + key + "' desconocida.");
			break;
		}
		
		// Creamos 5 líneas
		for(var ind=0; ind<5; ++ind ) {
			var coord = getCoorde(ind, angOrigen);
			
			var text  = document.createElementNS(SVGUtil.SVG_NAMESPACE,"text");
			text.id = key+"[" + ind + "]#"+id;
			text.setAttribute('x', coord[0]);
			text.setAttribute('y', coord[1]);
			text.setAttribute('font-size', 4);
			text.setAttribute('font-family', 'Verdana');
			if ( angOrientacion ) {
				text.setAttribute('transform','rotate(' + angOrientacion + ' ' + (coord[0]) + "," + (coord[1]) + ')');
			}

			text.appendChild(document.createTextNode(""));
            myGroup.appendChild(text);
		}
	}
	
	
	// Añadimos los textos (si hay)
	if ( textos ) {
		for(var indDirec=0; indDirec<SVGUtil.DIRECCIONES.length; ++indDirec) {
			var key = SVGUtil.DIRECCIONES[indDirec];
			
			SVGUtil.writeLines(id, key, SVGUtil.spliteLine(textos[key]));
		}
		
	}
	
	// TEST
	SVGUtil.updatePatternWithImg(myGroup, Util.getRandomPictureUrl());
		
	return {path:p, grupo:myGroup};
}

SVGUtil.setStyle = function(ele, key, value) {
	YAHOO.util.Dom.setStyle(ele, key, value);
}

// TODO : Revisar de arriba abajo.
/**
 * Divide una línea en fragmentos, de manera que quepan en los vértices del hexágono.
 * Ahora se hace a saco
 */
SVGUtil.spliteLine = function(line) {
	var longMax = 30;
	var longMin = 6;
	var decLong = 2;
	var lineas = new Array();
	
	var currLine = line;
	for(var ind=0; currLine.length>0 ;++ind ) {
		// Primero calculamos cual es la long del fragmento actual
		var lenFragmento = longMax - ind*decLong;
		if ( lenFragmento<longMin ) {
			lenFragmento = longMin;
		}
		var fragmento = currLine.substring(0, lenFragmento);
		currLine = currLine.substring(lenFragmento);
		lineas.push(fragmento);
	}
	
	return lineas;
}

SVGUtil.writeLines = function(baldosaId, direccion, lineas) {
	//if ( lineas.length > 5) alert("Sólo se pueden escribir cinco líneas");
	
	for( var ind=0; ind<lineas.length && ind<5; ++ind ) {
		var value = lineas[ind];
		
		// Ponemos el nuevo texto en el hexágono ...
		var hexText = YAHOO.util.Dom.get(direccion+'[' + ind + ']#'+baldosaId);
		if ( hexText.firstChild ) {
			hexText.removeChild( hexText.firstChild );
			hexText.appendChild(document.createTextNode(value));
		}
		// ... y lo mostramos
		YAHOO.util.Dom.setStyle(hexText, 'display', 'block');
	}
}


SVGUtil.rotate = function(group, ang, x,y) {
	YAHOO.util.Dom.setAttribute(group,"transform","rotate(" + ang + " " + x + " " + y + ")");
}


SVGUtil.createImg = function(url, x, y, r) {
	var img = document.createElementNS(SVGUtil.SVG_NAMESPACE,"image");
	img.setAttribute('xlink:href', url);
	img.setAttribute('x', x);
	img.setAttribute('y', y);
	img.setAttribute('width', r);
	img.setAttribute('height', r);
	
	return img;
}

/**
 * Creamos un pattern (para usarlo de bg) con un color
 */
SVGUtil.createColorPattern = function(id, width, height, color) {
	var pattern = document.createElementNS(SVGUtil.SVG_NAMESPACE,"pattern");
	pattern.id="bg_" + id;
	pattern.setAttribute('patternUnits','userSpaceOnUse');
	pattern.setAttribute('width',width);
	pattern.setAttribute('height',height);
	pattern.setAttribute('x', -width/2);
	pattern.setAttribute('y', -height/2);
	
	var rect = document.createElementNS(SVGUtil.SVG_NAMESPACE,"rect");
	rect.setAttribute('x', 0);
	rect.setAttribute('y', 0);
	rect.setAttribute('width',width);
	rect.setAttribute('height',height);
	rect.setAttribute('fill',color);
	pattern.appendChild(rect);
	/*
	var img = document.createElementNS(SVGUtil.SVG_NAMESPACE,"image");
	img.setAttributeNS(SVGUtil.XLINK_NAMESPACE, 'href', url);
	img.setAttribute('x', 0);
	img.setAttribute('y', 0);
	img.setAttribute('width',width);
	img.setAttribute('height',height);
	pattern.appendChild(img);
	*/
	
	
	return pattern;
}

/**
 * Sutituimos el color por una imagen o modificamos la url
 */
SVGUtil.updatePatternWithImg = function(svgGroup, url) {
	// Buscamos el elemento pattern
	var ePattern = null;
	for(var ind=0; ePattern==null && ind<svgGroup.childNodes.length; ++ind ) {
		var node = svgGroup.childNodes[ind];
		if ( node.localName=='pattern' ) {
			ePattern=node;
		}
	}
	
	// Hemos encontrado un pattern
	if ( ePattern!=null ) {
		// Obtenemos el nodo para algunos valores
		var eFill = ePattern.firstChild;
		var x = YAHOO.util.Dom.getAttribute(eFill, 'x');
		var y = YAHOO.util.Dom.getAttribute(eFill, 'y');
		var w = YAHOO.util.Dom.getAttribute(eFill, 'width');
		var h = YAHOO.util.Dom.getAttribute(eFill, 'height');
		
		// Nos cargamos el nodo que hay dentro
		// TODO : Actualizar si ya es una imagen
		ePattern.removeChild( eFill );
		
		// Añadimos un nodo imagen
		var img = document.createElementNS(SVGUtil.SVG_NAMESPACE,"image");
		img.setAttributeNS(SVGUtil.XLINK_NAMESPACE, 'href', url);
		img.setAttribute('x', x);
		img.setAttribute('y', x);
		img.setAttribute('width',w);
		img.setAttribute('height',h);
		YAHOO.util.Dom.setStyle(img, "filter", "url(#filterBg)");
		ePattern.appendChild(img);
	}
}