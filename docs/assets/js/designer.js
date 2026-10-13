/*
 * Word clock grid designer (design-your-own.md), in five steps: start grid,
 * letters, words, check, send.
 *
 * A design is a factory layout file (format 2, as provisioning/*.json in the
 * development repository) plus the letters of the grid. Word table rows:
 *   0       opening words ("IT IS")
 *   1-12    minute phrases for :00, :05, ... :55
 *   13-24   hours 12, 1, ... 11
 *   25-31   weekdays, Sunday ... Saturday
 *   32-36   extra minutes 0 to 4 (the minute dots; each row lists all LEDs
 *           lit for that many minutes)
 *   37-48   optional hour words for :00, used instead of rows 13-24
 * Each row lights at most 24 LEDs. LEDs snake through the grid: even rows run
 * left to right, odd rows right to left.
 */
(function () {
  'use strict';

  var SIZE = 11, LEDS = 121, MAX_PER_WORD = 24, ROWS = 49, STORAGE_KEY = 'word-clock-design';
  // Address the "Email your design" button writes to; empty until decided.
  var ORDER_EMAIL = '';
  // A minute dot, as in the DXF generator's grid (word-clock-dxf-generator).
  var DOT = '.';
  var APOSTROPHES = ["'", '’'];
  var STEPS = ['start', 'letters', 'words', 'check', 'send'];

  // Example grids, copied from provisioning/*-layout.json in the development
  // repository. Keep them in sync when those files change.
  var EXAMPLES = {
    english: {"name":"English","next_hour":[false,false,false,false,false,false,false,true,true,true,true,true],"letters":[["I","T","L","I","S","A","H","A","L","F","X"],["T","W","E","N","T","Y","E","F","I","V","E"],["Q","U","A","R","T","E","R","S","T","E","N"],["T","O","K","P","A","S","T","U","O","N","E"],["T","W","O","T","H","R","E","E","S","I","X"],["F","O","U","R","F","I","V","E","T","E","N"],["S","E","V","E","N","E","I","G","H","T","X"],["N","I","N","E","E","L","E","V","E","N","K"],["T","W","E","L","V","E","L","I","G","H","T"],["S","K","Y","E","X","O'","C","L","O","C","K"],["M","T","W","T","F","S","S",".",".",".","."]],"words":[[0,1,3,4],[99,100,101,102,103,104],[11,12,13,14,37,38,39,40],[30,31,32,37,38,39,40],[22,23,24,25,26,27,28,37,38,39,40],[16,17,18,19,20,21,37,38,39,40],[11,12,13,14,16,17,18,19,20,21,37,38,39,40],[6,7,8,9,37,38,39,40],[11,12,13,14,16,17,18,19,20,21,42,43],[16,17,18,19,20,21,42,43],[22,23,24,25,26,27,28,42,43],[30,31,32,42,43],[11,12,13,14,42,43],[88,89,90,91,92,93],[33,34,35],[44,45,46],[47,48,49,50,51],[62,63,64,65],[58,59,60,61],[52,53,54],[66,67,68,69,70],[71,72,73,74,75],[84,85,86,87],[55,56,57],[78,79,80,81,82,83],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    german: {"name":"Deutsch","next_hour":[false,false,false,false,false,true,true,true,true,true,true,true],"letters":[["E","S","A","I","S","T","M","F","Ü","N","F"],["Z","E","H","N","Z","W","A","N","Z","I","G"],["V","I","E","R","T","E","L","U","V","O","R"],["N","A","C","H","T","H","A","L","B","S","O"],["Z","W","E","I","N","S","D","R","E","I","K"],["V","I","E","R","S","K","Y","E","X","L","O"],["E","L","F","Ü","N","F","S","E","C","H","S"],["S","I","E","B","E","N","A","C","H","T","X"],["Z","E","H","N","E","U","N","B","A","L","D"],["Z","W","Ö","L","F","P","L","A","U","H","R"],["M","D","M","D","F","S","S",".",".",".","."]],"words":[[0,1,3,4,5],[99,100,101],[7,8,9,10,40,41,42,43],[18,19,20,21,40,41,42,43],[22,23,24,25,26,27,28,40,41,42,43],[11,12,13,14,15,16,17,40,41,42,43],[7,8,9,10,30,31,32,35,36,37,38],[35,36,37,38],[7,8,9,10,35,36,37,38,40,41,42,43],[11,12,13,14,15,16,17,30,31,32],[22,23,24,25,26,27,28,30,31,32],[18,19,20,21,30,31,32],[7,8,9,10,30,31,32],[105,106,107,108,109],[46,47,48,49],[44,45,46,47],[50,51,52,53],[62,63,64,65],[68,69,70,71],[72,73,74,75,76],[82,83,84,85,86,87],[78,79,80,81],[91,92,93,94],[88,89,90,91],[66,67,68],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[46,47,48],[],[],[],[],[],[],[],[],[],[]]},
    french: {"name":"Français","next_hour":[false,false,false,false,false,false,false,true,true,true,true,true],"letters":[["I","L","K","E","S","T","R","D","E","U","X"],["Q","U","A","T","R","E","T","R","O","I","S"],["N","E","U","F","U","N","E","S","E","P","T"],["H","U","I","T","S","I","X","C","I","N","Q"],["D","I","X","O","N","Z","E","B","L","E","U"],["D","O","U","Z","E","L","S","K","Y","E","X"],["H","E","U","R","E","S","P","E","T","I","T"],["M","O","I","N","S","X","L","E","D","I","X"],["Q","U","A","R","T","X","D","E","M","I","E"],["V","I","N","G","T","-","C","I","N","Q","X"],["L","M","M","J","V","S","D",".",".",".","."]],"words":[[0,1,3,4,5],[],[100,101,102,103],[77,78,79],[73,74,88,89,90,91,92],[105,106,107,108,109],[100,101,102,103,104,105,106,107,108,109],[73,74,94,95,96,97,98],[83,84,85,86,87,100,101,102,103,104,105,106,107,108,109],[83,84,85,86,87,105,106,107,108,109],[80,81,83,84,85,86,87,88,89,90,91,92],[77,78,79,83,84,85,86,87],[83,84,85,86,87,100,101,102,103],[61,62,63,64,65,66,67,68,69,70,71],[26,27,28,66,67,68,69,70],[7,8,9,10,66,67,68,69,70,71],[11,12,13,14,15,66,67,68,69,70,71],[16,17,18,19,20,21,66,67,68,69,70,71],[33,34,35,36,66,67,68,69,70,71],[37,38,39,66,67,68,69,70,71],[29,30,31,32,66,67,68,69,70,71],[40,41,42,43,66,67,68,69,70,71],[22,23,24,25,66,67,68,69,70,71],[44,45,46,66,67,68,69,70,71],[47,48,49,50,66,67,68,69,70,71],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    spanish: {"name":"Español","next_hour":[false,false,false,false,false,false,false,true,true,true,true,true],"letters":[["E","S","O","N","Z","L","A","S","U","N","A"],["D","O","S","T","R","E","S","E","I","S","A"],["C","U","A","T","R","O","C","I","N","C","O"],["S","I","E","T","E","O","C","H","O","L","U"],["N","U","E","V","E","D","I","E","Z","R","A"],["O","N","C","E","D","O","C","E","M","A","R"],["Y","M","E","N","O","S","M","E","D","I","A"],["V","E","I","N","T","I","C","I","N","C","O"],["V","E","I","N","T","E","N","D","I","E","Z"],["C","U","A","R","T","O","S","K","Y","E","X"],["L","M","X","J","V","S","D",".",".",".","."]],"words":[[],[],[66,77,78,79,80,81],[66,95,96,97,98],[66,104,105,106,107,108,109],[66,88,89,90,91,92,93],[66,77,78,79,80,81,82,83,84,85,86,87],[66,72,73,74,75,76],[67,68,69,70,71,77,78,79,80,81,82,83,84,85,86,87],[67,68,69,70,71,88,89,90,91,92,93],[67,68,69,70,71,104,105,106,107,108,109],[67,68,69,70,71,95,96,97,98],[67,68,69,70,71,77,78,79,80,81],[1,2,3,5,6,7,58,59,60,61],[0,1,5,6,8,9,10],[1,2,3,5,6,7,19,20,21],[1,2,3,5,6,7,15,16,17,18],[1,2,3,5,6,7,22,23,24,25,26,27],[1,2,3,5,6,7,28,29,30,31,32],[1,2,3,5,6,7,12,13,14,15],[1,2,3,5,6,7,39,40,41,42,43],[1,2,3,5,6,7,35,36,37,38],[1,2,3,5,6,7,44,45,46,47,48],[1,2,3,5,6,7,49,50,51,52],[1,2,3,5,6,7,62,63,64,65],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    portuguese: {"name":"Português","next_hour":[false,false,false,false,false,false,false,true,true,true,true,true],"letters":[["É","S","Ã","O","R","U","M","A","L","U","Z"],["D","U","A","S","T","R","Ê","S","E","I","S"],["Q","U","A","T","R","O","C","I","N","C","O"],["S","E","T","E","O","I","T","O","D","E","Z"],["N","O","V","E","O","N","Z","E","S","O","L"],["D","O","Z","E","K","E","M","E","N","O","S"],["U","M","A","Q","U","A","R","T","O","V","I"],["M","E","I","A","P","D","E","Z","A","M","O"],["V","I","N","T","E","A","S","K","Y","E","X"],["E","M","C","I","N","C","O","P","A","Z","X"],["S","T","Q","Q","S","S","D",".",".",".","."]],"words":[[],[],[60,103,104,105,106,107],[60,80,81,82],[60,66,67,69,70,71,72,73,74],[60,88,89,90,91,92],[60,88,89,90,91,92,103,104,105,106,107,109],[60,84,85,86,87],[55,56,57,58,59,88,89,90,91,92,103,104,105,106,107,109],[55,56,57,58,59,88,89,90,91,92],[55,56,57,58,59,66,67,69,70,71,72,73,74],[55,56,57,58,59,80,81,82],[55,56,57,58,59,103,104,105,106,107],[1,2,3,62,63,64,65],[0,5,6,7],[1,2,3,18,19,20,21],[1,2,3,14,15,16,17],[1,2,3,22,23,24,25,26,27],[1,2,3,28,29,30,31,32],[1,2,3,11,12,13,14],[1,2,3,40,41,42,43],[1,2,3,36,37,38,39],[1,2,3,44,45,46,47],[1,2,3,33,34,35],[1,2,3,48,49,50,51],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    italian: {"name":"Italiano","next_hour":[false,false,false,false,false,false,false,true,true,true,true,true],"letters":[["È","S","O","N","O","A","L","E","R","I","S"],["L'","U","N","A","D","U","E","T","R","E","K"],["Q","U","A","T","T","R","O","S","E","I","Y"],["O","T","T","O","C","I","N","Q","U","E","E"],["S","E","T","T","E","N","O","V","E","A","X"],["D","I","E","C","I","U","N","D","I","C","I"],["D","O","D","I","C","I","B","E","P","O","R"],["M","E","N","O","T","D","I","E","C","I","A"],["Q","U","A","R","T","O","M","E","Z","Z","A"],["V","E","N","T","I","C","I","N","Q","U","E"],["L","M","M","G","V","S","D",".",".",".","."]],"words":[[],[],[73,99,100,101,102,103,104],[73,78,79,80,81,82],[73,88,89,90,91,92,93],[73,105,106,107,108,109],[73,99,100,101,102,103,104,105,106,107,108,109],[73,94,95,96,97,98],[84,85,86,87,99,100,101,102,103,104,105,106,107,108,109],[84,85,86,87,105,106,107,108,109],[84,85,86,87,88,89,90,91,92,93],[78,79,80,81,82,84,85,86,87],[84,85,86,87,99,100,101,102,103,104],[1,2,3,4,6,7,66,67,68,69,70,71],[0,18,19,20,21],[1,2,3,4,6,7,15,16,17],[1,2,3,4,6,7,12,13,14],[1,2,3,4,6,7,22,23,24,25,26,27,28],[1,2,3,4,6,7,34,35,36,37,38,39],[1,2,3,4,6,7,29,30,31],[1,2,3,4,6,7,44,45,46,47,48],[1,2,3,4,6,7,40,41,42,43],[1,2,3,4,6,7,49,50,51,52],[1,2,3,4,6,7,61,62,63,64,65],[1,2,3,4,6,7,55,56,57,58,59,60],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    dutch: {"name":"Nederlands","next_hour":[false,false,false,false,true,true,true,true,true,true,true,true],"letters":[["H","E","T","E","I","S","U","V","I","J","F"],["T","I","E","N","A","S","N","V","O","O","R"],["O","V","E","R","B","K","K","W","A","R","T"],["H","A","L","F","Y","Y","U","O","V","E","R"],["V","O","O","R","L","E","I","É","É","N","D"],["T","W","E","E","L","X","K","D","R","I","E"],["V","I","E","R","V","I","J","F","Z","E","S"],["Z","E","V","E","N","C","N","E","G","E","N"],["A","C","H","T","T","I","E","N","E","L","F"],["T","W","A","A","L","F","P","M","U","U","R"],["M","D","W","D","V","Z","Z",".",".",".","."]],"words":[[0,1,2,4,5],[99,100,101],[7,8,9,10,22,23,24,25],[18,19,20,21,22,23,24,25],[28,29,30,31,32,33,34,35,36],[11,12,13,14,18,19,20,21,40,41,42,43],[7,8,9,10,11,12,13,14,40,41,42,43],[40,41,42,43],[7,8,9,10,22,23,24,25,40,41,42,43],[18,19,20,21,22,23,24,25,40,41,42,43],[28,29,30,31,32,44,45,46,47],[11,12,13,14,18,19,20,21],[7,8,9,10,11,12,13,14],[104,105,106,107,108,109],[51,52,53],[62,63,64,65],[55,56,57,58],[66,67,68,69],[70,71,72,73],[74,75,76],[83,84,85,86,87],[88,89,90,91],[77,78,79,80,81],[92,93,94,95],[96,97,98],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    frisian: {"name":"Frysk","next_hour":[false,false,false,false,true,true,true,true,true,true,true,true],"letters":[["I","T","K","I","S","A","T","S","I","E","N"],["F","I","I","F","K","E","R","T","I","E","R"],["F","O","A","R","S","O","E","R","D","A","N"],["H","E","A","L","W","E","I","K","T","W","A"],["I","E","N","T","R","I","J","E","S","Â","N"],["F","J","O","U","W","E","R","F","I","I","F"],["N","J","O","G","G","E","N","A","L","V","E"],["S","E","I","S","A","C","H","T","W","Y","N"],["T","S","I","E","N","T","O","L","V","E","X"],["S","K","Y","E","X","M","O","E","R","E","N"],["M","T","W","T","F","S","S",".",".",".","."]],"words":[[0,1,3,4],[100,101,102,103],[18,19,20,21,27,28,29],[6,7,8,9,10,27,28,29],[11,12,13,14,15,16,17,27,28,29],[6,7,8,9,10,22,23,24,25,37,38,39,40,41,42,43],[18,19,20,21,22,23,24,25,37,38,39,40,41,42,43],[37,38,39,40,41,42,43],[18,19,20,21,27,28,29,37,38,39,40,41,42,43],[6,7,8,9,10,27,28,29,37,38,39,40,41,42,43],[11,12,13,14,15,16,17,22,23,24,25],[6,7,8,9,10,22,23,24,25],[18,19,20,21,22,23,24,25],[93,94,95,96,97],[44,45,46],[33,34,35],[47,48,49,50,51],[59,60,61,62,63,64,65],[55,56,57,58],[84,85,86,87],[52,53,54],[80,81,82,83],[66,67,68,69,70,71,72],[88,89,90,91,92],[73,74,75,76],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    swedish: {"name":"Svenska","next_hour":[false,false,false,false,false,true,true,true,true,true,true,true],"letters":[["K","L","O","C","K","A","N","T","Ä","R","K"],["F","E","M","T","I","O","K","V","A","R","T"],["T","J","U","G","O","L","Ö","V","E","R","I"],["H","A","L","V","X","E","T","T","T","V","Å"],["T","R","E","F","Y","R","A","F","E","M","S"],["S","E","X","S","J","U","Å","T","T","A","K"],["N","I","O","T","I","O","E","L","V","A","N"],["T","O","L","V","L","S","K","Y","E","X","R"],["H","A","E","N","F","I","N","D","A","G","O"],["M","E","D","K","Ä","R","L","E","K","X","Z"],["M","T","O","T","F","L","S",".",".",".","."]],"words":[[0,1,2,3,4,5,6,8,9],[],[19,20,21,28,29,30,31],[16,17,18,28,29,30,31],[11,12,13,14,15,28,29,30,31],[22,23,24,25,26,28,29,30,31],[19,20,21,32,40,41,42,43],[40,41,42,43],[19,20,21,28,29,30,31,40,41,42,43],[22,23,24,25,26,32],[11,12,13,14,15,32],[16,17,18,32],[19,20,21,32],[84,85,86,87],[36,37,38],[33,34,35],[44,45,46],[47,48,49,50],[51,52,53],[63,64,65],[60,61,62],[56,57,58,59],[66,67,68],[69,70,71],[72,73,74,75],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    norwegian: {"name":"Norsk","next_hour":[false,false,false,false,true,true,true,true,true,true,true,true],"letters":[["K","L","O","K","K","E","N","S","E","R","A"],["F","E","M","T","I","K","V","A","R","T","A"],["O","V","E","R","K","P","Å","L","Y","S","T"],["H","A","L","V","S","E","T","T","T","R","E"],["T","O","F","I","R","E","F","E","M","A","B"],["S","E","K","S","Å","T","T","E","N","I","K"],["S","J","U","T","I","E","L","L","E","V","E"],["T","O","L","V","A","S","K","Y","E","X","B"],["H","A","E","N","G","O","D","D","A","G","K"],["L","E","V","L","I","V","E","T","N","Å","S"],["M","T","O","T","F","L","S",".",".",".","."]],"words":[[0,1,2,3,4,5,6,8,9],[],[19,20,21,22,23,24,25],[17,18,22,23,24,25],[12,13,14,15,16,22,23,24,25],[17,18,27,28,40,41,42,43],[19,20,21,27,28,40,41,42,43],[40,41,42,43],[19,20,21,22,23,24,25,40,41,42,43],[17,18,22,23,24,25,40,41,42,43],[12,13,14,15,16,27,28],[17,18,27,28],[19,20,21,27,28],[84,85,86,87],[36,37,38],[44,45],[33,34,35],[46,47,48,49],[50,51,52],[62,63,64,65],[66,67,68],[58,59,60,61],[56,57],[69,70],[71,72,73,74,75,76],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    danish: {"name":"Dansk","next_hour":[false,false,false,false,false,true,true,true,true,true,true,true],"letters":[["K","L","O","K","K","E","N","Z","E","R","U"],["T","Y","V","E","K","V","A","R","T","T","I"],["F","E","M","B","O","V","E","R","T","I","K"],["H","A","L","V","K","E","T","T","O","N","I"],["T","R","E","F","I","R","E","F","E","M","S"],["S","E","K","S","S","Y","V","O","T","T","E"],["T","I","E","L","L","E","V","E","A","B","C"],["T","O","L","V","K","S","K","Y","E","X","Z"],["H","A","V","E","N","G","O","D","D","A","G"],["T","A","K","F","O","R","I","D","A","G","X"],["M","T","O","T","F","L","S",".",".",".","."]],"words":[[0,1,2,3,4,5,6,8,9],[],[22,23,24,26,27,28,29],[11,12,26,27,28,29],[13,14,15,16,17,26,27,28,29],[18,19,20,21,26,27,28,29],[22,23,24,31,40,41,42,43],[40,41,42,43],[22,23,24,26,27,28,29,40,41,42,43],[18,19,20,21,31],[13,14,15,16,17,31],[11,12,31],[22,23,24,31],[84,85,86,87],[37,38],[35,36],[44,45,46],[47,48,49,50],[51,52,53],[62,63,64,65],[59,60,61],[55,56,57,58],[33,34],[66,67],[68,69,70,71,72,73],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    korean: {"name":"한국어","next_hour":[false,false,false,false,false,false,false,false,false,false,false,false],"letters":[["지","금","은","우","리","의","소","중","한","시","간"],["열","한","두","세","네","다","섯","여","섯","일","곱"],["오","늘","도","꼭","좋","은","하","루","되","세","요"],["여","덟","아","홉","시","함","께","라","서","좋","아"],["사","랑","하","는","가","족","과","함","께","해","요"],["이","삼","사","오","십","오","분","행","복","하","게"],["스","카","이","엑","스","단","어","시","계","예","요"],["정","각","입","니","다","고","마","워","요","친","구"],["우","리","꿈","을","향","해","오","늘","도","힘","내"],["당","신","과","의","모","든","순","간","이","선","물"],["월","화","수","목","금","토","일",".",".",".","."]],"words":[[0,1,2],[83,84,85,86,87],[59,60,83,84,85],[59,61,83,84,85],[59,60,61,83,84,85],[59,61,65,83,84,85],[59,60,61,65,83,84,85],[59,61,64,83,84,85],[59,60,61,64,83,84,85],[59,61,63,83,84,85],[59,60,61,63,83,84,85],[59,61,62,83,84,85],[59,60,61,62,83,84,85],[19,21,39],[20,39],[19,39],[18,39],[17,39],[15,16,39],[13,14,39],[11,12,39],[39,42,43],[39,40,41],[21,39],[20,21,39],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    japanese: {"name":"日本語","next_hour":[false,false,false,false,false,false,false,false,false,false,false,false],"letters":[["今","は","い","つ","も","あ","り","が","と","う","ね"],["十","一","二","三","四","五","六","七","八","九","時"],["今","日","も","良","い","一","日","を","ど","う","ぞ"],["二","三","四","五","十","五","分","ち","ょ","う","ど"],["ス","カ","イ","エ","ッ","ク","ス","の","と","け","い"],["で","す","家","族","と","過","ご","す","時","間","を"],["大","切","な","人","と","ず","っ","と","一","緒","に"],["笑","顔","あ","ふ","れ","る","毎","日","に","感","謝"],["夢","に","向","か","っ","て","今","日","も","一","歩"],["二","人","の","時","間","は","い","つ","も","宝","物"],["月","火","水","木","金","土","日",".",".",".","."]],"words":[[0,1],[33,34,35,36,64,65],[37,38,64,65],[37,39,64,65],[37,38,39,64,65],[37,39,43,64,65],[37,38,39,43,64,65],[37,39,42,64,65],[37,38,39,42,64,65],[37,39,41,64,65],[37,38,39,41,64,65],[37,39,40,64,65],[37,38,39,40,64,65],[11,19,21],[11,20],[11,19],[11,18],[11,17],[11,16],[11,15],[11,14],[11,13],[11,12],[11,21],[11,20,21],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]},
    chinese: {"name":"中文","next_hour":[false,false,false,false,false,false,false,false,false,false,false,false],"letters":[["现","在","是","我","们","最","美","好","的","时","光"],["十","一","二","三","四","五","六","七","八","九","两"],["点","整","祝","你","每","天","都","开","心","快","乐"],["零","二","三","四","五","十","五","分","很","幸","福"],["来","自","S","K","Y","E","X","的","文","字","钟"],["愿","你","的","每","一","天","都","充","满","阳","光"],["家","人","的","陪","伴","是","最","好","的","礼","物"],["珍","惜","和","你","在","一","起","的","每","一","刻"],["每","一","天","都","是","一","个","新","的","开","始"],["谢","谢","你","一","直","都","陪","在","我","身","边"],["一","二","三","四","五","六","日",".",".",".","."]],"words":[[0,1,2],[23],[36,37,43],[36,38],[36,37,38],[36,38,42],[36,37,38,42],[36,38,41],[36,37,38,41],[36,38,40],[36,37,38,40],[36,38,39],[36,37,38,39],[19,21,22],[20,22],[11,22],[18,22],[17,22],[16,22],[15,22],[14,22],[13,22],[12,22],[21,22],[20,21,22],[116],[110],[111],[112],[113],[114],[115],[],[117],[117,118],[117,118,119],[117,118,119,120],[],[],[],[],[],[],[],[],[],[],[],[]]}
  };

  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MINUTE_NAMES = ['on the hour', '5 past', '10 past', 'quarter past', '20 past', '25 past',
    'half past', '25 to', '20 to', 'quarter to', '10 to', '5 to'];

  function led(row, col) { return row % 2 === 0 ? row * SIZE + col : row * SIZE + (SIZE - 1 - col); }
  function pos(index) {
    var row = Math.floor(index / SIZE), c = index % SIZE;
    return { row: row, col: row % 2 === 0 ? c : SIZE - 1 - c };
  }
  // One square holds one character, or a letter with an apostrophe ("O'"
  // in O'CLOCK), like the DXF generator's tokens. Older designs used a
  // middle dot for the minute dots.
  function cleanLetter(c) {
    if (typeof c !== 'string') return '';
    c = c.replace(/·/g, DOT).replace(/’/g, "'");
    var chars = Array.from(c);
    return chars.length > 1 && chars[1] === "'" ? chars[0] + "'" : (chars[0] || '');
  }
  function clock(h, m) { return h + ':' + String(m).padStart(2, '0'); }

  // Words step: phrases in groups. {group, label, hint, row, phrase (minute
  // phrases), optional, dots}
  var PHRASES = [{ group: 'Opening words (optional)', label: 'Opening words', hint: 'e.g. IT IS', row: 0, optional: true }];
  for (var m = 0; m < 12; m++) {
    PHRASES.push({ group: 'Minutes', label: 'x:' + String(m * 5).padStart(2, '0'), hint: MINUTE_NAMES[m],
      row: 1 + m, phrase: m, optional: m === 0 });
    if (m === 0) PHRASES[PHRASES.length - 1].hint = "on the hour, e.g. O'CLOCK (may stay empty)";
  }
  for (var h = 1; h <= 12; h++) {
    PHRASES.push({ group: 'Hours', label: h + " o'clock", row: 13 + (h % 12) });
  }
  for (h = 1; h <= 12; h++) {
    PHRASES.push({ group: 'Hours on the full hour (optional)', label: h + " o'clock at " + clock(h, 0),
      hint: 'only if different, like German EIN UHR', row: 37 + (h % 12), optional: true });
  }
  [1, 2, 3, 4, 5, 6, 0].forEach(function (d) { PHRASES.push({ group: 'Days (optional)', label: DAYS[d], row: 25 + d, optional: true }); });
  for (var n = 1; n <= 4; n++) {
    PHRASES.push({ group: 'Minute dots (optional)', label: n + ' extra minute' + (n > 1 ? 's' : ''),
      hint: 'e.g. ' + clock(4, 20 + n), row: 32 + n, dots: true, optional: true });
  }

  // Quick choices for the next-hour marks: first minute phrase that names the
  // next hour.
  var RULES = { '15': 3, '20': 4, '25': 5, '35': 7, never: 12 };

  function blankRows() { var r = []; for (var i = 0; i < ROWS; i++) r.push([]); return r; }
  function nextHourFrom(first) { var a = []; for (var i = 0; i < 12; i++) a.push(i >= first); return a; }

  function emptyDesign() {
    var letters = [];
    for (var r = 0; r < SIZE; r++) letters.push(new Array(SIZE).fill(''));
    return { name: '', customer: '', email: '', order: '', nextHour: nextHourFrom(RULES['35']), letters: letters, words: blankRows() };
  }

  function exampleDesign(key) {
    var d = importDesign(JSON.parse(JSON.stringify(EXAMPLES[key])));
    d.name = '';
    return d;
  }

  /* ---------- import and export ---------- */

  // Accepts this designer's files: format 2, and format 1 from before the
  // 24-letter limit (37 rows of 12, with an optional next_hour_from minute).
  function importDesign(data) {
    if (!data || !Array.isArray(data.words) || (data.words.length !== ROWS && data.words.length !== 37)) {
      throw new Error('This is not a word clock design file.');
    }
    var d = emptyDesign();
    d.name = typeof data.name === 'string' ? data.name : '';
    d.customer = typeof data.customer_name === 'string' ? data.customer_name : '';
    d.order = typeof data.order_number === 'string' ? data.order_number : '';
    d.email = typeof data.customer_email === 'string' ? data.customer_email : '';
    if (Array.isArray(data.next_hour) && data.next_hour.length === 12) {
      d.nextHour = data.next_hour.map(Boolean);
    } else {
      var from = data.next_hour_from === undefined ? 20 : data.next_hour_from;
      d.nextHour = nextHourFrom(from === null ? 12 : Math.ceil(from / 5));
    }
    if (Array.isArray(data.letters) && data.letters.length === SIZE) {
      d.letters = data.letters.map(function (row) {
        var a = (typeof row === 'string' ? Array.from(row) : row).map(cleanLetter);
        while (a.length < SIZE) a.push('');
        return a.slice(0, SIZE);
      });
    }
    data.words.forEach(function (w, r) {
      if (r < ROWS) d.words[r] = w.filter(function (l) { return l >= 0 && l < LEDS; }).slice(0, MAX_PER_WORD);
    });
    return d;
  }

  function exportDesign() {
    var rows = design.words.map(function (w) { return w.slice().sort(function (a, b) { return a - b; }); });
    var anyDay = rows.slice(25, 32).some(function (w) { return w.length; });
    var anyMinutes = rows.slice(33, 37).some(function (w) { return w.length; });
    return {
      version: 2,
      hardware_revision: 1,
      indications: { it_is: rows[0].length > 0, minutes: anyMinutes, weekdays: anyDay },
      next_hour: design.nextHour.slice(),
      words: rows,
      name: design.name,
      customer_name: design.customer,
      customer_email: design.email,
      order_number: design.order,
      // Squares lit as minute dots without a letter of their own get a ".",
      // so the DXF generator engraves a dot there.
      letters: design.letters.map(function (row, r) {
        return row.map(function (c, col) { return c || (isMinuteDot(led(r, col)) ? DOT : ''); });
      })
    };
  }

  // The download in the layout of provisioning/*-layout.json: one line per
  // setting, word row and letter row.
  function formatDesign(d) {
    function list(a) { return '[' + a.map(function (v) { return JSON.stringify(v); }).join(', ') + ']'; }
    function rows(a) { return '[\n' + a.map(function (r) { return '    ' + list(r); }).join(',\n') + '\n  ]'; }
    var i = d.indications;
    return '{\n' + [
      '"version": ' + d.version,
      '"hardware_revision": ' + d.hardware_revision,
      '"indications": {"it_is": ' + i.it_is + ', "minutes": ' + i.minutes + ', "weekdays": ' + i.weekdays + '}',
      '"next_hour": ' + list(d.next_hour),
      '"words": ' + rows(d.words),
      '"name": ' + JSON.stringify(d.name)
    ].concat(d.customer_name ? ['"customer_name": ' + JSON.stringify(d.customer_name)] : [],
      d.customer_email ? ['"customer_email": ' + JSON.stringify(d.customer_email)] : [],
      d.order_number ? ['"order_number": ' + JSON.stringify(d.order_number)] : [], [
      '"letters": ' + rows(d.letters)
    ]).map(function (line) { return '  ' + line; }).join(',\n') + '\n}\n';
  }

  function isMinuteDot(l) {
    return design.words.slice(33, 37).some(function (w) { return w.indexOf(l) !== -1; });
  }

  /* ---------- storage (convenience only; the download is the real copy) ---------- */
  function save() {
    edited = true;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(exportDesign())); } catch (e) { /* private mode */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? importDesign(JSON.parse(raw)) : null;
    } catch (e) { return null; }
  }

  var lastExample = '';
  var stored = load();
  var design = stored || exampleDesign('english');
  var edited = !!stored;
  var step = 'start', selectedPhrase = null, selectedCell = null, currentDay = 3;
  var root, gridEl;

  /* ---------- clock logic (same rules as the firmware) ---------- */
  function rowsFor(hour, minute) {
    var phrase = Math.floor(minute / 5);
    var shown = (hour + (design.nextHour[phrase] ? 1 : 0)) % 12;
    var hourRow = phrase === 0 && design.words[37 + shown].length ? 37 + shown : 13 + shown;
    return [0, 1 + phrase, hourRow];
  }

  function litLeds(hour, minute, day) {
    var lit = new Set();
    rowsFor(hour, minute).concat([25 + day, 32 + (minute % 5)]).forEach(function (r) {
      design.words[r].forEach(function (l) { lit.add(l); });
    });
    return lit;
  }

  function sortedByPosition(leds) {
    return leds.slice().sort(function (a, b) {
      var pa = pos(a), pb = pos(b);
      return pa.row - pb.row || pa.col - pb.col;
    });
  }

  // Letters in reading order, with a space wherever they aren't next to each
  // other.
  function wordText(leds) {
    var text = '', prev = null;
    sortedByPosition(leds).forEach(function (l) {
      var p = pos(l);
      if (prev && (p.row !== prev.row || p.col !== prev.col + 1)) text += ' ';
      text += design.letters[p.row][p.col] || '?';
      prev = p;
    });
    return text;
  }

  function timeText(hour, minute) {
    var leds = [];
    rowsFor(hour, minute).forEach(function (r) { leds = leds.concat(design.words[r]); });
    var text = wordText(leds.filter(function (l, i) { return leds.indexOf(l) === i; }));
    var dots = minute % 5;
    return (text || '(no words lit)') + (dots ? '  + ' + dots + ' dot' + (dots > 1 ? 's' : '') : '');
  }

  /* ---------- rendering ---------- */
  function $(sel) { return root.querySelector(sel); }

  function previewTime() {
    var t = ($('#wcd-time').value || '09:47').split(':');
    return { hour: parseInt(t[0], 10) || 0, minute: parseInt(t[1], 10) || 0 };
  }

  function render() {
    var lit = new Set(), inPhrase = new Set(), used = new Set();
    if (step === 'start') lit = litLeds(9, 47, 3);
    if (step === 'check') {
      var t = previewTime();
      lit = litLeds(t.hour, t.minute, currentDay);
    }
    if (step === 'words') {
      design.words.forEach(function (w) { w.forEach(function (l) { used.add(l); }); });
      if (selectedPhrase !== null) design.words[selectedPhrase].forEach(function (l) { inPhrase.add(l); });
    }
    var minuteLeds = new Set();
    design.words.slice(33, 37).forEach(function (w) { w.forEach(function (l) { minuteLeds.add(l); }); });
    gridEl.querySelectorAll('button').forEach(function (cell) {
      var l = parseInt(cell.dataset.led, 10), p = pos(l);
      var ch = design.letters[p.row][p.col] || (minuteLeds.has(l) ? DOT : '');
      // A "." is drawn as a round dot centred in its square (CSS), not on
      // the text baseline.
      cell.textContent = ch === DOT ? '' : ch;
      cell.className = 'wcd-cell' + (ch === DOT ? ' is-dot' : '');
      if (lit.has(l)) cell.classList.add('is-lit');
      if (step === 'words') {
        if (inPhrase.has(l)) cell.classList.add('is-selected');
        else if (used.has(l)) cell.classList.add('is-used');
      }
      if (step === 'letters' && selectedCell === l) cell.classList.add('is-selected');
    });
    if (step === 'start') $('#wcd-start-shows').textContent = timeText(9, 47);
    if (step === 'words') renderPhraseList();
    if (step === 'check') { $('#wcd-phrase').textContent = timeText(previewTime().hour, previewTime().minute); renderCheck('#wcd-check'); }
    if (step === 'send') renderCheck('#wcd-send-check');
  }

  function renderPhraseList() {
    var list = $('#wcd-phrases');
    list.innerHTML = '';
    var group = null;
    PHRASES.forEach(function (ph) {
      if (ph.group !== group) {
        group = ph.group;
        var heading = document.createElement('div');
        heading.className = 'wcd-group';
        heading.textContent = group;
        list.appendChild(heading);
      }
      var leds = design.words[ph.row];
      var item = document.createElement('div');
      item.className = 'wcd-phrase' + (ph.row === selectedPhrase ? ' is-active' : '') + (ph.optional ? ' is-optional' : '');
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wcd-phrase-main';
      b.innerHTML = '<span class="wcd-phrase-label"></span><span class="wcd-phrase-count"></span><span class="wcd-phrase-text"></span>';
      b.children[0].textContent = ph.label + (ph.hint ? ' · ' + ph.hint : '');
      b.children[1].textContent = leds.length + '/' + MAX_PER_WORD;
      b.children[2].textContent = ph.dots ? (leds.length ? leds.length + ' lit' : '—')
        : wordText(leds) || (ph.optional ? 'empty' : '—');
      b.addEventListener('click', function () { selectedPhrase = ph.row; render(); });
      item.appendChild(b);
      if (ph.phrase !== undefined && ph.phrase > 0) {
        var label = document.createElement('label');
        label.className = 'wcd-next-hour';
        var box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = design.nextHour[ph.phrase];
        box.addEventListener('change', function () {
          design.nextHour[ph.phrase] = box.checked;
          syncRule();
          save();
          render();
        });
        label.appendChild(box);
        label.appendChild(document.createTextNode(' next hour'));
        label.title = 'Tick when this phrase names the coming hour, like "twenty-five to FIVE" at 4:35';
        item.appendChild(label);
      }
      list.appendChild(item);
    });
    var current = PHRASES.filter(function (p) { return p.row === selectedPhrase; })[0];
    $('#wcd-words-hint').textContent = current
      ? 'Now click the letters for "' + current.label + '" in the grid. Click a letter again to remove it.'
      : 'Choose a phrase from the list, then click its letters in the grid.';
  }

  function syncRule() {
    var match = 'custom';
    Object.keys(RULES).forEach(function (k) {
      if (nextHourFrom(RULES[k]).every(function (v, i) { return i === 0 || v === design.nextHour[i]; })) match = k;
    });
    $('#wcd-rule').value = match;
  }

  function problems() {
    var list = [];
    PHRASES.forEach(function (ph) {
      if (!ph.optional && ph.row >= 1 && ph.row <= 24 && !design.words[ph.row].length) list.push(ph.label + ' has no letters yet.');
    });
    var dotRows = design.words.slice(33, 37).filter(function (w) { return w.length; }).length;
    if (dotRows && dotRows < 4) list.push('Only ' + dotRows + ' of the 4 minute-dot phrases have dots (fill in all 4, or none).');
    var dayRows = design.words.slice(25, 32).filter(function (w) { return w.length; }).length;
    if (dayRows && dayRows < 7) list.push('Only ' + dayRows + ' of the 7 days have letters (fill in all 7, or none).');
    return list;
  }

  function renderCheck(sel) {
    var found = problems(), box = $(sel);
    box.innerHTML = '';
    if (!found.length) {
      var extras = [['opening words', design.words[0].length], ['weekdays', design.words.slice(25, 32).some(function (w) { return w.length; })],
        ['minute dots', design.words.slice(33, 37).some(function (w) { return w.length; })]];
      var without = extras.filter(function (e) { return !e[1]; }).map(function (e) { return e[0]; });
      box.textContent = 'Your design is complete.' + (without.length ? ' It has no ' + without.join(' and ') + ' (optional).' : '');
      box.className = 'wcd-check is-ok';
      return;
    }
    box.className = 'wcd-check is-warning';
    box.appendChild(document.createTextNode('Still to do (step 3, Words):'));
    var ul = document.createElement('ul');
    found.forEach(function (p) { var li = document.createElement('li'); li.textContent = p; ul.appendChild(li); });
    box.appendChild(ul);
  }

  /* ---------- interaction ---------- */
  function onCell(l) {
    var p = pos(l);
    if (step === 'letters') {
      selectedCell = l;
      var input = $('#wcd-letter');
      input.value = design.letters[p.row][p.col];
      $('#wcd-letter-pos').textContent = 'Row ' + (p.row + 1) + ', column ' + (p.col + 1);
      input.focus();
      input.select();
    } else if (step === 'words') {
      if (selectedPhrase === null) { flash('First choose a phrase from the list.'); return; }
      var w = design.words[selectedPhrase], i = w.indexOf(l);
      if (i !== -1) w.splice(i, 1);
      else if (w.length >= MAX_PER_WORD) { flash('A phrase can light at most ' + MAX_PER_WORD + ' letters.'); return; }
      else w.push(l);
      save();
    }
    render();
  }

  function moveCell(delta) {
    var p = pos(selectedCell), index = p.row * SIZE + p.col + delta;
    if (index < 0 || index >= LEDS) return;
    onCell(led(Math.floor(index / SIZE), index % SIZE));
  }

  function flash(text) {
    var el = $('#wcd-flash');
    el.textContent = text;
    clearTimeout(flash.timer);
    flash.timer = setTimeout(function () { el.textContent = ''; }, 4000);
  }

  function setStep(next) {
    step = next;
    var index = STEPS.indexOf(next);
    root.querySelectorAll('.wcd-step').forEach(function (s) {
      var i = STEPS.indexOf(s.dataset.step);
      s.setAttribute('aria-current', i === index ? 'step' : 'false');
      s.classList.toggle('is-done', i < index);
    });
    root.querySelectorAll('.wcd-panel').forEach(function (p) { p.hidden = p.dataset.step !== next; });
    gridEl.dataset.mode = next;
    if (next === 'send') { $('#wcd-confirm').checked = false; $('#wcd-attach-now').hidden = true; updateSendButtons(); }
    render();
  }

  function slug(text) { return text.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase(); }

  function fileName() {
    return (design.order ? 'order-' + slug(design.order) + '-' : '') + 'word-clock-design.json';
  }

  // Download and email only with the customer's details, and once the
  // customer confirms the design is final.
  function validEmail(text) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text); }

  function missingDetail() {
    if (!design.customer) return ['#wcd-customer', 'Fill in your name first.'];
    if (!validEmail(design.email)) return ['#wcd-email-address', 'Fill in a valid email address first.'];
    if (!design.order) return ['#wcd-order', 'Fill in your order number first.'];
    return null;
  }

  function confirmed() {
    var missing = missingDetail();
    if (missing) { flash(missing[1]); $(missing[0]).focus(); return false; }
    if ($('#wcd-confirm').checked) return true;
    flash('First tick the box to confirm your design is final.');
    return false;
  }

  function updateSendButtons() {
    var ok = !missingDetail() && $('#wcd-confirm').checked;
    $('#wcd-email').disabled = !ok;
    $('#wcd-download').disabled = !ok;
  }

  function download() {
    var blob = new Blob([formatDesign(exportDesign())], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Keep the file available long enough for slow downloads.
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 60000);
  }

  // Open the email through a link of its own, after the download has started:
  // navigating the page to a mailto: link right away cancels the download in
  // some browsers (Safari).
  function openEmail(href) {
    var a = document.createElement('a');
    a.href = href;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Browsers can't attach files to an email, so download first, then open an
  // email that asks to attach it.
  function email() {
    if (!confirmed()) return;
    download();
    var subject = 'Word clock design' + (design.order ? ', order ' + design.order : '') +
      (design.customer ? ', ' + design.customer : '');
    var body = 'Hello,\n\nAttached is my word clock design.\n\n' +
      (design.customer ? 'Name: ' + design.customer + '\n' : '') +
      (design.email ? 'Email: ' + design.email + '\n' : '') +
      (design.order ? 'Order number: ' + design.order + '\n' : '') +
      'File: ' + fileName() + '\n\n' +
      'I have checked the design and understand it can\'t be changed after sending.\n\n' +
      '(Please attach the file you just downloaded before sending this email.)\n';
    var href = 'mailto:' + encodeURIComponent(ORDER_EMAIL) + '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    setTimeout(function () { openEmail(href); }, 1000);
    var note = $('#wcd-attach-now');
    note.textContent = '';
    var strong = document.createElement('strong');
    strong.textContent = 'Now attach ' + fileName() + ' to the email.';
    note.appendChild(strong);
    note.appendChild(document.createTextNode(' It was just saved to your Downloads folder. ' +
      'Without it we can\'t make your clock. '));
    var again = document.createElement('a');
    again.href = href;
    again.textContent = 'Open the email again';
    note.appendChild(again);
    note.hidden = false;
  }

  // Picture of the clock face at the time and day chosen in step 4.
  function downloadPicture() {
    var SIZE_PX = 880, PAD = 20, GAP = 4;
    var cell = (SIZE_PX - 2 * PAD - (SIZE - 1) * GAP) / SIZE;
    var t = previewTime(), lit = litLeds(t.hour, t.minute, currentDay);
    var minuteLeds = new Set();
    design.words.slice(33, 37).forEach(function (w) { w.forEach(function (l) { minuteLeds.add(l); }); });
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE_PX;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0b0b0d';
    ctx.fillRect(0, 0, SIZE_PX, SIZE_PX);
    var fontSize = Math.round(cell * 0.42);
    ctx.font = '600 ' + fontSize + 'px Inter, system-ui, -apple-system, "Hiragino Sans", "Apple SD Gothic Neo", "PingFang SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var l = led(r, c), on = lit.has(l);
        var ch = design.letters[r][c] || (minuteLeds.has(l) ? DOT : '');
        var x = PAD + c * (cell + GAP) + cell / 2, y = PAD + r * (cell + GAP) + cell / 2;
        ctx.fillStyle = on ? '#ffffff' : '#3a3b40';
        ctx.shadowColor = on ? 'rgba(255, 255, 255, 0.7)' : 'transparent';
        ctx.shadowBlur = on ? 16 : 0;
        if (ch === DOT) {
          ctx.beginPath();
          ctx.arc(x, y, fontSize * 0.15, 0, 2 * Math.PI);
          ctx.fill();
        } else if (ch) {
          ctx.fillText(ch, x, y);
        }
      }
    }
    var a = document.createElement('a');
    a.href = canvas.toDataURL('image/jpeg', 0.92);
    a.download = 'example-' + (lastExample || 'design') + '-' + String(t.hour).padStart(2, '0') + String(t.minute).padStart(2, '0') + '.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function replaceDesign(next) {
    // Keep the customer's name and order number when switching grids.
    next.customer = next.customer || design.customer;
    next.order = next.order || design.order;
    next.email = next.email || design.email;
    design = next;
    save();
    edited = false;
    selectedPhrase = selectedCell = null;
    syncRule();
    render();
  }

  /* ---------- setup ---------- */
  function init() {
    root = document.getElementById('wcd');
    if (!root) return;
    gridEl = $('#wcd-grid');
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.dataset.led = led(r, c);
        b.setAttribute('aria-label', 'Row ' + (r + 1) + ', column ' + (c + 1));
        b.addEventListener('click', function (e) { onCell(parseInt(e.currentTarget.dataset.led, 10)); });
        gridEl.appendChild(b);
      }
    }
    root.querySelectorAll('.wcd-step').forEach(function (s) {
      s.addEventListener('click', function () { setStep(s.dataset.step); });
    });
    root.querySelectorAll('[data-go]').forEach(function (b) {
      b.addEventListener('click', function () {
        setStep(STEPS[STEPS.indexOf(step) + (b.dataset.go === 'next' ? 1 : -1)]);
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Step 1: start grid
    root.querySelectorAll('[data-example]').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.dataset.example;
        if (edited && !confirm('Start from this grid? Your current design is replaced.')) return;
        replaceDesign(key === 'empty' ? emptyDesign() : exampleDesign(key));
        lastExample = key;
        flash(key === 'empty' ? 'Empty grid loaded. Continue with step 2.' : 'Grid loaded. Continue with step 2, or change it as you like.');
      });
    });
    $('#wcd-open').addEventListener('click', function () { $('#wcd-file').click(); });
    $('#wcd-file').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      file.text().then(function (text) {
        replaceDesign(importDesign(JSON.parse(text)));
        edited = true;
        flash('Design opened.');
      }).catch(function (err) { flash(err.message); });
      e.target.value = '';
    });

    // Step 2: letters
    var input = $('#wcd-letter');
    input.addEventListener('input', function () {
      if (selectedCell === null) return;
      var p = pos(selectedCell);
      var value = input.value.toUpperCase();
      var chars = Array.from(value);
      var last = chars.length ? chars[chars.length - 1] : '';
      if (chars.length === 1 && APOSTROPHES.indexOf(last) !== -1) {
        // An apostrophe joins the previous square's letter: O + ' = O'.
        var index = p.row * SIZE + p.col - 1;
        var prev = index >= 0 ? design.letters[Math.floor(index / SIZE)] : null;
        if (prev && prev[index % SIZE]) {
          prev[index % SIZE] = cleanLetter(prev[index % SIZE] + "'");
          save();
        }
        input.value = design.letters[p.row][p.col];
        input.select();
        render();
        return;
      }
      design.letters[p.row][p.col] = chars.length === 2 && APOSTROPHES.indexOf(last) !== -1 ? cleanLetter(value) : cleanLetter(last);
      save();
      if (chars.length) moveCell(1); else render();
    });
    input.addEventListener('keydown', function (e) {
      if (selectedCell === null) return;
      var moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: SIZE, ArrowUp: -SIZE };
      if (moves[e.key]) { moveCell(moves[e.key]); e.preventDefault(); }
    });

    // Step 3: words
    $('#wcd-rule').addEventListener('change', function (e) {
      if (RULES[e.target.value] === undefined) return;
      design.nextHour = nextHourFrom(RULES[e.target.value]);
      save();
      render();
    });
    $('#wcd-clear-phrase').addEventListener('click', function () {
      if (selectedPhrase === null) return;
      design.words[selectedPhrase] = [];
      save();
      render();
    });

    // Step 4: check
    $('#wcd-time').addEventListener('input', render);
    $('#wcd-picture').addEventListener('click', function () {
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(downloadPicture);
    });
    var days = $('#wcd-days');
    [1, 2, 3, 4, 5, 6, 0].forEach(function (d) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wcd-chip' + (d === currentDay ? ' is-active' : '');
      b.textContent = DAYS[d].slice(0, 3);
      b.addEventListener('click', function () {
        currentDay = d;
        days.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
        render();
      });
      days.appendChild(b);
    });
    root.querySelectorAll('[data-time]').forEach(function (b) {
      b.addEventListener('click', function () { $('#wcd-time').value = b.dataset.time; render(); });
    });

    // Step 5: send
    var customer = $('#wcd-customer'), emailAddress = $('#wcd-email-address'), order = $('#wcd-order');
    customer.value = design.customer;
    emailAddress.value = design.email;
    order.value = design.order;
    customer.addEventListener('input', function () { design.customer = customer.value.trim(); save(); updateSendButtons(); });
    emailAddress.addEventListener('input', function () { design.email = emailAddress.value.trim(); save(); updateSendButtons(); });
    order.addEventListener('input', function () { design.order = order.value.trim(); save(); updateSendButtons(); });
    $('#wcd-confirm').addEventListener('change', updateSendButtons);
    $('#wcd-download').addEventListener('click', function () { if (confirmed()) download(); });
    $('#wcd-email').addEventListener('click', email);

    syncRule();
    setStep('start');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
