/**
 * Gestiona los paths de SVG
 * 
 * NOTA: Este path NO sabe nada de los sistemas de coordenadas, trasnalte, zooms.....
 * así que los puntos YA tienen que llegar transformados
 * 
 * NOTA: Por ahora no se usa, ha quedado en buenas intenciones. 
 */
function SVGPath() {
	// Elemento DOM con el path
	this.ePath = null;
	// Número de puntos que nos saltamos
	this.totSkip=0;
	// Índice del punto que nos estamos saltando
	this.indSkip=0;
	// Puntos del Path
	this.puntos="";
	// Estilo 
	this.style = null;
}

// --------------------------------------------------------------------- Setters
SVGPath.prototype.setStyle = function(style) {
	this.style = style;
}

// ------------------------------------------------------------ Métodos Públicos
SVGPath.prototype.startPath = function(punto) {
	this.puntos = "M";
	this.puntos += punto[0];
	this.puntos += ',';
	this.puntos += punto[1];
	this.puntos += ' L';
	
	this.ePath = document.createElementNS(SVGUtil.SVG_NAMESPACE,"path");
	this.ePath .setAttribute('d', this.puntos);
	this.ePath .setAttribute('style' , this.ePath);
    
    Logger.getInstance().log("START PATH : " + this.puntos , "logUv");
    
    return this.ePath;
}

SVGPath.prototype.endPath = function(punto) {
}

SVGPath.prototype.addPoint2Path = function(punto) {
}

/** Smooth del path */
SVGPath.prototype.smooth = function(punto) {
}

