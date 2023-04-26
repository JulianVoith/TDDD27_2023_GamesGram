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


# not used any more
# store user's token
def createUserSession(steamid, token):
    # insert user's steamid and token
    try:
        get_db().execute("insert into userSessions values (?,?);", [steamid, token])
        get_db().commit()
        return True
    except:
        return False


# not used any more
# check active session by token
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
    #print("database,token",token)
    cursor = get_db().execute(
        "select steamid from userSessions where token like ?;", [token]
    )
    userSteamid = cursor.fetchall()
    cursor.close()

    return userSteamid[0][0]

# method to check existence of user
def userExists(steamid):
    # fetch user by email
    cursor = get_db().execute("select steamid from userInfo where steamid like ?;", [steamid])
    user = cursor.fetchall()
    cursor.close()
    # check if user exists and return true or false
    if user != []:
        return True
    else:
        return False
        
# create user in database
def createUser(userInformation):
    # insert passed dictionary and create user in database
    try:
        get_db().execute(
            "insert into userInfo values (?,?,?);",
            [
                userInformation["steamid"],
                userInformation["personname"],
                userInformation["aboutProfile"]
            ],
        )
        get_db().commit()
        return True
    except:
        return False

#method to create follow entry
def followUser(steamid, followid):
    # insert user's steamid and token
    try:
        get_db().execute("insert into followRel values (?,?);", [steamid, followid])
        get_db().commit()
        return True
    except:
        return False

#method to create follow entry
def getFollower(steamid):
    # get a users followers
    cursor = get_db().execute("select steamid from userInfo where followid like ?;", [steamid])
    user = cursor.fetchall()
    cursor.close()
    # check if user exists and return true or false
    if user != []:
        return True
    else:
        return False
    
#method to fuzzy search User 
def searchUser(searchTerm):
    cursor = get_db().execute(
        "select steamid from userInfo where personname like ?;", (f"%{searchTerm}%",)
    )
    userSteamid = cursor.fetchall()
    cursor.close()
    return userSteamid
