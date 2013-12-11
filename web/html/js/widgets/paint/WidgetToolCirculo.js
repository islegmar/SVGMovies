/**
 * Dibujamos círculos 
 */
function WidgetToolCirculo() {
	WidgetToolCirculo.superclass.constructor.call(this);
	// Radio del círculo
	this.eRadio = null;
}
YAHOO.lang.extend(WidgetToolCirculo, WidgetToolChooser);

// ------------------------------------------------------------ Métodos Públicos
WidgetToolCirculo.prototype.getRadio = function() {
	return this.eRadio.value; 
}

// ------------------------------------------------------------- WidgetPaintTool
WidgetToolCirculo.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_CIRCULO;
}

// ----------------------------------------------------------- WidgetToolChooser
WidgetToolCirculo.prototype.render = function() {
	WidgetToolCirculo.superclass.render.call(this);
	
	// Añadimos un input text para poner el radio del círculo
	this.eRadio = Util.getChildrenByTagName(this.pActiva, "input");
	this.eRadio.value=10;
}
