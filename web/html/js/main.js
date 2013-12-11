var LOGGER = null;
var IS_LOCAL = true;

var LIENZO = null;
// Al final ponemos una variable global, porque es una especie de Config del sistema
// ¿Me arrepentiré?
var TOOLBOX = null;

// Custom Events
var EVENT_ZOOM = new YAHOO.util.CustomEvent("Zoom");
var EVENT_MOVE = new YAHOO.util.CustomEvent("Move");

/*if ( !Modernizr.canvas ) {
	alert("Tu navegador no soporta canvas de HTML5!");
} else if ( !Modernizr.localstorage ) {
	alert("Tu navegador no soporta localstorage de HTML5!");
} else {*/
    YAHOO.util.Event.onDOMReady( function() {
      /*
    	var widget = new WidgetImgSelect();
    	widget.setSelect("test");
    	widget.addValue("img1", 'http://localhost/dibujo2D/resources/mancha1.png');
    	widget.addValue("img2", 'http://localhost/dibujo2D/resources/mancha2.png');
    	widget.addValue("img3", 'http://localhost/dibujo2D/resources/mancha3.png');
    	widget.render();
    	return;
    	*/
    	
    	
        Logger.getInstance().setLogPanel("pLogger");
        /*
    	var lienzoCanvas = new WidgetLienzoCanvas();
    	lienzoCanvas.setLienzo("lienzo");
    	lienzoCanvas.render();
    	*/
    	
        // Evita el comportamiento por defecto del D&D
        document.ondragstart = function () { return false; };

        // Lienzo
        var lienzoSVG = new WidgetLienzoSVG();
        lienzoSVG.setLienzo("lienzoSVG");
        // Check if the svg element is inside a iframe
        var svgDocument = document;
        if ( document.getElementById("myFrame") ) {
        	svgDocument = document.getElementById("myFrame").contentWindow.document;
        }
        lienzoSVG.setESVG(svgDocument.getElementById("mySVG"));
        lienzoSVG.setEGroup(svgDocument.getElementById("mainGroup"));
        // TODO - No me mola mucho ésta solución..... ¿por qué?
        // lienzoSVG.setPaintToolBox(toolBox);
        lienzoSVG.setEventZoom(EVENT_ZOOM);
        lienzoSVG.render();        
        LIENZO = lienzoSVG;
        
        // Caja de herramientas
        var toolBox = new WidgetPaintToolBoxSVG();
        toolBox.setBox("paintBox");
        toolBox.setEventZoom(EVENT_ZOOM);
        toolBox.render();
        // TODO - Eliminar
        toolBox.setLienzo(lienzoSVG);
        TOOLBOX = toolBox;
        
        // Tenemos que cargar una serie de imágenes
        // TODO 
		var svgDefs = new SVGDefs();
		svgDefs.render();
		lienzoSVG.eSVG.insertBefore(svgDefs.getDom(), lienzoSVG.eSVG.firstChild);
        
        // Creamos los patterns para cada imagen y añadimos esa opción 
        // al color chooser del toolbox
		function addPattern(name, url) {
			// Construimos un objeto imagen
			var img = new Image();
			img.src = url;
			// Cuando se haya cargado, construimos el objeto SVGImgPattern
			// y lo añadimos a los colorPicker. Lo hacemos así porque, en
			// este momento, sabremos las dimensiones de las imágenes
			YAHOO.util.Event.addListener ( img , "load", function(event, obj) {
				// Añadimos el pattern al svg
				var pattern = new SVGImgPattern(obj.name);
				pattern.setSrc(obj.url);
				pattern.setWidth(obj.img.width);
				pattern.setHeight(obj.img.height);
				pattern.render();
				svgDefs.getDom().appendChild(pattern.getDom());
				
				// Añadimos el pattern a los color picker
	            var toolColorPicker     = toolBox.getTool(WidgetPaintToolBox.TOOL_COLORPICKER);
	            var toolFillColorPicker = toolBox.getTool(WidgetPaintToolBox.TOOL_FILLCOLORPICKER);	            
				if ( toolColorPicker!=null ) {
					toolColorPicker.addPattern(obj.name, obj.url);
				}
				if ( toolFillColorPicker!=null ) {
					toolFillColorPicker.addPattern(obj.name, obj.url);
				}
			}, {name : name, url : url, img : img});
			
		}
		
		if ( IS_LOCAL ) {
			/*
			addPattern('ladrillo', '../patterns/mancha3.png');
			addPattern('rojo'    , '../patterns/mancha2.png');
			addPattern('azul'    , '../patterns/azul.png');
			*/
		// Los pedimos al servidor	
		} else 
	    YAHOO.util.Connect.asyncRequest('POST', '../php/getPatterns.php', {
			success: function(o) {
	    		var data = YAHOO.lang.JSON.parse(o.responseText);
	    		
	            // Loop sobre todos los patterns del servidor
	    		for( var name in data ) {
	    			addPattern(name, data[name].url);
	    		}
	        },
	  		failure: function(o) { alert("Error : " + o.responseText); }
	    });
	    /*
		
		
        var urls = [ 'http://localhost/dibujo2D/resources/mancha1.png',
                     'http://localhost/dibujo2D/resources/mancha2.png',
                     'http://localhost/dibujo2D/resources/mancha3.png' ];
		*/
		
		// Activamos el modo B&W
		// TODO - Hacerlo configurable
		toolBox.activeBWMode();
		//toolBox.activeColorMode();
		
		// Close button
		$('.bClose').click(function(){
		  $(this).parent().hide();
		});
    $('#bRenderMovie').click(function(){
      $('body').trigger('renderMovie');
    });
    
    $('#bGenerateImage').click(function(){
      $('body').trigger('generateImage');
    });
    

    $('#btnPaint').click(function(){
      $('body').data('action', 'play');
      $('body').trigger('paintMode');
    });
    
    $('#btnMove').click(function(){
      $('body').trigger('moveMode');
    });
    
    $('#comandos button').click(function(){
      $(this).parent().children().removeClass('selected');
      $(this).addClass('selected');
    });
	  
    // @todo : Chapuzilla toto esto....
    var currZoomLevel = null;
    var isZoomStart = null;
    /*
    $('#bZoomIn').click(function(){
      $('body').addClass('modeZoom');
      currZoomLevel = -1;
      isZoomStart = true;
      performZoom();
    });

    $('#bZoomOut').click(function(){
      $('body').addClass('modeZoom');
      currZoomLevel = 1;
      isZoomStart = true;
      performZoom();
    });
    
    $('#bZoomStop').click(function(){
      $('body').removeClass('modeZoom');
      currZoomLevel = null;
      isZoomStart = null;
      // Reset, so the following actions (paint,...) create a NEW step
      TOOLBOX.setActionWhenMouseReleased(WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_NEWSTEP);
    });
    */
    
    function performZoom() {
      if ( currZoomLevel!=null ) {
        // When start Zoom create a new step
        if ( isZoomStart ) {
          TOOLBOX.setActionWhenMouseReleased(WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_NEWSTEP);
        }
        $('body').trigger('zoom', currZoomLevel);
        // For the rest, group all the zoom into the current step
        isZoomStart = false;
        TOOLBOX.setActionWhenMouseReleased(WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_CURRSTEP);
        
        setTimeout(performZoom, 500);
      }
    }
    
    var $lienzo = $('#lienzoSVG');
    // Slider
    /*
    $("#zoomSlider .slider" ).slider({
      value:100,
      min: 0,
      max: 500,
      step: 50,
      start : function(){
        console.log('Start');
      },
      change : function(){
        console.log('Change');
        
      },
      stop: function(){
        console.log('Stop ');
      }
    });
    */
    $( "#zoomSlider input")
      .on('slidestart', function(){
        $lienzo.trigger('customZoomStart');
      })
      .on('slidestop', function(){
        $lienzo.trigger('customZoomEnd');
      })
      .bind( "change", function(event, ui) {
        var $this = $(this);
        // Previous value
        var prevVal = $this.data('value')==null ? this.defaultValue : $this.data('value');
        // Current Value
        var currVal = $this.val();
        // They are different
        if ( prevVal!=currVal ) {
          $this.data('value', currVal);
          // Zoom out
          if ( currVal > prevVal ) {
            $lienzo.trigger('customZoomRun',[1]);
          // Zoom In  
          } else {
            $lienzo.trigger('customZoomRun',[-1]);
          }
        }
        
      });
    /* Basic/Advanced modes */
    $('#comandos #mode').change(function(){
      if ( $(this).val()=='advanced' ) {
        $('body').addClass('modeAdvanced');
      } else {
        $('body').removeClass('modeAdvanced');
      }
    });
  });
/*}*/


