import sqlite3

from flask import g

DATANASE_URI = "database.db"

# create db connection
def get_db():
    db = getattr(g, "db", None)
    if db is None:
        db = g.db = sqlite3.connect(DATANASE_URI)

    return db


# close db connection
def disconnect():
    db = getattr(g, "db", None)
    if db is not None:
        g.db.close()
        g.db = None


#Create user session by storing token in database
def createUserSession(steamid, token):
    try:
        get_db().execute("insert into userSessions values (?,?);", [steamid, token])
        get_db().commit()
        return True
    except:
        return False

# check if session is active with token
def activeSession(token):
    cursor = get_db().execute(
        "select token from userSessions where token like ?;", [token]
    )
    sessionToken = cursor.fetchall()
    cursor.close()
    if sessionToken != []:
        return True
    else:
        return False


# check active session by steamid
def activeSessionSteamid(steamid):
    cursor = get_db().execute(
        "select token from userSessions where steamid like ?;", [steamid]
    )
    sessionToken = cursor.fetchall()
    cursor.close()
    if sessionToken != []:
        return sessionToken[0][0]
    else:
        return False


# method to delete active user session
def deleteSession(token):
    try:
        get_db().execute("delete from userSessions where token like (?);", [token])
        get_db().commit()
        return True
    except:
        return False


# get steamid of user by the token
def getSteamidByToken(token):
    
    cursor = get_db().execute(
        "select steamid from userSessions where token like ?;", [token]
    )
    userSteamid = cursor.fetchall()
    cursor.close()

    return userSteamid[0][0]


# method to check existence of user by steamid
def userExists(steamid):
    cursor = get_db().execute(
        "select steamid from userInfo where steamid like ?;", [steamid]
    )
    user = cursor.fetchall()
    cursor.close()
    if user != []:
        return True
    else:
        return False


# create user with platform specific information
# dictionary needs to be inserted
def createUser(userInformation):
    try:
        get_db().execute(
            "insert into userInfo values (?,?,?);",
            [
                userInformation["steamid"],
                userInformation["personname"],
                userInformation["aboutProfile"],
            ],
        )
        get_db().commit()
        return True
    except:
        return False


# get stored user information from database
def getUser(steamid):
    
    cursor = get_db().execute("select * from userInfo where steamid like ?;", [steamid])
    userInfo = cursor.fetchall()
    cursor.close()
    
    if userInfo != []:
        return userInfo[0]
    else:
        return False


# get steamid of all users on the platfrom from database
def getAllUser():
    
    cursor = get_db().execute("select steamid from userInfo;")
    users = cursor.fetchall()
    cursor.close()
    
    if users != []:
        return users
    else:
        return False


# Seatch user with wildcard on the database
def searchUser(searchTerm):
    cursor = get_db().execute(
        "select steamid from userInfo where personname like ?;", (f"%{searchTerm}%",)
    )
    userSteamid = cursor.fetchall()
    cursor.close()
    return userSteamid


# method to create post on the database
def createPost(steamid, appid, descr, accessRuleID, postMedia):
    try:
        
        cursor = get_db().execute(
            "insert into userPost (steamid, appid, descr, accessRuleID, postMedia, ts) values (?, ?, ?, ?, ?, CURRENT_TIMESTAMP);",
            [steamid, appid, descr, accessRuleID, postMedia],
        )

        get_db().commit()
        cursor.close()
        return True
    except:
        return False


# method to fetch id for latest media entry. (used to create new entry)
def getLastUsedID():
    cursor = get_db().execute("select max(rowid) from userMedia;")

    lastId = cursor.fetchall()
    cursor.close()

    return lastId[0][0]


# create database entry for uploaded media
def uploadMedia(filenam, typeofm):
    try:
        cursor = get_db().execute(
            "insert into userMedia (filenam, typeofm) values (?, ?);",
            [filenam, typeofm],
        )
        get_db().commit()
        cursor.close()
        return True
    except:
        return False


# delete database entry for uploaded media
def deleteMedia(filenam):
    try:
        cursor = get_db().execute(
            "delete from userMedia where filenam like ?;",
            [filenam],
        )
        get_db().commit()
        cursor.close
        return True
    except:
        return False


# fetch posts of a user by steamid
def getUserPosts(steamid):
    cursor = get_db().execute(
        "select * from userPost where steamid like ?ORDER BY ts DESC;", [steamid]
    )
    posts = cursor.fetchall()
    cursor.close()
    
    return posts



# fetch posts related to a specific game
def getGamePosts(appid):
    cursor = get_db().execute(
        "SELECT * FROM userPost WHERE appid LIKE ? ORDER BY ts DESC;", [appid]
    )
    posts = cursor.fetchall()
    cursor.close()
    return posts


# fetch media related to a specific post
def getMedia(filenam):
    cursor = get_db().execute(
        "select * from userMedia where filenam like ?;", [filenam]
    )
    media = cursor.fetchall()
    cursor.close()
    
    return media[0]

#create follow entry on the database
def setFollow(steamid, followid):
    try:
        get_db().execute("insert into followRel values (?,?);", [steamid, followid])
        get_db().commit()
        return True
    except:
        return False

#delete follow entry on the database
def deleteFollow(steamid, followid):
    try:
        get_db().execute(
            "delete from followRel where steamid like (?) and followsID like (?);",
            [steamid, followid],
        )
        get_db().commit()
        return True
    except:
        return False


# fetch followers of a user by steamid
def getFollowers(steamid):
    cursor = get_db().execute(
        "select steamid from followRel where followsID like ?;", [steamid]
    )
    followers = cursor.fetchall()
    cursor.close()
    if followers != []:
        return followers[0]
    else:
        return []
    
# fetch followedUser of a user by steamid
def getUserFollowed(steamid):
    cursor = get_db().execute(
        "select followsID from followRel where steamid like ?;", [steamid]
    )
    followers = cursor.fetchall()
    cursor.close()
    if followers != []:
        return followers[0]
    else:
        return []

# Check if a user has liked a specific post
def isPostLiked(steamid, postID):
    cursor = get_db().execute(
        "select count(*) from postLikes where steamid = ? AND postID = ?;",
        [steamid, postID],
    )
    liked = cursor.fetchone()
    cursor.close()
    return False if liked[0] == 0 else True


# Handling user unlikes of posts
def deletePostLiked(steamid, postID):
    try:
        get_db().execute(
            "delete from postLikes where steamid like (?) and postID like (?);",
            [steamid, postID],
        )
        get_db().commit()
        return True
    except:
        return False


# Handle users adding new likes to a post
def addPostLiked(steamid, postID):
    try:
        get_db().execute("insert into postLikes values (?,?);", [steamid, postID])
        get_db().commit()
        return True
    except:
        return False

#Count likes of a specific post
def countPostLiked(postID):
    cursor = get_db().execute(
        "select count(*) from postLikes where postID = ?;",
        [postID],
    )
    liked = cursor.fetchone()
    cursor.close()
    
    if liked is not None:
        return liked[0]
    else:
        return 0  

# Check if a user has liked a specific comment
def isCommentLiked(steamid, commentID):
    cursor = get_db().execute(
        "select count(*) from commentLikes where steamid = ? AND commentID = ?;",
        [steamid, commentID],
    )
    liked = cursor.fetchone()
    cursor.close()
    return False if liked[0] == 0 else True


# Handling user unlikes of comment
def deleteCommentLiked(steamid, commentID):
    try:
        get_db().execute(
            "delete from commentLikes where steamid like (?) and commentID like (?);",
            [steamid, commentID],
        )
        get_db().commit()
        return True
    except:
        return False


# Handle users adding new likes to a comment
def addCommentLiked(steamid, commentID):
    try:
        get_db().execute("insert into commentLikes values (?,?);", [steamid, commentID])
        get_db().commit()
        return True
    except:
        return False


# get count of likes of a comment
def countCommentLiked(commentID):
    cursor = get_db().execute(
        "select count(*) from commentLikes where commentID = ?;",
        [commentID],
    )
    liked = cursor.fetchone()
    cursor.close()
    
    if liked is not None:
        return liked[0]
    else:
        return 0  


# create comment in a post on the database
def createComment(commentID, authorSteamID, postID, content):
    try:
        cursor = get_db().execute(
            "insert into postComments (commentID, content, authorSteamID, postID, ts) values (?, ?, ?, ?, CURRENT_TIMESTAMP);",
            [commentID, content, authorSteamID, postID],
        )
        get_db().commit()
        cursor.close()
        return True
    except:
        return False


# get comments of a post from database
def getComments(postID):
    cursor = get_db().execute(
        "select rowid, commentID, content, authorSteamID, postID, ts from postComments where postID like ? and commentID like ? ORDER BY ts DESC;",
        [postID, 0],
    )
    comments = cursor.fetchall()
    cursor.close()
    
    return comments


# get comments of a comment on a post from database
def getSubComments(postID, commentID):
    cursor = get_db().execute(
        "select rowid, commentID, content, authorSteamID, postID, ts from postComments where postID like ? AND commentID like ? ORDER BY ts DESC;",
        [postID, commentID],
    )
    comments = cursor.fetchall()
    cursor.close()
    
    return comments
