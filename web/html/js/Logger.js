// TODO : Revisar....
function Logger() {
	this.logPanel = null;
}

Logger.instance = null;
Logger.eNewLine = document.createElement("br");
Logger.getInstance = function() {
	if ( Logger.instance==null ) {
		Logger.instance = new Logger(); 
	}
	
	return Logger.instance;
}

// --------------------------------------------------------------------- Setters
Logger.prototype.setLogPanel = function (logPanel) {
	this.logPanel= YAHOO.util.Dom.get(logPanel);
}

// ------------------------------------------------------------ Métodos Públicos
Logger.prototype.log = function(msg, panel) {
	var logPanel = YAHOO.util.Dom.get(panel);
	if ( !logPanel ) {
		logPanel = this.logPanel; 
	}
    if ( logPanel ) {
    	var span = document.createElement("div");
    	span.innerHTML = msg;
    	logPanel.appendChild(span);
    	//logPanel.appendChild(Logger.eNewLine);
    }
}