/**
 * Logger with several levels.
 * @returns
 */
function Logger() {
  this.$logPanel = null;
	this.enabled = true;
	this.level = null;
	this.hideIfNoMsg = true;
}

Logger.instance = null;
Logger.ERROR    = 1;
Logger.WARN     = 2;
Logger.INFO     = 3;
Logger.DEBUG    = 4;
Logger.LOWDEBUG = 5;

Logger.getInstance = function() {
	if ( Logger.instance==null ) {
		Logger.instance = new Logger(); 
		// By default, only error
		Logger.instance.setLevel(Logger.ERROR);
	}
	
	return Logger.instance;
}

// --------------------------------------------------------------------- Setters
Logger.prototype.setLogPanel = function (logPanel) {
  // When using YUI, logPanel is a string with the ID
  if ( typeof logPanel == 'string' ) {
    this.$logPanel = $('#' + logPanel);
  } else {
    this.$logPanel = logPanel;
  }
  // Hide by default
  if ( this.hideIfNoMsg ) {
    this.$logPanel.hide();
  }
  
  return this;
}

Logger.prototype.setEnabled = function (enabled) {
  this.enabled = enabled;
  
  return this;
}

Logger.prototype.setLevel = function (level) {
	this.level = level;

	return this;
}

// ------------------------------------------------------------ Métodos Públicos
Logger.prototype.info = function(msg) {
  return this.logMessage(Logger.INFO, msg);
}

Logger.prototype.debug= function(msg) {
  return this.logMessage(Logger.DEBUG, msg);
}
Logger.prototype.lowDebug = function(msg) {
  return this.logMessage(Logger.LOWDEBUG, msg);
}

// Protected
Logger.prototype.logMessage = function(msgLevel, msg) {
  if ( !this.enabled  || msgLevel > this.level) return;
  
  
  if ( this.$logPanel ) {
    this.$logPanel.show();
    this.$logPanel.append('<span>' + msg + '</span>');
  } else {
    console.log(msg);
  }
  
  return this;
}