from flask import Flask, Response, jsonify, request, send_file, send_from_directory, redirect
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)

api = Api(app)

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
        print(data)
        return "",200




if __name__ == '__main__':
    app.run(debug=True)