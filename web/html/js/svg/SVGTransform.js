/**
 * Gestiona el atributo transform
 */
function SVGUtil() {
	
}

SVGUtil.SVG_NAMESPACE = "http://www.w3.org/2000/svg";
SVGUtil.SIN30 = Math.sin(Math.PI/6);
SVGUtil.COS30 = Math.cos(Math.PI/6);

SVGUtil.DIRECCIONES = ['N', 'NE', 'SE', 'S', 'SW', 'NW'];



/**
 * Devuelve un elemento que representa un hexágono, con centro en 'center' y radio r
 * Los textos los pongo en las aristas. Es un mapa con las llaves los puntos cardinales:
 * N, NE, SE, S, SW y NW
 */
SVGUtil.addHexagon = function(svgGroup, X, Y, r, style, textos, id) {
    // Todo lo meto en un grupo
    var myGroup  = document.createElementNS(SVGUtil.SVG_NAMESPACE,"g");

    // Ahora creo el hexágono
	var w = r*SVGUtil.SIN30;
	var h = r*SVGUtil.COS30;
	
	var puntos= "";	
	puntos+= (X-w) + "," + (Y-h) + " ";
	puntos+= (X+w) + "," + (Y-h) + " ";
	puntos+= (X+r) + "," + (Y  ) + " ";
	puntos+= (X+w) + "," + (Y+h) + " ";
	puntos+= (X-w) + "," + (Y+h) + " ";
	puntos+= (X-r) + "," + (Y  ) + " ";
	
	var p  = document.createElementNS(SVGUtil.SVG_NAMESPACE,"polygon");
	p.setAttribute('points', puntos);
	p.setAttribute('style' , style);	
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
		
		return [X+(x*Math.cos(angRad) - y*Math.sin(angRad)),Y+(x*Math.sin(angRad) + y*Math.cos(angRad))];
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
			text.setAttribute('font-size', 2);
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