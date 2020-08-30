// Lokale Testumgebung erstellen: python3 -m http.server
// Open in Firefox: http://localhost:8000/Programme/cordova/workshop/www/
// Clean svg with https://jakearchibald.github.io/svgomg/

var root = document.documentElement;
var svgObject;
var svgSingle;
var colorPush; // change name to color_push
var colorPull;
var keyboardLayout = new Array();
var accbtns_visible = new Set();
var notes_visible = new Set(); 
var accbtns_pull_hide_all = false; // bool
var accbtns_push_hide_all = false; // bool
var option_no_oct; // bool, if true: no differentiation between octaves

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

  // choose color for pull buttons
  colorPull = document.querySelector("#color_pull");
  colorPull.addEventListener("input", function(){
    root.style.setProperty('--color-pull',colorPull.value);
  }, false);
  colorPull.select();

  // load KeyboardLayout
  var note_names = window[document.querySelector('#language').value];
  assignKeyboardLayout(GC_3_heim, note_names);

  // accordeon buttons
  var accbtns = document.querySelector('#keyboard').querySelectorAll('div.push, div.pull');
  accbtns.forEach(accbtn => {
      accbtn.addEventListener('click', toggleNote);
      // accbtn.addEventListener('touch', toggleNote);
  })

  // load svgs
  svgSingle = document.getElementById('svg_single').contentDocument; // Todo: Namen ändern
  svgObject = document.getElementById('svg_object').contentDocument; // Todo: Namen ändern
  var rect_list = svgObject.querySelectorAll('rect');
  rect_list.forEach(rect => {
      rect.addEventListener('click', toggleNote);
     // rect.addEventListener('touch', toggleNote); // Todo: müsste getestet werden
  });
  rect_list[2].dispatchEvent(new Event('click'));
  rect_list[6].dispatchEvent(new Event('click'));
  rect_list[9].dispatchEvent(new Event('click'));
  // refresh_visible_accbtns();
}

//######################
//    svg (staff)
//######################

function setStyle(object, property, value) {
    var oldStyle = object.getAttributeNS(null, 'style');
    var regexp = new RegExp("(^|;)"+property+"\:([^;]+)($|;)(.*)$", "g");
    var newStyle;
    if(oldStyle.match(regexp) != null){
        newStyle = oldStyle.replace(regexp, "$1"+property+"\:"+value+"$3$4");
    }
    else{
        newStyle = oldStyle+";"+property+":"+value;
    }
    object.setAttributeNS(null, 'style', newStyle);
}

function toggleNote() {
    var hide_note; // bool
    var note_with_oct; // note with octave specification in scientific pitch notation, i.e. f4_flat
    var note_no_oct; // note without octave specification, i.e. f_flat

    if(this.tagName.toLowerCase() == "rect"){
        var rect = this;
        note_with_oct = rect.getAttributeNS(null, 'id');
        if(rect.getAttributeNS(null, 'style').includes('opacity:0%')){
            hide_note = false;
        }  
        if(rect.getAttributeNS(null, 'style').includes('opacity:0.3')){
            hide_note = true;
        }
    }
    else if(this.tagName.toLowerCase() == "div"){
        note_with_oct = window.keyboardLayout[this.id];
        rect = svgObject.getElementById(note_with_oct);
        if(this.classList.contains("hidden")){
            hide_note = false;
        }
        else{
            hide_note = true;
        }
    }
    //note_no_oct = note_with_oct.replace(/[0-9]/g, '');
    var button_ids = Object.keys(window.keyboardLayout).filter(key => window.keyboardLayout[key] === note_with_oct);
    if(hide_note){
        window.notes_visible.delete(note_with_oct);
        if(rect != null){
            setStyle(rect, "opacity", "0%");
        }
        for (let i = 0; i < button_ids.length; i++) {
            window.accbtns_visible.delete(button_ids[i]);
        }
    }
    else{
        window.notes_visible.add(note_with_oct);
        if(rect != null){
            setStyle(rect, "opacity", "0.3");
        }
        for (let i = 0; i < button_ids.length; i++) {
            window.accbtns_visible.add(button_ids[i]);
        }
    }
    refresh_visible_accbtns();
}

function refresh_visible_accbtns() {

    // refresh notes and accidentals in svgSingle
    var single_notes = svgSingle.querySelectorAll('#notes_between_lines > path, #notes_on_lines > path');
    var accidentals = svgSingle.querySelectorAll("text[id$='flat'], text[id$='sharp']");
    single_notes.forEach(note => {
        setStyle(note, "opacity", "0%");
    })
    accidentals.forEach(accidental => {
        setStyle(accidental, "opacity", "0%");
    })
    notes_visible.forEach(note => {
        var note = svgSingle.querySelector('path[id^='.concat(note.substr(0,2)));
        setStyle(note, "opacity", "1");
        if(note.length > 2){ // note with accidentals
            var accidental = svgSingle.querySelector('text[id='.concat(note));
            setStyle(accidental, "opacity", "1");
        }
    })

    // refresh push buttons
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

    // refresh pull buttons
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
                document.getElementById(x).innerHTML = note_names[layout[x].replace(/[0-9]/g, '')];
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