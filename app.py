from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='web_app')

# Hardcoded users
USERS = {
    "user1": "pass1",
    "user2": "pass2"
}

@app.route('/')
def index():
    return send_from_directory('web_app', 'login.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username in USERS and USERS[username] == password:
        return jsonify({"success": True, "message": "Login successful", "redirect": "/dashboard"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/dashboard')
def dashboard():
    return send_from_directory('web_app', 'dashboard.html')

# Serve other static files (css, js, images) if requested directly
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('web_app', filename)

# Serve static images from static folder if needed (since styles reference ../static)
# The css references ../static/images/bg-image.jpeg. 
# If css is served from /login.css, then ../static resolves to /static.
@app.route('/static/<path:filename>')
def serve_static_assets(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
