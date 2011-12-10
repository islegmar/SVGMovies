/**
 * Caja de herramientas de pintura
 */
function WidgetBgChooser() {
	WidgetBgChooser.superclass.constructor.call(this);

	// Input text con la url
	this.inputUrl = null;
}

YAHOO.lang.extend(WidgetBgChooser, WidgetPaintTool);

// --------------------------------------------------------------------- Setters

// ------------------------------------------------------------ Métodos Públicos
WidgetBgChooser.prototype.getBgUrl = function() {
	return this.inputUrl.value;
}

// ------------------------------------------------------------------ WidgetBase
WidgetBgChooser.prototype.render = function() {
	
	// Añadimos un elemento que será el holder de esta clase
	this.inputUrl = document.createElement("input");
	this.container.appendChild(this.inputUrl );
	// Y un potón para aplicar el cambio
	var button = document.createElement("input");
	button.type = "button";
	button.value="Apply!";
	this.container.appendChild(button);
	YAHOO.util.Event.addListener(button, "click", function(e, myself) {
		// Obtenemos la URL del bg
		var bgUrl = myself.getBgUrl();
		// Se la notificamos al ToolBox
		myself.toolBox.applyBgUrl(bgUrl);		
	}, this);
}


// ------------------------------------------------------------- WidgetPaintTool
WidgetBgChooser.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_BGCHOOSER;
}
