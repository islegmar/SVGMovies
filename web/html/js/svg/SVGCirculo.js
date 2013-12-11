/**
 * Círculos SVG
 */
function SVGCirculo() {
	this.centro = null;
	this.style = null;
	this.radio = 20;
}

YAHOO.lang.extend(SVGCirculo, SVGDomBase);

// --------------------------------------------------------------------- Setters
SVGCirculo.prototype.setCentro = function (centro) {
	this.centro = centro;
}

SVGCirculo.prototype.setStyle = function(style) {
	this.style = style;
}

SVGCirculo.prototype.setRadio = function(radio) {
	this.radio = radio;
}

// ------------------------------------------------------------------ SVGDomBase
SVGCirculo.prototype.render = function (src) {
	this.eDom = document.createElementNS(SVGUtil.SVG_NAMESPACE,"circle");
	YAHOO.util.Dom.setAttribute(this.eDom, "cx", this.centro[0]);
	YAHOO.util.Dom.setAttribute(this.eDom, "cy", this.centro[1]);
	YAHOO.util.Dom.setAttribute(this.eDom, "r" , this.radio);
	YAHOO.util.Dom.setAttribute(this.eDom, "style", this.style);
	/*
	YAHOO.util.Dom.setAttribute(this.eDom, "stroke", "black");
	YAHOO.util.Dom.setAttribute(this.eDom, "stroke-width", "2");
	YAHOO.util.Dom.setAttribute(this.eDom, "fill", "red");
	*/
}
