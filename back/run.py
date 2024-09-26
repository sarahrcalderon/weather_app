from flask import Flask, send_from_directory
from rotas import app as api_app

app = Flask(__name__, static_folder='../front/build/static', template_folder='../front/build')

app.register_blueprint(api_app)

@app.route('/')
def index():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    app.run(debug=True)
