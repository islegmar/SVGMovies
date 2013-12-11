/**
 * Gestiona el tembleque del dibujo 
 */
function WidgetPaintTembleque() {
	WidgetPaintTembleque.superclass.constructor.call(this);
	// Nivel del tembleque
	this.eLevel = null;
}
YAHOO.lang.extend(WidgetPaintTembleque, WidgetPaintTool);

// ------------------------------------------------------------ Métodos Públicos
WidgetPaintTembleque.prototype.getLevel = function() {
	return this.eLevel.value; 
}

// ------------------------------------------------------------- WidgetPaintTool
WidgetPaintTembleque.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_TEMBLEQUE;
}

// ----------------------------------------------------------- WidgetToolChooser
WidgetPaintTembleque.prototype.render = function() {
	WidgetPaintTembleque.superclass.render.call(this);
	
	// Añadimos un input text para poner el radio del círculo
	this.eLevel= Util.getChildrenByTagName(this.container, "input");
	this.eLevel.value=0;
}
