/**
 * Dibujamos líneas 
 */
function WidgetToolLinea() {
	WidgetToolLinea.superclass.constructor.call(this);
	// Número de puntos a saltar al dibujar la línea.
	// Si es grande : muy redondeado, paths cortos
	// Si es pequeño : muy picudo, paths lagos
	this.eNumPuntosSaltar = null;
	// Checkbox que indica si suavizamos camino o no
	this.eSuavizarPath = null;
}
YAHOO.lang.extend(WidgetToolLinea, WidgetToolChooser);

//------------------------------------------------------------- WidgetPaintTool
WidgetToolLinea.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_LINEA;
}

//------------------------------------------------------------ Métodos Públicos
WidgetToolLinea.prototype.getNumPuntosSaltar = function() {
	return this.eNumPuntosSaltar.value; 
}

WidgetToolLinea.prototype.isSuavizarPath = function () {
	return this.eSuavizarPath.checked ;
}

//----------------------------------------------------------- WidgetToolChooser
WidgetToolLinea.prototype.render = function() {
	WidgetToolLinea.superclass.render.call(this);
	
	// Ínput text con el número de puntos a saltar
	this.eNumPuntosSaltar = YAHOO.util.Dom.get("numPuntosSaltar");
	this.eNumPuntosSaltar.value = 10;

	this.eSuavizarPath = YAHOO.util.Dom.get("suavizarCamino");
	this.eSuavizarPath.checked = "true";
}