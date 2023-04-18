import hashlib
from hashlib import sha256 #DOCU
from flask import Flask, Response, jsonify, request, send_file, send_from_directory, redirect, session,make_response
from flask_restful import Api, Resource, reqparse,fields, marshal_with
from urllib.parse import urlencode
from flask_cors import CORS
from os import environ

import json
import os, sys


app = Flask(__name__)

api = Api(app)
CORS(app) # enable CORS on all routes


steam_openid_url = 'https://steamcommunity.com/openid/login'

parser = reqparse.RequestParser()
parser.add_argument('task')
class Message(Resource):
    def get(self):
        return {"message": 'Hello World'}
api.add_resource(Message, '/hello')

@api.resource('/login')
class Login(Resource):
    def post(self):
        data = request.json
        print("data")
        token = hashlib.sha1(os.urandom(24)).hexdigest()
        print("token")
        # created dictonary response
        tokenResp = {"token": token}
        print(token)
        # session created and user is logged in
        return make_response(jsonify(tokenResp), 201)  # CREATED

@api.resource('/auth')
class SteamLogin(Resource):
    def post(self):
        params = {
            'openid.ns': "http://specs.openid.net/auth/2.0",
            'openid.identity': "http://specs.openid.net/auth/2.0/identifier_select",
            'openid.claimed_id': "http://specs.openid.net/auth/2.0/identifier_select",
            'openid.mode': 'checkid_setup',
            'openid.return_to': 'http://127.0.0.1:5000/authorize',
            'openid.realm': 'http://127.0.0.1:5000'
        }
        query_string = urlencode(params)
        auth_url = steam_openid_url + "?" + query_string
        print(auth_url)
        return redirect(auth_url)
    
@app.route("/authorize")
def authorize():
  print(request.args)
  return json.dumps(request.args) + '<br><br><a href="http://localhost:5000/auth">Login with steam</a>'


if __name__ == '__main__':
    app.run(debug=True)