# delegate.js [![Build Status](https://travis-ci.org/1000ch/delegate.png?branch=master)](https://travis-ci.org/1000ch/delegate)

## About

Delegate event.

## Usage

```js
var element = document.getElementById("hoge");

element.bind("click", function(e) {
    alert("element is clicked.");
});

element.delegate("click", "span", function(e) {
    console.log("span of #hoge is clicked.");
});

var elements = document.getElementsByTagName("div");

elements.bind("touchstart", function(e) {
    console.log("div is touchstarted.");
});
```

## License

Copyright [1000ch.net](http://1000ch.net/)  
Released under the MIT license  