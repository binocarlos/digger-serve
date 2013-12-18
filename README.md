digger-serve
============

An app server for digger websites.

```js
var port = process.env['DIGGER_APP_PORT'] || 8791;
var DiggerServe = require('digger-serve');

var server = new DiggerServe();

var website = server.website({
	document_root:__dirname,
	domains:'*',
	session:true,
	parser:true,
	debug:true,
	cors:true
})

// website is an express app
website.get('/ping/:name', function(req, res){
  res.json({
    pong:20
  })
})

// server is a wrapper for a http.createServer
server.listen(port, function(){
  console.log('test server listening');
  done();
})  
```