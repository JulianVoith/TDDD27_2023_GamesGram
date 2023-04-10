from flask import Flask
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)

api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('task')
class Message(Resource):
    def get(self):
        return {"message": 'Hello World'}
api.add_resource(Message, '/hello')

if __name__ == '__main__':
    app.run(debug=True)