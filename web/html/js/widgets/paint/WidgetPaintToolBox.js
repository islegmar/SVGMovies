/**
 * Caja de herramientas de pintura
 */
function WidgetPaintToolBox() {
	WidgetPaintToolBox.superclass.constructor.call(this);
	
	// Div donde está la caja con las herramientas de pintura
	this.box;
	
	// Tools
	this.tools = [];
	
	// La herramienta de pintura activa en este momento
	this.activePaintTool = null;
	
	// La baldosa activa en este momento 
	// TODO : Hmmmmm ¿no será mejor la comunicación por eventos?
	this.baldosa;
	// TODO ?
	this.lienzo;
	// Evento de Zoom
	this.eventZoom = null;
	// Nivel actual de zoom (factor)
	// TODO - El valor inicial lo deberíamos recibir de SVGGroup, pero lo pongo
	// aquí porque no me fío (sincronías y esas cosas) 
	this.currZoom = 1;
}

YAHOO.lang.extend(WidgetPaintToolBox, WidgetBase);

// Posibles herramientas seleccionadas
WidgetPaintToolBox.TOOL_BRUSH = 1;
WidgetPaintToolBox.TOOL_COLORPICKER = 2;
WidgetPaintToolBox.TOOL_BGCHOOSER = 3;
WidgetPaintToolBox.TOOL_FILLCOLORPICKER = 4;
WidgetPaintToolBox.TOOL_TEMBLEQUE  = 5;
WidgetPaintToolBox.TOOL_PAINTMODE  = 6;
// Herramientas de pintura (sólo una está activa)
WidgetPaintToolBox.TOOL_LINEA = 50;
WidgetPaintToolBox.TOOL_CIRCULO = 51;


// --------------------------------------------------------------------- Setters
WidgetPaintToolBox.prototype.setBox = function(box) {
	this.box = YAHOO.util.Dom.get(box);
}

WidgetPaintToolBox.prototype.setEventZoom = function(eventZoom) {
	this.eventZoom = eventZoom; 
}

WidgetPaintToolBox.prototype.setBaldosa = function(baldosa) {
	this.baldosa = baldosa;
}

WidgetPaintToolBox.prototype.setLienzo = function(lienzo) {
	this.lienzo = lienzo;
}

WidgetPaintToolBox.prototype.setActionWhenMouseReleased = function(action) {
  return this.tools[WidgetPaintToolBox.TOOL_PAINTMODE].setActionWhenMouseReleased(action);
}


// ------------------------------------------------------------ Métodos Públicos
/** Activamos el modo de pintura en color */
WidgetPaintToolBox.prototype.activeColorMode  = function() {
	this.tools[WidgetPaintToolBox.TOOL_FILLCOLORPICKER].activeColorMode();
	this.tools[WidgetPaintToolBox.TOOL_COLORPICKER].activeColorMode();
	
	// Quitamos el fondo negro (si hay)
	this.lienzo.removeFondoNegro();
}

/** Activamos el modo de pintura en B&W */
WidgetPaintToolBox.prototype.activeBWMode  = function() {
	this.tools[WidgetPaintToolBox.TOOL_FILLCOLORPICKER].activeBWMode();
	this.tools[WidgetPaintToolBox.TOOL_COLORPICKER].activeBWMode();

	// Ponemos el fondo negro
	this.lienzo.addFondoNegro();
	
}

WidgetPaintToolBox.prototype.getTool = function(id) {
	return this.tools[id];
}

WidgetPaintToolBox.prototype.getPaintToolActiva = function() {
	return this.activePaintTool;
}

WidgetPaintToolBox.prototype.getColor = function() {
	return this.tools[WidgetPaintToolBox.TOOL_COLORPICKER].getColor();
}

WidgetPaintToolBox.prototype.getFillColor = function() {
	return this.tools[WidgetPaintToolBox.TOOL_FILLCOLORPICKER].getColor();
}

WidgetPaintToolBox.prototype.getStrokeWidth = function() {
	if ( this.isZoomChangeStrokeWidth() ) {
		return this.tools[WidgetPaintToolBox.TOOL_BRUSH].getStrokeWidth()/this.currZoom;	
	} else {
		return this.tools[WidgetPaintToolBox.TOOL_BRUSH].getStrokeWidth();
	}
}

WidgetPaintToolBox.prototype.isSuavizarPath = function() {
	return this.tools[WidgetPaintToolBox.TOOL_LINEA].isSuavizarPath();
}

WidgetPaintToolBox.prototype.isOneStepByDraw = function() {
	return this.tools[WidgetPaintToolBox.TOOL_PAINTMODE].isOneStepByDraw();
}

WidgetPaintToolBox.prototype.getActionWhenMouseReleased = function() {
	return this.tools[WidgetPaintToolBox.TOOL_PAINTMODE].getActionWhenMouseReleased();
}

WidgetPaintToolBox.prototype.isZoomCreaFotogramas = function() {
	return this.tools[WidgetPaintToolBox.TOOL_PAINTMODE].isZoomCreaFotogramas();
}

WidgetPaintToolBox.prototype.isMoveCreaFotogramas = function() {
	return this.tools[WidgetPaintToolBox.TOOL_PAINTMODE].isMoveCreaFotogramas();
}

WidgetPaintToolBox.prototype.isZoomChangeStrokeWidth = function() {
	return this.tools[WidgetPaintToolBox.TOOL_PAINTMODE].isZoomChangeStrokeWidth();
}

WidgetPaintToolBox.prototype.getUrlBg = function() {
	return this.tools[WidgetPaintToolBox.TOOL_BGCHOOSER].getBgUrl();
}

WidgetPaintToolBox.prototype.getTemblequeLevel = function() {
	return this.tools[WidgetPaintToolBox.TOOL_TEMBLEQUE].getLevel();
}

/** Recibimos la notificación de un nuevo bg */  
WidgetPaintToolBox.prototype.applyBgUrl = function(bgUrl) {
	// TODO ¿Por eventos?
	if ( this.baldosa!=null ) {
		this.baldosa.actualizaBgImage(bgUrl);
	}
}

/** Activa una herramienta de pintura (lápiz, círculos,...) */
WidgetPaintToolBox.prototype.activaTool = function(paintTool) {
	// Desactiva la que estaba activa
	if ( this.activePaintTool != null ) {
		this.activePaintTool.inactiva();
	}
	
	// Activa la nueva
	this.activePaintTool  = paintTool;
	this.activePaintTool.activa();
}

// ------------------------------------------------------------------ WidgetBase
WidgetPaintToolBox.prototype.render = function() {
	// Subscribe
	if ( this.eventZoom ) {
		this.eventZoom.subscribe( function(evt, args, myself) {
			myself.currZoom = args[0].newZoom;
	    }, this);
	}
	// Nos pateamos toda la caja para ver que herramientas son las que tenemos
	// El nombre de la herramienta es el nombre de la clase
	// TODO : ¿Se podría usar otro atributo?
	// Buscamos todos los elementos con clase WidgetPaintTool
	this.tools = [];
	YAHOO.util.Dom.getElementsByClassName ('WidgetPaintTool', null, this.box, function(ele, myself) {
		
		// Buscamos la herramienta.
		// El nombre de la herramienta está está gaurdado en el nombre de la 
		// clase como tool<Widget>
		// pej.
		// <td class="WidgetPaintTool toolWidgetColorPicker">Color</td>
		// corresponde a WidgetColorPicker
		var tool;
		
		// ele.className es una lista separada por espacios con todas las clases
		var classes = ele.className.split(' ');
		for(var ind=0; ind<classes.length; ++ind) {
			var classe = classes[ind];
			
			// La clase empieza por app_
			if (classe.indexOf("tool")==0 ) {
				// Capitaliza la primera a
				var tipoObj = classe.substring("tool".length);
				tool = eval("new " + tipoObj + "()");
				tool.setContainer(ele);
				tool.render();
				tool.setToolBox(myself);
				// Nos guardamos la herramienta
				myself.tools[tool.getTipo()] = tool;
				
				// Activamos el dibujo de líneas
				if ( tool.getTipo()== WidgetPaintToolBox.TOOL_LINEA) {
					myself.activaTool(tool);
				}
			}
		}
		
		// TODO : ¿POr qué no aparece la excepción?
		if ( tool==null ) {
			//throw "No se ha encontrado el nombre de la herramienta en '" + ele.className + "'";
			alert( "No se ha encontrado el nombre de la herramienta en '" + ele.className + "'");
		}
	}, this);
}