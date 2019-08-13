
var root = document.documentElement;
var colorPush;
var colorPull;

window.addEventListener("load", startup, false);
function startup() {

  // push button
  var pushBtn = document.querySelector("#push");
  pushBtn.onclick = function() {
    topdivs = document.querySelectorAll(".top");
    for (var i = 0; i < topdivs.length; i++) {
        topdivs[i].classList.toggle("hidden");
    }
  };

  // pull button
  var pullBtn = document.querySelector("#pull");
  pullBtn.onclick = function() {
      bottomdivs = document.querySelectorAll(".bottom");
      for (var i = 0; i < bottomdivs.length; i++) {
          bottomdivs[i].classList.toggle("hidden");
      }
  }

  // Choose color for push buttons
  colorPush = document.querySelector("#color_push");
  colorPush.addEventListener("input", function(){
    root.style.setProperty('--color-push', colorPush.value);
  }, false);
  colorPush.select();

  // Choose color for pull buttons
  colorPull = document.querySelector("#color_pull");
  colorPull.addEventListener("input", function(){
    root.style.setProperty('--color-pull',colorPull.value);
  }, false);
  colorPull.select();

  // load KeyboardLayout
  assignKeyboardLayout(GC_3_heim);
}

//######################
//     settings
//######################

function assignKeyboardLayout(layout) {
    for (var x in layout) {
        if (layout.hasOwnProperty(x)){
            try{
                document.getElementById(x).innerHTML = layout[x];
            }
            catch (e) {continue}
        }
    } 
}

var direction = 2;
function rotateKeyboard() {
    var kb = document.querySelector("#keyboard");
    var btns = document.querySelectorAll(".button");

    switch (direction) {
        case 0:
            kb.style.flexDirection = "row";  
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = "block";
            } 
            break;
        case 1: // default variant
            kb.style.flexDirection = "column";
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = "inline-block";
            }
            break;
        case 2:
            kb.style.flexDirection = "row-reverse";
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = "block";
            }
            break;
        case 3:
            kb.style.flexDirection = "column-reverse";
            for (var i = 0; i < btns.length; i++) {
                btns[i].style.display = "inline-block";
            }
            break;
    }

    direction = (direction + 1) % 4; // possible values: 0, 1, 2, 3
}

// css display: https://codeburst.io/common-problems-in-positioning-elements-in-css-best-practices-b03ac54dbdcb