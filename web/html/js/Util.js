function Util() {
}

/**
 * Muestra un mensaje de error
 */
Util.showError = function(s , errorMsgDiv) {
	var div = YAHOO.util.Dom.get(!errorMsgDiv ? "_errorMsg" : errorMsgDiv);
	if ( div ) {
		div.innerHTML = s;
		YAHOO.util.Dom.replaceClass(div, "hidden", "unhidden");
	} else {
		//alert(s);
		//alert("Se ha producido un error inesperado.\nSi persiste, por favor póngase en contacto con info@crisisbcnk36.com");
	}
}

Util.showMensajeEfimero = function(s) {
	var popup = new PopUpEfimero(s);
	popup.render();
	//alert(s);
}

/**
 * Limpia la zona de error
 */
Util.clearError = function(errorMsgDiv) {
	var div = YAHOO.util.Dom.get(!errorMsgDiv ? "_errorMsg" : errorMsgDiv);
	div.innerHTML = "";
	YAHOO.util.Dom.replaceClass(div, "unhidden", "hidden");
}

Util.defaultErrorHandler = function(obj) {
	alert("ERROR : " + obj);
	/*
	if ( typeof(obj)=='string' ) {
		Util.showError(obj,null);
	// Suponemos que es la respuesta AJAX	
	} else {
		Util.showError(obj.responseText,null);
	}
	*/
}

Util.makeInvisible = function(ele) {
	YAHOO.util.Dom.replaceClass(ele, "unhidden", "hidden");
}

Util.makeVisible = function(ele) {
	YAHOO.util.Dom.replaceClass(ele, "hidden", "unhidden");
}

Util.getRequestParameter = function(parameterName) {
	var queryString = window.top.location.search.substring(1);

	var parameterName = parameterName + "=";
	if ( queryString.length > 0 ) {
		// Find the beginning of the string
		begin = queryString.indexOf ( parameterName );
		// If the parameter name is not found, skip it, otherwise return the value
		if ( begin != -1 ) {
			// Add the length (integer) to the beginning
			begin += parameterName.length;
			// Multiple parameters are separated by the "&" sign
			end = queryString.indexOf ( "&" , begin );
			if ( end == -1 ) {
				end = queryString.length;
			}
			// Return the string
			return unescape ( queryString.substring ( begin, end ) );
		}
		// Return "null" if no parameter has been found
		return "null";
	}
} 


/**
 * Devuelve las coordenadas de un objet
  * �Gracias http://www.quirksmode.org/js/findpos.html !
 */
Util.getObjCoordinates = function(obj, addPadding) {
	var curleft = 0;
	var curtop = 0;
	var padding = null;
	if ( addPadding ) {
		padding = Util.getPaddingObj(obj);
		alert("obj : " + obj + " - " + padding);
	}
	
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		if ( addPadding ) {
			return [curleft-padding[0][0],curtop-padding[0][1]];
		} else {
			return [curleft,curtop];
		}
	}
}

/* Aparentemente, devuelve lo mismo que Util.getObjCoordinates */
/* 
Util.getObjCoordinates2 = function(obj) {
	var region = YAHOO.util.Dom.getRegion(obj);
	return [region.left, region.top];

}
*/

/** Devuelve las coordenadas de la caja de un elemento (tiene en cuenta el padding)*/
Util.getObjDimensions = function(obj, addPadding) {
	if ( addPadding ) {
		var padding = Util.getPaddingObj(obj);
		return [obj.clientWidth+padding[0][0]+padding[1][0], obj.clientHeight+padding[0][1]+padding[1][1]];
	} else {
		var region = YAHOO.util.Dom.getRegion(obj);
		return [region.width, region.height];
		//return [obj.clientWidth, obj.clientHeight];
		//return [YAHOO.obj.clientWidth, obj.clientHeight];
	}
}

Util.getPaddingObj = function(obj, addPadding) {
	// Esto tiene el px que hay que quitar
	// TODO se podría hacer mejor, quitando las unidades y pasando todo a px pero....
	var padLeft   =  YAHOO.util.Dom.getStyle(obj, "paddingLeft").replace("px","");
	var padRight  =  YAHOO.util.Dom.getStyle(obj, "paddingRight").replace("px","");
	var padTop    =  YAHOO.util.Dom.getStyle(obj, "paddingTop").replace("px","");
	var padBottom =  YAHOO.util.Dom.getStyle(obj, "paddingBottom").replace("px","");
	
	return [[padLeft, padTop],[padRight, padBottom]];
	
}

/**
 * Devuelve las coordenadas relativas de un evento con relaci�n a un objeto
 * NOTA: esta funci�n est� pensada para usarla con el evento teniendo lugar DENTRO de obj (pej click de una imagen)
 *       Se desconode el resultado si el evento tiene lugar FUERA ��??
 */
Util.getRelCoordinates = function(evt,obj) {
	var evtXY = YAHOO.util.Event.getXY(evt);
	var objXY = Util.getObjCoordinates(obj);
	
	return [evtXY[0]-objXY[0],evtXY[1]-objXY[1]];
}

Util.removeUntilUnderscore = function(s) {
	var idx = s.indexOf("_");
	
	if ( idx==-1 ) {
		return s;
	} else {
		return s.substring(idx+1);
	}
}

/**
 * Cuando nos movemos encima de un elemento, ponemos el icono de una mano, para
 * indicar que ese contenido el clickable
 */
Util.showElementAsClickable = function(ele) {
	YAHOO.util.Event.addListener(ele, "mouseover",function(e) {
   	 	e.target.style.cursor='pointer';
    });   
}

Util.resaltaImagen = function(img, escala) {
	if ( !escala ) escala = 1.2;
	
	YAHOO.util.Event.addListener(img , "mouseover",function(e, escala) {
		var img = e.target;
		
		var oldW = img.width;
		var oldH = img.height;
		// Vamos a calcular las nuevas dimensiones
		var newW = oldW * escala;
		var newH = oldH * escala;
		// ... y lo desplazamos
		var newTop = -(newH-oldH)/2;
		var newLeft = -(newW-oldW)/2;
		//alert("New margin-top : " + (-(newH-oldH)/2));
		YAHOO.util.Dom.setStyle(img,"margin-top" ,newTop+"px");
		YAHOO.util.Dom.setStyle(img,"margin-left",newLeft+"px");
		YAHOO.util.Dom.setStyle(img,"width" ,newW+"px");
		YAHOO.util.Dom.setStyle(img,"height",newH+"px");
		
	 	// Y venga, un sonidico :-)
		SOUND.play('beep');

	}, escala);
	YAHOO.util.Event.addListener(img , "mouseout",function(e, escala) {
		var img = e.target;
		var newW = img.width / escala;
		var newH = img.height / escala;

		// Lo desplazamos
		YAHOO.util.Dom.setStyle(img,"margin-top" ,0);
		YAHOO.util.Dom.setStyle(img,"margin-left",0);
		// Lo redimensionamos
		YAHOO.util.Dom.setStyle(img,"width" ,newW+"px");
		YAHOO.util.Dom.setStyle(img,"height",newH+"px");
		
		// La imagen se escala sola, proporcionalmente. Por eso no modificamos la altura ¿¿??
		//img.width = img.width / escala;
	}, escala);
}

Util.beepElemento = function(ele) {
	
	YAHOO.util.Event.addListener(ele, "mouseover",function(e) {
		SOUND.play('beep');
	}, null);
	
	YAHOO.util.Event.addListener(ele, "mouseout",function(e, escala) {
		SOUND.stop('beep');
	}, null);
}

Util.blink = function(eleName, tot, show) {
	  var ele = document.getElementById(eleName);
	  // Si no especificamos el total de veces, ponemos 10
	  if ( !tot ) tot=10;
	  
	  if ( show ) {
	    ele.style.visibility = "visible";
	  } else {
	    ele.style.visibility = "hidden";
	  }
	  show=!show;
	  --tot;
	  
	  if ( tot!=0 ) {
	    setTimeout(function() { Util.blink(eleName, tot, show) }, 300);
	  // Al salir, nos aseguramos de que siempre se vea  
	  } else {
	    ele.style.visibility = "visible";
	  }
}

Util.keepPreferencia = function(prefName, prefValue) {
	YAHOO.util.Connect.asyncRequest("POST", ACTIONS['keepUserPreferencia'], 
		{
			success: function(o) { },
      		failure: function(o) {  }
		}, "prefName=" + prefName + "&prefValue=" + prefValue);
}



// ----------------------
// Random
// TODO - Pasar a una clase
//----------------------


function nextRandomNumber(){
	  var hi = this.seed / this.Q;
	  var lo = this.seed % this.Q;
	  var test = this.A * lo - this.R * hi;
	  if(test > 0){
	    this.seed = test;
	  } else {
	    this.seed = test + this.M;
	  }
	  return (this.seed * this.oneOverM);
}

function RandomNumberGenerator(){
	  var d = new Date();
	  this.seed = 2345678901 + (d.getSeconds() * 0xFFFFFF) + (d.getMinutes() * 0xFFFF);
	  this.A = 48271;
	  this.M = 2147483647;
	  this.Q = this.M / this.A;
	  this.R = this.M % this.A;
	  this.oneOverM = 1.0 / this.M;
	  this.next = nextRandomNumber;
	  return this;
}

function createRandomNumber(Min, Max){
	  var rand = new RandomNumberGenerator();
	  return Math.round((Max-Min) * rand.next() + Min);
}

Util.getTemplateElement = function(className, eLista, returnNullIfError) {
	//alert("Util.getTemplateElement(" + className + "," + eLista + ")");
	return Util.getSingleElement(YAHOO.util.Dom.getElementsByClassName (className, null, eLista ? eLista : document.body), returnNullIfError);
}

/**
 * Situación: tenemos un contenedor (pej. un div) que contiene una serie de 
 * elementos que se añaden de manera dinámica. A partir del elemento que representa
 * el template, obtenemos el del contenedor
 */
Util.getListaContainer= function(cellTemplate) {
	var container = YAHOO.util.Dom.getAncestorByClassName(cellTemplate,"listaItems");
	
	if ( !container ) {
		//throw "No se encuentra un contenedor de lista para " + cellTemplate;
		alert("No se encuentra un contenedor de lista para " + cellTemplate);
	}
	
	return container;
}

Util.getSingleElement = function(lista, returnNullIfError) {
	if ( !lista ) {
		if ( returnNullIfError ) {
			return null;
		} else {
			alert("La lista no contiene elementos");
		}
	} else if ( lista.length!=1 ) {
		if ( returnNullIfError ) {
			return null;
		} else {
			alert("La lista contiene " + lista.length + " cuando se esperaba sólo 1");
		}
	} else {
		return lista[0];
	}
}

/**
 * Se utiliza para, a partir de bloques HTML construidos como clone de un 
 * template, obtener elementos HTML individuales (un span, un img,...) y 
 * configurarlos con los valores dinámicos.
 */
Util.getChildrenByTagName  = function(element, tagName, returnNullIfError) {
	//alert("getChildrenByTagName(" + element + "," + tagName + ")");
	return Util.getSingleElement(YAHOO.util.Dom.getElementsBy(function(ele) {
		return true;
	}, tagName, element), returnNullIfError);
}


Util.getChildrenByClassName  = function(element, className, returnNullIfError) {
	//alert("getChildrenByTagName(" + element + "," + className + ")");
	return Util.getSingleElement(YAHOO.util.Dom.getElementsByClassName(className, null, element), returnNullIfError);
}

Util.getChildrenById = function(element, id) {
	return YAHOO.util.Dom.getElementBy(function(ele) {
		return ele.id==id;
	}, null, element);
}

Util.fillEleWithFileContent = function(idElement, path) {
	YAHOO.util.Connect.asyncRequest("POST", "/php/servlet/getFile.php?src=" + path,
			{
				success: function(o) {
					var ele = YAHOO.util.Dom.get(idElement);
					ele.innerHTML = o.responseText;
				},
				failure: function(o) { Util.defaultErrorHandler(o); }
			}, null);
}

/**
 * Recibimos un array del tipo
 * [ {"ID":"50","FIELD_NAME":"des","LANG":"ca","FIELD_VALUE":"Can Faves","OID_ID":"3000013"},
 *   {"ID":"72","FIELD_NAME":"localizacion","LANG":null,"FIELD_VALUE":"","OID_ID":"3000013"}
 * ]
 * y si pej. keyName = FIELD_NAME ¡, lo transformaremos en un Map donde la 
 * key será 'des' y 'localizacion'  
 */
Util.array2Map = function(data, keyName) {
	var map = new Array();
	for (var ind=0; ind<data.length; ++ind ) {
		// row representa una estrcutura del tipo
		// {
		//  "ID":"50",
		//  "FIELD_NAME":"des",
		//  "LANG":"ca",
		//  "FIELD_VALUE":"Can Faves",
		//  "OID_ID":"3000013"
		// }
		
		var row = data[ind]; 
		map[row[keyName]] = row; 
	}
		
	return map;
}

Util.add2Url = function(url, param, value) {
	var newUrl;
	
	// No hya valor, no hay cambios
	if ( value==null ) {
		newUrl=url;
	// Añadimos el parámetro	
	} else {
		// Primer parámetro
		if ( url.indexOf("?")==-1 ) {
			newUrl = url + "?" + param + "=" + value;
		// Parámetros adicionales	
		} else {
			var startPos = url.indexOf(param+"=");
			
			// Este parámetro no existe, lo añadimos		
			if ( startPos==-1 ) {
				newUrl = url + "&" + param + "=" + value;
			// Existe, tenemos que cambiar el valor	
			} else {
				// Ponemos el nuevo valor
				newUrl = url.substring(0, startPos) + param + "=" + value;

				// Vamos a ver si el parámetro no estaba al final de la cadena, 
				// con lo que nos queda un troz de url por añadir
				var endPos = url.indexOf("&", startPos+(param+"=").length);
				if ( endPos!=-1 ) {
					newUrl += url.substring(endPos);
				}
			}
		}
	}
	
	return newUrl;

}

Util.isPar = function(value){
	if (value%2 == 0)
		return true;
	else
		return false;
}

Util.getDistancia = function(punto1, punto2) {
	var d = Math.sqrt( Math.pow(punto2[0]-punto1[0],2) + Math.pow(punto2[1]-punto1[1],2));
	//alert("distancia (" + punto1 + ") y (" + punto2 + ") ====> " + d);
	return d;
}

Util.getRandomPicture2 = function(tags, cbFunction) {
	// Construimos la URL
	var url = "http://api.flickr.com/services/rest/?format=json&sort=random&method=flickr.photos.search&api_key=66c61b93c4723c7c3a3c519728eac252&tag_mode=all";	
	var params = "tags=" + tags;
	
    YAHOO.util.Connect.asyncRequest("GET", url, 
			{
				success: function(o) { 
    				alert("OK : " + o);
    				/*
                    var data = YAHOO.lang.JSON.parse(o.responseText);
                    
                    // Obtenemos un valor aleatorio
                    var i = Math.random();
                    i = i * 100;
                    i = Math.ceil(i);
                    
                    var photo = data.photos.photo[i];
                    
                    var t_url = "http://farm" + photo.farm +
                    ".static.flickr.com/" + photo.server + "/" +
                    photo.id + "_" + photo.secret + "_" + "m.jpg";
                    
                    var p_url = "http://www.flickr.com/photos/" +
                    photo.owner + "/" + photo.id;
                    
                    alert("p_url : " + p_url + " t_url : " + t_url);
                    */
                },
                // Ignoramos el error
	      		failure: function(o) { 
                	alert("ERROR : " + o);
                	/*
                	alert(o.responseText);
                	*/ 
                }
			}, params);
	
}

Util.getRandomPictureUrl = function() {
    var ind = Math.floor(Math.random()*TEST_FOTOS.length);
    
    return TEST_FOTOS[ind];
    
    

}

//@format (hex|rgb|null) : Format to return, default is integer
Util.randomColor = function(format)
{
 var rint = Math.round(0xffffff * Math.random());
 switch(format)
 {
  case 'hex':
   return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
  break;
  
  case 'rgb':
   return 'rgb(' + (rint >> 16) + ',' + (rint >> 8 & 255) + ',' + (rint & 255) + ')';
  break;
  
  default:
   return rint;
  break;
 }
}

Util.createCopyFromTemplate = function(template, parent) {
	var ele = template.cloneNode(true);
	
	// Si tienen un id, lo eliminamos
	ele.removeAttribute("id");
	
	// Le quitamos la clase template, que nos permitirá mostrarlo
	YAHOO.util.Dom.removeClass(ele, "template");

	
	// Lo añadimos al parent
	if ( !parent ) {
		template.parentNode.appendChild(ele);
	} else {
		parent.appendChild(ele);
	}
	
	// Lo devolvemos
	return ele;
}


/**
 * http://sujithcjose.blogspot.com/2007/10/zero-padding-in-java-script-to-add.html
 * Util.zeroPad(5,3); => 005 
 */
Util.zeroPad = function(num,count)
{
	var numZeropad = num + '';
	while(numZeropad.length < count) {
		numZeropad = "0" + numZeropad;
	}
	return numZeropad;
}