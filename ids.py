from flask import Flask, render_template
import json

app = Flask(__name__)

def parse_logs():
    alerts = []
    with open("rules.json") as f:
        rules = json.load(f)

    blocked_users = rules["blocked_users"]
    max_attempts = rules["max_attempts"]

    with open("logs.txt") as f:
        lines = f.readlines()

    login_attempts = {}
    
    for line in lines:
        if "user:" in line:
            parts = line.strip().split()
            username = parts[0].split(":")[1]
            result = parts[1]

            if username not in login_attempts:
                login_attempts[username] = 0

            if result == "failed":
                login_attempts[username] += 1

            if username in blocked_users or login_attempts[username] > max_attempts:
                alerts.append(f"Suspicious activity from user '{username}'.")

    return alerts

@app.route("/")
def index():
    alerts = parse_logs()
    return render_template("index.html", alerts=alerts)

if __name__ == "__main__":
    app.run(debug=True)

