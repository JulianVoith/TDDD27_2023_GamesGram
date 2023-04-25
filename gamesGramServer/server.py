import hashlib
from hashlib import sha256 #DOCU
from flask import Flask, Response, jsonify, request, send_file, send_from_directory, redirect, session,make_response
from flask_restful import Api, Resource, reqparse,fields, marshal_with
from urllib.parse import urlencode
from flask_cors import CORS,  cross_origin
from os import environ
from pysteamsignin.steamsignin import SteamSignIn #import for steam signin

import database_helper
import json
import os, sys
import requests


app = Flask(__name__)

api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}}) # enable CORS on all routes


steam_openid_url = 'https://steamcommunity.com/openid/login'

api_key = 'FB453E73DBD4107207669FA395CBC366'

parser = reqparse.RequestParser()
parser.add_argument('task')
class Message(Resource):
    def get(self):
        return {"message": 'Hello World'}
api.add_resource(Message, '/hello')

@api.resource('/login')#Not in use now
class Login(Resource):
    def post(self):
        data = request.json
        steamid=data['steamID']
        if database_helper.activeSessionSteamid(steamid):
             token= database_helper.activeSessionSteamid(steamid)
             tokenResp = {"token": token}
             return make_response(jsonify(tokenResp), 200) #OK
        else:
            token = hashlib.sha1(os.urandom(24)).hexdigest()
            # created dictonary response
            tokenResp = {"token": token}
            if database_helper.createUserSession(steamid, token):
                # session created and user is logged in
                return make_response(jsonify(tokenResp), 201) #CREATED
            else:
            # database error
                return "", 500  # internal server error

@api.resource('/signout')#Not in use now
class SignOut(Resource):
    def delete(self):
        if request.headers['token']:
            if database_helper.deleteSession(request.headers['token']):
                # Session successfully deleted
                return "", 200  # OK
            else:
                # database error
                return "", 500  # internal server error
        else:
            # response if not signed in
            return "", 401  # UNAUTHORIZED
        

#API resource to follow other user
@api.resource('/follow')
class FollowUser(Resource):
    def post(self):
        data = request.json
        steamid = database_helper.getSteamidByToken(data['token'])
        if steamid:
            if database_helper.userExists(data['followid']):
                if database_helper.followUser(steamid, data['followid']):
                    return "", 201 #OK
                else:
                    return "", 500 #internal server error
            else:
                return "",404 # NO FOUND

        else:
            return "", 404 # NO FOUND
        
#API resource to follow other user
@api.resource('/getFollower')
class GetFollower(Resource):
    def post(self):
        data = request.json
        steamid = data['steamid']
        if steamid:
            if database_helper.userExists(steamid):
                databaseData = database_helper.getFollower(steamid)
                return make_response(jsonify(databaseData), 200)
            else:
                return "",404 #

        else:
            return "", 401
            
@api.resource('/GetUserInfo')
class GetUserInfo(Resource):
    def get(self):
        if request.headers['token']:
            token=request.headers['token']
            if database_helper.getSteamidByToken(token):
                steamids=database_helper.getSteamidByToken(token)
                #print('steamids:',steamids)
                url='http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
                params={
                    "key": api_key,
                    "steamids":steamids
                }
                DetailFriendList=requests.get(url, params)
                return make_response(DetailFriendList.content, 200)  # OK
            else:
                # database error
                return "", 500  # internal server error
        else:
            return "",404 #

@api.resource('/GetFriendList')
class GetFriendList(Resource):
    def post(self):

        steamid = request.json['steamid'] #fetch steamid from client
        params={"key": api_key,"steamid":steamid,"relationship": "friend"}
        url='https://api.steampowered.com/ISteamUser/GetFriendList/v0001/'
        response = requests.get(url, params)

        #url='http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
        #params={
        #     "key": api_key,
        #     "steamids":steamids
        #}
        #DetailFriendList=requests.get(url, params)
        return make_response(response.content, 200)  # OK

#build method for fetching details of users. only when needed!

@app.route('/authWSteam2')
def loginSteam():
    steamLogin = SteamSignIn()
    return steamLogin.RedirectUser(steamLogin.ConstructURL('http://localhost:3000/'))

@api.resource('/processSteamLogin')
class processSteamLogin(Resource):
    def post(self):
        returnData = request.json
        steamid = returnData['openid.claimed_id'][37:]

        # Better method, should fix it latter

        #SteamLogin = SteamSignIn()
        #steamid = SteamLogin.ValidateResults(returnData)

        if database_helper.activeSessionSteamid(steamid) and steamid:
             token= database_helper.activeSessionSteamid(steamid)
             tokenResp = {"token": token}
             return make_response(jsonify(tokenResp), 200) # OK
        else:
            print(steamid)
            token = hashlib.sha1(os.urandom(24)).hexdigest()
            # created dictonary response
            tokenResp = {"token": token}
            if database_helper.userExists(steamid):
                 if database_helper.createUserSession(steamid, token) and steamid:
                     return make_response(jsonify(tokenResp), 201) #CREATED
                 else:
                # database error
                    return "", 500  # internal server error
            else:
                 params={
                    "key": api_key,
                    "steamids":steamid
                }
                 url='http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
                 response = requests.get(url, params)
                 if response.status_code==200:
                     personaname=json.loads(response.content)['response']['players'][0]['personaname']
                     userInformation={
                        "steamid": steamid,
                        "personname": personaname,
                        "aboutProfile": None
                     }
                     if database_helper.createUser(userInformation):
                         if database_helper.createUserSession(steamid, token) and steamid:
                            return make_response(jsonify(tokenResp), 201) #CREATED
                         else:
                            # database error
                            return "", 500  # internal server error
                     else:
                         return "",500 
                 else:
                     return "", 502  # Bad Gateway
            
                # session created and user is logged in
                
            
            
if __name__ == '__main__':
    app.run(debug=True)#host="localhost", port=3000)

#Backup can be deleted soon

#@api.resource('/authWSteam')
#class SteamLogin(Resource):
#    def loginSteam(self):
#        print("test")
#        steamLogin = SteamSignIn()
#        return steamLogin.RedirectUser(steamLogin.ConstructURL('http://localhost:3000/processSteamLogin'))

"""              if database_helper.userExists(steamid):
                 return make_response(jsonify(tokenResp), 200) #OK
             else:
                 params={"key": api_key,"steamid":steamid,"relationship": "friend"}
                 url='https://api.steampowered.com/ISteamUser/GetFriendList/v0001/'
                 response = requests.get(url, params)
                 if response.status_code==200:
                     personaname=json.loads(response.content)['response']['players'][0]['personaname']
                     userInformation={
                        "steamid": steamid,
                        "personname": personaname,
                        "aboutProfile": None
                     }
                     if database_helper.createUser(userInformation):
                         return "",201 # Created
                     else:
                         return "",500 
                 else:
                     return "", 502  # Bad Gateway  """