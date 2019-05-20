# jaeger-tracer-restify
This is a module for jaeger instrumentation to allow your node backend with just four lines of code and the require statements included to be able to send the incoming and outgoing requests and responses data to the jaeger backend.

This is a fork of `jaeger-tracer`.

[![npm version](https://badge.fury.io/js/jaeger-tracer-restify.svg)](https://badge.fury.io/js/jaeger-tracer-restify)
[![Dependency Status](https://david-dm.org/johnshew/jaeger-tracer-restify.svg)](https://david-dm.org/johnshew/jaeger-tracer-restify.svg)

## Table of contents


## Installation
` npm install jaeger-tracer-restify`

## Usage
All you need to do is include the following middleware in your app with the following way
```javascript
let { jaegarTracerMiddleware } = require('jaeger-tracer-restify');
let http = require('http');
let https = require('https');


// some middlewares
// body parser middleware

// jaeger tracer middleware here
app.use(jaegarTracerMiddleware({ http, https }, 'your-app', {
	reporter: {
	    // host name of your 
		agentHost:  'localhost'
	}
}
));
```
This is the simplest usage of package you can customize the collector host and many other data through the configs which we will be describing later.

----------------
## How the package works
Inside the package we just log the incoming requests and their responses from this backend 
the middleware takes the http or https to be able to monkey patch the http.request or https.request functions and put the tracer headers in any outgoing requests to third party backends. Also the it extracts the headers from any incoming requests to relate spans with the parent child relations. basically everything from extracting and injecting the headers happens inside. 

### Important notes
The package inside use the [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage) so , be careful to lose the context
also there is a function which gets you the context to be able to pass it over if its lost in some place in your code.

## API Reference
The package exports the following functions to give you full control and flexibility below we will list the function telling what is the usage of each one and what do they do.

#### jaegarTracerMiddleware
#### initTracer
#### makeSpan
#### makeSpanWithParent
#### spanMaker
#### getContext
#### unirestWrapper
#### requestWrapper
#### getInjectionHeaders
