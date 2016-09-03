"use strict";

function User() {
    this.name = "user";
    this.password = null;
    
    this.mailbox = [];
    this.filesystem = new FileSystem();
    
    this.hasLoggedIn = false;
}