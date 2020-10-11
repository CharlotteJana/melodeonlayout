// Create local server: python3 -m http.server
// Open in Firefox: http://localhost:8000/Programme/cordova/workshop/www/
// Clean svg with https://jakearchibald.github.io/svgomg/

var root = document.documentElement;
var svgOctaveIgnore;
var svgOctaveDiff;
var option_octave; // string, 2 values: 'diff' (differentiation between octaves) or 'ignore' (no differentiation)
var colorPush; // change name to color_push
var colorPull;
var keyboard_lefthand = new Array();
var keyboard_righthand = new Array();
var accbtns_visible = new Set();
var notes_visible = new Set(); 
var accbtns_pull_hide_all = false; // bool
var accbtns_push_hide_all = false; // bool
var note_names;

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
  var row_number = document.querySelector('#setting_row_number').value;
  note_names = window[document.querySelector('input[name = "language"]:checked').value];
  keyboard_lefthand = window[document.querySelector('#setting_layout_lefthand').value];
  keyboard_righthand = window[document.querySelector('#setting_layout_righthand').value];
  assignKeyboardLayout(keyboard_lefthand, note_names, "left");
  assignKeyboardLayout(keyboard_righthand, note_names, "right");
  showRows(row_number);

  // accordeon buttons
  //var accbtns = document.querySelector('#keyboard').querySelectorAll('div.push, div.pull');
  var accbtns = document.querySelectorAll('#keyboard .push, #keyboard .pull, #bassboard .push, #bassboard .pull');
  accbtns.forEach(accbtn => {
      accbtn.addEventListener('click', toggleNote);
      // accbtn.addEventListener('touch', toggleNote);
  })

  // load svgs
  svgOctaveDiff = document.getElementById('svg_octave_diff').contentDocument; // Todo: Namen ändern
  svgOctaveIgnore = document.getElementById('svg_octave_ignore').contentDocument; // Todo: Namen ändern
  var rect_list = svgOctaveIgnore.querySelectorAll('rect');
  rect_list.forEach(rect => {
      rect.addEventListener('click', toggleNote);
     // rect.addEventListener('touch', toggleNote); // Todo: müsste getestet werden
  });
  optionOctave();
  rect_list[2].dispatchEvent(new Event('click'));
  //rect_list[6].dispatchEvent(new Event('click'));
  //rect_list[9].dispatchEvent(new Event('click'));
  
  // only show melody tab
  document.getElementById('righthandTab').dispatchEvent(new Event('click'));

  rotateKeyboard(4);
}

//######################
//    svg (staff)
//######################

function optionOctave(){
    option_octave = document.querySelector('input[name="octave"]:checked').value;
    if(option_octave == 'diff'){
        document.querySelector('#staff_octave_ignore').classList.add("hide_staff");
        document.querySelector('#staff_octave_diff').classList.remove("hide_staff");
        document.querySelector('body').style.flexDirection = "row";
        document.querySelector('#menuLine').style.flexDirection = "column";
    }
    else if (option_octave == 'ignore'){
        document.querySelector('#staff_octave_ignore').classList.remove("hide_staff");
        document.querySelector('#staff_octave_diff').classList.add("hide_staff");
        document.querySelector('body').style.flexDirection = "column";
        document.querySelector('#menuLine').style.flexDirection = "row";
    }
}

function setStyle(object, property, value) {
    try{
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
    catch (e) {}
}

function toggleNote() {
    var keyboard = Object.assign({}, window.keyboard_lefthand, window.keyboard_righthand);
    var hide_note; // bool
    var note_with_oct; // note with octave specification in scientific pitch notation, i.e. f4_flat
    var note_no_oct; // note without octave specification, i.e. f_flat
    var button_ids = new Array();
    var note_names = new Set();

    // ######### definition of variables "note_with_oct" and "hide_note" ##########

        // case: a rectangle in svgOctaveIgnore has been clicked
        if(this.tagName.toLowerCase() == "rect"){
            var rect = this;
            note_with_oct = rect.getAttributeNS(null, 'id'); 
            if(rect.getAttributeNS(null, 'style').includes('opacity:0%')){
                hide_note = false;
            }  
            if(rect.getAttributeNS(null, 'style').includes('opacity:0.3')){
                hide_note = true;
            }
        /* var button_ids = Object.keys(window.keyboard_righthand).filter(
                key => window.keyboard_righthand[key].replace(/[0-9]/g, '') === note_no_oct
            );
            var notes_with_oct = Object.entries(window.keyboard_righthand).filter(
                key => window.keyboard_righthand[key].replace(/[0-9]/g, '') === note_no_oct 
            )*/
        }
        // case: an accordeon button has been clicked
        else if(this.tagName.toLowerCase() == "div"){
            note_with_oct = keyboard[this.id];
            rect = svgOctaveIgnore.getElementById(note_with_oct);
            if(this.classList.contains("hidden")){
                hide_note = false;
            }
            else{
                hide_note = true;
            }
        }

    // ######### definition of arrays "button_ids" and "note_names" ##########
    if(option_octave == "diff"){
        button_ids = Object.keys(keyboard).filter(
            key => keyboard[key] === note_with_oct
        );
        note_names.add(note_with_oct);
    }
    else if (option_octave == "ignore"){
        note_no_oct = note_with_oct.replace(/[0-9]/g, '');
        Object.entries(keyboard).forEach(
            ([key, value]) => {
                if(value.replace(/[0-9]/g, '') == note_no_oct){
                    button_ids.push(key);
                    note_names.add(value);
                } 
            }
        );
       /* for (const [key, value] of Object.entries(window.keyboard_righthand)) {
            if(${key}.replace(/[0-9]/g, '') == note_no_oct){
                console.log(${value});
                button_ids.push(${key});
                note_names.push(${value});
            }
          }*/
    }

    // ######### change values of "notes_visible" and "accbtns_visible" ##########
    if(hide_note){
        // delete elements of note_names from notes_visible
        notes_visible = new Set([...notes_visible].filter(x => !note_names.has(x)));
        //if(rect != null){
        //    setStyle(rect, "opacity", "0%");
        //}
        for (let i = 0; i < button_ids.length; i++) {
            window.accbtns_visible.delete(button_ids[i]);
        }
    }
    else{
        notes_visible = new Set([...notes_visible, ...note_names]);
        //if(rect != null){
        //    setStyle(rect, "opacity", "0.3");
        //}
        for (let i = 0; i < button_ids.length; i++) {
            window.accbtns_visible.add(button_ids[i]);
        }
    }
    refresh_visible_accbtns();
}

function refresh_visible_accbtns(clear=false) {

    if(clear){
        window.accbtns_visible = new Set();
        window.notes_visible = new Set();
    }

    // refresh notes and accidentals in svgOctaveDiff
    //var single_notes = svgOctaveDiff.querySelectorAll('#notes_between_lines > path, #notes_on_lines > path');
    var single_notes = svgOctaveDiff.querySelectorAll(".music_note");
    var accidentals = svgOctaveDiff.querySelectorAll("text[id$='flat'], text[id$='sharp']");
    var rects_all = svgOctaveIgnore.querySelectorAll('rect');
    single_notes.forEach(note => {
        setStyle(note, "opacity", "0%");
    })
    accidentals.forEach(accidental => {
        setStyle(accidental, "opacity", "0%");
    })
    rects_all.forEach(rect => {
        setStyle(rect, "opacity", "0%");
    })
    notes_visible.forEach(note => {
        var note_visible = svgOctaveDiff.querySelector('path[id^='.concat(note.substr(0,2)));
        setStyle(note_visible, "opacity", "1");
        if(note.length > 2){ // note with accidentals 
            var accidental = svgOctaveDiff.querySelector('text[id='.concat(note));
            setStyle(accidental, "opacity", "1");
        }
        var rects = svgOctaveIgnore.querySelectorAll('rect[id^='.concat(note.substr(0,1)));
        rects.forEach(rect => {
            if(rect.id.replace(/[0-9]/g, '') == note.replace(/[0-9]/g, '')){
                setStyle(rect, "opacity", "0.3");
            }
        })
    })

    // refresh push buttons
    var accbtns_push = document.querySelectorAll('#keyboard div.push, #bassboard div.push');
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
    var accbtns_pull = document.querySelectorAll('#keyboard div.pull, #bassboard div.pull');
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

function assignKeyboardLayout(layout, note_names, hand = null) {
    if(hand == "right"){
        window.keyboard_righthand = layout;
        var rows = document.querySelectorAll('#keyboard > .row');
    }
    else if(hand == "left"){
        window.keyboard_lefthand = layout;
        var rows = document.querySelectorAll('#bassboard > .row');
    }
    rows.forEach(row => {
        row.style.display = "flex";
    })
    for (var x in layout) {
        if (layout.hasOwnProperty(x)){
            try{
                if(layout[x] == ""){
                    document.getElementById(x).parentNode.style.display = "none";
                }
                else if(layout[x].match('major')){
                    document.getElementById(x).innerHTML = "+";
                    document.getElementById(x).parentNode.style.display = "flex";
                }
                else if(layout[x].match('minor')){
                    document.getElementById(x).innerHTML = "-";
                    document.getElementById(x).parentNode.style.display = "flex";
                }
                else{
                    document.getElementById(x).innerHTML = note_names[layout[x].replace(/[0-9]/g, '')];
                    document.getElementById(x).parentNode.style.display = "flex";
                }
            }
            catch (e) {continue}
        }
    }
/*     rows.forEach(row => {
        if(row.querySelectorAll("div[style='display: flex;']").length == 0){
            row.style.display = "none";
        }
    })  */
}

function rotateKeyboard(direction) {
    var kb = document.querySelector("#keyboard");
    var bb = document.querySelector("#bassboard");
    var rows = document.querySelectorAll("#keyboard > .row, #bassboard > .row");
    var acc = document.querySelector("#accordion");
    var bellows_horizontal = document.querySelector('#bellows_horizontal');
    var bellows_vertical = document.querySelector('#bellows_vertical');

    switch (direction) {
        case 1: // melody: left, bass: right
            bellows_horizontal.style.display = "none";  
            bellows_vertical.style.display = "flex";
            bellows_vertical.style.transform = "";
            acc.style.flexDirection = "row-reverse";
            acc.style.justifyContent = "flex-start";
            bb.style.flexDirection = "row-reverse";
            kb.style.flexDirection = "row-reverse";  
            for (var i = 0; i < rows.length; i++) {
                rows[i].style.flexDirection = "column";
            } 
            break;
        case 2: // melody: top, bass: bottom
            bellows_vertical.style.display = "none";
            bellows_horizontal.style.display = "flex";
            bellows_horizontal.style.transform = "";
            acc.style.flexDirection = "column-reverse";
            acc.style.justifyContent = "flex-end";
            bb.style.flexDirection = "column-reverse";
            kb.style.flexDirection = "column-reverse";
            for (var i = 0; i < rows.length; i++) {
                rows[i].style.flexDirection = "row-reverse";
            }
            break;
        case 3: // melody: right, bass: left          
            bellows_horizontal.style.display = "none";  
            bellows_vertical.style.display = "flex";
            bellows_vertical.style.transform = "rotate(180deg)";
            acc.style.flexDirection = "row";
            acc.style.justifyContent = "flex-start";
            bb.style.flexDirection = "row";
            kb.style.flexDirection = "row";
            for (var i = 0; i < rows.length; i++) {
              rows[i].style.flexDirection = "column-reverse";
            }
            break;
        case 4: // melody: bottom, bass: top
            bellows_vertical.style.display = "none";
            bellows_horizontal.style.display = "flex";
            bellows_horizontal.style.transform = "rotate(180deg)";
            acc.style.flexDirection = "column";
            acc.style.justifyContent = "flex-end";
            bb.style.flexDirection = "column";
            kb.style.flexDirection = "column";
            for (var i = 0; i < rows.length; i++) {
                rows[i].style.flexDirection = "row";
            }
            break;
    }
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

function openTab(evt, tabName) {
    if(evt.currentTarget.classList.contains("active")){
        evt.currentTarget.classList.remove("active");
        document.getElementById(tabName).style.display = "none";
    }
    else{
        evt.currentTarget.classList.add("active");
        document.getElementById(tabName).style.display = "flex";
    }
}

function showRows(number) {
    var row3buttons = document.getElementById("row 3").children
    switch(number){
        case "2": 
            for(i = 0; i < row3buttons.length; i++){
                row3buttons[i].style.display = "none";
            }
            break;
        case "2.5":
            for(i = 0; i < row3buttons.length; i++){
                var index = parseInt(row3buttons[i].id.replace("3.", ""));
                if(index < 3 | index > 8)
                    row3buttons[i].style.visibility = "hidden";
                else
                row3buttons[i].style.display = "flex";
            }
            break;
        case "3": 
            for(i = 0; i < row3buttons.length; i++){
                row3buttons[i].style.display = "flex";
            }
            break;
    }
}