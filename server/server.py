from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# starts the appliocation and is similar to the maisfngsgn method/function
if __name__ == "__main__":
    app.debug == True
    app.run()
