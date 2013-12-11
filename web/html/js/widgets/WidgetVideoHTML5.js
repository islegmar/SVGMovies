/**
 * Gestiona un elemento de tipo Video
 * 
 * @return
 */
function WidgetVideoHTML5() {
	//WidgetVideoHTML5.superclass.constructor.call(this);
	
	// Container de este elemento
	this.container = null;
	
	// Atributos de elemento video
	this.width = null;
	this.height = null;
	//this.src = null;
	
	// Elemento video
	this.eVideo;
}
//YAHOO.lang.extend(WidgetVideoHTML5, WidgetBase);

// --------------------------------------------------------------------- Setters
WidgetVideoHTML5.prototype.setContainer = function(container) {
	this.container = YAHOO.util.Dom.get(container);
}

WidgetVideoHTML5.prototype.setWidth = function(width) {
	this.width = width;
}

WidgetVideoHTML5.prototype.setHeight = function(height) {
	this.height = height;
}

/*
WidgetVideoHTML5.prototype.setSrc = function(src) {
	this.src = src;
}
*/

// ----------------------------------------------------------------- Widget Base
WidgetVideoHTML5.prototype.render = function() {
	//WidgetVideoHTML5.superclass.render.call(this);
	
	this.eVideo = document.createElement("video");
	YAHOO.util.Dom.setAttribute(this.eVideo, "width", this.width);
	YAHOO.util.Dom.setAttribute(this.eVideo, "height", this.height);
	YAHOO.util.Dom.setAttribute(this.eVideo, "autoplay", "");
	YAHOO.util.Dom.setAttribute(this.eVideo, "controls", "");
	YAHOO.util.Dom.setAttribute(this.eVideo, "preload", "");	
	this.container.appendChild(this.eVideo);
}

// ------------------------------------------------------------ Métodos Públicos
/** Muestrea el vídeo (añade el DOM a un cierto container) */
WidgetVideoHTML5.prototype.show = function(src) {
	YAHOO.util.Dom.setAttribute(this.eVideo, "src", src + "?now=" + (new Date()).getTime());
	this.container.appendChild(this.eVideo);
	
	// TODO - Mejorar ésto
	// Eliminamos el elemento source de <video>
	/*
	if ( this.eVideo.firstChild ) {
		this.eVideo.removeChild(this.eVideo.firstChild);
	}
	
	// Añadimos un nuevo elemento
	var source = document.createElement("source");
	YAHOO.util.Dom.setAttribute(source, "src", src);
	YAHOO.util.Dom.setAttribute(source, "type", "video/avi");
	this.eVideo.appendChild(source);
	*/
}

/** Oculta el vídeo (elimina el elemento DOM) */
WidgetVideoHTML5.prototype.hide = function() {
	this.container.removeChild(this.eVideo);
	// Eliminamos el elemento source de <video>
	//this.eVideo.removeChild(this.eVideo.firstChild);
}