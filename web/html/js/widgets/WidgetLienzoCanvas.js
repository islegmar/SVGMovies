/**
 * Lienzo como canvas HTML5
 * 
 * @return
 */
function WidgetLienzoCanvas() {
	WidgetLienzoCanvas.superclass.constructor.call(this);
	
	// canvas
	this.canvas = null;
	// context 2d
	this.context = null;
	// Image Data
	this.imgd=null;
}
YAHOO.lang.extend(WidgetLienzoCanvas, WidgetLienzo);

WidgetLienzoCanvas.prototype.render = function() {
	WidgetLienzoCanvas.superclass.render.call(this);
	
	// canvas
	this.canvas = document.getElementById("lienzo");
	// context 2d
	this.context = this.canvas.getContext("2d");
	// Image Data
	this.imgd = this.getImageData(this.canvas.width, this.canvas.height);  

	this.context.strokeStyle = "black";
	
}

/* Limpia el lienzo */
WidgetLienzoCanvas.prototype.limpia = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var w = this.canvas.width;
	this.canvas.width = 1;
	this.canvas.width = w;
	this.indPath=0;
	this.indPunto=0;
	this.numPuntos=0;
}

/*
WidgetLienzoCanvas.prototype.play = function() {
	// Limpia el lienzo
	this.limpia();

	// Empezamos a dibujar  
	doDrawPoint(this);
}



//Obtain a portion of the graphic data  
WidgetLienzoCanvas.prototype.getImageData = function(w, h) {       

  // Not all browsers implement createImageData. On such browsers  
  // we obtain the ImageData object using the getImageData method.   
  // The worst-case scenario is to create an object *similar* to  
  // the ImageData object and hope for the best luck.       
  if (this.context.createImageData) {        
    return this.context.createImageData(w, h);       
  } else if (this.context.getImageData) {         
    return this.context.getImageData(0, 0, w, h);       
  } else {         
    return {'width' : w, 'height' : h, 'data' : new Array(w*h*4)};       
  }   
}  

//Draw a pixel on the canvas     
WidgetLienzoCanvas.prototype.drawPoint = function(x, y) {            
  // Calculate the pixel offset from the coordinates       
  var idx = (x + (y * this.imgd.width)) * 4;        

  // Modify the graphic data       
  this.imgd.data[idx] = 0;     // Red       
  this.imgd.data[idx+1] = 0;   // Green       
  this.imgd.data[idx+2] = 0;   // Blue       
  this.imgd.data[idx+3] = 255; // Alpha channel     
}      
*/

// ---------------------------------------------------------------- WidgetLienzo
WidgetLienzoCanvas.prototype.startPath = function(punto) {
	this.context.moveTo(punto[0], punto[1]);
}

WidgetLienzoCanvas.prototype.addPoint2Path = function(punto) {
    this.context.lineTo(punto[0], punto[1]);
    this.context.stroke();
}

WidgetLienzoCanvas.prototype.endPath = function(punto) {
	this.context.lineTo(punto[0], punto[1]);
    this.context.stroke();
}
