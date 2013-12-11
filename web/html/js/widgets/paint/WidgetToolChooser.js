/**
 * Probablemente este nombre (o el de WidgetPaintTool, no lo sé) no sea 
 * muy afortunado. Anyway, las clases derivadas representan botones que 
 * muestran la herramienta activa (pej. línea, punto,...); o sea, que se va 
 * a dibujar cuando se dibuje algo. Tienen dos estados, activo e inactivo 
 * y, opcionalmente, una serie de propiedades.  
 */
function WidgetToolChooser() {
	WidgetToolChooser.superclass.constructor.call(this);
	// Indica si esta herramienta está activa o no
	this.isActiva = false;
	// Panel de la herramienta activa
	this.pActiva = null;
	// Panel de la herramienta inactiva
	this.pInactiva = null;
}
YAHOO.lang.extend(WidgetToolChooser, WidgetPaintTool);

// --------------------------------------------------------------------- Setters
// ------------------------------------------------------------ Métodos Públicos
/** Activa la herramienta */
WidgetToolChooser.prototype.activa = function() {
	this.isActiva = true;
	
	// Muestra el panel de herramienta activa
	if ( this.pActiva!=null ) {
		YAHOO.util.Dom.removeClass(this.pActiva, "oculto");
	}
	// Oculta el panel de herramienta inactiva
	if ( this.pInactiva!=null ) {
		YAHOO.util.Dom.addClass(this.pInactiva, "oculto");
	}
}

/** Inactiva la herramienta */
WidgetToolChooser.prototype.inactiva = function() {
	this.isActiva = false;
	
	// Muestra el panel de herramienta inactiva
	if ( this.pInactiva!=null ) {
		YAHOO.util.Dom.removeClass(this.pInactiva, "oculto");
	}
	// Oculta el panel de herramienta activa
	if ( this.pActiva!=null ) {
		YAHOO.util.Dom.addClass(this.pActiva, "oculto");
	}
}

// ------------------------------------------------------------------ WidgetBase
WidgetToolChooser.prototype.render = function() {
	this.pActiva   = Util.getChildrenByClassName(this.container, "toolActiva"  , true);
	this.pInactiva = Util.getChildrenByClassName(this.container, "toolInactiva", true);
	
	// Cuando hacemos click en el panel de desactivado, la activamos
	if ( this.pInactiva!=null ) {
		// Mostramos como clickable el panel inactivo
		Util.showElementAsClickable(this.pInactiva);
		
		YAHOO.util.Event.addListener(this.pInactiva, "click", function(event, myself) {
			myself.toolBox.activaTool(myself);
		}, this);
	}
	
	//this.inactiva();
}