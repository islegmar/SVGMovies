/**
 * Caja de herramientas de pintura
 */
function WidgetColorPicker() {
	WidgetColorPicker.superclass.constructor.call(this);
	
	this.colorPicker = null;
	this.colorHolder = null;
	// Opcionalemente, podemos tener una "cajita" para seleccionar el pattern, 
	// en vez de el color
	this.imgSelect = null;
	// Indica si hemos elegido un color o un pattern
	this.isColorSelected = true;
}

YAHOO.lang.extend(WidgetColorPicker, WidgetPaintTool);

// --------------------------------------------------------------------- Setters
// ------------------------------------------------------------ Métodos Públicos
WidgetColorPicker.prototype.getColor = function() {
	return this.isColorSelected ? '#' + this.colorHolder.value : "url(#" + this.imgSelect.getValue() + ")";
}

/** Añade un pattern */
WidgetColorPicker.prototype.addPattern = function(val, url) {
	this.imgSelect.addValue(val, url);
}

// ------------------------------------------------------------------ WidgetBase
WidgetColorPicker.prototype.render = function() {

	// Añadimos un elemento que será el holder de esta clase
	this.colorHolder = document.createElement("input");
	this.container.appendChild(this.colorHolder);
	this.colorPicker = new jscolor.color(this.colorHolder, {});
	//this.colorPicker.fromString('73BEFF');
	this.colorPicker.fromString('000000');
	
	// Añadimos un pattern chooser
	// TODO - Debería ser opcional
	this.imgSelect = new WidgetImgSelect();
	this.imgSelect.render();
	this.container.appendChild(this.imgSelect.getDom());
	
	// TODO - Tal vez se podría hacer más "user friendly" 
	// select para saber si tenemos que devolver un color o un pattern
	var selValReturned = document.createElement("select");
	this.container.appendChild(selValReturned);
	
	var option = document.createElement("option");
	option.value = "color";
	option.text = "color";
	option.checked = "checked";
	selValReturned.appendChild(option);
	option = document.createElement("option");
	option.value = "pattern";
	option.text = "pattern";
	selValReturned.appendChild(option);
	
	YAHOO.util.Event.addListener(selValReturned, "change", function(event, params) {
		// Valor elegido
		var val=params.select.options[params.select.selectedIndex].value;
		if ( val=="color" ) {
			params.myself.isColorSelected = true;
		} else {
			params.myself.isColorSelected = false;
		}
	}, {myself:this, select:selValReturned});
}

// ------------------------------------------------------------- WidgetPaintTool
WidgetColorPicker.prototype.show = function() {	
}

WidgetColorPicker.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_COLORPICKER;
}
