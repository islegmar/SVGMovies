/**
 * Representa un Step dentro de una película 
 */
function WidgetVideoStep(id) {
	// Id del step
	this.id = id;
	
	// Visor donde se muestran los fotogramas
	this.eVisor = null;
	
	// Donde se pone el panel del step
	this.container = null;
	
	// Template utilizado para montar el panel del step
	this.tmplEStep = null;
	
	// El div donde irán los fotogramas
	this.pFotogramas = null;
	
	// El input text con el texto
	// TODO ¿No se puede eliminar esta variable?
	this.eText = null;
	
	// Los input test con el start/end de los fotogramas que se desactivan
	this.eStartDesactiva = null;
	this.eEndDesactiva = null;
	
	// Lista de fotogramas (cada uno es un SVG)
	// NOTA: Algunos estarán activos y otros no
	this.fotogramas = new Array();
	// Cuando hacemos play, el ind del fotograma que estamos visualizando
	this.indCurrFotograma = null;
	// El id del timer
	this.idTimer = null;
	// El fotograma activo
	this.fotogramaActivo = null;
	// Opcional : elemento con el ind de este step
	this.eIdStep = null;
}

// --------------------------------------------------------------------- Setters
WidgetVideoStep.prototype.setVisor = function(eVisor) {
	this.eVisor = YAHOO.util.Dom.get(eVisor);
}

WidgetVideoStep.prototype.setContainer = function(container) {
	this.container = YAHOO.util.Dom.get(container);
}

/** Fotograma activo */
WidgetVideoStep.prototype.getFotogramaActivo = function() {
	return this.fotogramaActivo;
}
WidgetVideoStep.prototype.setFotogramaActivo = function(fotogramaActivo) {
	this.fotogramaActivo = fotogramaActivo;
}

WidgetVideoStep.prototype.setEIdStep = function(eIdStep) {
	this.eIdStep = eIdStep;
}

// ------------------------------------------------------------ Métodos Públicos
WidgetVideoStep.prototype.getId = function() {
	return this.id;
}

WidgetVideoStep.prototype.render = function() {
	// Montamos una caja (a partir de un template) donde va toda la 
	// info + controles del step y la añadimos al container
	if ( this.tmplEStep ==null ) {
		this.tmplEStep = YAHOO.util.Dom.get("tmplStep");
	}	
	var pStep = Util.createCopyFromTemplate(this.tmplEStep, this.container);
	this.container.appendChild(pStep);
	
	// Configuramos los diversos elementos
	
	// ------------
	// Nombre del step
	// ------------
	var startStep = Util.getChildrenByClassName(pStep, "startStep");
	startStep.appendChild(document.createTextNode("STEP " + this.id));
    YAHOO.util.Event.addListener(startStep, "click", function(e, myself) {
    	myself.play();
    }, this);

	// ------------
	// Panel donde van los fotogramas
	// ------------
    this.pFotogramas = Util.getChildrenByClassName(pStep, "pFotogramas");
    
    // ------------
	// Texto de los fotogramas
	// ------------
    this.eText = Util.getChildrenByClassName(pStep, "subtitulo");
    // Cuando escribimos, actualizamos el texto de los fotogramas
	// TODO ¿no puede ser demasiado?
    YAHOO.util.Event.addListener(this.eText, "keyup", function(evt, myself) {
		 for (var ind=0; ind<myself.fotogramas.length; ++ind ) {
			 var fotograma = myself.fotogramas[ind];
			 var texto = myself.eText.value;
			 fotograma.updateTexto(texto);
		 }
    }, this);
    
    // ------------
	// Start/end de los fotogramas que se desactivan 
	// ------------    
	this.eStartDesactiva = Util.getChildrenByClassName(pStep, "startDesactiva");
	this.eEndDesactiva = Util.getChildrenByClassName(pStep, "endDesactiva");
	var bToogleDisabled = Util.getChildrenByClassName(pStep, "toogleDisabled");
    YAHOO.util.Event.addListener(bToogleDisabled, "click", function(evt, myself) {
    	var start = myself.eStartDesactiva.value;
    	var end = myself.eEndDesactiva.value;
    	for(var ind=start; ind<=end; ++ind) {
    		var fotograma = myself.fotogramas[ind];
    		fotograma.toogleDisabled();
    	}
   }, this);
}

/** Devuelve el total de fotogramas activos */
WidgetVideoStep.prototype.getNumFotogramasActivos = function() {
	var tot = 0;
	for(var ind=0; ind<this.fotogramas.length; ++ind ) {
		if ( !this.fotogramas[ind].isDisabled() ) ++tot;
	}
	
	return tot;
}

/** Añade un fotograma. */
WidgetVideoStep.prototype.addFotograma = function(fotogramaContent, updateLastFotograma) {
	// Modificamos el último fotograma 
	if ( updateLastFotograma && this.fotogramas.length!=0 ) {
		var fotograma = this.fotogramas[this.fotogramas.length-1];
		fotograma.setContent(fotogramaContent);
	// Construimos el objeto fotograma
	} else {
		var fotograma = new WidgetVideoFotograma(this.fotogramas.length);
		fotograma.setContainer(this.pFotogramas);
		fotograma.setContent(fotogramaContent);
		fotograma.setEVisor(this.eVisor);
		fotograma.setStep(this);
		fotograma.render();
		
		// Añadimos el fotograma a la lista	
		this.fotogramas.push(fotograma);
	}
	
	// Actualizamos el texto del fotograma
	var texto = this.eText.value;
	if ( texto!=null && texto.length!=0 ) {
		fotograma.updateTexto(texto);
	}
	
}

/** Play de este step */
WidgetVideoStep.prototype.play = function(cbFunc) {
	var myself = this;
	// Calculamos el timeout para que todos los fotogramas de este paso
	// se muestre en 1000ms.
	var timeout = 1000/this.getNumFotogramasActivos();
	this.indCurrFotograma = null;
	// Llamamos directamante a showNextFotograma() para que no haya tiempo de 
	// espera
	this.showNextFotograma(true);
	this.idInterval = setInterval(function(){
			// Oooooh, hemos llegado al final
			if ( !myself.showNextFotograma(true) ) {
				clearInterval(myself.idInterval);
				if ( cbFunc ) {
					cbFunc();
				}
			}
    },timeout);
}

/** Muestra un fotograma */
WidgetVideoStep.prototype.showFotograma = function(ind) {
	this.indCurrFotograma = ind;
	
	// Desactivamos el fotograma que actualmente está activo
	if ( this.fotogramaActivo!=null ) {
		this.fotogramaActivo.setActivo(false);
	}
	
	// Activamos el nuevo fotograma
	this.fotogramaActivo = this.fotogramas[ind];
	this.fotogramaActivo.setActivo(true);
	
	// Y le damos al play
	this.fotogramaActivo.play();
}

/* Muestra el siguiente fotograma. Devuelve false si hemos llegado al final */
WidgetVideoStep.prototype.showNextFotograma = function(showActiveOnly) {
	// No podemos reproducir el fotograma
	if ( !this.fotogramas || this.fotogramas.length==0 || this.indCurrFotograma==(this.fotogramas.length-1) ) {
		if ( this.eFotogramaActivo!=null ) {
			YAHOO.util.Dom.removeClass(this.eFotogramaActivo, "fotogramaActivo");
		}
		return false;
	}
	var ind = this.indCurrFotograma==null ? 0 : this.indCurrFotograma+1;
	// Si el siguiente fotograma no está "disabled" , buscamos otros
	if ( showActiveOnly && this.fotogramas[ind].isDisabled() ) {
		this.indCurrFotograma=ind;
		return this.showNextFotograma(showActiveOnly);
	} else {
		this.showFotograma(ind);
		return true;
	}
}

/* Muestra el anterior fotograma. Devuelve false si estamos en el principio */
WidgetVideoStep.prototype.showPrevFotograma = function() {
	if ( !this.fotogramas || this.fotogramas.length==0 || this.indCurrFotograma==null || this.indCurrFotograma==0 ) {
		if ( this.eFotogramaActivo!=null ) {
			YAHOO.util.Dom.removeClass(this.eFotogramaActivo, "fotogramaActivo");
		}
		return false;
	}
	this.showFotograma(this.indCurrFotograma-1);
	return null;
}

WidgetVideoStep.prototype.show = function() {
	YAHOO.util.Dom.removeClass(this.container, "oculto");
	if ( this.eIdStep!=null ) {
		YAHOO.util.Dom.addClass(this.eIdStep, "activo");
	}
}

WidgetVideoStep.prototype.hide = function() {
	YAHOO.util.Dom.addClass(this.container, "oculto");
	if ( this.eIdStep!=null ) {
		YAHOO.util.Dom.removeClass(this.eIdStep, "activo");
	}
}

WidgetVideoStep.prototype.save2Disk = function(prefijo, indStep) {
	for(var indFotograma=0; indFotograma<this.fotogramas.length; ++indFotograma) {
		this.fotogramas[indFotograma].save2Disk(prefijo, indStep, indFotograma);
	}
}