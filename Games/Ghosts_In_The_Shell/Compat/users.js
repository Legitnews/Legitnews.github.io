var playerUser;
var mabel;
var jdavis;
var lparker;
var vkinsley;
var tkinsley;
var leader;

function users_init(){
    playerUser = new User();
    playerUser.name = "investigator";
    
    playerUser.mailbox.push(parseMail(loadFile("home_player_email_1")));
    playerUser.mailbox.push(parseMail(loadFile("home_player_email_2")));
    playerUser.mailbox.push(parseMail(loadFile("home_player_email_3")));
    
    playerUser.filesystem.homeFolder.addFile(parseFile(loadFile("home_player_file_1")));
    
    mabel = new User();
    mabel.name = "mabel";
    
    mabel.mailbox.push(parseMail(loadFile("target_mabel_email_1")));
    
    mabel.filesystem.homeFolder.addFolder("diary");
    mabel.filesystem.homeFolder.contents["diary"].addFile(parseFile(loadFile("target_mabel_file_1")));
    mabel.filesystem.homeFolder.contents["diary"].addFile(parseFile(loadFile("target_mabel_file_2")));
    mabel.filesystem.homeFolder.contents["diary"].addFile(parseFile(loadFile("target_mabel_file_3")));
    mabel.filesystem.homeFolder.contents["diary"].addFile(parseFile(loadFile("target_mabel_file_4")));
    mabel.hasLoggedIn = true;
    
    jdavis = new User();
    jdavis.name = "jdavis";
    jdavis.password = "2013";
    
    jdavis.mailbox.push(parseMail(loadFile("target_jdavis_email_1")));
    jdavis.mailbox.push(parseMail(loadFile("target_jdavis_email_2")));
    
    jdavis.filesystem.homeFolder.addFile(parseFile(loadFile("target_jdavis_file_1")));
    jdavis.filesystem.homeFolder.addFile(parseFile(loadFile("target_jdavis_file_2")));
    
    lparker = new User();
    lparker.name = "lparker";
    lparker.password = "autumn";
    
    lparker.mailbox.push(parseMail(loadFile("target_lparker_email_1")));
    lparker.mailbox.push(parseMail(loadFile("target_lparker_email_2")));
    lparker.mailbox.push(parseMail(loadFile("target_lparker_email_3")));
    lparker.mailbox.push(parseMail(loadFile("target_lparker_email_4")));
    
    lparker.filesystem.homeFolder.addFolder("diary");
    
    lparker.filesystem.homeFolder.contents["diary"].addFile(parseFile(loadFile("target_lparker_file_1")));
    lparker.filesystem.homeFolder.contents["diary"].addFile(parseFile(loadFile("target_lparker_file_2")));
    
    vkinsley = new User();
    vkinsley.name = "vkinsley";
    vkinsley.password = "anything";
    
    vkinsley.mailbox.push(parseMail(loadFile("target_vkinsley_email_1")));
    vkinsley.mailbox.push(parseMail(loadFile("target_vkinsley_email_2")));
        
    tkinsley = new User();
    tkinsley.name = "tkinsley";
    
    tkinsley.mailbox.push(parseMail(loadFile("target_tkinsley_email_1")));
    tkinsley.mailbox.push(parseMail(loadFile("target_tkinsley_email_2")));
    
    tkinsley.filesystem.homeFolder.addFolder("confessions");
    tkinsley.filesystem.homeFolder.contents["confessions"].addFile(parseFile(loadFile("target_tkinsley_file_1")));
    tkinsley.filesystem.homeFolder.contents["confessions"].addFile(parseFile(loadFile("target_tkinsley_file_2")));
    tkinsley.filesystem.homeFolder.contents["confessions"].addFile(parseFile(loadFile("target_tkinsley_file_3")));
    tkinsley.filesystem.homeFolder.addFile(parseFile(loadFile("target_tkinsley_file_4")));
    
    leader = new User();
    leader.name = "leader";
    leader.password = "jeremiah";
    
    leader.filesystem.homeFolder.addFile(parseFile(loadFile("target_leader_file_1")));
    leader.filesystem.homeFolder.addFile(parseFile(loadFile("target_leader_file_2")));
}