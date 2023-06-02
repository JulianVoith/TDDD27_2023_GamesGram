/*Table for active user session*/
create table userSessions(steamid BIGINT UNSIGNED, token varchar(120),primary key(steamid));
/*Table for registered users*/
create table userInfo(steamid BIGINT UNSIGNED, personname varchar(120), aboutProfile varchar(240), primary key(steamid));
/*Table for follow relationships*/
create table followRel (steamid BIGINT UNSIGNED, followsID BIGINT UNSIGNED);
/*Table for all user posts*/
create table userPost (steamid BIGINT UNSIGNED, appid BIGINT UNSIGNED, descr varchar(300), accessRuleID int, postMedia varchar(120), ts TIMESTAMP);
/*Table for all existing media*/
create table userMedia (filenam varchar(120), typeofm varchar(20), primary key(filenam)) ;

/*Table for all posted comments (commentID is not primary key. its a field to refrenece to another comment. Rowid is the unique ID of a comment) */
create table postComments(commentID int, content varchar(500), authorsteamid BIGINT UNSIGNED, postID varchar(120), ts TIMESTAMP);

/*Table for all likes of a post*/
CREATE TABLE postLikes (
    steamid BIGINT UNSIGNED,
    postID VARCHAR(120),
    PRIMARY KEY(steamid, postID),
    FOREIGN KEY(postID) REFERENCES userPost(postMedia)
);

/*Table for all likes of a comment*/
CREATE TABLE commentLikes (
    steamid BIGINT UNSIGNED,
    commentID INT,
    PRIMARY KEY(steamid, commentID),
    FOREIGN KEY(commentID) REFERENCES postComments(ROWID)
);

/*Table for access rule of post (not yet implemented)*/
create table accessRules (accessID int, descr varchar(120), primary key(accessID));

