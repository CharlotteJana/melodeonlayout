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
var adjustKeys_direction;
var rotateKeyboard_direction;
var root_note; // base note for selected chord or scale

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
  changeNoteNames(note_names);
  showRows(row_number);

  // accordeon buttons
  //var accbtns = document.querySelector('#keyboard').querySelectorAll('div.push, div.pull');
  var accbtns = document.querySelectorAll('#keyboard .push, #keyboard .pull, #bassboard .push, #bassboard .pull');
  accbtns.forEach(accbtn => {
      accbtn.addEventListener('click', toggleNote);
      // accbtn.addEventListener('touch', toggleNote);
  })

  // load svgs
  svgOctaveDiff = document.getElementById('svg_octave_diff').contentDocument;
  svgOctaveIgnore = document.getElementById('svg_octave_ignore').contentDocument;
  var rect_list = svgOctaveIgnore.querySelectorAll('rect');
  rect_list.forEach(rect => {
      rect.addEventListener('click', toggleNote);
     // rect.addEventListener('touch', toggleNote); // Todo: müsste getestet werden
  });
  var single_notes = svgOctaveDiff.querySelectorAll(".music_note");
  single_notes.forEach(note => {
      note.addEventListener('click', toggleNote);
  })
  var accidentals = svgOctaveDiff.querySelectorAll("text[id$='flat'], text[id$='sharp']");
  accidentals.forEach(accidental => {
      accidental.addEventListener('click', toggleNote);
  })
  optionOctave();
  rect_list[2].dispatchEvent(new Event('click'));
  //rect_list[6].dispatchEvent(new Event('click'));
  //rect_list[9].dispatchEvent(new Event('click'));
  
  // only show melody tab
  document.getElementById('righthandTab').dispatchEvent(new Event('click'));
  
  // add event listeners to select forms
  document.querySelector('select#root_of_chord').addEventListener('change', showChord);
  document.querySelector('select#type_of_chord').addEventListener('change', showChord);

  adjustKeys(5)
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
        // case: a note or accidental in svgOctaveIgnored has been clicked
        else if(this.tagName.toLowerCase() == "path" | this.tagName.toLowerCase() == "text"){
            note_with_oct = this.getAttributeNS(null, 'id');
            rect = svgOctaveIgnore.getElementById(note_with_oct);
            if(this.classList.contains("hidden")){
                hide_note = false;
            }
            else{
                hide_note = true;
            }
        }

    // ######### definition of array "note_names" ##########
    if(option_octave == "diff"){
        note_names.add(note_with_oct);
    }
    else if (option_octave == "ignore"){
        note_no_oct = note_with_oct.replace(/[0-9]/g, '');
        Object.entries(keyboard).forEach(
            ([key, value]) => {
                if(value.replace(/[0-9]/g, '') == note_no_oct){
                    note_names.add(value);
                } 
            }
        );
    }

    // ######### change values of "notes_visible" and "accbtns_visible" ##########
    if(hide_note){
        // delete elements of note_names from notes_visible
        notes_visible = new Set([...notes_visible].filter(x => !note_names.has(x)));
    }
    else{
        notes_visible = new Set([...notes_visible, ...note_names]);
    }
    refresh_visible_accbtns();
}

function refresh_visible_accbtns(clear=false) {
    window.accbtns_visible = new Set();
    if(clear){
        window.notes_visible = new Set();
    }

    // refresh notes and accidentals in svgOctaveDiff
    //var single_notes = svgOctaveDiff.querySelectorAll('#notes_between_lines > path, #notes_on_lines > path');
    var single_notes = svgOctaveDiff.querySelectorAll(".music_note");
    var accidentals = svgOctaveDiff.querySelectorAll("text[id$='flat'], text[id$='sharp']");
    var rects_all = svgOctaveIgnore.querySelectorAll('rect');
    var ledgers = svgOctaveDiff.querySelectorAll("path[id^='ledger'");
    single_notes.forEach(note => {
        note.classList.add("hidden");
    })
    accidentals.forEach(accidental => {
        accidental.classList.add("hidden");
    })
    ledgers.forEach(ledger => {
        setStyle(ledger, "opacity", "0%");
    })
    rects_all.forEach(rect => {
        setStyle(rect, "opacity", "0%");
    })

    var keyboard = Object.assign({}, window.keyboard_lefthand, window.keyboard_righthand);
    var button_ids = new Array();
    var note_with_oct;
    var note_no_oct;
    for (var nv = notes_visible.values(), note_with_oct= null; note_with_oct=nv.next().value; ) {
        obj_with_oct = svgOctaveDiff.querySelector('path[id^='.concat(note_with_oct.substr(0,2)));
        note_no_oct = note_with_oct.replace(/[0-9]/g, '');
        try{ // show note on svgOctaveDiff
            
            obj_with_oct.classList.remove("hidden");

            // show accidentals
            if(note_with_oct.length > 2){
                var accidental = svgOctaveDiff.querySelector('text[id='.concat(note_with_oct));
                accidental.classList.remove("hidden");
            }

            // show ledgers
            if(note_with_oct.substr(0,2) in notes_with_ledgers){
                ledgers_visible = notes_with_ledgers[note_with_oct.substr(0,2)];
                ledgers.forEach(ledger => {
                    if(ledgers_visible.includes(ledger.id)){
                        setStyle(ledger, "opacity", "1");
                    }                
                })
            }
        }
        catch (e) {}
        try{ // show note on svgOctaveIgnore
            var rects = svgOctaveIgnore.querySelectorAll('rect[id^='.concat(note_with_oct.substr(0,1)));
            rects.forEach(rect => {
                if(rect.id.replace(/[0-9]/g, '') == note_no_oct){
                    setStyle(rect, "opacity", "0.3");
                }
            })
        }
        catch (e) {}
        try{ // update accbtns_visible
            if(option_octave == "diff"){
                button_ids = Object.keys(keyboard).filter(
                    key => keyboard[key] === note_with_oct
                );
            }
            else if (option_octave == "ignore"){
                Object.entries(keyboard).forEach(
                    ([key, value]) => {
                        if(value.replace(/[0-9]/g, '') == note_no_oct){
                            button_ids.push(key);
                        } 
                    }
                );
            }
            for (let i = 0; i < button_ids.length; i++) {
                window.accbtns_visible.add(button_ids[i]);
            } 
        }
        catch (e) {}                   
    }

    // refresh push buttons
    var accbtns_push = document.querySelectorAll('#keyboard div.push, #bassboard div.push');
    for(var i = 0; i < accbtns_push.length; i++){
        if(window.accbtns_push_hide_all){
            accbtns_push[i].classList.add("hidden");
            //TODO: Find all notes that are only in push and remove the corresponding rects and notes in the svg files
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
            //TODO: Find all notes that are only in pull and remove the corresponding rects and notes in the svg files
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
//     music theory
//######################

function setRootNote(root){
    window.root_note = root;
    document.querySelector('#root_of_scale > option[value="'+ root +'"]').selected = 'selected';
    document.querySelector('#root_of_scale > option[value="'+ root +'"]').selected = 'selected';
}

function showChord() {
    setRootNote(document.querySelector("#root_of_chord").value);
    var type = document.querySelector("#type_of_chord").value;
    var chord_pattern = chords_3[type+"_r1"];
    var note_indices = chord_pattern.map(x => x + window.note_order.indexOf(root_note.substring(0, 1) + "1" + root_note.substring(1)));
    var all_note_indices = note_indices;
    for (i = 1; i <=6; i++) {
        all_note_indices = all_note_indices.concat(note_indices.map(x => x+i*12));
    }
    all_note_indices = all_note_indices.filter(function(element) { return element < window.note_order.length });
    window.notes_visible = new Set;
    var chord_notes = new Set;
    all_note_indices.forEach(index => {
        window.notes_visible.add(window.note_order[index]);
        chord_notes.add(window.note_order[index].replace(/[0-9]/g, ''));
    });
    refresh_visible_accbtns();
    var missing_chord_push = [];
    var missing_chord_pull = [];
    for (var chord = chord_notes.values(), note=null; note=chord.next().value; ){
        if(missing_push_notes.has(note)){
            missing_chord_push.push(note_names[note]);
        }
        if(missing_pull_notes.has(note)){
            missing_chord_pull.push(note_names[note]);
        }
    }
    if(missing_chord_push.length == 0 & missing_chord_pull.length == 0){
        document.querySelector("#comment_notes_missing").classList.add("hide_staff");
        document.querySelector("#comment_notes_push").classList.add("hide_staff");
        document.querySelector("#comment_notes_pull").classList.add("hide_staff");
    }
    else{
        if(missing_chord_push.length > 0){
            document.querySelector("#comment_notes_missing").classList.remove("hide_staff");
            document.querySelector("#comment_notes_push").classList.remove("hide_staff");
            document.querySelector("#comment_notes_push").innerHTML = missing_chord_push.join(', ');
        } else {        
            document.querySelector("#comment_notes_push").classList.add("hide_staff");
        }
        if(missing_chord_pull.length > 0){
            document.querySelector("#comment_notes_missing").classList.remove("hide_staff");
            document.querySelector("#comment_notes_pull").classList.remove("hide_staff");
            document.querySelector("#comment_notes_pull").innerHTML = missing_chord_pull.join(', ');
        } else {
            document.querySelector("#comment_notes_pull").classList.add("hide_staff");
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
    var pull_notes = new Set;
    var push_notes = new Set;
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
                    var note = layout[x].replace(/[0-9]/g, '');
                    document.getElementById(x).innerHTML = note_names[note];
                    document.getElementById(x).parentNode.style.display = "flex";
                    if(hand == "right"){
                        if(x.endsWith('_')){
                            pull_notes.add(note);
                        }
                        else{
                            push_notes.add(note);
                        }
                    }
                }
            }
            catch (e) {continue}
        }
    }
    if(hand == "right"){
        for (var i in nnames_usual){
            if(!pull_notes.has(nnames_usual[i])){
                window.missing_pull_notes.add(nnames_usual[i]);
            }
            if(!push_notes.has(nnames_usual[i])){
                window.missing_push_notes.add(nnames_usual[i]);
            }
        }
    }
/*     rows.forEach(row => {
        if(row.querySelectorAll("div[style='display: flex;']").length == 0){
            row.style.display = "none";
        }
    })  */
}

function changeNoteNames(new_note_names){
    window.note_names = new_note_names;
    assignKeyboardLayout(keyboard_lefthand, note_names, 'left');
    assignKeyboardLayout(keyboard_righthand, note_names, 'right');
    var noteOptions = document.querySelectorAll('#root_of_chord > option, #root_of_scale > option');
    noteOptions.forEach(option => {
        var name = note_names[option.value];
        option.innerHTML = name[0].toUpperCase() + name.slice(1); // capitalized version of note name
    })
}

function rotateKeyboard(direction) {
    window.rotateKeyboard_direction = direction;
    var kb = document.querySelector("#keyboard");
    var bb = document.querySelector("#bassboard");
    var rows = document.querySelectorAll("#keyboard > .row, #bassboard > .row");
    var acc = document.querySelector("#accordion");
    var bellows_horizontal = document.querySelector('#bellows_horizontal');
    var bellows_vertical = document.querySelector('#bellows_vertical');

    if(adjustKeys_direction == 5){
        adjustKeys(5);
    }

    switch (direction) {
        case 1: // melody: left, bass: right
            bellows_horizontal.style.display = "none";  
            bellows_vertical.style.display = "flex";
            bellows_vertical.style.transform = "";
            acc.style.flexDirection = "row-reverse";
            acc.style.justifyContent = "flex-end";
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
    window.adjustKeys_direction = direction;
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
        case 5: // pull always outside, push always near bellows
            for (var i = 0; i < buttons.length; i++) {
                bass_button = buttons[i].parentElement.id.startsWith("bass");
                pull = buttons[i].querySelector(".pull");
                push = buttons[i].querySelector(".push");
                pull?.classList.remove("top", "bottom", "left", "right");
                push?.classList.remove("top", "bottom", "left", "right");

                if(rotateKeyboard_direction == 1){
                    if(bass_button){
                        buttons[i].style.flexDirection = "row";
                        push?.classList.add("left");
                        pull?.classList.add("right");
                    }
                    else{
                        buttons[i].style.flexDirection = "row-reverse";
                        push?.classList.add("right");
                        pull?.classList.add("left");
                    }
                }
                else if (rotateKeyboard_direction == 2){
                    if(bass_button){
                        buttons[i].style.flexDirection = "column";
                        push?.classList.add("top");
                        pull?.classList.add("bottom");
                    }
                    else{
                        buttons[i].style.flexDirection = "column-reverse";
                        push?.classList.add("bottom");
                        pull?.classList.add("top");
                    }
                }
                else if (rotateKeyboard_direction == 3) {
                    if(bass_button){
                        buttons[i].style.flexDirection = "row-reverse";
                        push?.classList.add("right");
                        pull?.classList.add("left");
                    }
                    else{
                        buttons[i].style.flexDirection = "row";
                        push?.classList.add("left");
                        pull?.classList.add("right");
                    }
                }
                else if (rotateKeyboard_direction == 4) {
                    if(bass_button){
                        buttons[i].style.flexDirection = "column-reverse";
                        push?.classList.add("bottom");
                        pull?.classList.add("top");
                    }
                    else{
                        buttons[i].style.flexDirection = "column";
                        push?.classList.add("top");
                        pull?.classList.add("bottom");
                    }
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