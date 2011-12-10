/**
 * Visor de ficheros SVG
 */
function WidgetVisorSVG() {
	// Donde se muestran los Steps
	this.eVisor = null;
	// Donde se ponen los índices de los diversos steps
	this.eStepsIndex = null;
	// Donde se ponen los fotogramas de cada uno de los steps
	this.eStepsContent = null;
	// Botón de save
	this.bSaveMovie = null;
	// Botón de load
	this.bLoadMovie = null;
	// Botón de Play Real
	this.bPlayReal = null;
	// Lista de steps
	this.steps = new Array();
	// Cuando hacemos play, el ind del step
	this.indCurrStep = null;
	// Current step
	this.currStep = null;
	// Cuando hacemos el PlayReal, el ind del fotograma
	this.indCurrFotogramaPlayReal = null;
	// Elemento WidgetLienzoSVG
	this.wLienzo = null;
}

// --------------------------------------------------------------------- Setters
WidgetVisorSVG.prototype.setVisor = function(eVisor) {
	this.eVisor = YAHOO.util.Dom.get(eVisor);
}

WidgetVisorSVG.prototype.setLienzo = function(wLienzo) {
	this.wLienzo = wLienzo;
}

// ------------------------------------------------------------ Métodos Públicos
WidgetVisorSVG.prototype.render = function() {
	// TODO - Setters
	this.eStepsIndex   = YAHOO.util.Dom.get("pStepsIndex");
	this.eStepsContent = YAHOO.util.Dom.get("pStepsContent");
	this.bSaveMovie    = YAHOO.util.Dom.get("bSaveMovie");
	this.bLoadMovie    = YAHOO.util.Dom.get("bLoadMovie");
	this.bPlayReal     = YAHOO.util.Dom.get("bPlayReal");

	// Save movie
    YAHOO.util.Event.addListener(this.bSaveMovie, "click", function(e, myself) {
    	myself.save2Disk();
    }, this);
	// Load movie
    YAHOO.util.Event.addListener(this.bLoadMovie, "click", function(e, myself) {
    	myself.loadFromDisk();
    }, this);
	// Play Real
    YAHOO.util.Event.addListener(this.bPlayReal, "click", function(e, myself) {
    	myself.playReal();
    }, this);


	// Capturamos los eventos del teclado para la reproducción
	var myself = this; // TODO - Evitar closure
    new YAHOO.util.KeyListener(
    		document, 
    		{
    			ctrl:false, 
    			keys:[37, 39]
    		},
            { 
    		  fn : function(type, args, obj) {
    					var code = parseInt(args[0]);
		    			switch(code) {
	    				// Left Arrow
		    			case 37:
		    			  myself.showPrevFotograma();
		    			  break;
		    			// Right Arrow  
		    			case 39:
		    			  myself.showNextFotograma();
		    			  break;
		    			}
    			   }
    		}
    ).enable();
}

WidgetVisorSVG.prototype.addFotograma = function(fotograma, isPathChanged, temblequeLevel, actionOnSave) {
	// Creamos un nuevo step. Si no es el caso, usamos el que ya tenemos
	if ( this.currStep==null || 
	     actionOnSave==WidgetPaintMode.ADD_ONE_FOTOGRAMA_NEWSTEP ||
	     actionOnSave==WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_NEWSTEP ) {
		// Si tenemos uno activo, lo ocultamos
		if ( this.currStep!=null ) {
			this.currStep.hide();
		}
		
		// Creamos el nuevo
		var idStep = this.steps.length;
		
		this.currStep = new WidgetVideoStep(idStep);
		this.currStep.setVisor(this.eVisor);
		// Creamos un contenedor para que éste step ponga sus controles y fotogramas
		var stepContainer = document.createElement("div");
		this.eStepsContent.appendChild(stepContainer);
		this.currStep.setContainer(stepContainer);
		
		// Lo añadimos a la lista
		this.steps.push(this.currStep);
		
		// Creamos un elemento en la lista de índice
		var link = document.createElement("a");
		link.innerHTML = idStep;
		this.currStep.setEIdStep(link);
		// Al hacer click, mostramos este step 
		YAHOO.util.Event.addListener(link, "click", function(event, params) {
			// Ocultamos el activo
			params.myself.currStep.hide();
			
			// Activamos éste
			params.myself.currStep = params.myself.steps[params.idStep]; 
			params.myself.currStep.show();
			params.myself.currStep.showFotograma(0);
		}, {myself:this, idStep:idStep});
		this.eStepsIndex.appendChild(link);
		
		// Render
		this.currStep.render();
		// Por defecto, show
		this.currStep.show();
	}
	
	// Añadimos el fotograma a la lista y modificamos la lista de controles
	function addOneFotograma(step, svgContent, temblequeLevel, updateLastFotograma) {
		// Si hay tembleque, modificamos la transformación del grupo, añadiendo 
		// un pequeños translate
		if ( temblequeLevel!=0 ) {
			var offsetX = Math.floor(Math.random()*temblequeLevel);
			var offsetY = Math.floor(Math.random()*temblequeLevel);
			var eGroup = svgContent.getElementsByTagName("g")[0];
			var newTransform = YAHOO.util.Dom.getAttribute(eGroup, "transform") + 
			                   ' translate(' + offsetX +  ',' + offsetY + ')';
			YAHOO.util.Dom.setAttribute(eGroup, "transform", newTransform);
		}
		
		// Creamos un nuevo fotograma
		step.addFotograma(svgContent, updateLastFotograma);
	}
	
	// Si lo que guardamos es un path de una curva compuesta, guardaremos tantos
	// ficheros como tramos tenga la curva, para que el movimiento sea más suave
	// Lo que nos ha llegado es algo del tipo
	// <svg>
	//   <g>
	//     <path...../>
	//     <path...../>
	//     <path d="Mx,y Ca,b c,d e,f Ca,b c,d....." style="..."/>
	//   </g>
	// </svg>  
	// y lo que queremos es fragmentar el último <path> en 
	//   + <path d="Mx,y Ca,b c,d e,f" style="..."/>
	//   + <path d="Mx,y Ca,b c,d e,f Ca,b c,d" style="..."/>
	//   + ......
	// Esto en el caso de haber aplicado suavizado. Sin suavizado el 
	// path que encontramos es:
	// Mx,y La,b c,d e,f ....
	if ( isPathChanged && 
		 (actionOnSave==WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_NEWSTEP || actionOnSave==WidgetPaintMode.ADD_SEVERAL_FOTOGRAMAS_CURRSTEP) ) {
		// Obtenemos el path que nos interesa, que es último elemento de tipo 
		// <path> hijo del <g> que es hijo directo de <svg>
		var group = fotograma.getElementsByTagName("g")[0];
		var path = group.lastChild;
		
		// Obtenemos el path ... 
		var pathValue = YAHOO.util.Dom.getAttribute(path,"d").trim();
		
		// ... lo dividimos en los arcos. 
		// La divisón es diferente si hemos aplicado suavizado o no. 
		var suavizado = pathValue.indexOf('C')!=-1;
		// Buscamos el primer espacio. Lo que hay a la derecha es el "Mx,y ", que
		// es la parte de movimiento y la parte inicial de todos los patsh.
		// Lo que viene a la derecha son los arcos (C o L, dependiendo del suavizado)
		var posPrimerEspacio= pathValue.indexOf(' ');
		// La parte del movimiento
		var movPart=pathValue.substring(0,posPrimerEspacio);
		
		// Obtenemos la lista de arcos, haciendo un split a la parte derecha
		var listaArcos = pathValue.substring(posPrimerEspacio+1).split( suavizado ? "C" : " ");
		
		// Por último, creamos tantos fotogramas como arcos
		var newPathValue=movPart +  " ";
	    for(var ind=0; ind<listaArcos.length; ++ind) {
	    	// Arco contiene sólo números
	    	var arco = listaArcos[ind].trim();
	    	// El primer split, en el caso de 'C', da vacío
	    	if ( arco.length!=0 ) {
		    	newPathValue += (suavizado ? " C" : " ") + arco;
		    	// ... creamos el nuevo fotograma ...
		    	var newFotograma = fotograma.cloneNode(true);
		    	// ... le cambiamos el atributo 'd' al último path ...
				var lastPath = (newFotograma.getElementsByTagName("g")[0]).lastChild;
				YAHOO.util.Dom.setAttribute(lastPath,"d", newPathValue);
				// ¡y nos lo guardamos!
				//alert("Guardamos el fotograma : " + newFotograma);
				addOneFotograma(this.currStep, newFotograma, temblequeLevel, false);
				//this.fotogramas.push(newFotograma);
	    	}
		}
	} else {
		if ( actionOnSave==WidgetPaintMode.ADD_CURRENT_FOTOGRAMA ) {
			addOneFotograma(this.currStep, fotograma.cloneNode(true), temblequeLevel, true);
		} else {
			addOneFotograma(this.currStep, fotograma.cloneNode(true), temblequeLevel, false);
		}
	}
}

WidgetVisorSVG.prototype.play = function() {
	this.indCurrStep=null;
	this.playNextStep();
}

WidgetVisorSVG.prototype.playNextStep = function() {
	if ( this.indCurrStep==null || (this.indCurrStep+1)<this.steps.length ) {
		if ( this.indCurrStep==null ) {
			this.indCurrStep=0;
		} else {
			++this.indCurrStep;
		}
		if ( this.currStep!=null ) {
			this.currStep.hide();
		}
		this.currStep = this.steps[this.indCurrStep];
		this.currStep.show();
		
		var myself = this; // TODO - Closure
		this.currStep.play(function() {
			myself.playNextStep();
		});
	}
}

WidgetVisorSVG.prototype.limpia = function() {
	this.steps = new Array();
	this.indCurrStep = null;
	this.currStep = null;
	// Limpiamos
	if ( this.eVisor.firstChild ) this.eVisor.removeChild( this.eVisor.firstChild );
	while ( this.eStepsIndex.firstChild ) this.eStepsIndex.removeChild( this.eStepsIndex.firstChild );
	while ( this.eStepsContent.firstChild ) this.eStepsContent.removeChild( this.eStepsContent.firstChild );
}

WidgetVisorSVG.prototype.save2Disk = function() {
	var movieName = "movie";
	// Antes limpiamos
	var totOldMovie = 0;
	for(var indStep=0; ; ++indStep) {
		// Ya no hay steps
		if ( localStorage.getItem("movie" + "-" + indStep + "-0")==null ) {
			break;
		}
		for(var indFotograma=0; ; ++indFotograma) {
			var id = movieName + "-" + indStep + "-" + indFotograma;
			// Borramos 
			if ( localStorage.getItem(id)!=null ) {
				localStorage.removeItem(id);
				++totOldMovie;
			} else {
				break;
			}
		}
	}
	alert("Old movie deleted! (" + totOldMovie + " fotogramas)");

	for(var indStep=0; indStep<this.steps.length; ++indStep) {
		this.steps[indStep].save2Disk(movieName, indStep);
	}
	alert("Save done!");
}

WidgetVisorSVG.prototype.loadFromDisk = function() {
	this.limpia();

	var tmpNode = document.createElement("div");
	for(var indStep=0; ; ++indStep) {
		// Ya no hay steps
		if ( localStorage.getItem("movie" + "-" + indStep + "-0")==null ) {
			break;
		}
		// Creamos el step
		for(var indFotograma=0; ; ++indFotograma) {
			var id = "movie" + "-" + indStep + "-" + indFotograma;
			var content = localStorage.getItem(id);
			// No hay contenido
			if ( content==null ) {
				break;
			}
			
			// Hacemos algo con este content
			//alert("Creado " + id);
			tmpNode.innerHTML = content; 
			if ( indFotograma==0 ) {
				this.addFotograma(tmpNode.firstChild, false, 0, WidgetPaintMode.ADD_ONE_FOTOGRAMA_NEWSTEP);
			} else {
				this.addFotograma(tmpNode.firstChild, false, 0, WidgetPaintMode.ADD_ONE_FOTOGRAMA_CURRSTEP);
			}
		}
	}
}

/**
 * Play de la película sincronizada con los códigos de tiempo
 */
WidgetVisorSVG.prototype.playReal = function() {
	// ----------------------
	// "Montar" la película, sincronizando con 
	// las marcas de tiempo
	// ----------------------
	
	// Vamos a montar un array con los fotogramas que se mostrarán en la película, a una velocidad de 10fps.
	// Eso quiere decir que en algunos intervalos tendremos que duplicar y en otros eliminar fotograms
	var velocidad = 10;
	var allFotogramas = new Array();
	var tmpFotogramas = new Array();
	var lastId=0;
	var lastTimeCode=0;
	for(var indStep=0; indStep<this.steps.length; ++indStep) {
		var step = this.steps[indStep];
		for(var indFotograma=0; indFotograma<step.fotogramas.length; ++indFotograma) {
			var fotograma = step.fotogramas[indFotograma];
			tmpFotogramas.push(fotograma);

			// Encontramos un fotograma con un código de tiempo
			// Vamos a seleccionar los fotogramas 
			if ( fotograma.timeCode!=null ) {
				// Número de fotogramas existentes en este intervalo
				var totExistentes = tmpFotogramas.length;
				// Número de fotogramas que podemos mostrar
				var tot2Show = (fotograma.timeCode - lastTimeCode)*velocidad;
				
				console.log("Curr Time Code : " + fotograma.timeCode + " Last Time Code : " + lastTimeCode + " # fotogramas existentes : " + totExistentes + " # fotogramas necesarios : " + tot2Show);

				// Actualizamos el timecode
				lastTimeCode = fotograma.timeCode;
				
				// Bueno, lo ideal sería que totExistentes==tot2Show, pero eso 
				// no ocurrirá casi nunca :-(
				// Lo que toca ahora es añadir/quitar fotogramas (o sea, normalizar
				
				// -----------------------	
				// DEL fotogramas
				// -----------------------	
				if ( totExistentes > tot2Show ) {
					var tot2Delete = totExistentes - Math.floor(tot2Show);
					while ( tot2Delete!=0 ) {
						// TODO : Mejorar. Ahora lo hacemos random total
						// NUNCA eliminamos el primero y el último fotograma
						var ind = 1+Math.floor(Math.random()*(tmpFotogramas.length-2)); 
						tmpFotogramas.splice(ind, 1);
						--tot2Delete;
					}
					
					// Añadimos los que quedan al metraje original
					allFotogramas = allFotogramas.concat(tmpFotogramas);
				// -----------------------	
				// ADD fotogramas
				// -----------------------	
				} else if ( totExistentes < tot2Show ) {
					// Nos guardamos estos fotogramas en un array temporal
					var sequenceFotogramas = new Array();
					
					// Vamos a ver cuantas veces tiene que aparecer cada fotograma para que con los que tenemos
					// (totExistentes) mostremos los que necesitamos (tot2Show) 
					// Siempre obtenemos el entero menor. Eso quiere decir que tal vez añadamos DE MENOS, pero
					// nos aseguramos de que todos los fotogramas de la serie aparezcan al menos una vez
					var totCopiasCadaFotograma = Math.floor(tot2Show/totExistentes);
					
					// Ahora lo que hay que hacer es añadir cada fotograma "totCopiasCadaFotograma" veces cada uno
					var totFotogramasAdded = 0;
					var totFotogramas2Add = Math.floor(tot2Show);
					var indCopia = totCopiasCadaFotograma;
					console.log("[ADD] Tenemos que añadir " + totFotogramas2Add + " totCopiasCadaFotograma : " + totCopiasCadaFotograma + " (length : " + sequenceFotogramas.length +")");
					while ( tmpFotogramas.length!=0 && totFotogramasAdded<totFotogramas2Add) {
						// Añadimos un fotograma a la lista. Siempre cogeremos el primero, porque
						// cuando tengamos que pasar al siguiente, lo que haremos (en vez de usar un 
						// contador) lo sacaremos de la lista (v. más abajo)
						var fotograma = tmpFotogramas[0];
						sequenceFotogramas.push(fotograma);
						
						// ¡Ya hemos añadido un fotograma más a la lista global!...
						++totFotogramasAdded;						
						// ... ¡y una copia menos que añadir! 
						--indCopia;
						
						console.log("[ADD] Añadido el fotograma " + fotograma + " a la lista (totFotogramasAdded=" + totFotogramasAdded + ", indCopia : " + indCopia + ")");

						// Ya hemos añadidos todas las copias de este fotograma. 
						// Lo sacamos de la lista y volvemos a empezar con el siguientes
						if ( indCopia==0 ) {
							tmpFotogramas.splice(0,1);
							indCopia=totCopiasCadaFotograma;
						}
						
					}
					console.log("[ADD] Añadidos " + totFotogramasAdded + " en la primera pasada (length : " + sequenceFotogramas.length +")");
					// Ok, ahora me quedan unos cuantos por añadir.
					while ( totFotogramasAdded<totFotogramas2Add) {
						// TODO : Ahora lo hago de manera aleatoria
						var ind = Math.floor(Math.random()*sequenceFotogramas.length);
						sequenceFotogramas.splice(ind+1,0,sequenceFotogramas[ind]);
						
						// ¡Ya hemos añadido un fotograma más a la lista global!
						++totFotogramasAdded;
					}
					console.log("[ADD] Añadidos " + totFotogramasAdded + " (length : " + sequenceFotogramas.length +")");
					// ¡Algo a ido mal!
					if ( totFotogramasAdded!=totFotogramas2Add) {
						alert("ERROR: Se tenían que añadir " + totFotogramas2Add + " y sólo se han añadido " + totFotogramasAdded);
					}
					
					allFotogramas = allFotogramas.concat(sequenceFotogramas);					
				// El caso raro de que totExistentes==tot2Show. Los añadimos todos  	
				} else {
					allFotogramas = allFotogramas.concat(tmpFotogramas);	
				}
				
				// Ponemos "a cero"
				tmpFotogramas = new Array();
			} else {
				// Lo guardamos
				//tmpFotogramas.push(fotograma);
			}
		}
	}
	
	// ----------------------
	// Guardar la peli
	// TODO : ¿Se puede eviar closures, limpiar código?
	// ----------------------
	// Limpiamos los datos del servidor
    YAHOO.util.Connect.asyncRequest('POST', '../php/cleanData.php', {
		success: function(o) {
			// Guardamos en el servidor
			for(var ind=0; ind<allFotogramas.length; ++ind ) {
				var fotograma = allFotogramas[ind];
				
				console.log("Enviado fotograma " + ind + " de " + allFotogramas.length + "..."); 
				
			    var svg_xml = fotograma.getContentAsString();			
			    YAHOO.util.Connect.asyncRequest('POST', '../php/saveSvg.php', 
			    {
				  success: function(o) {
				  	var data = YAHOO.lang.JSON.parse(o.responseText);
				  	console.log("Grabado ok. id : " + data.startInd); 
			    	//Logger.getInstance().log("FIN save [" + data.startInd + "]. endInd : " + data.endInd); 
			      },
			      failure: function(o) { alert("Error : " + o.responseText); }
			    }, "image="               + svg_xml             + 
			       "&ind="                + Util.zeroPad(ind,0) + 
			       "&numFiles2Generate=1" +  
			       "&isPathChanged=0"     + 
			       "&temblequeLevel=0"
			    );
			}
		},
  		failure: function(o) { alert("Error : " + o.responseText); }
    });
	
	// ----------------------
	// Visualizar la peli
	// TODO : ¿Se puede eviar closures, limpiar código?
	// ----------------------
	var indFotograma = 0;
	var timeout = Math.floor(1000/velocidad); 
	alert("Dale al Play! Ahora tenemos " + allFotogramas.length + " fotogramas. timeout: " + timeout);
	var startTime = (new Date()).getTime();
	var lastTime = startTime;
	var tInterval = setInterval(function() {
		var now = (new Date()).getTime();
		// Ya se ha acabado la película
		if ( !allFotogramas[0] ) {
			clearInterval(tInterval);
		} else {
			console.log(indFotograma + " [" + (now-startTime) +"#" + (now-lastTime) + "] Mostramos el fotograma " + allFotogramas[0].step.id + "#" + allFotogramas[0].id);			
			allFotogramas[0].play();
			allFotogramas.splice(0,1);
			++indFotograma;
			lastTime = now;
		}
	}, timeout);	
}