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

component:
	cd adaptors/angular && component build
	cd adaptors/angularplus && component build
	cd adaptors/angularmin && component build
	cd adaptors/angularminplus && component build

installcomponents:
	cd adaptors/angular && component install
	cd adaptors/angularplus && component install
	cd adaptors/angularmin && component install
	cd adaptors/angularminplus && component install

cleancomponents:
	cd adaptors/angular && rm -rf build
	cd adaptors/angular && rm -rf components
	cd adaptors/angularplus && rm -rf build
	cd adaptors/angularplus && rm -rf components
	cd adaptors/angularmin && rm -rf build
	cd adaptors/angularmin && rm -rf components
	cd adaptors/angularminplus && rm -rf build
	cd adaptors/angularminplus && rm -rf components

uglify: component browserify
	uglifyjs build/digger.browserify.js > build/digger.uglify.js

sockets: component browserify uglify
	cat assets/sockjs-client.min.js > build/digger.js
	cat assets/sockjs-client.min.js > build/digger.min.js
	echo "\n\n//^^^ Sockets - Digger\n\n" >> build/digger.js
	echo "\n\n//^^^ Sockets - Digger\n\n" >> build/digger.min.js
	cat build/digger.browserify.js >> build/digger.js
	cat build/digger.uglify.js >> build/digger.min.js

	# angular
	echo "" > build/digger.angular.js
	echo "" > build/digger.angularplus.js
	echo "" > build/digger.angularmin.js
	echo "" > build/digger.angularminplus.js

	echo "\n\n//^^^ Angular - Digger\n\n(function(){\n\n" >> build/digger.angular.js
	echo "\n\n//^^^ Angular - Digger\n\n(function(){\n\n" >> build/digger.angularplus.js
	echo "\n\n//^^^ Angular - Digger\n\n(function(){\n\n" >> build/digger.angularmin.js	
	echo "\n\n//^^^ Angular - Digger\n\n(function(){\n\n" >> build/digger.angularminplus.js

	cat adaptors/angular/build/build.js >> build/digger.angular.js
	cat adaptors/angularplus/build/build.js >> build/digger.angularplus.js
	cat adaptors/angularmin/build/build.js >> build/digger.angularmin.js
	cat adaptors/angularminplus/build/build.js >> build/digger.angularminplus.js

	echo "\nrequire('diggerserve-angular');\n\n})()" >> build/digger.angular.js
	echo "\nrequire('diggerserve-angularplus');\n\n})()" >> build/digger.angularplus.js
	echo "\nrequire('diggerserve-angularmin');\n\n})()" >> build/digger.angularmin.js
	echo "\nrequire('diggerserve-angularminplus');\n\n})()" >> build/digger.angularminplus.js

	uglifyjs build/digger.angular.js > build/digger.angular.min.js
	uglifyjs build/digger.angularplus.js > build/digger.angularplus.min.js
	uglifyjs build/digger.angularmin.js > build/digger.angularmin.min.js
	uglifyjs build/digger.angularminplus.js > build/digger.angularminplus.min.js

tidy:
	rm build/digger.browserify.js
	rm build/digger.uglify.js

build: sockets tidy

install:
	npm install

.PHONY: test