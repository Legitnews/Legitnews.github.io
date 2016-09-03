"use strict";

function Computer(){
    this.commands = ["help", "ls", "cd", "whoami", "mail", "nano", "emacs", "vim", "ed", "sb_email.exe", "su", "lsusers"]
    
    this.users = {};
    this.currUser = null;
    this.hostname = "Host";
    this.cwd = "~"; //Current Working Directory
    
    this.rc = "";
    
    this.changeUser = function(user){
        this.currUser = user;
        this.cwd = "~";
        user.hasLoggedIn = true;
    };   
}

var homeComputer;
var targetComputer;

var ips = {};

function computer_init(){
    homeComputer = new Computer();
    homeComputer.commands.push("ssh")
    homeComputer.hostname = "Work-PC";
    homeComputer.users["investigator"] = playerUser;
    homeComputer.currUser = playerUser;
    homeComputer.rc = loadFile("home_rc");

    targetComputer = new Computer();
    targetComputer.hostname = "Bunker-PC";
    targetComputer.users["mabel"] = mabel;
    targetComputer.users["jdavis"] = jdavis;
    targetComputer.users["lparker"] = lparker;
    targetComputer.users["vkinsley"] = vkinsley;
    targetComputer.users["tkinsley"] = tkinsley;
    targetComputer.users["leader"] = leader;
    targetComputer.currUser = mabel;
    targetComputer.rc = loadFile("target_rc");
    targetComputer.commands.push("logout")
    targetComputer.commands.push("download")
    
    ips["127.0.0.1"] = homeComputer;
    ips["217.78.1.159"] = targetComputer;
    ips["x"] = targetComputer;
}