function MouseWheel(/*zona*/) {
	// Zona de donde capturamos los eventos de la rueda de ratón
	// TODO - Lo hacemos por ID. Podríamos hacerlo calculando las regiones X,Y
	// Nota : en nuestro caso, zona será la imagen del bodegón
	
	//this.idZona = zona && zona.id ? zona.id : null;
	// El objeto que recibirá el evento de que se ha dado a la duedecica
	this.magnifier;
}

MouseWheel.prototype.setMagnifier = function(magnifier) {
	this.magnifier = magnifier;
}

MouseWheel.prototype.render = function() {
	var pWidget = this;
	/** This is high-level function.
	 * It must react to delta being more/less than zero.
	 */
	function handle(delta) {
		pWidget.magnifier.doZoom(delta);
	}
	
	/** Event handler for mouse wheel event.
	 */
	function wheel(event){
			// Si hemos definido una zona y el evento no es de nuestra zona, 
     		// no hacemos nada y se hace el scroll normal
		    /* No termina de ir bien
			if ( pWidget.idZona && (!event.target.id || event.target.id!=pWidget.idZona) ) {
				return;
			}
			*/
			
	        var delta = 0;
	        if (!event) /* For IE. */
	                event = window.event;
	        
	        // Primero miramos donde ha tenido lugar el evento
	        if (event.wheelDelta) { /* IE/Opera. */
	                delta = event.wheelDelta/120;
	                /** In Opera 9, delta differs in sign as compared to IE.
	                 */
	                if (window.opera)
	                        delta = -delta;
	        } else if (event.detail) { /** Mozilla case. */
	                /** In Mozilla, sign of delta is different than in IE.
	                 * Also, delta is multiple of 3.
	                 */
	                delta = -event.detail/3;
	        }
	        /** If delta is nonzero, handle it.
	         * Basically, delta is now positive if wheel was scrolled up,
	         * and negative, if wheel was scrolled down.
	         */
	        if (delta)
	                handle(delta);
	        /** Prevent default actions caused by mouse wheel.
	         * That might be ugly, but we handle scrolls somehow
	         * anyway, so don't bother here..
	         */
	        if (event.preventDefault)
	                event.preventDefault();
		event.returnValue = false;
	}

	
	YAHOO.util.Event.onDOMReady(function(){
		/** Initialization code. 
		 * If you use your own event management code, change it as required.
		 */
		/** DOMMouseScroll is for mozilla. */
		if (window.addEventListener) {
			window.addEventListener('DOMMouseScroll', wheel, false);
		}
		
		/** IE/Opera. */
		window.onmousewheel = document.onmousewheel = wheel;
	});
}