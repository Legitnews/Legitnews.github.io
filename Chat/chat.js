function setCookie(cname,cvalue,exdays){
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}

var chatBox = document.getElementById("chatbox");
var inputBox = document.getElementById("input");
var submitButton = document.getElementById("submit");
var usersBox = document.getElementById("users");
var usernameInput = document.getElementById("username");

var xmlhttp = new XMLHttpRequest();

function testRequest(){
    //console.log(xmlhttp.readyState);
    xmlhttp.open("GET", "/");
    xmlhttp.send("Hello");
}

var Host = {
	users : [],
	
	addUser : function(username){
		this.users.push(username);
		this.writeUsers();
		
		return this.users.length - 1;
	},
	
	editUser : function(newName, userNo){
		this.users[userNo] = newName;
		this.writeUsers();
	},
	
	delUser : function(userNo){
		this.users[userNo] = null;
		this.writeUsers();
	},
	
	writeUsers : function(){
		LocalUser.writeUsers();
		//Tell all users to do so.
	},
}

var LocalUser = {
	username : "Guest",
	userNo : 0,
	
	init : function(){
		var username = getCookie("username");
		
		if (username !== ""){
			this.username = username;
		}
		else{
			this.username = "Guest" + Math.floor(Math.random() * 1000);
		}
		usernameInput.value = this.username;
		
		this.userNo = Host.addUser(this.username);
	},
	
	setUsername : function(){
		this.username = usernameInput.value;
		setCookie("username", this.username, 365);
		
		Host.editUser(this.username, this.userNo);
	},
	
	printMessage : function(username, message, time){
		var fullMessage = time + " " + username + ": " + message + "\n";
		
		chatBox.contentEditable = true;
		chatBox.value += fullMessage;
		
		chatBox.scrollTop = chatBox.scrollHeight;
	},
	
	submitMessage : function(){
		var message = inputBox.value;
		
		if (message === ""){
			return;
		}
		
		//Strip trailing whitespace / newlines. Check for spam?
		
		inputBox.value = "";
		
		var time = (new Date()).toTimeString().substring(0, 8);
		
		this.printMessage(this.username, message, time);
		
		//Send out over network.
	},
	
	writeUsers : function(){
		usersBox.value = "";
		
		for (var i=0; i < Host.users.length; i++){
			if (Host.users[i] === null){
				continue;
			}
			
			usersBox.value += Host.users[i] + "\n";
		}
	},
	
	logOut : function(){
		Host.delUser(this.userNo);
	},
}

LocalUser.init();

submitButton.onclick = function(){ LocalUser.submitMessage(); };
usernameInput.onchange = function(){ LocalUser.setUsername(); };

