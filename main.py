from flask import Flask

app = Flask(__name__)

@app.route("/")
def MainPage():
    return "<p>Testing commits</p>"

if __name__ == '__main__':
    
    app.run(host="localhost", port=4200)