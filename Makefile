test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter spec \
		--timeout 300 \
		--require should \
		--growl \
		test/test.js

browserify:
	browserify -r digger-sockets > build/digger.js

uglify: browserify
	uglifyjs build/digger.js > build/digger.min.js

build: uglify

install:
	npm install

.PHONY: test