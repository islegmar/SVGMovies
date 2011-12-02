/**
 * Rectángulos SVG
 */
function SVGRect() {
	this.x = "0"
	this.y = "0"
	this.width  = "100%";
	this.height = "100%";
	this.fill   = "black";
	this.stroke = "none";
}

YAHOO.lang.extend(SVGRect, SVGDomBase);

// --------------------------------------------------------------------- Setters

// ------------------------------------------------------------------ SVGDomBase
SVGRect.prototype.render = function (src) {
	
	this.eDom = document.createElementNS(SVGUtil.SVG_NAMESPACE,"rect");
	YAHOO.util.Dom.setAttribute(this.eDom, "x"     , this.x);
	YAHOO.util.Dom.setAttribute(this.eDom, "y"     , this.y);
	YAHOO.util.Dom.setAttribute(this.eDom, "width" , this.width);
	YAHOO.util.Dom.setAttribute(this.eDom, "height", this.height);
	YAHOO.util.Dom.setAttribute(this.eDom, "fill"  , this.fill);
	YAHOO.util.Dom.setAttribute(this.eDom, "stroke", this.stroke);
}
