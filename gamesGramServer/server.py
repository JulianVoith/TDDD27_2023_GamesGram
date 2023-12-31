import hashlib
import json
import os
import sys
from hashlib import sha256  # DOCU
from os import environ
from urllib.parse import urlencode

import database_helper
import requests
from flask import (
    Flask,
    Response,
    jsonify,
    make_response,
    request,
)

from flask_cors import CORS, cross_origin
from flask_restful import Api, Resource, fields, marshal_with, reqparse
from pysteamsignin.steamsignin import SteamSignIn  # import for steam signin
from werkzeug.utils import secure_filename

app = Flask(__name__)
api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Gloabal declarations

# Steam authentification
steam_openid_url = "https://steamcommunity.com/openid/login"
api_key = "FB453E73DBD4107207669FA395CBC366"
# Media upload
# paths for media
img_path = "data/images/"
audio_path = "data/audios/"
video_path = "data/videos/"
upload_path_img = os.path.join(app.root_path, img_path)
upload_path_audio = os.path.join(app.root_path, audio_path)
upload_path_video = os.path.join(app.root_path, video_path)

parser = reqparse.RequestParser()
parser.add_argument("task")

#@app.route("/http-call")
#def http_call():
#    """return JSON with string data as the value"""
#    data = {"data": "This text was fetched using an HTTP call to server on render"}
#    return jsonify(data)


#@socketio.on("connect")
#def connected():
#    """event listener when client connects to the server"""
#    # print(request.sid)
#    # print("client has connected")
#    emit("connect", {"data": f"id: {request.sid} is connected"})


#@socketio.on("data")
#def handle_message(data):
#    """event listener when client types a message"""
#    print("data from the front end: ", str(data))
#    emit("data", {"data": data, "id": request.sid}, broadcast=True)


#@socketio.on("disconnect")
#def disconnected():
#    """event listener when client disconnects to the server"""
#    # print("user disconnected")
#    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)


# route for socket creation
# @sockets.route("/")
# def echo_socket(sockets):
# run websocket until it is closed down
#    print("CONNECTED")
#    while True:
# receive email and hexcode of the token from client
#        payload = json.loads(sockets.receive())
# split it up into variables
#        steamid = payload["steamid"]
# HEX = payload["HEX"]

# check if there is an active session of the user
#        activeSession = database_helper.activeSessionSteamid(steamid)
# fetch the token from the database and hash it
# REHEX = sha256(activeSession.encode("utf-8")).hexdigest()

# check if there is an active session and the transmitted and genereted hex code are the same
#        if activeSession:
# replace users ws with new one after e.g. a refresh, if combination is new add it (stored by the hex)
#            client_list[steamid] = sockets
# ß            print(client_list)
#        else:
#            sockets.close(1000, "signOut")

#API to sign user out and delete session
@api.resource("/signout")  
class SignOut(Resource):
    def delete(self):
        if request.headers["token"]:
            if database_helper.deleteSession(request.headers["token"]):
                # Session successfully deleted
                return "", 200  # OK
            else:
                # database error
                return "", 500  # internal server error
        else:
            # response if not signed in
            return "", 401  # UNAUTHORIZED

#API to get user information of a user. Without transmitted steam id it will be fetched based on the token
@api.resource("/GetUserInfo", "/GetUserInfo/<string:steamid>")
class GetUserInfo(Resource):
    def get(self, steamid=None):
        # Check if the request header contains a token
        token = request.headers.get("token")  # MAYBE BACK TODO
        ##if not token:
        ##    return "", 401  # Unauthorized

        # Get steamid from the database if not provided as a parameter
        if steamid is None:
            steamid = database_helper.getSteamidByToken(token)
            if not steamid:
                return "", 500  # Internal server error

        # Request user details from the Steam API
        url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
        params = {"key": api_key, "steamids": steamid}

        # fetch information from stem api
        details = requests.get(url, params).json()
        # fetch user information from platform databse
        platforminfo = database_helper.getUser(steamid)

        # add custom user description if existing
        if platforminfo:
            details["response"]["players"][0]["description"] = platforminfo[2]
        else:
            details["response"]["players"][0][
                "description"
            ] = "No information available."

        return make_response(details, 200)  # OK

#API to fetch recently played games from the steam servers
@api.resource("/GetRecentlyPlayedGames/<string:steamid>")
class GetRecentlyPlayedGames(Resource):
    def get(self, steamid):
        params = {"key": api_key, "steamid": steamid, "count": 0}
        url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/"
        response = requests.get(url, params)
        if "games" in json.loads(response.content)["response"]:
            result = json.loads(response.content)["response"]["games"]
            return make_response(jsonify(result), 200)  # OK
        else:
            return 404  # NO FOUND

#API to fetch the friendlist of a specific profile
@api.resource("/GetFriendList/<string:steamid>")
class GetFriendList(Resource):
    def get(self, steamid):
        
        #Fetch steamids of the users friends from the Steam API
        params = {"key": api_key, "steamid": steamid, "relationship": "friend"}
        url = "https://api.steampowered.com/ISteamUser/GetFriendList/v0001/"
        response = requests.get(url, params)
        result = json.loads(response.content)["friendslist"]["friends"]
        print(len(result))
        steamids = []
        for i in result:
            steamids.append(i["steamid"])
        steamids = ", ".join(map(str, steamids))
        
        # Request friends details from the Steam API
        url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
        params = {"key": api_key, "steamids": steamids}

        # fetch information from stem api
        details = requests.get(url, params).json()

        return make_response(details["response"]["players"], 200)  # OK

#API Endpoint for authentification via Steam servers. Is using third-party extension for python.
@app.route("/authWSteam2")
def loginSteam():
    steamLogin = SteamSignIn()
    return steamLogin.RedirectUser(steamLogin.ConstructURL("http://localhost:3000/"))

#API to process the login onto the platform. Creates user information on databaase if its a users first sign in
@api.resource("/processSteamLogin")
class processSteamLogin(Resource):
    def post(self):
        returnData = request.json
        steamid = returnData["openid.claimed_id"][37:]

        if database_helper.activeSessionSteamid(steamid) and steamid:
            token = database_helper.activeSessionSteamid(steamid)
            tokenResp = {"token": token}
            return make_response(jsonify(tokenResp), 200)  # OK
        else:
            token = hashlib.sha1(os.urandom(24)).hexdigest()
            # created dictonary response
            tokenResp = {"token": token}
            if database_helper.userExists(steamid):
                if database_helper.createUserSession(steamid, token) and steamid:
                    return make_response(jsonify(tokenResp), 201)  # CREATED
                else:
                    # database error
                    return "", 500  # internal server error
            else:
                # first login, create the user info
                params = {"key": api_key, "steamids": steamid}
                url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
                response = requests.get(url, params)
                # fetch user personaname by steamid, personaname is for search user
                if response.status_code == 200:
                    personaname = json.loads(response.content)["response"]["players"][
                        0
                    ]["personaname"]
                    userInformation = {
                        "steamid": steamid,
                        "personname": personaname,
                        "aboutProfile": "No information availabe.",
                    }
                    if database_helper.createUser(userInformation):
                        if (
                            database_helper.createUserSession(steamid, token)
                            and steamid
                        ):
                            return make_response(jsonify(tokenResp), 201)  # CREATED
                        else:
                            # database error
                            return "", 500  # internal server error
                    else:
                        return "", 500 #internal server error
                else:
                    # steam server is not available
                    return "", 502  # Bad Gateway

#API to search user on the platform
@api.resource("/search/<string:searchTerm>")
class GetUser(Resource):
    def get(self, searchTerm):
        result = database_helper.searchUser(searchTerm)
        if len(result):
            result_str = [(str(n),) for n in result]
            response_data = json.dumps(result_str)
            return make_response(response_data, 200)  # OK
        else:
            return "", 404  # NO FOUND


#Interface for creating a post with media
#Capable of uploading image audio and video
@api.resource("/createPost")
class CreatePost(Resource):
    def post(self):

        # Fetch token from header and check if session is acrive
        token = request.headers.get("token")
        if database_helper.activeSession(token):

            # get transmitted media data
            media = request.files.get("file")

            # validate if file is an image, audio or video
            if (
                media.content_type[0:5] == "image"
                or media.content_type[0:5] == "audio"
                or media.content_type[0:5] == "video"
            ) and media is not None:
                
                # make safe filename give it the next id and save it into message data
                mediaFilename = media.filename
                # create new filename with an unique ID
                partition = mediaFilename.rpartition(".")
                # fetch latest used id
                lastId = database_helper.getLastUsedID()

                if lastId is None:
                    lastId = 1
                else:
                    lastId = lastId + 1

                # create new filename for media
                mediaFilename = secure_filename(
                    str(lastId) + partition[1] + partition[2]
                ).lower()

                # create new table entry
                if database_helper.uploadMedia(mediaFilename, media.content_type[0:5]):
                    # save image to disk depending on media type
                    if media.content_type[0:5] == "image":
                        uploadpath = upload_path_img
                    elif media.content_type[0:5] == "audio":
                        uploadpath = upload_path_audio
                    else:
                        uploadpath = upload_path_video

                    # save media on disk
                    media.save(os.path.join(uploadpath, mediaFilename))

                    # create post itself after media upload
                    if database_helper.createPost(
                        database_helper.getSteamidByToken(token),
                        request.form.get("category"),
                        request.form.get("descr"),
                        request.form.get("access"),
                        mediaFilename,
                    ):
                        return "", 201  # successfully uploaded

                    else:
                        # If post upload goes wrong associated media gets deleted from disc
                        database_helper.deleteMedia(mediaFilename)
                        os.remove(os.path.join(uploadpath, mediaFilename))

                        return "", 500  # internal server error

                else:
                    # database error
                    return "", 500  # internal server error
            else:
                return "", 400  # badrequst
        else:
            return "", 401  # Unauthorized


# API for the post like system
# @head -> # Check if a user has liked a specific post
# @delete ->  # Handling user unlikes of posts
# @post ->  # Handle users adding new likes
@api.resource("/PostLike/<string:postID>")
class PostLike(Resource):
    def head(self, postID):
        # Check if a user has liked a specific post
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            steamid = database_helper.getSteamidByToken(token)
            if database_helper.isCommentLiked(steamid, postID):
                return "", 200  # ok
            else:
                return "", 404  # no found
        else:
            return "", 401  # Unauthorized

    def delete(self, postID):
        # Handling user unlikes of posts
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            steamid = database_helper.getSteamidByToken(token)
            if database_helper.deleteCommentLiked(steamid, postID):
                return "", 200  # ok
            else:
                return "", 404  # no found
        else:
            return "", 401  # Unauthorized

    def post(self, postID):
        # Handle users adding new likes
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            steamid = database_helper.getSteamidByToken(token)
            if database_helper.addCommentLiked(steamid, postID):
                return "", 201  # created
            else:
                return "", 404  # no found
        else:
            return "", 401  # Unauthorized

    def get(self, postID):
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            result = database_helper.countCommentLiked(postID)
            return make_response(jsonify({"likesCount": result}), 200)  # ok
        else:
            return "", 401  # Unauthorized


# API for comment like system
# @head -> # Check if a user has liked a specific comment
# @delete ->  # Handling user unlikes of comment
# @post ->  # Handle users adding new likes of a comment
@api.resource("/CommentLike/<string:commentID>")
class CommentLike(Resource):
    def head(self, commentID):
        # Check if a user has liked a specific post
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            steamid = database_helper.getSteamidByToken(token)
            if database_helper.isPostLiked(steamid, commentID):
                return "", 200  # ok
            else:
                return "", 404  # no found
        else:
            return "", 401  # Unauthorized

    def delete(self, commentID):
        # Handling user unlikes of posts
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            steamid = database_helper.getSteamidByToken(token)
            if database_helper.deletePostLiked(steamid, commentID):
                return "", 200  # ok
            else:
                return "", 404  # no found
        else:
            return "", 401  # Unauthorized

    def post(self, commentID):
        # Handle users adding new likes
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            steamid = database_helper.getSteamidByToken(token)
            if database_helper.addPostLiked(steamid, commentID):
                return "", 201  # created
            else:
                return "", 404  # no found
        else:
            return "", 401  # Unauthorized

    def get(self, commentID):
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            result = database_helper.countPostLiked(commentID)
            return make_response(jsonify({"likesCount": result}), 200)  # ok
        else:
            return "", 401  # Unauthorized


# API for creating a post with media
@api.resource("/getPosts/<string:steamid>")
class GetPosts(Resource):
    def get(self, steamid):
        # Fetch token from header and check if session is acrive
        ##token = request.headers.get('token') 

        # Check if there is an active session
        ##if database_helper.activeSession(token):

        # response init
        postResponse = []

        # fetch posts by steamid
        posts = database_helper.getUserPosts(steamid)

        # iterate through posts and creat dictionary and stream url and pass back to client
        for post in posts:
            typeOfMedia = database_helper.getMedia(post[4])

            if typeOfMedia[1] == "image":
                url = "/image_feed/" + post[4]
            elif typeOfMedia[1] == "video":
                url = "/video_feed/" + post[4]
            else:
                url = "/audio_feed/" + post[4]

            postResponse.append(
                {
                    "steamid": post[0],
                    "appid": post[1],
                    "descr": post[2],
                    "accessRuleID": post[3],
                    "filenam": post[4],
                    "timestamp": post[5],
                    "url": url,
                }
            )

        # if existing return json of table entries
        if postResponse is not None:
            return make_response(jsonify(postResponse), 200)  # OK

        else:
            return 404  # notfound
        ##else:
        ##   return "", 401 #unauthorized


# API for returning all post relevant for Home page
@api.resource("/getHome/<string:steamid>")
class GetHome(Resource):
    def get(self, steamid):
        postResponse = []
        followers = []
        followers.append(steamid)

        #Fetch all follower
        for follower in database_helper.getUserFollowed(steamid):
            followers.append(str(follower))

        #Only get posts based on followship
        for follow in followers:
            # fatch all post
            posts = database_helper.getUserPosts(follow)
            for post in posts:
                typeOfMedia = database_helper.getMedia(post[4])

                if typeOfMedia[1] == "image":
                    url = "/image_feed/" + post[4]
                elif typeOfMedia[1] == "video":
                    url = "/video_feed/" + post[4]
                else:
                    url = "/audio_feed/" + post[4]

                postResponse.append(
                    {
                        "steamid": str(post[0]),
                        "appid": str(post[1]),
                        "descr": str(post[2]),
                        "accessRuleID": str(post[3]),
                        "filenam": str(post[4]),
                        "timestamp": str(post[5]),
                        "url": str(url),
                    }
                )
        # sort according timestamp
        postResponse.sort(key=lambda x: x["timestamp"], reverse=True)
        # if existing return json of table entries
        if postResponse is not None:
            return make_response(jsonify(postResponse), 200)  # OK

        else:
            return 404  # notfound


# API for fetching posts related to a game 
@api.resource("/getGame/<string:appid>")
class GetGame(Resource):
    def get(self, appid):
        postResponse = []
        # fatch all post
        posts = database_helper.getGamePosts(appid)
        
        for post in posts:
            typeOfMedia = database_helper.getMedia(post[4])

            if typeOfMedia[1] == "image":
                url = "/image_feed/" + post[4]
            elif typeOfMedia[1] == "video":
                url = "/video_feed/" + post[4]
            else:
                url = "/audio_feed/" + post[4]

            postResponse.append(
                {
                    "steamid": str(post[0]),
                    "appid": str(post[1]),
                    "descr": str(post[2]),
                    "accessRuleID": str(post[3]),
                    "filenam": str(post[4]),
                    "timestamp": str(post[5]),
                    "url": str(url),
                }
            )
        # if existing return json of table entries
        if postResponse is not None:
            return make_response(jsonify(postResponse), 200)  # OK

        else:
            return 404  # notfound

#API to fetch latest news about a game from the Steam API
@api.resource("/getGameNews/<string:appid>")
class GetGameNews(Resource):
    def get(self, appid):
        params = {"appid": appid}
        url = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2"
        response = requests.get(url, params)
        postResponse = json.loads(response.content)["appnews"]["newsitems"]
        if response.status_code == 200:
            return make_response(jsonify(postResponse), 200)  # OK
        else:
            # steam server is not available
            return "", 502  # Bad Gateway


#Router to steam image from backend to the platform frontend
@app.route("/image_feed/<image>", methods=["GET"])
def image_feed(image):
    # partition for correct mimetype
    mime = image.rpartition(".")
    mimetype = "image/" + mime[2]

    # method to stream image for Response
    def gen(imagename):
        # get image and stream
        image = open(
            upload_path_img + imagename, "rb"
        ).read()  # send_from_directory(upload_path_img, imagename)
        yield image

    return Response(gen(image), status=200, mimetype=mimetype), 200

""" # function to stream an audio to the wall in chunks. allows scrolling around
@app.route("/audio_feed/<audio>", methods=["GET"])
def audio_feed(audio):
    # partition for correct mimetype
    mime = audio.rpartition(".")
    mimetype = "audio/" + mime[2]

    # create response in chunks
    return Response(get_chunk(upload_path_audio + audio), status=200, mimetype=mimetype)


# function to stream an video to the wall in chunks. allows scrolling around
@app.route("/video_feed/<video>", methods=["GET"])
def video_feed(video):
    # partition for correct mimetype
    mime = video.rpartition(".")
    mimetype = "video/" + mime[2]

    # create response in chunks
    return Response(get_chunk(upload_path_video + video), status=200, mimetype=mimetype)

# creates chunks of media pgiles and streams them to the client 
def get_chunk(filepath):
    #fetch filesize and set step siz of data packets
    filesize = os.path.getsize(filepath)
    yielded = 0
    yield_size = 1024 * 1024

    # if byte1 is not None:
    #    if not byte2:
    #        byte2 = filesize
    #    yielded = byte1
    #    filesize = byte2

    with open(filepath, "rb") as f:
        content = f.read()

    # stream content to client
    while True:
        remaining = filesize - yielded
        if yielded == filesize:
            break
        if remaining >= yield_size:
            yield content[yielded : yielded + yield_size]
            yielded += yield_size
        else:
            yield content[yielded : yielded + remaining]
            yielded += remaining """

# API resource to get all users for server site rendering of dynamic route
@api.resource("/getUsers")
class GetUsers(Resource):
    def get(self):
        if database_helper.getAllUser():
            databaseUser = database_helper.getAllUser()
            userResponse = []
            for user in databaseUser:
                userResponse.append(str(user)[1:18]) 
            return make_response(jsonify(userResponse), 200)
        else:
            return "", 404  #


# API for following a user
@api.resource("/follow/<string:followid>")
class Follow(Resource):
    # function for following
    def get(self, followid):
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            steamid = database_helper.getSteamidByToken(token)
            if database_helper.setFollow(steamid, followid):
                return "", 201  # successfully followed
            else:
                return "", 500 # internal server error
        else:
            return "", 401  # unauthorized

    # function for unfollowing
    def delete(self, followid):
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            steamid = database_helper.getSteamidByToken(token)
            if database_helper.deleteFollow(steamid, followid):
                return "", 200  # successfully deleted
            else:
                return "", 500
        else:
            return "", 401  # unauthorized


#API for fetching followers of a user
@api.resource("/getFollowers/<string:steamid>")
class GetFollowers(Resource):
    def get(self, steamid):
        # token = request.headers.get('token') MAYBE BACK TODO
        # if database_helper.activeSession(token): MAYBE BACK TODO
        postResponse = []
        for follower in database_helper.getFollowers(steamid):
            postResponse.append(str(follower))
        postResponse = ", ".join(map(str, postResponse))

        # Request user details from the Steam API
        url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
        params = {"key": api_key, "steamids": postResponse}

        # fetch information from stem api
        details = requests.get(url, params).json()
        return make_response(details["response"]["players"], 200)  # OK


# API to create a comment on a post
@api.resource("/sendComment")
class SendComment(Resource):
    def post(self):
        token = request.headers.get("token")
        if database_helper.activeSession(token):
            commentData = request.json
            if database_helper.createComment(
                commentData["commentID"],
                commentData["authorSteamID"],
                commentData["postID"],
                commentData["content"],
            ):
                return "", 201  # successfully created
            else:
                return "", 500  # internal server error
        else:
            return "", 401  # unauthorized


#API to get comments and subcommentsof a post
@api.resource(
    "/getComments/<string:postID>", "/getComments/<string:postID>/<string:commentID>"
)
class GetComments(Resource):
    def get(self, postID, commentID=None):
        #        token = request.headers.get("token")
        #       if database_helper.activeSession(token):
        commentsResponse = []

        if commentID is None:
            comments = database_helper.getComments(postID)
        else:
            comments = database_helper.getSubComments(postID, commentID)

        for comment in comments:
            commentsResponse.append(
                {
                    "id": str(comment[0]),
                    "commentID": str(comment[1]),
                    "content": str(comment[2]),
                    "authorSteamID": str(comment[3]),
                    "postID": str(comment[4]),
                    "timestamp": str(comment[5]),
                }
            )

        return make_response(jsonify(commentsResponse), 200)  # OK


#        else:
#            return "", 401  # unauthorized


if __name__ == "__main__":
    app.run(debug=True, port=5001)
    #socketio.run(app, debug=True, port=5001)
