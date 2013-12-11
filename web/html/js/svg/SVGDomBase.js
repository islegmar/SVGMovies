/**
 * Clase base de todos aquellos objetos SVG que tienen su representación DOM
 * (vamos, todos)
 */
function SVGDomBase() {
	// Elemento DOM
	this.eDom = null; 
	// Todos los elementos tienen un id
	this.id = null;
}

/** Devuelve el elemento DOM */
SVGDomBase.prototype.getDom = function () {
	return this.eDom;
}

/** Devuelve el id. Si no existe, se crea uno */
SVGDomBase.prototype.getId = function () {
	if ( this.id==null ) {
		this.id=(new Date()).getTime() + "_" + Math.floor(Math.random()*1000);
	}
	if ( this.eDom.id==null ) {
		this.eDom.id = this.id;
	}
	
	return this.id;
}

SVGDomBase.prototype.render = function () {
	alert("Función render() en " + this + " no implementada");
}
