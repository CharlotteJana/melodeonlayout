
var root = document.documentElement;
var colorPush;
var colorPull;
var keyboardLayout;

window.addEventListener("load", startup, false);
function startup() {

  // push button
  var pushBtn = document.querySelector("#pushbtn");
  pushBtn.onclick = function() {
    pushdivs = document.querySelectorAll(".push");
    for (var i = 0; i < pushdivs.length; i++) {
        pushdivs[i].classList.toggle("hidden");
    }
  };

  // pull button
  var pullBtn = document.querySelector("#pullbtn");
  pullBtn.onclick = function() {
      pulldivs = document.querySelectorAll(".pull");
      for (var i = 0; i < pulldivs.length; i++) {
          pulldivs[i].classList.toggle("hidden");
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
  var note_names = window[document.querySelector('#language').value];
  assignKeyboardLayout(GC_3_heim, note_names);

  // load svg
  var svgObject = document.getElementById('svg_object').contentDocument;
  var svg = svgObject.getElementById('staff_short');
  var btn_list = svgObject.querySelectorAll('rect[id^=btn]');
  btn_list.forEach(btn => {
      btn.addEventListener('click', toggleNote);
     // btn.addEventListener('touch', toggleNote); // Todo: müsste getestet werden
  });

  //console.log(btn_list);
}

//######################
//    svg (staff)
//######################

function toggleNote() {
    var hide_notes_pull = document.querySelector("#pullbtn").classList.contains("hidden");
    var hide_notes_push = document.querySelector("#pushbtn").classList.contains("hidden");
    if(this.getAttributeNS(null, 'style').includes('opacity:0.3')){
        var hide_note = true;
        this.setAttributeNS(null, 'style', 'opacity:0%;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.79621941;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1');
    }
    else if(this.getAttributeNS(null, 'style').includes('opacity:0%')){
        var hide_note = false;
        this.setAttributeNS(null, 'style', 'opacity:0.3;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.79621941;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1');
    }
    var note_with_oct = this.getAttributeNS(null, 'id').slice(4); // note with octave specification in scientific pitch notation, i.e. f4_flat
    var note_no_oct = note_with_oct.replace(/[0-9]/g, ''); // note without octave specification, i.e. f_flat
    var button_ids = Object.keys(window.keyboardLayout).filter(key => window.keyboardLayout[key] === note_no_oct);
    for (let i = 0; i < button_ids.length; i++) {
        var a = document.getElementById(button_ids[i]);
        console.log(hide_note);
        if(hide_note){
            a.classList.add("hidden")
        }
        else{
            if(!hide_notes_pull & button_ids[i].includes("_"))
                a.classList.remove("hidden");
            if(!hide_notes_push & !button_ids[i].includes("_"))
                a.classList.remove("hidden");
        }
    }
}

//######################
//     settings
//######################

function assignKeyboardLayout(layout, note_names) {
    keyboardLayout = layout;
    for (var x in layout) {
        if (layout.hasOwnProperty(x)){
            try{
                document.getElementById(x).innerHTML = note_names[layout[x]];
            }
            catch (e) {continue}
        }
    } 
}

var direction = 2;
function rotateKeyboard() {
    var kb = document.querySelector("#keyboard");
    var rows = document.querySelectorAll(".row");

    switch (direction) {
        case 0:
            kb.style.flexDirection = "row";  
            for (var i = 0; i < rows.length; i++) {
                rows[i].style.flexDirection = "column";
            } 
            break;
        case 1: // default variant
            kb.style.flexDirection = "column";
            for (var i = 0; i < rows.length; i++) {
                rows[i].style.flexDirection = "row";
            }
            break;
        case 2:
            kb.style.flexDirection = "row-reverse";
            for (var i = 0; i < rows.length; i++) {
                rows[i].style.flexDirection = "column";
            }
            break;
        case 3:
            kb.style.flexDirection = "column-reverse";
            for (var i = 0; i < rows.length; i++) {
                rows[i].style.flexDirection = "row";
            }
            break;
    }

    direction = (direction + 1) % 4; // possible values: 0, 1, 2, 3
}

// css display: https://codeburst.io/common-problems-in-positioning-elements-in-css-best-practices-b03ac54dbdcb

function adjustKeys(direction) {
    var buttons = document.querySelectorAll(".button");

    switch (direction) {
        case 1: // default variant 
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].style.flexDirection = "column";
                push = buttons[i].querySelector(".push");
                if(push !== null){
                    push.classList.remove("top", "bottom", "left", "right");
                    push.classList.add("top");
                }
                pull = buttons[i].querySelector(".pull");
                if(pull !== null){
                    pull.classList.remove("top", "bottom", "left", "right");
                    pull.classList.add("bottom");
                }
            } 
            break;
        case 2: 
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].style.flexDirection = "row-reverse";
                push = buttons[i].querySelector(".push");
                if(push !== null){
                    push.classList.remove("top", "bottom", "left", "right");
                    push.classList.add("right");
                }
                pull = buttons[i].querySelector(".pull");
                if(pull !== null){
                    pull.classList.remove("top", "bottom", "left", "right");
                    pull.classList.add("left");
                }
            }
            break;
        case 3:
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].style.flexDirection = "column-reverse";
                push = buttons[i].querySelector(".push");
                if(push !== null){
                    push.classList.remove("top", "bottom", "left", "right");
                    push.classList.add("bottom");
                }
                pull = buttons[i].querySelector(".pull");
                if(pull !== null){
                    pull.classList.remove("top", "bottom", "left", "right");
                    pull.classList.add("top");
                }
            }
            break;
        case 4:
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].style.flexDirection = "row";
                push = buttons[i].querySelector(".push");
                if(push !== null){
                    push.classList.remove("top", "bottom", "left", "right");
                    push.classList.add("left");
                }
                pull = buttons[i].querySelector(".pull");
                if(pull !== null){
                    pull.classList.remove("top", "bottom", "left", "right");
                    pull.classList.add("right");
                }
            }
            break;
    }
}

function toggleSettings() {
    var x = document.getElementById("settings");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  } 

function showRows(number) {
    var row3buttons = document.getElementById("row 3").children
    switch(number){
        case "2": 
            for(i = 0; i < row3buttons.length; i++){
                row3buttons[i].style.visibility = "collapse";
            }
            break;
        case "2.5":
            for(i = 0; i < row3buttons.length; i++){
                var index = parseInt(row3buttons[i].id.replace("3.", ""));
                if(index < 3 | index > 8)
                    row3buttons[i].style.visibility = "hidden";
                else
                row3buttons[i].style.visibility = "visible";
            }
            break;
        case "3": 
            for(i = 0; i < row3buttons.length; i++){
                row3buttons[i].style.visibility = "visible";
            }
            break;
    }
    for (i = 0; i < row3buttons.length; i++) {

        console.log('row3buttons[i]: ', );
        
    }

}