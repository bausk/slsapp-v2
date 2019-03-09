import json
import os
from os import path
from flask import Flask, jsonify
from flask_cors import cross_origin, CORS


if __name__ == '__main__':
    script_dir = os.path.dirname(__file__)
    rel_path = 'secrets.dev.json'
    abs_file_path = os.path.join(script_dir, rel_path)
    for key, val in json.load(open(abs_file_path)).items():
        os.environ[key] = val


from utils.auth import requires_auth, add_error_handler
from utils.gdrive import get_dataframe


app = Flask(__name__)
CORS(app)
add_error_handler(app)

@app.route("/api/public")
@requires_auth
def hello3():
    response = get_dataframe()
    return response.to_json()


@app.route("/api/private")
@requires_auth
def hello4():
    response = get_dataframe()
    return response.to_json()


if __name__ == '__main__':
    app.debug = False
    app.run(host="0.0.0.0", port=3000)
