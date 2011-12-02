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
    });
/*}*/


