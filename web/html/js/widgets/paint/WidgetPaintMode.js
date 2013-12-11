/**
 * Opciones genéricas sobre los dibujos generados
 */
function WidgetPaintMode() {
	WidgetPaintMode.superclass.constructor.call(this);
	// One step by draw
	// this.eOneStepByDraw = null;
	// Acción que realizamos cuando alzamos el lápiz y terminamos el dibujo
	// (v. abajo WidgetPaintMode.ADD_* para listado)
	this.eCbActionWhenMouseRelease;
	
	// Checkbox. Si activo, al hacer zoom creamos nuevos fotogramas
	this.eZoomCreaFotogramas = null;
	// Checkbox. Si activo, al movernos creamos nuevos fotogramas
	this.eMoveCreaFotogramas = null;
	// Checkbox. Si activo, el stroke-with varía con el zoom para que VISUALMENTE
	// tenga siempre el mismo tamaño
	this.eZoomChangeStrokeWidth = null;
	
	// Action when finishing an action.
	// We can set it or get it from the checkboxes
	this.actionWhenMouseReleased = null;
}

// Posibles acciones cuando alzamos el lápiz    
WidgetPaintMode.ADD_CURRENT_FOTOGRAMA = 1;             // El dibujo se añade al fotograma actual             
WidgetPaintMode.ADD_ONE_FOTOGRAMA_NEWSTEP = 2;         // El dibujo se añade a un fotograma en un nuevo step
WidgetPaintMode.ADD_ONE_FOTOGRAMA_CURRSTEP = 3;        // El dibujo se añade a un fotograma en el step actual
WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_NEWSTEP = 4;    // Se añaden varios fotogramas (1 por cada trazo) en un nuevo step
WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_CURRSTEP = 5;   // Se añaden varios fotogramas (1 por cada trazo) en el step actual

YAHOO.lang.extend(WidgetPaintMode, WidgetPaintTool);

// --------------------------------------------------------------------- Setters
// ------------------------------------------------------------ Métodos Públicos
WidgetPaintMode.prototype.getActionWhenMouseReleased = function() {
	if ( this.actionWhenMouseReleased!=null ) {
	  return this.actionWhenMouseReleased;
	} else {
    var action = null;
  	
  	for(var ind=0; action==null && ind<this.eCbActionWhenMouseRelease.length; ++ind ) {
  		if ( this.eCbActionWhenMouseRelease[ind].checked ) {
  			action = this.eCbActionWhenMouseRelease[ind].value;
  		}
  	}
  	
  	return action;
  }
}

WidgetPaintMode.prototype.setActionWhenMouseReleased = function(action) {
  this.actionWhenMouseReleased = action;
}


WidgetPaintMode.prototype.isZoomCreaFotogramas = function() {
	return this.eZoomCreaFotogramas.checked;
}

WidgetPaintMode.prototype.isMoveCreaFotogramas = function() {
	return this.eMoveCreaFotogramas.checked;
}

WidgetPaintMode.prototype.isZoomChangeStrokeWidth = function() {
	return this.eZoomChangeStrokeWidth.checked;
}

// ------------------------------------------------------------------ WidgetBase
/**
 * Parmitmos de que todos los elementos HTML existen y sólo hay que encontrarlos
 */ 
WidgetPaintMode.prototype.render = function() {
	// Lista de checkboxes
	this.eCbActionWhenMouseRelease = YAHOO.util.Dom.getElementsBy( function(ele) {
		return ele.type=="radio" && ele.name=="actionWhenMouseReleased";
	});
	
	this.eZoomCreaFotogramas    = YAHOO.util.Dom.get("zoomCreaFotogramas");
	this.eMoveCreaFotogramas    = YAHOO.util.Dom.get("moveCreaFotogramas");
	this.eZoomChangeStrokeWidth = YAHOO.util.Dom.get("zoomChangeStrokeWidth");
}

// ------------------------------------------------------------- WidgetPaintTool
WidgetPaintMode.prototype.getTipo = function() {
	return WidgetPaintToolBox.TOOL_PAINTMODE;
}
