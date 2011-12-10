/**
 * Utilities para gestionar los elementos <defs>
 */
function SVGDefs() {
	SVGDefs.superclass.constructor.call(this);
}

YAHOO.lang.extend(SVGDefs, SVGDomBase);

/** Crea el elemento DOM con los datos que tenemos en este momento */
SVGDefs.prototype.render = function () {
	this.eDom = document.createElementNS(SVGUtil.SVG_NAMESPACE,"defs");
}
