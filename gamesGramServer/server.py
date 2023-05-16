import hashlib
import json
import os
import sys
from hashlib import sha256  # DOCU
from os import environ
from urllib.parse import urlencode
from flask_cors import CORS,  cross_origin
from os import environ
from pysteamsignin.steamsignin import SteamSignIn #import for steam signin
from werkzeug.utils import secure_filename

import database_helper
import requests
from flask import (
    Flask,
    Response,
    jsonify,
    make_response,
    redirect,
    request,
    send_file,
    send_from_directory,
    session,
)
from flask_cors import CORS, cross_origin
from flask_restful import Api, Resource, fields, marshal_with, reqparse
from pysteamsignin.steamsignin import SteamSignIn  # import for steam signin

app = Flask(__name__)

api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})  # enable CORS on all routes

#Gloabal declarations
#Steam authentification
steam_openid_url = 'https://steamcommunity.com/openid/login'
api_key = 'FB453E73DBD4107207669FA395CBC366'
#Media upload
# paths for media 
img_path = "data/images/"
audio_path = "data/audios/"
video_path = "data/videos/"
upload_path_img = os.path.join(app.root_path, img_path)
upload_path_audio = os.path.join(app.root_path, audio_path)
upload_path_video = os.path.join(app.root_path, video_path)

parser = reqparse.RequestParser()
parser.add_argument("task")


class Message(Resource):
    def get(self):
        return {"message": "Hello World"}


api.add_resource(Message, "/hello")


@api.resource("/login")  # Not in use now
class Login(Resource):
    def post(self):
        data = request.json
        steamid = data["steamID"]
        if database_helper.activeSessionSteamid(steamid):
            token = database_helper.activeSessionSteamid(steamid)
            tokenResp = {"token": token}
            return make_response(jsonify(tokenResp), 200)  # OK
        else:
            token = hashlib.sha1(os.urandom(24)).hexdigest()
            # created dictonary response
            tokenResp = {"token": token}
            if database_helper.createUserSession(steamid, token):
                # session created and user is logged in
                return make_response(jsonify(tokenResp), 201)  # CREATED
            else:
                # database error
                return "", 500  # internal server error


@api.resource("/signout")  # Not in use now
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


# API resource to follow other user
@api.resource("/follow")
class FollowUser(Resource):
    def post(self):
        data = request.json
        steamid = database_helper.getSteamidByToken(data["token"])
        if steamid:
            if database_helper.userExists(data["followid"]):
                if database_helper.followUser(steamid, data["followid"]):
                    return "", 201  # OK
                else:
                    return "", 500  # internal server error
            else:
                return "", 404  # NO FOUND

        else:
            return "", 404  # NO FOUND


# API resource to follow other user
@api.resource("/getFollower")
class GetFollower(Resource):
    def post(self):
        data = request.json
        steamid = data["steamid"]
        if steamid:
            if database_helper.userExists(steamid):
                databaseData = database_helper.getFollower(steamid)
                return make_response(jsonify(databaseData), 200)
            else:
                return "", 404  #

        else:
            return "", 401


@api.resource("/GetUserInfo", "/GetUserInfo/<string:steamid>")
class GetUserInfo(Resource):
    def get(self, steamid=None):
        # Check if the request header contains a token
        token = request.headers.get("token")
        if not token:
            return "", 401  # Unauthorized

        # Get steamid from the database if not provided as a parameter
        if steamid is None:
            steamid = database_helper.getSteamidByToken(token)
            if not steamid:
                return "", 500  # Internal server error

        # Request user details from the Steam API
        url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
        params = {"key": api_key, "steamids": steamid}

        #fetch information from stem api
        details = requests.get(url, params).json()
        #fetch user information from platform databse
        platforminfo = database_helper.getUser(steamid)

        #add custom user description if existing
        if platforminfo:
            details["response"]["players"][0]["description"] = platforminfo[2]
        else:
            details["response"]["players"][0]["description"] = "No information available."
            

        return make_response(details, 200)  # OK


@api.resource("/GetRecentlyPlayedGames/<string:steamid>")
class GetRecentlyPlayedGames(Resource):
    def get(self, steamid):
        params = {"key": api_key, "steamid": steamid, "count": 0}
        url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/"
        response = requests.get(url, params)
        result=json.loads(response.content)['response']['games']
        return make_response(jsonify(result), 200)  # OK


@api.resource("/GetFriendList")
class GetFriendList(Resource):
    def post(self):
        steamid = request.json["steamid"]  # fetch steamid from client
        params = {"key": api_key, "steamid": steamid, "relationship": "friend"}
        url = "https://api.steampowered.com/ISteamUser/GetFriendList/v0001/"
        response = requests.get(url, params)

        # url='http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
        # params={
        #     "key": api_key,
        #     "steamids":steamids
        # }
        # DetailFriendList=requests.get(url, params)
        return make_response(response.content, 200)  # OK


# build method for fetching details of users. only when needed!


@app.route("/authWSteam2")
def loginSteam():
    steamLogin = SteamSignIn()
    return steamLogin.RedirectUser(steamLogin.ConstructURL("http://localhost:3000/"))


@api.resource("/processSteamLogin")
class processSteamLogin(Resource):
    def post(self):
        returnData = request.json
        steamid = returnData["openid.claimed_id"][37:]

        # Better method, should fix it latter
        """ 
        SteamLogin = SteamSignIn()
        steamid = SteamLogin.ValidateResults(returnData)
        """
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
                        "aboutProfile": "No information availabe."
                     }
                    if database_helper.createUser(userInformation):
                         if database_helper.createUserSession(steamid, token) and steamid:
                            return make_response(jsonify(tokenResp), 201) #CREATED
                         else:
                            # database error
                            return "", 500  # internal server error
                    else:
                        return "", 500
                else:
                    # steam server is not available
                    return "", 502  # Bad Gateway

            # session created and user is logged in


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
@api.resource("/createPost")
class CreatePost(Resource):
    def post(self):
        
        #Fetch token from header and check if session is acrive
        token = request.headers.get('token')

        if database_helper.activeSession(token):

            #get media data
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
                    if database_helper.createPost(database_helper.getSteamidByToken(token), request.form.get("category"), request.form.get("descr"), request.form.get("access"), mediaFilename):

                        return "", 201  # successfully uploaded
                    
                    else:

                        #If post upload goes wrong associated media gets deleted from disc
                        database_helper.deleteMedia(mediaFilename)
                        os.remove(os.path.join(uploadpath, mediaFilename))

                        return "", 500  # internal server error

                else:
                    # incase upload goes wron. remove linkage from emssage
                    database_helper.updateUserMessageMedia(
                        "", request.form.get("messageID")
                    )
                    # database error
                    return "", 500  # internal server error
            else:
                return "", 400 #badrequst
            #check content type
        #create database entry with id
        else:
            return "", 401  # Unauthorized

#Interface for creating a post with media
@api.resource("/getPosts/<string:steamid>")
class GetPosts(Resource):
    def get(self, steamid):
        
        print(steamid)

         #Fetch token from header and check if session is acrive
        token = request.headers.get('token')

        #Check if there is an active session
        if database_helper.activeSession(token):
            
            #response init
            postResponse = []

            #fetch posts by steamid
            posts = database_helper.getUserPosts(steamid)

            #iterate through posts and creat dictionary and stream url and pass back to client
            for post in posts:

                typeOfMedia = database_helper.getMedia(post[4])
                print(typeOfMedia);
                if typeOfMedia[1] == "image":
                    url = "/image_feed/" + post[4]
                elif typeOfMedia[1] == "video":
                    url = "/video_feed/" + post[4]
                else:
                    url = "/audio_feed/" + post[4]

                postResponse.append({
                    "steamid": post[0],
                    "appid": post[1],
                    "descr": post[2],
                    "accessRuleID": post[3],
                    "filenam": post[4],
                    "timestamp": post[5],
                    "url": url
                })
            
            #if existing return json of table entries
            if postResponse is not None:

                return make_response(jsonify(postResponse), 200) #OK
            
            else:
                return 404 #notfound
        else:
            return "", 401 #unauthorized

# function for streaming an image to the wall
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

if __name__ == '__main__':
    app.run(debug=True)

