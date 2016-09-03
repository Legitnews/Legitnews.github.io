"use strict";

//Yeah boi fuckin terminal emulator

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

var Terminal = {
    fontSize   : 16,
    fontWidth  : 9,
    width  : 96, //chars
    height : 28,
    
    lastLineLastFrame : "",
    lineLastFrame : 0,
    
    cursor : "\u23B8", //\u2588 u23B8
    cursorLine : 0,
    cursorFlickerTime : .5,
    timeUntilCursorFlicker : 0,
    
    state : states.terminal,
    
    inputStream : document.getElementById("termInput"),
    display : document.getElementById("termDisplay"),
    statusBarDisplay : document.getElementById("statusBar"),
    
    listeningForInput : false,
    showingInput : false,
    promptingInput : false,
    
    workingFile : "",
    workingFileDate : "",
    workingFileAuthor : "",
    workingFileStatus : "",
    workingFileMessage : "",
    
    inputCallback : null,
    
    textFont : "Mononoki", //And this font
    boldFont : "Mononoki-Bold",
    
    alpha : 1,
    
    currentLine : 0,
    inputPos : [0, 0],
    
    buffer : [], //This marks the first time anyone has ever used a "buffer" in javascript.
    lineColours : [],
    inputHistory : [],
    
    prevBuffer : [],
    
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
        
        for (var i=0; i < this.height; i++){
            this.buffer[i] = "";
        }
        
        this.pushText(this.currComputer.rc);
        
        this.promptForInput();
    },
    
    update : function (){
        if (this.listeningForInput){
            doFocus();
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
        
        if (this.state === states.won){
            this.gameWinAnim();
        }
    },
    
    gameWinAnim : function(){
        if (this.fadeOutTimeRemaining > 0){
            this.fadeOutTimeRemaining -= deltaTime;
            var ratio = this.fadeOutTimeRemaining / this.fadeOutTime;
            this.alpha = ratio;
        }
        
        else if (this.downloadTimeRemaining > 0){
            this.alpha = 1;
            
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
        
        else if (this.state === states.terminal){
            if (e.keyCode === Key.UP) this.cycleHistory(1);
            else if (e.keyCode === Key.DOWN) this.cycleHistory(-1);
        }
        
        else {
            if (e.keyCode === Key.UP){
                this.display.scrollTop -= this.fontSize;
            }
            else if (e.keyCode === Key.DOWN){
                this.display.scrollTop += this.fontSize;
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
        
        this.buffer[this.currentLine] = line;// + " ".repeat(this.width-line.length);
        this.advanceLine();
        
        if (this.currentLine >= this.viewBottom){
            this.buffer[this.currentLine] = line;// + " ".repeat(this.width-line.length);//this.buffer[this.currentLine].substr(line.length);
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
        
        this.state = states.texteditor;
        
        this.workingFile = title;
        this.workingFileAuthor = author;
        this.workingFileDate = date;
        this.workingFileStatus = status;
        this.workingFileMessage = "ESC to exit";
        
        this.render(true);
        this.scrollToTop();
    },
    
    closeTextEditor : function(){
        this.buffer = this.prevBuffer;
        this.scrollToBottom();
        
        this.state = states.terminal;
        
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
        
        if (this.inputPos[1] >= this.buffer.length)
            this.buffer.push("");
        
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
        
        this.cursorLine = this.currentLine;
    },
    
    advanceLine : function (){
        if (this.buffer[this.currentLine].endsWith(this.cursor))
            this.buffer[this.currentLine] = this.buffer[this.currentLine].substr(0, this.buffer[this.currentLine].length-2);
        
        this.currentLine++;
        
        if (this.currentLine <= this.viewBottom){
            return;
        }
    
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
        
        var time = h+":"+m+":"+s+"  "+y+"/"+mn+"/"+d;
        
        var fileInfo = (this.workingFile + "  " + this.workingFileAuthor + "  " + this.workingFileDate + "  " + this.workingFileMessage);
        
        return fileInfo + " ".repeat(this.width - (fileInfo.length + time.length + 1)) + time;
    },
        
    fillCursor : function (){
        var prevCursorState = this.cursorState;
        
        if (! (this.state === states.terminal)){
            return;
        }
        
        if (this.timeUntilCursorFlicker <= -this.cursorFlickerTime){
            this.timeUntilCursorFlicker = this.cursorFlickerTime;
            return;
        }
        
        if (this.timeUntilCursorFlicker < 0){
            return;
        }
        
        if (this.display.scrollTop !== this.display.scrollTopMax){
            return;
        }
            
        
        var caret = doGetCaretPosition(this.inputStream);
        
        setCaretToPos(this.display, this.display.value.lastIndexOf(this.prompt)+caret+2);
        
        return prevCursorState !== this.cursorState;
    },
    
    fillStatusBar : function(){
        this.statusBarDisplay.value = this.statusBar();
    },
    
    scrollToTop : function(){
        this.display.scrollTop = 0;
    },
    
    scrollToBottom : function(){
        this.display.scrollTop = this.display.scrollHeight;  
    },
    
    render : function (force){
        
        this.fillStatusBar();
        this.fillCursor();
        
        this.display.style.opacity = this.alpha;
        
        if (this.state === states.texteditor && !force){
            return;
        }
        
        else if ((this.state === states.terminal) && (this.lastLineLastFrame === this.buffer[this.currentLine]) && (this.lineLastFrame === this.currentLine) && !force){
            return;
        }
        
        this.lastLineLastFrame = this.buffer[this.currentLine];
        this.lineLastFrame = this.currentLine;
        
        var displayText = "";
        
        for (var i=0; i < this.buffer.length; i++){
            var line = this.buffer[i];
            
            if (line !== undefined){
                if (i !== 0)
                    displayText += "\n";
                if (line.trim())
                    displayText += line;
            }
        }
        
        this.display.value = displayText;
        
        this.scrollToBottom();
    },
}
