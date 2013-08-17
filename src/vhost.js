var Vhost = function() {
	this.hostDictionary = {};
};

Vhost.prototype.vhost = function() {
	var hostDictionary = this.hostDictionary;

	return function vhost(req, res, next){
		if (!req.headers.host) return next();
		var host = req.headers.host.split(':')[0];
		var server = hostDictionary[host];
		if (!server){
			var parts = host.split('.');
			parts[0] = '*';
			server = hostDictionary[parts.join('.')];
			if(!server){
				return next();	
			}
		} 
		if ('function' == typeof server) return server(req, res, next);
		server.emit('request', req, res);
	};

};

Vhost.prototype.register = function(host, app) {
	this.hostDictionary[host] = app;
};

module.exports = Vhost;