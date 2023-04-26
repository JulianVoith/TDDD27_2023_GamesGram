create table userSessions(steamid int(64), token varchar(120),primary key(steamid));

create table userInfo(steamid int(64), personname varchar(120), aboutProfile varchar(240), primary key(steamid));

create table followRel (steamid int(64), followsID int(64));

create table media (streamid int(64), appid(64), mediaID ,accesRuleID)