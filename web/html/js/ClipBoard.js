function ClipBoard() {
	this.content = null;
}

ClipBoard.instance = null;
ClipBoard.getInstance = function() {
	if ( ClipBoard.instance==null ) {
		ClipBoard.instance = new ClipBoard(); 
	}
	
	return ClipBoard.instance;
}

// --------------------------------------------------------------------- Setters
// ------------------------------------------------------------ Métodos Públicos
ClipBoard.prototype.copy = function(content) {
	this.content = content;
}

ClipBoard.prototype.get = function() {
	return this.content;
}