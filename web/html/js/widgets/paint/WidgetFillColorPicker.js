/**
 * Elige el relleno. Tiene una particularidad, de que si nos ponemos en modo
 * B&W, se puede elegir fondo none o white 
 */
function WidgetFillColorPicker() {
	WidgetColorPicker.superclass.constructor.call(this);
	
}

YAHOO.lang.extend(WidgetFillColorPicker, WidgetColorPicker);

// ------------------------------------------------------------- Métodos Públicos
// En el caso de fill, el defecto es none
WidgetFillColorPicker.prototype.activeBWMode = function() {
	WidgetFillColorPicker.superclass.activeBWMode.call(this);
	this.setColor("none");
}

// ------------------------------------------------------------- WidgetPaintTool
WidgetFillColorPicker.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_FILLCOLORPICKER;
}
