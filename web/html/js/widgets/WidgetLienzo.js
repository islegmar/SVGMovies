/**
 * Clase abstracta (su implementazión puede ser pej. HTML5 o SVG) que representa
 * un lienzo. Captura los eventos del usuario y para realizar cosas como:
 * + Dibujar líneas
 * + Zoom
 * + Panning (mover el panel) 
 * @return
 */
function WidgetLienzo() {
  this.ID = 'WidgetLienzo';
  
	// panel donde se situal el canvas de HTML5 o de SVG o de lo que sea
	this.lienzo = null;
	this.$lienzo = null;
	
	// log panel
	this.logPanel = null;
	
	// TODO - No me mola mucho que éste tenga una referencia a WidgetPaintToolBox,
	// no me parece muy elegante -> Pues a mi no me parece mal, mejor ésto que una
	// referencia gloabl ¿no?
	// Sí, ahora es una referencia global a TOOLBOX
	// this.paintToolBox = null;
	
	// true si estamos dibujando
	this.isDrawing = false;
	// Timeout
	this.timeout=5;
	// En el play, dibujamos puntos
	this.renderAsPuntos = false;
	// Modo actual del cursor
	this.mode=null;
	// Último punto
	this.lastPoint=null;
	// Rueda del ratón
	this.mouseWheel=null;

	// ¿TO DELETE?: Probablemento estas variables no sirven ahora, porque el 
	// dibujado "punto a punto" lo hace la subclase a su manera
	
	// paths del dibujo. cada path es una colección de puntos
	this.paths = 0;
	// ind del path que estamos dibujando
	this.indPath = 0;
	// ind del punto del path que estamos dibujando
	this.indPunto = 0;
	// número de puntos
	this.numPuntos = 0;
	// Evento de zoom
	this.eventZoom = null;
	
	// Si lo ejecutamos en local o no
	this.isLocal = true;
	
	// @todo : Unificar un poco (también se usa isDragging)
	 // Indica si estamos moviendo o no (-> Pintando)
  this.isMoving = false;
  // Indica si iniciamos una acción (paint/move/zoom)
  this.isStartAction = null;

}
// Modos del cursor 
WidgetLienzo.MODE_PAINT = 0;
WidgetLienzo.MODE_MOVE = 1;

function doDrawPoint(myself) {	
	// Random color
	//myself.context.strokeStyle = Util.randomColor("hex");
	
	// Obtenemos el punto
	var punto = myself.paths[myself.indPath][myself.indPunto];
	
	// Points
	if ( myself.renderAsPuntos ) {
		myself.drawPoint(punto[0], punto[1]);  
		myself.context.putImageData(myself.imgd, 0, 0);
	} else {
		if ( myself.indPunto==0 ) {
			myself.startPath(punto);
			/*
			myself.context.beginPath();
			myself.context.moveTo(punto[0], punto[1]);
			*/
		} else {
			if ( (myself.indPunto+1)==myself.paths[myself.indPath].length ) {
				myself.endPath(punto);
			} else {
				myself.addPoint2Path(punto, true);
			}
		}
	}
	
	// Nos movemos al siguiente punto
    ++myself.indPunto;
    
    // No quedan más puntos en el path actual
    if ( myself.indPunto>=myself.paths[myself.indPath].length )  {
		

    	/*
    	myself.context.closePath();
    	*/
    	// Nos movemos de path
    	++myself.indPath;
    	myself.indPunto=0;
    	
    	// Ya no quedan paths
    	if ( myself.indPath>=myself.paths.length )  {
    		return;
    	}
    }
    
    // Quedan más puntos, seguimos el dibujo
	setTimeout(function() {doDrawPoint(myself);},/*Math.floor(Math.random()*100)*/myself.timeout);
}
/*
function doIncStrokeWidth(myself) {
    // Quedan más puntos, seguimos el dibujo
	setTimeout(function() {doDrawPoint(myself);},myself.timeout);
}
*/
// --------------------------------------------------------------------- Setters
WidgetLienzo.prototype.setLienzo = function(lienzo) {
  this.lienzo = YAHOO.util.Dom.get(lienzo);
	this.$lienzo = $('#' + lienzo);
}

/*
WidgetLienzo.prototype.setPaintToolBox = function(paintToolBox) {
	this.paintToolBox = paintToolBox;
	paintToolBox.setLienzo(this);
}
*/

WidgetLienzo.prototype.setEventZoom = function(eventZoom) {
	this.eventZoom = eventZoom; 
}

// ------------------------------------------------------------ Métodos Públicos
WidgetLienzo.prototype.render = function() {
	// logPanel
	this.logPanel = document.getElementById("log");
	// Inicializamos el array
	this.paths = new Array();
	this.isDrawing = false;
	
	this.mouseWheel = new MouseWheel();
	this.mouseWheel.setMagnifier(this);
	this.mouseWheel.render();
	
	// ===========================================================================
	//
	// Actions
	//
	// ===========================================================================
	
	// ---------------------------------------------------------------------- Zoom
	// Start a Zoom
	this.$lienzo.bind('customZoomStart', {myself:this}, function(e) {
	  var myself = e.data.myself;
    // Create a new Fotogram where to put all the zoom
	  TOOLBOX.setActionWhenMouseReleased(WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_NEWSTEP);

	  myself.isStartAction = true;
	  $('body').attr('data-action', 'move');
	  
	  return false;
	});
	
	// Zoom the image
	this.$lienzo.bind('customZoomRun', {myself:this}, function(e, delta) {
	  var myself = e.data.myself;
	  if ( !myself.isStartAction ) return;
	  // When doZoom is executed, the SVG is saved. The firs action just the start
	  // will CREATE a new Fotogram ....
	  myself.doZoom(delta);
	  // ... while the next steps will be ADDES to the current Fotograma
	  TOOLBOX.setActionWhenMouseReleased(WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_CURRSTEP);  
	  
	  return false;
	});
	
	// End the zoom
	this.$lienzo.bind('customZoomEnd', {myself:this}, function(e) {
	  var myself = e.data.myself;
	  if ( !myself.isStartAction ) return;
	  
	  myself.isStartAction = null;
	  $('body').attr('data-action', 'paint');
	  
	  return false;
	});
	
	
  // --------------------------------------------------------------------- Paint
  
	// Start Paint
	function startPaint(e){
    var myself = e.data.myself;

    // We start a paint, process the event
    // If using gesture, not paint if if is with more that one finger
    if( !(e.button == 2 || myself.isMoving) && (!e.gesture || e.gesture.touches.length>1) ) {
      e.preventDefault();
      
      myself.isStartAction = true;
      
      Logger.getInstance().lowDebug("[DOWN");
      var punto = Util.getRelCoordinates(e, myself.lienzo, Logger.getInstance());
      //YAHOO.util.Event.stopEvent(e); 
      
      myself.mode=WidgetLienzo.MODE_PAINT;
      // Si tenemos la herramienta de círculo activada, al hacer click
      // dibujamos un círculo
      if (TOOLBOX.getPaintToolActiva().getTipo()==WidgetPaintToolBox.TOOL_CIRCULO) {
        myself.drawCirculo(punto);
        // Línea  
      } else {
        // Creamos un nuevo path y guardamos el punto
        myself.paths.push(new Array());
        myself.paths[myself.paths.length-1].push(punto);
        ++myself.numPuntos;
        
        if ( myself.logPanel ) {
          myself.logPanel.innerHTML="START [" + myself.numPuntos + "] : " + punto;
        }
        myself.startPath(punto); 
        //myself.context.moveTo(punto[0], punto[1]);
        myself.isDragging = true;
      }
      
      myself.lastPoint=punto;
      
      return false;
    }
  };
  
  // Painting
  function execPaint(e){
    var myself = e.data.myself;

    if ( myself.mode==WidgetLienzo.MODE_PAINT ) {
      e.preventDefault();
      
      //Logger.getInstance().lowDebug('.');
      var punto = Util.getRelCoordinates(e, myself.lienzo);
      
      // Sólo lo tenemos en cuentas en el caso de líneas
      if  (TOOLBOX.getPaintToolActiva().getTipo()==WidgetPaintToolBox.TOOL_LINEA) {
        // Guardamos el punto en el path actual
        myself.paths[myself.paths.length-1].push(punto);
        ++myself.numPuntos;
        
        //Logger.getInstance().lowDebug("DRAW [" + myself.numPuntos + "] : " + punto);
        
        myself.addPoint2Path(punto);
      }
      
      myself.lastPoint=punto;
      myself.isStartAction = false;
      
      return false;
    }
  };
  
  
  // End Paint
  function endPaint(e){
    var myself = e.data.myself;

    // End of paint, process the event
    if( myself.mode == WidgetLienzo.MODE_PAINT ) {
      e.preventDefault();
      
      Logger.getInstance().lowDebug('UP ' + myself.lienzo);  
      //var punto = Util.getRelCoordinates(e, myself.lienzo, Logger.getInstance());
      var punto  = myself.paths[myself.paths.length-1];
      //YAHOO.util.Event.stopEvent(e); 
      Logger.getInstance().lowDebug('punto:' + punto +']');

      Logger.getInstance().lowDebug("LINE");
      
      // Sólo lo tenemos en cuentas en el caso de líneas
      if (TOOLBOX.getPaintToolActiva().getTipo()==WidgetPaintToolBox.TOOL_LINEA) {
        // Guardamos el punto en el path actual
        myself.paths[myself.paths.length-1].push(punto);
        ++myself.numPuntos;
        Logger.getInstance().lowDebug("#puntos : " + myself.numPuntos);
        
        // Marke the end of the path -> method save will be called
        myself.endPath(punto);
      }
      
      myself.isDragging = false;
      myself.isMoving = false;
      myself.mode=null;
      myself.isStartAction = null; 
      
      return false;
    }
  };
  
  // ---------------------------------------------------------------------- Move
  
  // Start Move
  function startMove(e){
    var myself = e.data.myself;
    
    // We start a movement, process the event
    if( e.button == 2 || myself.isMoving || (e.gesture && e.gesture.touches.length>1) ) {
      e.preventDefault();
      
      myself.isStartAction = true;
      
      var punto = Util.getRelCoordinates(e, myself.lienzo, Logger.getInstance());
      Logger.getInstance().debug("startMove. punto:"+punto);
      
      myself.mode=WidgetLienzo.MODE_MOVE;
      myself.lastPoint=punto;
      
      Logger.getInstance().debug("START_MOVE|");
      $('body').attr('data-action', 'move');

      return false;
    }
  };
  
  // Moving
  function execMove(e){
    var myself = e.data.myself;

    if (myself.mode==WidgetLienzo.MODE_MOVE) {
      e.preventDefault();
      
      //Logger.getInstance().lowDebug('.');
      var punto = Util.getRelCoordinates(e, myself.lienzo);
      
     // IL - 07/03/13
     // When moving, we agrupate all the movements in one step
     // In the first movement, we create a new Step
     if ( myself.isStartAction ) {
       TOOLBOX.setActionWhenMouseReleased(WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_NEWSTEP);
     } else {
       TOOLBOX.setActionWhenMouseReleased(WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_CURRSTEP);  
     }
     
      var dX =  punto[0]-myself.lastPoint[0];
      var dY =  punto[1]-myself.lastPoint[1];
      myself.translate(dX,dY);
      
      myself.lastPoint=punto;
      myself.isStartAction = false;
      
      Logger.getInstance().debug('.');
      
      return false;
    }
  };
  
  // End Move
  function endMove(e){
    var myself = e.data.myself;
    
    // End Move, process
    if( myself.mode == WidgetLienzo.MODE_MOVE ) {
      e.preventDefault();
      //var punto = Util.getRelCoordinates(e, myself.lienzo, Logger.getInstance());
      var punto  = myself.paths[myself.paths.length-1];
      //YAHOO.util.Event.stopEvent(e); 
      Logger.getInstance().lowDebug('punto:' + punto +']');
      
      Logger.getInstance().lowDebug("FIN DEL MOVE");
      // IL - 07/03/13
      // When moving, we agrupate all the movements in one step
      TOOLBOX.setActionWhenMouseReleased(WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_NEWSTEP);
      
      //myself.context.lineTo(punto[0], punto[1]);
      //myself.context.stroke();
      myself.isDragging = false;
      myself.isMoving = false;
      myself.mode=null;
      myself.isStartAction = null; 
      
      // Automatically, switch to paint mode
      $('body').trigger('paintMode'); 
          
      Logger.getInstance().debug('END MOVE|');
      return false;
    }
  };
  
  // ------------------------------- EVENTOS ------------------------------ //
	
	document.body.onContextMenu=function(){
		alert("ctx");
	};
	
	// Mostramos el dibujo
    YAHOO.util.Event.addListener("btnPlay", "click", function(e, myself) {
      myself.play();
    }, this);

	// Guardamos el dibujo
    // TODO : ¿Existe esto?
    /*
    YAHOO.util.Event.addListener("btnSave", "click", function(e, myself) {
    	myself.save();
    }, this);
    */
    
    // Guardamos el fotograma actual  
    YAHOO.util.Event.addListener("bSaveCurrFotograma", "click", function(e, myself) {
    	myself.save(false);
    }, this);
    

    // Limpiamos el lienzo
    YAHOO.util.Event.addListener("btnLimpia", "click", function(e, myself) {
    	myself.limpia();
    	// Inicializamos el array
    	myself.paths = new Array();
    	myself.isDrawing = false;
    	myself.indPath=0;
    	myself.indPunto=0;
    	myself.numPuntos=0;
    }, this);
	
	
    
    
    // --------------------------------------------------- TEMPORAL
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    
    // ---- Listeners
    if ( isMobile.any() ) {
      // Paint using jquery events
      $(this.lienzo).bind("touchstart", {myself:this}, startPaint);
      $(this.lienzo).bind("touchmove" , {myself:this}, execPaint);
      $(this.lienzo).bind("touchend"  , {myself:this}, endPaint);

      // Movement using hammer
      var $hammer = $(this.lienzo).hammer();
      $hammer.on("transformstart", {myself:this}, startMove);
      $hammer.on("transform"     , {myself:this}, execMove);
      $hammer.on("transformend"  , {myself:this}, endMove);
      /*
      $hammer.on("pinchout", {myself:this}, function(e){
        var myself = e.data.myself;
        myself.doZoom(0.5);
      });
      $hammer.on("pinchin", {myself:this}, function(e){
        var myself = e.data.myself;
        myself.doZoom(-0.5);
      });
      */
      
    // Browser
    } else {
      $(this.lienzo).bind("mousedown", {myself:this}, startPaint);
      $(this.lienzo).bind("mousemove", {myself:this}, execPaint);
      $(this.lienzo).bind("mouseup  ", {myself:this}, endPaint);
      
      $(this.lienzo).bind("mousedown", {myself:this}, startMove);
      $(this.lienzo).bind("mousemove", {myself:this}, execMove);
      $(this.lienzo).bind("mouseup  ", {myself:this}, endMove);
    }
    // -------------------------------------------------------------------- PLAY
    /*Hammer(this.lienzo).on('pinchout', function(){
      alert('pinchout');
    });
    Hammer(this.lienzo).on('pinchin', function(){
      alert('pinchin');
    });
    */
    /*
    Hammer(this.lienzo).on('swipe', function(e) {
      alert('Swipe');
    })
    */;
    /*
    $(this.lienzo).bind( "click", function(e) {
      e.preventDefault();
      
      alert("Tap");
      myself.play();
    });*/
}

/* Limpia el lienzo */
WidgetLienzo.prototype.limpia = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var w = this.canvas.width;
	this.canvas.width = 1;
	this.canvas.width = w;
	this.indPath=0;
	this.indPunto=0;
	this.numPuntos=0;
}


WidgetLienzo.prototype.play = function() {
  alert('WidgetLienzo.prototype.play');
  // Limpia el lienzo
	this.limpia();

	// Empezamos a dibujar  
	doDrawPoint(this);
}



//Obtain a portion of the graphic data  
WidgetLienzo.prototype.getImageData = function(w, h) {       

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
WidgetLienzo.prototype.drawPoint = function(x, y) {            
  // Calculate the pixel offset from the coordinates       
  var idx = (x + (y * this.imgd.width)) * 4;        

  // Modify the graphic data       
  this.imgd.data[idx] = 0;     // Red       
  this.imgd.data[idx+1] = 0;   // Green       
  this.imgd.data[idx+2] = 0;   // Blue       
  this.imgd.data[idx+3] = 255; // Alpha channel     
}      

//---------------------------------------------------------------- WidgetLienzo
WidgetLienzo.prototype.startPath = function(punto) {
	alert("Método no implementado");
}

WidgetLienzo.prototype.addPoint2Path = function(punto) {
	alert("Método no implementado");
}

WidgetLienzo.prototype.endPath = function(punto) {
	alert("Método no implementado");
}

WidgetLienzo.prototype.drawCirculo = function (centro) {
	alert("Método no implementado");
}

WidgetLienzo.prototype.translate = function (dX, dY) {
	alert("Método no implementado");
}

WidgetLienzo.prototype.save = function () {
	alert("Método no implementado");
}
/*
WidgetLienzo.prototype.doZoom = function (delta) {
	alert("Método no implementado");
}
*/