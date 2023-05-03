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


steam_openid_url = "https://steamcommunity.com/openid/login"

api_key = "FB453E73DBD4107207669FA395CBC366"

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
        detail_friend_list = requests.get(url, params)

        return make_response(detail_friend_list.content, 200)  # OK


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
            print(steamid)
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
                        "aboutProfile": None,
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


if __name__ == "__main__":
    app.run(debug=True)

# Backup can be deleted soon

# @api.resource('/authWSteam')
# class SteamLogin(Resource):
#    def loginSteam(self):
#        print("test")
#        steamLogin = SteamSignIn()
#        return steamLogin.RedirectUser(steamLogin.ConstructURL('http://localhost:3000/processSteamLogin'))
