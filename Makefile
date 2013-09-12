TESTS = test/*.js
REPORTER = spec
#REPORTER = dot

check: test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--timeout 300 \
		--require should \
		--growl \
		$(TESTS)

browserify:
	browserify -r digger-sockets > build/digger.browserify.js

uglify: browserify
	uglifyjs build/digger.browserify.js > build/digger.uglify.js

sockets: browserify uglify
	cat assets/sockjs-client.min.js > build/digger.js
	cat assets/sockjs-client.min.js > build/digger.min.js
	echo "\n\n//^^^ Sockets - Digger\n\n" >> build/digger.js
	echo "\n\n//^^^ Sockets - Digger\n\n" >> build/digger.min.js
	cat build/digger.browserify.js >> build/digger.js
	cat build/digger.uglify.js >> build/digger.min.js

tidy:
	rm build/digger.browserify.js
	rm build/digger.uglify.js

build: sockets tidy

install:
	npm install

.PHONY: test