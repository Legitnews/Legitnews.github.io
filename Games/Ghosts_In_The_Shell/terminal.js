"use strict";

//Yeah boi fuckin terminal emulator

function doGetCaretPosition (oField) {
  //http://stackoverflow.com/users/43677/bezmax

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange();

    // Move selection start to 0 position
    oSel.moveStart('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionStart;

  // Return results
  return iCaretPos;
}

function doFocus(){
    if (Terminal.inputStream)
        Terminal.inputStream.focus();
}

window.setInterval(doFocus, 100);

var states = {
    "terminal" : 0,
    "texteditor" : 1,
    "won" : 2,
}

var cursorModes = {
    "terminal" : 0,
    "texteditor" : 1,
}

var Terminal = {
    fontSize   : 16,
    fontWidth  : 9,
    width  : 96, //chars
    height : 28,
    viewTop : 0,
    viewBottom : 26,
    viewOffset : 0,
    
    cursor : "\u23B8", //\u2588
    cursorPos : [0, 0],
    cursorFlickerTime : .5,
    timeUntilCursorFlicker : 0,
    cursorMode : cursorModes.terminal,
    
    state : states.terminal,
    
    inputStream : document.getElementById("termInput"),
    listeningForInput : false,
    showingInput : false,
    promptingInput : false,
    
    drawingScrollbar : false,
    
    workingFile : "",
    workingFileDate : "",
    workingFileAuthor : "",
    workingFileStatus : "",
    workingFileMessage : "",
    
    inputCallback : null,
    
    textColour : "#8AC697", //I use this colour for my own terminal. It's great.
    cursorColour : "#b4e5be",
    statusBarColour : "#f24242",
    
    textFont : "Mononoki", //And this font
    boldFont : "Mononoki-Bold",
    
    currentLine : 0,
    inputPos : [0, 0],
    
    buffer : [], //This marks the first time anyone has ever used a "buffer" in javascript.
    lineColours : [],
    inputHistory : [],
    
    prevBuffer : [],
    prevViewOffset : 0,
    
    historyPos : 0,
    
    fadeOutTime : 5,
    fadeOutTimeRemaining : 5,
    downloadTime : 16,
    downloadTimeRemaining : 16,
    
    prompt : "$ ",
    
    currComputer : null,
    
    init : function (){
        
        this.currComputer = homeComputer;
        
        this.inputStream.value = "";
        
        this.inputStream.addEventListener("keydown",
                                          function(e){ Terminal.keyListen(e); } )
        
        ctx.font = this.fontSize + "px " + this.textFont;
        //this.fontWidth = ctx.measureText("0").width; //Monospace font so char shouldn't matter.
        //^ I just hardcoded it to 9, which is what this should return, because sometimes the font doesn't load in time

        canvas.width  = this.width  * this.fontWidth;
        canvas.height = this.height *  this.fontSize;
        
        //Have to redo the font because changing the canvas silently resets the ctx or some shit.
        
        ctx.fillStyle = this.textColour;
        ctx.font = this.fontSize + "px " + this.textFont;
        
        for (var i=0; i < this.height; i++){
            this.buffer[i] = " ".repeat(this.width);
        }
        
        for (var i=0; i < this.height; i++){
            this.lineColours[i] = this.textColour;
        }
        this.lineColours[this.height-1] = this.statusBarColour;
        
        this.pushText(this.currComputer.rc);
        
        this.promptForInput();
    },
    
    update : function (){
        if (this.listeningForInput){
            this.inputStream.focus();
            this.inputStream.readOnly = false;
        }
        else{
            this.inputStream.readOnly = true;
        }
        
        if (this.showingInput){
            this.displayCurrentInput();
        }
        
        if (deltaTime){
            this.timeUntilCursorFlicker -= deltaTime;
        }
        
        if (this.drawingScrollbar){
            ScrollBar.updatePos(this.viewOffset, this.buffer.length - this.height);
        }
        
        if (this.state === states.won){
            this.gameWinAnim();
        }
    },
    
    gameWinAnim : function(){
        if (this.fadeOutTimeRemaining > 0){
            this.fadeOutTimeRemaining -= deltaTime;
            var ratio = this.fadeOutTimeRemaining / this.fadeOutTime;
            ctx.globalAlpha = ratio;
        }
        
        else if (this.downloadTimeRemaining > 0){
            ctx.globalAlpha = 1;
            
            var ratio = this.downloadTimeRemaining / this.downloadTime;
            
            var downloadBarSize = 50;
            
            var percentage = Math.round((1-ratio) * 100);
            var downloadbarFill = Math.round((1-ratio) * downloadBarSize)
            
            this.buffer = [
                "Downloading" + ".".repeat(3 - (Math.round(ratio * 20) % 3)), //Maths A-level already paying off
                "[" + "#".repeat(downloadbarFill) + "-".repeat(downloadBarSize-downloadbarFill) + "] " + percentage +"%",
            ];
            
            this.viewOffset = 0;
            
            this.downloadTimeRemaining -= deltaTime;
        }
        else{
            this.buffer[3] = "All data downloaded.";
            this.buffer[5] = "Ending 1 of 1";
        }
    },
    
    keyListen : function(e){
        if (e.keyCode === Key.ENTER)
            this.enterInput();
        
        else if (e.keyCode === Key.ESC && this.state === states.texteditor)
            this.closeTextEditor();
        
        else if (this.cursorMode === cursorModes.terminal){
            if (e.keyCode === Key.UP) this.cycleHistory(1);
            else if (e.keyCode === Key.DOWN) this.cycleHistory(-1);
        }
        
        else {
            if (e.keyCode === Key.UP){
                if (this.viewOffset > 0)
                    this.viewOffset--;
            }
            else if (e.keyCode === Key.DOWN){
                if (this.viewOffset < (this.buffer.length - this.viewBottom))
                    this.viewOffset++;
            }
            else if (e.keyCode === Key.LEFT && this.cursorPos[0] > 0){
                this.cursorPos[0]--;
            }
            else if (e.keyCode === Key.RIGHT && this.cursorPos[0] < this.width-1){
                this.cursorPos[0]++;
            }
        }
    },
    
    cycleHistory : function(dir){
        if (! this.inputHistory) return;
        
        this.inputStream.value = this.inputHistory[this.inputHistory.length - (this.historyPos+1)];
        
        this.historyPos += dir;
        
        if (this.historyPos < 0 || this.historyPos >= this.inputHistory.length) this.historyPos = 0;
    },
    
    enterInput : function (){
        if (! this.listeningForInput){ 
            return;
        }
        
        this.historyPos = 0;
        
        var input = this.inputStream.value;
        
        this.inputStream.value = "";
        this.listeningForInput = false;
        this.showingInput = false;
        this.promptingInput = false;
        this.advanceLine();
        
        if (this.inputCallback){
            var cb = this.inputCallback;
            this.inputCallback = null;
            cb(input);
        }
        else{
            this.interpretInput(input);
        }
        
        if (!this.promptingInput && this.state === states.terminal){
            this.promptForInput();
        }
    },
    
    pushLine : function(line){
        //TODO: multiline
        
        this.buffer[this.currentLine] = this.buffer[this.currentLine] = line + " ".repeat(this.width-line.length);
        this.advanceLine();
        
        if (this.currentLine >= this.viewBottom){
            this.buffer[this.currentLine] = line + " ".repeat(this.width-line.length);//this.buffer[this.currentLine].substr(line.length);
        }
    },
    
    pushLines : function(lines){
        for (var i=0; i<lines.length; i++){
            this.pushLine(lines[i]);
        }  
    },
    
    pushText : function(text){
        this.pushLines(text.split("\n"));  
    },
    
    openTextEditor : function(buffer, title, author, date, status){
        this.prevBuffer = this.buffer;
        this.prevViewOffset = this.viewOffset;
        
        this.buffer = buffer;
        this.viewOffset = 0;
        
        this.cursorPos = [buffer[0].length, 0];
        
        this.state = states.texteditor;
        this.cursorMode = cursorModes.texteditor;
        
        var sbPosx = (this.width-2) * this.fontWidth;
        var sbPosy = this.fontSize;
        var sbSizex = this.fontWidth;
        var sbSizey = this.fontSize * (this.viewBottom-1);
        
        ScrollBar.setup([sbPosx, sbPosy], [sbSizex, sbSizey], this.viewBottom, this.buffer.length, this.viewOffset, this.buffer.length - this.height);
        
        this.drawingScrollbar = true;
        
        this.workingFile = title;
        this.workingFileAuthor = author;
        this.workingFileDate = date;
        this.workingFileStatus = status;
        this.workingFileMessage = "ESC to exit";
    },
    
    closeTextEditor : function(){
        this.buffer = this.prevBuffer;
        this.viewOffset = this.prevViewOffset;
        
        this.state = states.terminal;
        this.cursorMode = cursorModes.terminal;
        
        this.drawingScrollbar = false;
        
        this.workingFile = "";
        this.workingFileAuthor = "";
        this.workingFileDate = "";
        this.workingFileStatus = "";
        this.workingFileMessage = "";
        
        this.pushLine("");
        this.promptForInput();
    },
    
    winGame : function(){
        this.state = states.won;
    },
    
    changeComputer : function(computer){
        this.currComputer = computer;
        this.pushLine("");
        this.pushText(computer.rc);
    },
    
    makePrompt : function(){
        return this.currComputer.currUser.name + "@" + this.currComputer.hostname + " (" + this.currComputer.cwd + ") " + this.prompt;
    },
    
    promptForInput : function (prompt){
        var prompt = prompt ? prompt : this.makePrompt();
        
        this.inputPos[0] = prompt.length;
        this.inputPos[1] = this.currentLine;
        
        this.listeningForInput = true;
        this.showingInput = true;
        this.promptingInput = true;
        
        this.buffer[this.inputPos[1]] = prompt + this.buffer[this.inputPos[1]].substr(prompt.length);
    },
    
    interpretInput : function(input){
        if (! input) return;
        
        this.inputHistory.push(input);
        
        var parts = input.split(" ");
        
        if (this.currComputer.commands.indexOf(parts[0]) !== -1){
            Commands[parts[0]](this.currComputer, parts.slice(1));
        }
        
        else{
            this.pushLine("Unknown Command: " + parts[0])
        }
    },
    
    displayCurrentInput : function (){
        var currinput = this.inputStream.value;
        
        var x = this.inputPos[0];
        var y = this.inputPos[1];
        
        var lines = [];
        lines[0] = currinput.substr(0, this.width-x);
        
        var nlines = Math.ceil((currinput.length + x) / this.width);
        
        for (var i=1; i<nlines; i++){
            lines[i] = currinput.substr((i * this.width - x), (i * (this.width+1) + x));
        }
        
        this.buffer[y] = this.buffer[y].substr(0, x) + lines[0];
        
        for (var i=1; i<nlines; i++){
            if ((y+i) > this.currentLine){
                this.advanceLine();
            }
            
            this.buffer[y+i] = lines[i];
        }
        
        if (this.cursorMode === cursorModes.terminal){
            var caret = doGetCaretPosition(this.inputStream);
            this.cursorPos[0] = (caret+x) % this.width;
            this.cursorPos[1] = this.currentLine - this.viewOffset;
        }
    },
    
    advanceLine : function (){
        //console.log(this.currentLine)
        
        this.currentLine++;
        
        if (this.currentLine <= this.viewBottom){
            return;
        }
        
        this.buffer.push(" ".repeat(this.width));
        this.viewOffset++;
        this.buffer[this.viewOffset+this.viewBottom] = " ".repeat(this.width);
    },
    
    statusBar : function (){
        var d = new Date();
        
        var h = ""+d.getHours();
        var m = ""+d.getMinutes();
        var s = ""+d.getSeconds();
        
        var y = "2308";
        var mn = "08";
        var d = "28";
        
        h = "0".repeat(2 - h.length) + h;
        m = "0".repeat(2 - m.length) + m;
        s = "0".repeat(2 - s.length) + s;
        
        var time = h+":"+m+":"+s+"--"+y+"/"+mn+"/"+d;
        
        var fileInfo = (this.workingFile + "--" + this.workingFileAuthor + "--" + this.workingFileDate + "--" + this.workingFileMessage);
        
        return fileInfo + "-".repeat(this.width - (fileInfo.length + time.length)) + time;
    },
        
    fillCursor : function (ctx){
        if (this.timeUntilCursorFlicker <= -this.cursorFlickerTime){
            this.timeUntilCursorFlicker = this.cursorFlickerTime;
            return;
        }
        
        if (this.timeUntilCursorFlicker < 0){
            return;
        }
        
        ctx.fillStyle = this.cursorColour;
        ctx.font = this.fontSize + "px " + this.boldFont;
        
        var pxX = this.cursorPos[0] * this.fontWidth;
        var pxY = (this.cursorPos[1]+1) * this.fontSize;
        
        ctx.fillText(this.cursor, pxX, pxY);
    },
    
    fillStatusBar : function(ctx){
        var oldalpha = ctx.globalAlpha;
        ctx.globalAlpha = 1;
        
        var text = this.statusBar();
        
        ctx.font = this.fontSize + "px " + this.boldFont;
        ctx.fillStyle = this.statusBarColour;
        
        ctx.fillText(text, 0, this.fontSize * this.height);
        
        ctx.globalAlpha = oldalpha;
    },
    
    render : function (ctx){
        ctx.fillStyle = this.textColour;
        ctx.font = this.fontSize + "px " + this.textFont;
        
        for (var i=0; i < this.height-1; i++){
            var line = this.buffer[this.viewOffset+i];
            
            
            //ctx.fillStyle = this.lineColours[i];
            if (line)
                ctx.fillText(line, 0, (i+1)*this.fontSize);
        }
        
        var caret = doGetCaretPosition(this.inputStream);
        
        this.fillCursor(ctx);
        this.fillStatusBar(ctx);
        
        if (this.drawingScrollbar){
            ScrollBar.draw(ctx);
        }
    },
}
