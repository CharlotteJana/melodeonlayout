//######################
//    translations
//######################

var german = {
    "f": "f", "f_sharp": "fis", "g": "g", "g_sharp": "gis", "a": "a", "b_flat": "b", 
    "b": "h", "c": "c", "c_sharp": "cis", "d": "d", "e_flat": "es", "e": "e", "": ""
}

var french = {
    "f": "fa", "f_sharp": "fa♯", "g": "sol", "g_sharp": "sol♯", "a": "la", "b_flat": "si♭", 
    "b": "si", "c": "do", "c_sharp": "do♯", "d": "ré", "e_flat": "mi♭", "e": "mi", "": ""    
}

var english = {
    "f": "f", "f_sharp": "f♯", "g": "g", "g_sharp": "g♯", "a": "a", "b_flat": "b♭", 
    "b": "b", "c": "c", "c_sharp": "c♯", "d": "d", "e_flat": "e♭", "e": "e", "": ""
}

//######################
//    layouts
//######################

var GC_2 = { // G-C accordeon with 2 rows
    //push
    "1'":"e","2'":"g","3'":"c","4'":"e","5'":"g","6'":"c","7'":"e","8'":"g","9'":"c","10'":"e","11'":"g",
    "1":"b","2":"d","3":"g","4":"b","5":"d","6":"g","7":"b","8":"d","9":"g","10":"b","11":"d","12":"g",
    //pull     
    "1'_":"g","2'_":"b","3'_":"d","4'_":"f","5'_":"a","6'_":"b","7'_":"d","8'_":"f","9'_":"a","10'_":"b","11'_":"d",
    "1_":"e","2_":"f_sharp","3_":"a","4_":"c","5_":"e","6_":"f_sharp","7_":"a","8_":"c","9_":"e","10_":"f_sharp","11_":"a","12_":"c",   
}

var GC_2_dutch = { // G-C accordeon with 2 rows, reeds of button 5' are swaped (a and g)
    //push
    "1'":"e","2'":"g","3'":"c","4'":"e","5'":"a","6'":"c","7'":"e","8'":"g","9'":"c","10'":"e","11'":"g",
    "1":"h","2":"d","3":"g","4":"b","5":"d","6":"g","7":"b","8":"d","9":"g","10":"b","11":"d","12":"g",
    //pull 
    "1'_":"g","2'_":"b","3'_":"d","4'_":"f","5'_":"g","6'_":"b","7'_":"d","8'_":"f","9'_":"a","10'_":"b","11'_":"d",
    "1_":"e","2_":"f_sharp","3_":"a","4_":"c","5_":"e","6_":"f_sharp","7_":"a","8_":"c","9_":"e","10_":"f_sharp","11_":"a","12_":"c", 
}

GC_3_heim = { // G-C accordeon with 3 rows, 3rd row after Francois Heim
    //push
    "1''":"g3_sharp","2''":"a3","3''":"e4_flat","4''":"g4_sharp","5''":"a4","6''":"e5_flat","7''":"g5_sharp","8''":"a5","9''":"e6_flat","10''":"g6_sharp",
    "1'":"e3","2'":"g3","3'":"c4","4'":"e4","5'":"g4","6'":"c5","7'":"e5","8'":"g5","9'":"c6","10'":"e6","11'":"g6",
    "1":"b2","2":"d3","3":"g3","4":"b3","5":"d4","6":"g4","7":"b4","8":"d5","9":"g5","10":"b5","11":"d6","12":"g6",
    //pull     
    "1''_":"b3_flat", "2''_":"c4_sharp","3''_":"g4","4''_":"g4_sharp","5''_":"b4_flat","6''_":"c5_sharp","7''_":"g5","8''_":"g5_sharp","9''_":"b5_flat","10''_":"c6_sharp",
    "1'_":"g3","2'_":"b3","3'_":"d4","4'_":"f4","5'_":"a4","6'_":"b4","7'_":"d5","8'_":"f5","9'_":"a5","10'_":"b5","11'_":"d6",
    "1_":"e3","2_":"f3_sharp","3_":"a3","4_":"c4","5_":"e4","6_":"f4_sharp","7_":"a4","8_":"c5","9_":"e5","10_":"f5_sharp","11_":"a5","12_":"c6",   
}

GC_3_heim_dutch = { // G-C accordeon with 3 rows, 3rd row after Francois Heim, reeds of button 5' are swaped (a and g)
    //push
    "1''":"g_sharp","2''":"a","3''":"e_flat","4''":"g_sharp","5''":"a","6''":"e_flat","7''":"g_sharp","8''":"a","9''":"e_flat","10''":"g_sharp",
    "1'":"e","2'":"g","3'":"c","4'":"e","5'":"a","6'":"c","7'":"e","8'":"g","9'":"c","10'":"e","11'":"g",
    "1":"b","2":"d","3":"g","4":"b","5":"d","6":"g","7":"b","8":"d","9":"g","10":"b","11":"d","12":"g",
    //pull     
    "1''_":"b_flat","2''_":"c_sharp","3''_":"g","4''_":"g_sharp","5''_":"b_flat","6''_":"c_sharp","7''_":"g","8''_":"g_sharp","9''_":"b_flat","10''_":"c_sharp",
    "1'_":"g","2'_":"b","3'_":"d","4'_":"f","5'_":"g","6'_":"b","7'_":"d","8'_":"f","9'_":"a","10'_":"b","11'_":"d",
    "1_":"e","2_":"f_sharp","3_":"a","4_":"c","5_":"e","6_":"f_sharp","7_":"a","8_":"c","9_":"e","10_":"f_sharp","11_":"a","12_":"c",   
}

//######################
//    Bass
//######################

GC_18 = { // G-C accordeon with 18 Basses
    //push    
    "b1''": "g_sharp_major", "b2''": "g2_sharp", "b3''": "g_major", "b4''": "g2", "b5''": "c_major", "b6''": "c2",
    "b1'": "e_flat_major", "b2'": "e2_flat", "b3'": "e_major", "b4'": "e2", "b5'": "f_major", "b6'": "f2",
    "b1": "c_sharp_major", "b2": "c2_sharp", "b3": "b_major", "b4": "b2", "b5": "d_major", "b6": "d2",
    //pull
    "b1''_": "b_major", "b2''_": "b2", "b3''_": "d_major", "b4''_": "d2", "b5''_": "g_major", "b6''_": "g2",
    "b1'_": "b_flat_major", "b2'_":"b2_flat", "b3'_": "a_minor", "b4'_": "a2", "b5'_": "f_major", "b6'_": "f2",
    "b1_": "c_sharp_major", "b2_": "c2_sharp", "b3_": "e_major", "b4_": "e2", "b5_": "c2_major", "b6_": "c2"
}

GC_12 = { // G-C accordeon with 12 Basses
    //push    
    "b1''": "g_sharp_major", "b2''": "g2_sharp", "b3''": "g_major", "b4''": "g2", "b5''": "c_major", "b6''": "c2",
    "b1'": "e_flat_major", "b2'": "e2_flat", "b3'": "e_major", "b4'": "e2", "b5'": "f_major", "b6'": "f2",
    "b1": "", "b2": "", "b3": "", "b4": "", "b5": "", "b6": "",
    //pull
    "b1''_": "b_major", "b2''_": "b2", "b3''_": "d_major", "b4''_": "d2", "b5''_": "g_major", "b6''_": "g2",
    "b1'_": "b_flat_major", "b2'_":"b2_flat", "b3'_": "a_minor", "b4'_": "a2", "b5'_": "f_major", "b6'_": "f2",
    "b1_": "", "b2_": "", "b3_": "", "b4_": "", "b5_": "", "b6_": ""
}

GC_08 = { // G-C accordeon with 8 Basses
    //push    
    "b1''": "", "b2''": "", "b3''": "g_major", "b4''": "g2", "b5''": "c_major", "b6''": "c2",
    "b1'": "", "b2'": "", "b3'": "e_major", "b4'": "e2", "b5'": "f_major", "b6'": "f2",
    "b1": "", "b2": "", "b3": "", "b4": "", "b5": "", "b6": "",
    //pull
    "b1''_": "", "b2''_": "", "b3''_": "d_major", "b4''_": "d2", "b5''_": "g_major", "b6''_": "g2",
    "b1'_": "", "b2'_":"", "b3'_": "a_minor", "b4'_": "a2", "b5'_": "f_major", "b6'_": "f2",
    "b1_": "", "b2_": "", "b3_": "", "b4_": "", "b5_": "", "b6_": ""
}

//############################
//    musical knowledge
//############################

var notes_with_ledgers = {
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