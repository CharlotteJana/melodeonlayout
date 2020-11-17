//############################
//    music theory
//############################

// Plan:
// Zunächst Auswahl Button: Select Root and Select Type of Chords → Show correct buttons
// Zweiter Schritt: Select 2 - 4 Notes → get possible Chords

var note_order = [
    "c1", "c1_sharp", "d1", "e1_flat", "e1", "f1", "f1_sharp", "g1", "g1_sharp", "a1", "b1_flat", "b1",
    "c2", "c2_sharp", "d2", "e2_flat", "e2", "f2", "f2_sharp", "g2", "g2_sharp", "a2", "b2_flat", "b2",
    "c3", "c3_sharp", "d3", "e3_flat", "e3", "f3", "f3_sharp", "g3", "g3_sharp", "a3", "b3_flat", "b3",
    "c4", "c4_sharp", "d4", "e4_flat", "e4", "f4", "f4_sharp", "g4", "g4_sharp", "a4", "b4_flat", "b4",
    "c5", "c5_sharp", "d5", "e5_flat", "e5", "f5", "f5_sharp", "g5", "g5_sharp", "a5", "b5_flat", "b5",
    "c6", "c6_sharp", "d6", "e6_flat", "e6", "f6", "f6_sharp", "g6", "g6_sharp", "a6", "b6_flat", "b6"
]

// explanation of r1,r2... : the number indicates the position of the root note in the chord, 
// i.e. for triads we have r1 = normal form, r2 = second inversion, r3 = first inversion

// chords with 3 notes:
var chords_3 = {
    "major_r1": [0,4,7], "major_r2": [0,3,8], "major_r3": [0,5,9], // major chord, ex: C
    "minor_r1": [0,3,7], "minor_r2": [0,4,9], "minor_r3": [0,5,8], // minor chord, ex: c
    "dimin_r1": [0,3,6], "dimin_r2": [0,3,9], "dimin_r3": [0,6,9], // diminished chord, ex:
    "sus_r1":   [0,2,7], "sus_r2":  [0,5,10], "sus_r3":   [0,5,7], // sus, ex: Csus
    "augmented": [0,4,8] // augmented chord, ex: Caug (same for r1, r2, r3)
}

// chords with 4 notes:
var chords_4 = {
    "major7_r1": [0,4,7,11], "major7_r2": [0,1,5,8], "major7_r3": [0,4,5,9], "major7_r4": [0,3,7,8], // major seventh, ex: Cmaj7 = c,e,g,b
    "minor7_r1": [0,3,7,10], "minor7_r2": [0,2,5,10], "minor7_r3": [0,3,5,8], "minor7_r4": [0,4,7,9], // minor seventh, ex: Cmin7 = c,e♭,g,b♭
    "dom7_r1": [0,4,7,10], "dom7_r2": [0,2,6,9], "dom7_r3": [0,3,5,9], "dom7_r4": [0,3,6,8], // dominant seventh, ex: C7 = c,e,g,b♭    
    "hdim_7_r1": [0,3,6,10], "hdim_7_r2": [0,2,5,8], "hdim_7_r3": [0,4,6,9], "hdim_7_r4": [0,3,7,9], // halfdiminished seventh, ex: Cm7b5, C∅ = c,e♭,g♭,b♭
    "minmaj7_r1": [0,3,7,11], "minmaj7_r2": [0,1,4,8], "minmaj7_r3": [0,4,5,8], "minmaj7_r4": [0,4,8,9], //minor major seventh, ex: Cm maj7 = c,e♭,g,h
    "augmaj7_r1": [0,4,8,11], "augmaj7_r2": [0,1,5,9], "augmaj7_r3": [0,3,4,8], "augmaj7_r4": [0,4,7,8], // augmented major seventh, ex: Cmaj7#5 = c,e,g#,b
    "dim7": [0,3,6,9] // diminished seventh, ex: Cdim7 = c,e♭,g♭,b♭♭=a (same for r1 - r4)
}
//#################################
//    note names and translations
//#################################

// the note names that are internally used correspond to nnames_usual
var nnames_usual = ["f", "f_sharp", "g", "g_sharp", "a", "b_flat",  "b", "c", "c_sharp", "d", "e_flat",  "e"]
var nnames_flat  = ["f", "g_flat",  "g", "a_flat",  "a", "b_flat",  "b", "c", "d_flat",  "d", "e_flat",  "e"]
var nnames_sharp = ["f", "f_sharp", "g", "g_sharp", "a", "a_sharp", "b", "c", "c_sharp", "d", "d_sharp", "e"]

var german = {
    "f": "f", "f_sharp": "fis", "g_flat": "ges", "g": "g", "g_sharp": "gis", "a_flat": "as", "a": "a", "a_sharp": "ais", "b_flat": "b", 
    "b": "h", "c": "c", "c_sharp": "cis", "d_flat": "des", "d": "d", "d_sharp": "dis", "e_flat": "es", "e": "e", "": ""
}

var french = {
    "f": "fa", "f_sharp": "fa♯", "g_flat": "sol♭", "g": "sol", "g_sharp": "sol♯", "a_flat": "la♭", "a": "la", "a_sharp": "la♯", "b_flat": "si♭", 
    "b": "si", "c": "do", "c_sharp": "do♯", "d_flat": "ré♭", "d": "ré", "d_sharp": "ré♯", "e_flat": "mi♭", "e": "mi", "": ""    
}

var english = {
    "f": "f", "f_sharp": "f♯", "g_flat": "g♭", "g": "g", "g_sharp": "g♯", "a_flat": "a♭", "a": "a", "a_sharp": "a♯", "b_flat": "b♭", 
    "b": "b", "c": "c", "c_sharp": "c♯", "d_flat": "d♭", "d": "d", "d_sharp": "d♯", "e_flat": "e♭", "e": "e", "": ""
}

//############################
//    ledgers
//############################

const notes_with_ledgers = {
    "c2": ["ledger_down_bass_1", "ledger_down_bass_2"],
    "d2": ["ledger_down_bass_1"],
    "e2": ["ledger_down_bass_1"],
    "c4": ["ledger_down_1"],
    "a5": ["ledger_up_1"], 
    "b5": ["ledger_up_1"],
    "c6": ["ledger_up_1", "ledger_up_2"], 
    "d6": ["ledger_up_1", "ledger_up_2"],
    "e6": ["ledger_up_1", "ledger_up_2", "ledger_up_3"],
    "f6": ["ledger_up_1", "ledger_up_2", "ledger_up_3"],
    "g6": ["ledger_up_1", "ledger_up_2", "ledger_up_3", "ledger_up_4"]
  }