/**
 * Caja de herramientas de pintura
 */
function WidgetPaintTool() {
	WidgetPaintTool.superclass.constructor.call(this);

	// El <div> donde está esta herramienta
	this.container = null;
	
	// EL Toolbox (parent)
	this.toolBox = null;
}

YAHOO.lang.extend(WidgetPaintTool, WidgetBase);

// --------------------------------------------------------------------- Setters
WidgetPaintTool.prototype.setContainer = function (container) {
	this.container = container;
}

WidgetPaintTool.prototype.setToolBox = function (toolBox) {
	this.toolBox = toolBox;
}

// ------------------------------------------------------------ Métodos Públicos
WidgetPaintTool.prototype.show = function() {
	YAHOO.util.Dom.removeClass(this.container, "oculto");
}

WidgetPaintTool.prototype.hide = function() {
	YAHOO.util.Dom.addClass(this.container, "oculto");
}

// ---------------------------------------------------------- Métodos Abstractos
WidgetPaintTool.prototype.getTipo = function() {
	alert(this + "getTipo() No implementado");
}

