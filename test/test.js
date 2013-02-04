var btn = document.getElementById("buttonId");
var array = [btn];
var mixedArray = ["1", btn, 2];

test("argument test 1", function() {
	equal(new Handle(btn).length, 1, "single element is accepted");
});

test("argument test 2", function() {
	equal(new Handle(array).length, 1, "array is accepted");
});

test("argument test 3", function() {
	equal(new Handle(mixedArray).length, 1, "mixed array is accepted");
});