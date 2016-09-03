"use strict";

function File() {
    this.name = "";
    this.contents = [];
}

function Folder() {
    this.contents = {};
    
    this.addFolder = function (name) {
        this.contents[name] = new Folder();
    }
    
    this.addFile = function (file) {
        this.contents[file.name] = file;
    }
}

function FileSystem() {
    this.homeFolder = new Folder();
    
    this.resolveAddress = function (address) {
        if (address === "~") {
            return this.homeFolder;
        }
        
        var split = address.split("/");
        var current = this.homeFolder;
        var next;
        
        for (var i=1; i < split.length; i++){
            next = current.contents[split[i]];
            if (next)
                current = current.contents[split[i]];
            else
                return null;
        }
        
        return current;
    };
    
    this.checkExists = function(dir, filename, type){
        var folder = this.resolveAddress(dir);
        var f = folder.contents[filename];
        
        if (!f) return false;
        
        if (type){
            if (!(f instanceof type)){
                return false;
            }
        }
        
        return f;
    }
}

function parseFile(text) {
    var split = text.split("\n");
    
    var file = new File();
    
    file.name = split[0];
    file.contents = split.slice(2);
    
    return file;
}