/**
 * Especializada para SVG
 */
function WidgetPaintToolBoxSVG() {
	WidgetPaintToolBoxSVG.superclass.constructor.call(this);
}

YAHOO.lang.extend(WidgetPaintToolBoxSVG, WidgetPaintToolBox);

// ------------------------------------------------------------ Métodos Públicos
/**
 * Devuelve un string con el estilo
 */
/*
WidgetPaintToolBoxSVG.prototype.getStyle= function() {
	
	var style = "";
	style += "stroke : " + this.getColor() + ";";
	style += "stroke-width : " + this.getStrokeWidth() + ";";
	style += "fill: " + this.getFillColor() + ";";
	
	return style;
}
*/
// Si aplicamos los estuils como atributos, después resultan más sencillos para manipular
WidgetPaintToolBoxSVG.prototype.applyStyle= function(eSvg) {
	
	/*
	var style = "";
	style += "stroke : " + this.getColor() + ";";
	style += "stroke-width : " + this.getStrokeWidth() + ";";
	style += "fill: " + this.getFillColor() + ";";
	
	return style;
	*/
	eSvg.setAttribute("stroke"      , this.getColor());
	eSvg.setAttribute("stroke-width", this.getStrokeWidth());
	eSvg.setAttribute("fill"        , this.getFillColor());
}
