/**
 * Representa UN fotograma dentro de un step 
 */
function WidgetVideoFotograma(id) {
	this.id = id;
	
	// Donde se hace el render de los elementos grÃ¡ficos del widget
	this.container;
	
	// Si es true, quiere decir que este fotograma no se mostrarÃ¡ en el play final 
	this.disabled = false;
	
	// Si se true, quiere decir que es el fotograma activo, el que se estÃ¡ mostrando
	this.activo = false;
	
	// Contenido (DOM SVG)
	this.content;
	
	// Visor donde se muestran los fotogramas
	this.eVisor;
	
	// Step al que pertenece este fotograma
	this.step;
	
	// Template para crear los elementos gráficos
	this.tmplEFotograma;
	
	// Cajita que representa el fotograma dentro de la secuencia y que responde
	// a los eventos del usuario
	this.display = null;
	
	// (Opcional) Código de tiempo asociado a este fotograma
	this.timeCode = null;
	
	// Canvas html5
	this.html5canvas = YAHOO.util.Dom.get("html5canvas");
}

// --------------------------------------------------------------------- Setters
WidgetVideoFotograma.prototype.setContainer = function(container) {
    this.container = container;
}

WidgetVideoFotograma.prototype.setContent = function(content) {
    this.content = content;
}

WidgetVideoFotograma.prototype.setEVisor = function(eVisor) {
    this.eVisor = eVisor;
}

WidgetVideoFotograma.prototype.setStep = function(step) {
    this.step = step;
}

WidgetVideoFotograma.prototype.isActivo = function() {
    return this.activo;
}

WidgetVideoFotograma.prototype.isDisabled = function() {
    return this.disabled;
}

WidgetVideoFotograma.prototype.updateTexto = function(texto) {
	var g = Util.getChildrenById(this.content, "gFooterText");
	var t = Util.getChildrenById(g, "footerText");
	// Lo primero, es borrar el texto que habÃ­a antes
	if ( t.firstChild ) {
		  t.removeChild(t.firstChild);
	}
	// Ocultar
    if ( texto==null || texto.length==0 ) {
    	YAHOO.util.Dom.setAttribute(g, "display", "none");
    	t.innerHTML="";
    } else {
    	YAHOO.util.Dom.setAttribute(g, "display", "block");
		t.appendChild(document.createTextNode(texto));
    }
}

// ------------------------------------------------------------ MÃ©todos PÃºblicos
WidgetVideoFotograma.prototype.render = function() {
	// Creamos usando template
	if ( this.tmplEFotograma==null ) {
		this.tmplEFotograma = YAHOO.util.Dom.get("tmplFotograma");
	}	
	var eFotograma = Util.createCopyFromTemplate(this.tmplEFotograma, this.container);
	
	// Configuramos los diversos elementos

	// -------------
	// Display
	// -------------
	this.display = Util.getChildrenByClassName(eFotograma, "fotogramaId");
	this.display .innerHTML = "" + this.id;
	// Al hacer click, mostramos el fotograma
    YAHOO.util.Event.addListener(this.display, "click", function(e, myself) {
    	myself.play();
    }, this);
	// Al hacer doble click, toogle del estado del fotograma
    YAHOO.util.Event.addListener(this.display, "dblclick", function(e, myself) {
    	myself.toogleDisabled();
    }, this);
    
	// -------------
    // Código de tiempo 
	// -------------
    var inputCodigoTiempo = Util.getChildrenByClassName(eFotograma, "codigoTiempo");
    YAHOO.util.Event.addListener(inputCodigoTiempo, "keyup", function(evt, myself) {
    	var ele = evt.target;
    	myself.timeCode = ele.value!=null && ele.value.length!=0 ? ele.value : null;
   }, this);
    
    
    // Ponemos una 
    
    // Right click, opciones de menÃº
   	// TODO - Evitar closure
   	/* Con este cÃ³digo

   		function onTriggerContextMenu(p_oEvent) {
			var oTarget = this.contextEventTarget;
		}
                           
		oContextMenu.subscribe("triggerContextMenu", onTriggerContextMenu);

		oTarget es el elemento (span) que ha mostrado el context menÃº, y luego
        esa variable la pueden usar las funciones. Lo que no me gusta es la necesidad
		de una variable global :-(  
   	*/
   	var myself = this;
   	/* DISABLE MENU
   	var oContextMenu = new YAHOO.widget.ContextMenu(
                                 YAHOO.util.Dom.generateId(null, "fotogramaContextMenu"), 
                                {
                                    trigger: this.display,
                                    lazyload: true,                                    
							        itemdata: [
			   							         { text: "Copy"         ,  onclick: { fn: function() { myself.copy();           } } },
			   							         { text: "InsertBefore" ,  onclick: { fn: function() { myself.insertBefore();   } } },
			   							         { text: "InsertAfter"  ,  onclick: { fn: function() { myself.insertAfter();    } } },
			   							         { text: "Edit"         ,  onclick: { fn: function() { myself.edit(); } } },
			   							         { text: "generate image",  onclick: { fn: function() { myself.generateImage(); } } },
			   							         { text: "Activa/Desactiva",  onclick: { fn: function() { myself.toogleDisabled(); } } }
			   							      ]    
                                } 
                           );
   	 */
}

/** Muestra el contenido de este fotograma en el display */
WidgetVideoFotograma.prototype.play = function() {
    // TODO - No es muy elegante esta comunicaciÃ³n hijo->padre Â¿tal vez por eventos?
    // Pero entonces, tal vez tendrÃ­amos problemas con la sincronizaciÃ³n
    if ( this.step.getFotogramaActivo()!=null ) {
    	this.step.getFotogramaActivo().setActivo(false);
    }
    this.step.setFotogramaActivo(this);
    
	// Activamos la celda de ese fotograma
	this.setActivo(true);
	
    // Modificamos el contenido del visor
	if ( this.eVisor.firstChild ) {
		this.eVisor.removeChild( this.eVisor.firstChild );
	}
	this.eVisor.appendChild(this.content);
}

/** Cambia el estado del fotograma de disabled=>enabled o viceversa */
WidgetVideoFotograma.prototype.toogleDisabled = function() {
	// Toogle
	this.disabled = !this.disabled;

	if ( this.disabled ) {
		YAHOO.util.Dom.addClass(this.display, "fotogramaDisabled");
	} else {
		YAHOO.util.Dom.removeClass(this.display, "fotogramaDisabled");
	}
}

/** Edita este fotograma */
WidgetVideoFotograma.prototype.edit = function() {
	// TODO : Mejorar el cÃ³digo ;-)
	var lienzo = YAHOO.util.Dom.get("lienzoSVG");
	while ( lienzo.firstChild ) lienzo.removeChild( lienzo.firstChild );
	lienzo.appendChild(this.content);
	LIENZO.refresh();
}


/** Establece es status de activo */
WidgetVideoFotograma.prototype.setActivo = function(activo) {
	this.activo = activo;

	if ( this.activo ) {
		YAHOO.util.Dom.addClass(this.display, "fotogramaActivo");
	} else {
		YAHOO.util.Dom.removeClass(this.display, "fotogramaActivo");
	}
}

/* Copiamos en el portapapeles */
WidgetVideoFotograma.prototype.copy = function() {
	ClipBoard.getInstance().copy(this);
}

WidgetVideoFotograma.prototype.insertBefore = function() {
	var content = ClipBoard.getInstance().get();
	if ( content instanceof WidgetVideoFotograma ) {
		alert("WidgetVideoFotograma : " + typeof content);
	} else { 
		alert("unknown content : " + typeof content);
	}
}

WidgetVideoFotograma.prototype.insertAfter = function() {
	var content = ClipBoard.getInstance().get();
	if ( content instanceof WidgetVideoFotograma ) {
		alert("WidgetVideoFotograma : " + typeof content);
	} else { 
		alert("unknown content : " + typeof content);
	}
}

WidgetVideoFotograma.prototype.generateImage = function() {
	// pngDataURL = data:image/png;base64,XXXXXXXXXXX
  	var pngDataURL = this.content.toDataURL("image/png");
  	/*
  	alert(pngDataURL);
  	//document.getElementById("testImg").src="data:image/png;base64,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";
	*/
  	document.getElementById("testImg").setAttribute("src", pngDataURL);
  	
  	// Send data to PHP for storing it
    YAHOO.util.Connect.asyncRequest('POST', '../php/savePng.php', {
		success: function(o) {},
  		failure: function(o) { alert("Error : " + o.responseText); }
    },"data=" + pngDataURL);
}

WidgetVideoFotograma.prototype.save2Disk = function(prefijo, indStep, indFotograma) {
	var id = prefijo + "-" + indStep + "-" + indFotograma; 
    var contentAsString = (new XMLSerializer()).serializeToString(this.content);
	localStorage.setItem(id, contentAsString);
}

WidgetVideoFotograma.prototype.getContentAsString = function(prefijo, indStep, indFotograma) {
    return (new XMLSerializer()).serializeToString(this.content);
}