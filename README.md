digger-serve
============

A HTTP and websocket server for a digger application.

## installation

	$ npm install digger-serve --save

## usage

The role of this module is to bootstrap a web server that will mount several things:

 * a supplychain back to a digger reception server
 * an authentication app that sends login requests back to a digger warehouse
 * a session store plugged into Redis
 * a websocket server (via socket.io)

```js
var Serve = require('digger-serve');

var app = Serve({

})

```