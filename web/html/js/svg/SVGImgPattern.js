/**
 * Crea un pattern de tipo imagen
 */
function SVGImgPattern(id) {
	SVGImgPattern.superclass.constructor.call(this);
	
	this.id = id;
	this.img = null;
	this.src = null;
	this.width = null;
	this.height = null;
}

YAHOO.lang.extend(SVGImgPattern, SVGDomBase);

// --------------------------------------------------------------------- Setters
SVGImgPattern.prototype.setSrc = function (src) {
	this.src = src;
}

SVGImgPattern.prototype.setWidth = function (width) {
	this.width = width;
}

SVGImgPattern.prototype.setHeight = function (height) {
	this.height = height;
}


/** Crea el elemento DOM con los datos que tenemos en este momento */
SVGImgPattern.prototype.render = function () {
	// Este caso es un poco especial, porque depende de una función asynch (v. onload)
	// Lo que hacemos es que construimos el objeto "vacío" (por si llaman al 
	// getDom antes de que hayamos terminado) y después ya terminaremos de configurarlo
	this.eDom = document.createElementNS(SVGUtil.SVG_NAMESPACE,"pattern");
	this.eDom.id = this.id;
	YAHOO.util.Dom.setAttribute(this.eDom, "x", "0"); 
	YAHOO.util.Dom.setAttribute(this.eDom, "y", "0");
	YAHOO.util.Dom.setAttribute(this.eDom, "patternUnits", "userSpaceOnUse");
	YAHOO.util.Dom.setAttribute(this.eDom, "width" , this.width);
	YAHOO.util.Dom.setAttribute(this.eDom, "height", this.height);
	
	// Elemento image
	var image = document.createElementNS(SVGUtil.SVG_NAMESPACE,"image");
	YAHOO.util.Dom.setAttribute(image, "x", 0); 
	YAHOO.util.Dom.setAttribute(image, "y", 0);
	YAHOO.util.Dom.setAttribute(image, "width",  this.width); 
	YAHOO.util.Dom.setAttribute(image, "height", this.height);
	image.setAttributeNS("http://www.w3.org/1999/xlink", 'xlink:href', this.src);
	
	// Añadimos ig a pattern
	this.eDom.appendChild(image);
}
