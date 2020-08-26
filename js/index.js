
var root = document.documentElement;
var colorPush; // change name to color_push
var colorPull;
var keyboardLayout;
var accbtns_pull_hide_all = false; // bool
var accbtns_push_hide_all = false; // bool
var accbtns_visible = new Set(); 

window.addEventListener("load", startup, false);
function startup() {

  // push button
  var pushBtn = document.querySelector("#pushbtn");
  pushBtn.onclick = function() {
    this.classList.toggle("hidden");
    window.accbtns_push_hide_all = !window.accbtns_push_hide_all;
    refresh_visible_accbtns();
  };

  // pull button
  var pullBtn = document.querySelector("#pullbtn");
  pullBtn.onclick = function() {
      this.classList.toggle("hidden");
      window.accbtns_pull_hide_all = !window.accbtns_pull_hide_all;
      refresh_visible_accbtns();
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
  var rect_list = svgObject.querySelectorAll('rect[id^=btn]');
  rect_list.forEach(rect => {
      rect.addEventListener('click', toggleNote);
     // rect.addEventListener('touch', toggleNote); // Todo: müsste getestet werden
  });
  rect_list[2].dispatchEvent(new Event('click'));
  rect_list[4].dispatchEvent(new Event('click'));
  // refresh_visible_accbtns();
}

//######################
//    svg (staff)
//######################

function toggleNote() {
    if(this.getAttributeNS(null, 'style').includes('opacity:0.3')){
        var hide_note = true;
        this.setAttributeNS(null, 'style', 'opacity:0%;cursor:pointer;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.79621941;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1');
    }
    else if(this.getAttributeNS(null, 'style').includes('opacity:0%')){
        var hide_note = false;
        this.setAttributeNS(null, 'style', 'opacity:0.3;cursor:pointer;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.79621941;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1');
    }
    var note_with_oct = this.getAttributeNS(null, 'id').slice(4); // note with octave specification in scientific pitch notation, i.e. f4_flat
    var note_no_oct = note_with_oct.replace(/[0-9]/g, ''); // note without octave specification, i.e. f_flat
    var button_ids = Object.keys(window.keyboardLayout).filter(key => window.keyboardLayout[key] === note_no_oct);
    if(hide_note){
        for (let i = 0; i < button_ids.length; i++) {
            window.accbtns_visible.delete(button_ids[i]);
        }
    }
    else{
        for (let i = 0; i < button_ids.length; i++) {
            window.accbtns_visible.add(button_ids[i]);
        }
    }
    refresh_visible_accbtns();
}

function refresh_visible_accbtns() {
    var accbtns_push = document.querySelector('#keyboard').querySelectorAll('div.push');
    for(var i = 0; i < accbtns_push.length; i++){
        if(window.accbtns_push_hide_all){
            accbtns_push[i].classList.add("hidden");
        }
        else if(window.accbtns_visible.has(accbtns_push[i].id)){
            accbtns_push[i].classList.remove("hidden");
        }
        else{
            accbtns_push[i].classList.add("hidden");
        }
    }
    var accbtns_pull = document.querySelector('#keyboard').querySelectorAll('div.pull');
    for(var i = 0; i < accbtns_pull.length; i++){
        if(window.accbtns_pull_hide_all){
            accbtns_pull[i].classList.add("hidden");
        }
        else if(window.accbtns_visible.has(accbtns_pull[i].id)){
            accbtns_pull[i].classList.remove("hidden");
        }
        else{
            accbtns_pull[i].classList.add("hidden");
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