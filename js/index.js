
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

  // load KeyboardLayout
}

function updateColorPush(event) {
    // Farbvariable schreiben
    root.style.setProperty('--color-push',colorPush.value);
}

function assignKeyboardLayout() {
    myObj = { "2":"c", "2'":"d", "2'_":"e", "1_":null, "3'":"g"};
    layout = GC_3_heim;
    for (var x in layout) {
        if (layout.hasOwnProperty(x)){
            try{
                document.getElementById(x).innerHTML = layout[x];
            }
            catch (e) {continue}
        }
    } 
}