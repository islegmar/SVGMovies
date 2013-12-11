/**
 * Option list con imágenes
 * Consta de una select y un visor con la imagen seleccionada.
 * 
 * TODO - Mejorar, es un poco "chapuzas"
 * 
 * @return
 */
function WidgetImgSelect() {
	// Elemento DOM que representa el Widget, formado por:
	// + Una select : eSelect
	// + Un visor que muestra la imagen de la opción seleccionada : eVisor
	this.eDom = null;
	// Elemento DOM que representa el <select>
	this.eSelect = null;
	// Elemento DOM que representa el visor de la imagen seleccionada
	this.eVisor = null;
	
	// Mapa de imágenes/valores
	this.values = [];
}

// --------------------------------------------------------------------- Setters
WidgetImgSelect.prototype.setSelect = function(select) {
	this.eSelect = YAHOO.util.Dom.get(select);
}

// ------------------------------------------------------------ Métodos Públicos
// TODO - No es muy elegante, lo "normal" es llamar a esta función antes del render,
// pero da problemas en otros sitios. Esta función añade directamente una opción
// en la select
WidgetImgSelect.prototype.addValue = function(val, url) {
	this.values[val] = url;
	
	// Añadimos una nueva option
	var option = document.createElement("option");
	option.value = val;
	option.text = val;
	this.eSelect.appendChild(option);
}

WidgetImgSelect.prototype.render = function() {
	// No nos han dado el select : lo creamos nosotros 
	if ( this.eSelect==null ) {
		this.eDom = document.createElement("div");
		this.eSelect = document.createElement("select");
		this.eDom.appendChild(this.eSelect);
	// Nos han dado un select : tendremos que poner el visor donde podamos  	
	} else {
		this.eDom = this.eSelect.parentNode; 
	}
	
	// Creamos el visor y lo añadimos a eDom
	this.eVisor = document.createElement("img");
	this.eVisor.width = "10";
	this.eVisor.height = "10";
	this.eDom.appendChild(this.eVisor);
	
	// Siempre añadimos una en blanco
	var option = document.createElement("option");
	option.value = "";
	option.text = "<select>";
	this.eSelect.appendChild(option);
	// Listener para cuando cambiemos la opción del select
	YAHOO.util.Event.addListener(this.eSelect, "change", function(event, myself) {
		// Valor elegido
		var chosenoption=myself.eSelect.options[myself.eSelect.selectedIndex];
		var val = chosenoption.value;
		
		// Hemos elegido en blanco : deseleccionamos
		if ( !val || val.length==0 ) {
			myself.eVisor.src = "";
		// Mostramos la imagen correspondiente	
		} else {
			myself.eVisor.src = myself.values[val];
		}
	}, this);
}

WidgetImgSelect.prototype.getDom = function() {
	return this.eDom;
}

/** Devuelve el valor de la opción seleccionada */
WidgetImgSelect.prototype.getValue = function() {
	return this.eSelect.options[this.eSelect.selectedIndex].value;
}