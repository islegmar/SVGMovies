/**
 * Caja de herramientas de pintura
 */
function WidgetPaintBrush() {
	WidgetPaintBrush.superclass.constructor.call(this);
	
	this.eStrokeWidth;
}

YAHOO.lang.extend(WidgetPaintBrush, WidgetPaintTool);

// --------------------------------------------------------------------- Setters

// ------------------------------------------------------------------ WidgetBase
WidgetPaintBrush.prototype.render = function() {
	this.eStrokeWidth  = YAHOO.util.Dom.get("grosorPincel");
	this.eStrokeWidth.value = 5;
}

// ------------------------------------------------------------ Métodos Públicos
WidgetPaintBrush.prototype.getStrokeWidth = function () {
	return this.eStrokeWidth.value;
}

// ------------------------------------------------------------- WidgetPaintTool
WidgetPaintBrush.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_BRUSH;
}
