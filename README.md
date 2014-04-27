# delegate.js [![Build Status](https://travis-ci.org/1000ch/delegate.svg?branch=master)](https://travis-ci.org/1000ch/delegate)

## About

Delegation.

## Usage

```js
var element = document.getElementById("hoge");

var delegate = new Delegate(element);

delegate.on("click", "span", function(e) {
  console.log("span of #hoge is clicked.");
});
```

## License

Copyright [1000ch.net](http://1000ch.net/)  
Released under the MIT license  
