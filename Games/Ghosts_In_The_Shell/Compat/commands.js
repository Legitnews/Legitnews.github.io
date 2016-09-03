"use strict";

function ls(computer, args){
    var dir = args[0];
    
    dir = computer.cwd + (dir ? ("/"+dir) : "");
    
    var folder = computer.currUser.filesystem.resolveAddress(dir);
    
    if (folder instanceof File){
        Terminal.pushLine(dir);
        return;
    }
    
    if (!folder){
        Terminal.pushLine("Dir not recongnised.");
        return;
    }
    
    for (var f in folder.contents){
        Terminal.pushLine(f + ((folder.contents[f] instanceof Folder) ? "/" : ""));
    }
}

function cd(computer, args){
    if (!args[0]){
        computer.cwd = "~";
        return;
    }
    
    var dir = args[0];
    
    if (dir === ".."){
        //Up one.
        
        if (computer.cwd === "~"){
            Terminal.pushLine("Insufficient permissions to read above home folder.");
            return;
        }
        else {
            computer.cwd = computer.cwd.substr(0, computer.cwd.lastIndexOf("/"));
            return;
        }
    }
    
    var newcwd;
    
    if (dir[0] === "~"){
        //absolute
        newcwd = dir;
    }
    
    else{
        //relative
        newcwd = computer.cwd + "/"+dir;
    }
    
    var f = computer.currUser.filesystem.resolveAddress(newcwd);
    
    if (f && !(f instanceof File)){
        computer.cwd = newcwd;
    }
    else{
        Terminal.pushLine("Dir not recongnised.");
    }
}

function whoami(computer, args){
    Terminal.pushLine(computer.currUser.name);
}

function lsusers(computer, args){
    for (var user in computer.users){
        Terminal.pushLine(user);
    }
}

function ssh(computer, args){
    var ip = args[0];
    
    var computer = ips[ip];
    
    if(!computer){
        Terminal.pushLine("ssh: connect to host " + ip + " Connection refused");
        return;
    }
    
    Terminal.changeComputer(computer);
}

function logout(computer, args){
    Terminal.changeComputer(homeComputer);
}

function download(computer, args){
    var success = true;
    
    for (var user in computer.users){
        if (computer.users[user].hasLoggedIn){
            Terminal.pushLine("Downloaded data of " + user);
        }
        else{
            Terminal.pushLine("Error: No permission for data of " + user);
            success = false;
            break;
        }
    }
    
    if (!success){
        Terminal.pushLine("");
        Terminal.pushLine("You lack suffiecient permissions. You must log in as these users.");
    }
    
    else{
        Terminal.winGame();
    }
}

var suUser = null; //Annoyingly, I need some state for su. Ah well, the whole rest of the program is hyper-stateful anyway.

function su(computer, args){
    var username = args[0];
    var user = computer.users[username];
    
    if (!user){
        Terminal.pushLine("User not found.");
        return;
    }
    
    if (user.password && ! user.hasLoggedIn){
        suUser = user;
        Terminal.promptForInput("Password: ");
        Terminal.inputCallback = suCallback;
    }
    else{
        computer.changeUser(user);
    }
    
}

function suCallback(input){
    if (suUser.password === input){ //Not even hashed and salted.
        Terminal.currComputer.changeUser(suUser);
    }
    else{
        Terminal.pushLine("su: Authentication failure");
        suUser = null;
    }
}

function nano(computer, args){
    var file = args[0];
    
    var f = computer.currUser.filesystem.resolveAddress(computer.cwd+"/"+file);
    
    if (!(f) || (f instanceof Folder)){
        Terminal.pushLine("File not found.");
        return;
    }
    
    
    Terminal.openTextEditor(f.contents, f.name, computer.currUser.name, "", "READONLY");
}

function emacs(computer, args){
    Terminal.pushLine("Not enough RAM to run Emacs.");
}

function mail(computer, args){
    if (computer.currUser.mailbox.length <= 0){
        Terminal.pushLine("No mail for " + computer.currUser.name);
        return;
    }
    
    Terminal.pushLine("There are " + computer.currUser.mailbox.length + " mail(s).")
    
    var titleLength = 32;
    var senderLength = 16;
    
    for (var i=0; i < computer.currUser.mailbox.length; i++){
        var email = computer.currUser.mailbox[i];
        Terminal.pushLine((i+1) + ": " + ( email.title + " ".repeat(titleLength-email.title.length)) + " " + (email.sender + " ".repeat(senderLength-email.sender.length)) + " " + email.date);
    }
    
    Terminal.pushLine("");
    
    if (computer.currUser.mailbox.length > 0){
        Terminal.promptForInput("Which one to open? ");
        Terminal.inputCallback = emailCallback;
    }
}

function emailCallback(input){
    if (!input){
        Terminal.pushLine("Please specify a number");
        Terminal.inputCallback = emailCallback;
        Terminal.promptForInput("Which one to open? ");
        return;
    }
    
    var number = parseInt(input, 10);
    
    if (isNaN(number)){
        Terminal.pushLine("Please specify a number");
        Terminal.inputCallback = emailCallback;
        Terminal.promptForInput("Which one to open? ");
    }
    
    else if (number < 1 || number > Terminal.currComputer.currUser.mailbox.length){
        Terminal.pushLine("That email does not exist.");
        Terminal.inputCallback = emailCallback;
        Terminal.promptForInput("Which one to open? ");
    }
    
    else{
        emailOpen(number);
    }
}

function emailOpen(number){
    var email = Terminal.currComputer.currUser.mailbox[number-1];
    
    Terminal.openTextEditor(email.contents, email.title, email.sender, email.date, "READONLY");
}

function help(computer, args){
    for (var command in commandHelp){
        if (computer.commands.indexOf(command) !== -1)
            Terminal.pushLine(command+": "+commandHelp[command]);
    } 
}

var Commands = {
    "ls" : ls,
    "cd" : cd,
    "whoami" : whoami,
    "mail" : mail,
    "sb_email.exe" : mail,
    "help" : help,
    "ssh" : ssh,
    "nano" : nano,
    "vim" : nano,
    "ed" : nano,
    "emacs" : emacs,
    "logout" : logout,
    "su" : su,
    "lsusers" : lsusers,
    "download" : download,
};

var commandHelp = {
    "ls" : "List files in current directory.",
    "cd" : "Change current working directory. Usage: 'cd <dir>' ",
    "mail" : "Open mailbox for user.",
    "ssh" : "Login to a remote machine. Usage: 'ssh <ip>' ",
    "logout" : "Log out of SSH session.",
    "nano" : "A text editor. Use to view text files. Arrow keys to scroll. Usage: 'nano <file>'",
    "su" : "Change user. Usage 'su <username>' ",
    "download" : "Download all user data and log out of SSH session.",
    //"lsusers" : "List all users on the system."
};