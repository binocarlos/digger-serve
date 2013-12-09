/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

function get_error_config(req, res){

	var pagetitle = 'Error';
	var pagetext = 'There has been an unknown error.';
	var pagedata = '';
	if(res.statusCode===404){
		if(req.headers['x-digger-app']){
			pagetitle = 'Page not found';
			pagetext = 'This website does not have a page at that pathname';
			pagedata = req.url;
		}
		else{
			pagetitle = 'Website not found';
			pagetext = 'digger does not have a website at that URL';
			pagedata = req.url;
		}
	}
	else if(res.statusCode===500){
		pagetext = 'There has been an application error';
		pagedata = req.body;
	}

	return {
		statusCode:res.statusCode,
		pagetitle:pagetitle,
		pagetext:pagetext,
		pagedata:pagedata
	}
}

module.exports = function(){

	var fs = require('fs');
	var template = fs.readFile(path.normalize(__dirname + '/../assets/error.ejs'))
	/*
	
		the 404 handler
		
	*/
	return function(req, res, next){
		
		var config = get_error_config(req, res);
		var output = ejs.render(template, config);
		if(!res.statusCode){
			res.statusCode = 404;
		}
		res.send(output);
	}
}