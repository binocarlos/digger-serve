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
var Stack = require('../src');
var phantom = require('phantom');

describe('digger server', function(){
	var browser, server, website;

  before(function (done) {
    phantom.create(function (ph) {
      ph.createPage(function (tab) {

        browser = tab;
        
      	var port = process.env['DIGGER_APP_PORT'] || 8791;
				var DiggerServe = require('digger-serve');

				server = new DiggerServe();

				website = server.website({
					document_root:__dirname,
					domains:'*',
					session:true,
					parser:true,
					debug:true,
					cors:true
				})

        website.app.get('/ping/:name', function(req, res){
          res.json({
            pong:20
          })
        })

        setTimeout(function(){
          server.listen(port, function(){
            console.log('test server listening');
            done();
          })  
        })

				
      })
    })
  })

  it('should render a webpage', function (done) {

    this.timeout(3000);

    browser.open('http://localhost:8791/hello.html', function (status) {
      setTimeout(function () {
        browser.evaluate(function inBrowser() {
          // this will be executed on a client-side
          return {
            message:window.$diggerserve,
            result:window.$diggerresult
          }
        }, function fromBrowser(data) {
          data.message.should.equal('yo');
          data.result.pong.should.equal(20);
          done();
        });
      }, 1000)

    });
  });

})


