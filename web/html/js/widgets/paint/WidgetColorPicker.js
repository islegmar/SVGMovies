/**
 * Caja de herramientas de pintura
 */
function WidgetColorPicker() {
	WidgetColorPicker.superclass.constructor.call(this);
	
	// Panel para elegir color
	this.pColor = null;
	this.colorPicker = null;
	this.colorHolder = null;
	
	// Panel para elegir pattern
	this.pPattern = null;
	this.imgSelect = null;
	
	// Inidica el tipo elegido (v. más abajo)
	this.activeKind = 1;
	
	// TODO - Un poco chapuzas, pero para salir del paso
	this.selectedColor = null;
	
	// Panel en color mode
	this.pColorMode = null;
	// Panel en B&W mode
	this.pBWMode = null;
	// Si estamos en B&W mode
	this.isBWMode = null;
}
// Posibles tipos 
WidgetColorPicker.NONE    = 1;
WidgetColorPicker.COLOR   = 2;
WidgetColorPicker.PATTERN = 3;

YAHOO.lang.extend(WidgetColorPicker, WidgetPaintTool);

// --------------------------------------------------------------------- Setters
// ------------------------------------------------------------ Métodos Públicos
WidgetColorPicker.prototype.getColor = function() {
  return this.color;
  /*
	// Si estamos en B&W mode, la cosa va de otra manera
	if ( this.isBWMode ) {
		var color = null;
		// Vamos a ver si que está seleccionado
		// Nota : this.pBWMode es un <form>, así que this.pBWMode.fillBWMode me 
		// da la lista de checkboxes
		var lista = this.pBWMode.getElementsByTagName("input");
		for(var ind=0; color==null && ind<lista.length; ++ind ) {
			var cb = lista[ind];
			if ( cb.checked ) {
				color = cb.value;
			}
		}
		return color;
	// Si no....
	} else {
		// TODO
		if ( this.selectedColor!=null ) return this.selectedColor;
		
		switch ( this.activeKind ) 
		{
		case WidgetColorPicker.NONE:
			return "none";
		case WidgetColorPicker.COLOR:
			return "#" + this.colorHolder.value;
			YAHOO.util.Dom.setStyle(this.pColor,"visibility", "hidden");
		case WidgetColorPicker.PATTERN:
			return "url(#" + this.imgSelect.getValue() + ")";
		}
	}
	*/
}

WidgetColorPicker.prototype.activeColorMode = function() {
	this.setColor(null);
	this.isBWMode = false;
	YAHOO.util.Dom.removeClass(this.pColorMode , "oculto");
	YAHOO.util.Dom.addClass(this.pBWMode       , "oculto");
}

WidgetColorPicker.prototype.activeBWMode = function() {
	this.setColor("none");
	this.isBWMode = true;
	YAHOO.util.Dom.addClass(this.pColorMode , "oculto");
	YAHOO.util.Dom.removeClass(this.pBWMode , "oculto");
}


/** TODO : arreglar un poco */ 
WidgetColorPicker.prototype.setColor = function(color) {
	this.selectedColor = color;
}

/** Añade un pattern */
WidgetColorPicker.prototype.addPattern = function(val, url) {
	this.imgSelect.addValue(val, url);
}

WidgetColorPicker.prototype.activeColorMode = function() {
	this.setColor(null);
	this.isBWMode = false;
	YAHOO.util.Dom.removeClass(this.pColorMode , "oculto");
	YAHOO.util.Dom.addClass(this.pBWMode       , "oculto");
}

WidgetColorPicker.prototype.activeBWMode = function() {
	this.setColor("#FFFFFF");
	this.isBWMode = true;
	YAHOO.util.Dom.addClass(this.pColorMode , "oculto");
	YAHOO.util.Dom.removeClass(this.pBWMode , "oculto");
}

// ------------------------------------------------------------------ WidgetBase
/**
 * Parmitmos de que todos los elementos HTML existen y sólo hay que encontrarlos
 */ 
WidgetColorPicker.prototype.render = function() {
  this.color = '#FFFFFF';
  
  // ------------------------------------------------------------------ Listener
  $('body').bind('lineColor', {myself:this}, function(evt, color) {
    var myself = evt.data.myself;
    myself.color = color;
  });
  /*
	// --------------
	// Color mode y B&W
	// --------------
	this.pColorMode = Util.getChildrenByClassName(this.container, "pColorMode");
	this.pBWMode = Util.getChildrenByClassName(this.container, "pBWMode");
	this.isBWMode = false;

	
	// Panel con los selectores (radio puttons)
	var pSelectores = Util.getChildrenByClassName(this.container, "pSelectores");
	// Panel cuando se ha seleccionado el color
	this.pColor = Util.getChildrenByClassName(this.container, "pColor");
	// Panel cuando se ha seleccionado el pattern
	this.pPattern = Util.getChildrenByClassName(this.container, "pPattern");
	
	// --------------
	// Selectores 
	// --------------
	// Son radio button) que puede ser :
	// - none
	// - color
	// - pattern
	// Los configuramos para que, al clicar uno de ellos:
	// - Se cambie el valor de activeKind 
	// - Se muestre / oculte el panel correspondiente
	// TODO - Aquí usamos closures, no sé como parar 'this'
	var myself = this;
	YAHOO.util.Dom.getElementsBy(function(ele) {
		// Hemos encontrado un input. 
		if ( ele.type=="radio" ) {
			// Es el panel inicialmente activo
			if ( ele.checked ) {
				myself.activaPanel(ele.value);
			}
			
			// Al hacer click sobre una opción activamos / desactivamos los paneles
			// correspondientes
			YAHOO.util.Event.addListener(ele, "click", function(event, params) {
				params.myself.activaPanel(params.ele.value);				
			}, {myself:myself, ele:ele});
		}
	}, "input", pSelectores);
	
	// --------------
	// Panel Color
	// --------------
	// Obtenemos el input text que va a tener el código del colot
	this.colorHolder = Util.getChildrenByTagName(this.pColor, "input");
	// Construimos un colorPicker
	this.colorPicker = new jscolor.color(this.colorHolder , {});
	// Valor inicial
	this.colorPicker.fromString('000000');
	
	// --------------
	// Panel Pattern
	// --------------
	// Añadimos un pattern chooser
	this.imgSelect = new WidgetImgSelect();
	this.imgSelect.setSelect(Util.getChildrenByTagName(this.pPattern, "select"));
	this.imgSelect.render();
	*/
}

/** Activa uno de los paneles, el que tiene valor value */
WidgetColorPicker.prototype.activaPanel = function(value) {
	// Ocultamos el activo
	switch ( this.activeKind ) 
	{
	case WidgetColorPicker.COLOR:
		YAHOO.util.Dom.setStyle(this.pColor,"visibility", "hidden");
		break;
	case WidgetColorPicker.PATTERN:
		YAHOO.util.Dom.setStyle(this.pPattern,"visibility", "hidden");
		break;
	}
	
	// Mostramos el nuevo
	switch ( value ) 
	{
	case "none":
		this.activeKind = WidgetColorPicker.NONE; 
		break;
	case "color":
		this.activeKind = WidgetColorPicker.COLOR;
		YAHOO.util.Dom.setStyle(this.pColor,"visibility", "visible");
		break;
	case "pattern":
		this.activeKind = WidgetColorPicker.PATTERN;
		YAHOO.util.Dom.setStyle(this.pPattern,"visibility", "visible");
		break;
	}
}

// ------------------------------------------------------------- WidgetPaintTool
WidgetColorPicker.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_COLORPICKER;
}
