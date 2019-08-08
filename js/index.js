
let root = document.documentElement;
var colorPush;
var colorPull;

window.addEventListener("load", startup, false);
function startup() {
  // Choose color for push buttons
  colorPush = document.querySelector("#color_push");
  colorPush.addEventListener("input", updateColorPush, false);
  colorPush.select();

  // Choose color for pull buttons
  colorPull = document.querySelector("#color_pull");
  colorPull.addEventListener("input", function(){
    root.style.setProperty('--color-pull',colorPull.value);
  }, false);
  colorPull.select();
}

function updateColorPush(event) {
    // Farbvariable schreiben
    root.style.setProperty('--color-push',colorPush.value);
}

function assignKeyboardLayout() {
    document.getElementById("1'_").innerHTML = "a";
}