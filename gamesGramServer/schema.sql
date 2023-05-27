create table userSessions(steamid int(64), token varchar(120),primary key(steamid));

create table userInfo(steamid int(64), personname varchar(120), aboutProfile varchar(240), primary key(steamid));

create table followRel (steamid int(64), followsID int(64));

create table userPost (steamid int(64), appid int(64), descr varchar(300), accessRuleID int(16), postMedia varchar(120), ts TIMESTAMP);
create table userMedia (filenam varchar(120), typeofm varchar(20), primary key(filenam)) ;
create table accessRules (accessID int(16), descr varchar(120), primary key(accessID));

create table postComments(commentID int, likes int, content varchar(500), authorSteamID int(64), postID varchar(120), ts TIMESTAMP);
create table likeRel(postID varchar(120), commentID int, steamid int(64));