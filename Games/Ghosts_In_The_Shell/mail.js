"use strict";

function Mail(){
    this.sender = "";
    this.title = "";
    this.date = "";
    this.contents = [];
}

function parseMail(text){
    var split = text.split("\n");
    
    var mail = new Mail();
    
    mail.title  = split[0];
    mail.sender = split[1];
    mail.date   = split[2];
    mail.contents = split.slice(4);
    
    return mail;
}