Intrusion Detection System Simulation

A simple Python-based Intrusion Detection System (IDS) that simulates detection of unauthorized login attempts using rule-based logic. The system flags suspicious activities and displays real-time alerts via a clean HTML/CSS dashboard served through Flask.

---

## 📌 Project Overview

This project simulates how a basic rule-based IDS works by:

- Parsing login attempt logs.
- Checking for rule violations (blocked users, too many failed attempts).
- Displaying intrusion alerts on a web dashboard.

It provides a practical demonstration of how early warning systems in cybersecurity can be built and visualized for security monitoring purposes.

---

## 🛠️ Technologies Used

- **Python** – Core logic and backend processing
- **Flask** – Lightweight web server to display real-time alerts
- **HTML/CSS** – Frontend for visualization
- **JSON** – Rule storage (blocked users, thresholds)

---

## 📂 Project Structure

Intrusion-Detection-System/
├── app.py # Flask server to render alerts
├── ids.py # Intrusion detection logic
├── logs.txt # Simulated login attempt logs
├── rules.json # Detection rules (blocked users, max failures)
├── templates/
│ └── dashboard.html # HTML dashboard layout
└── static/
└── style.css # Basic CSS styling

yaml
Copy
Edit

---

## 📄 Sample Files

### `logs.txt`
```text
user:admin failed
user:admin failed
user:admin failed
user:admin failed
user:guest failed
rules.json
json
Copy
Edit
{
  "blocked_users": ["admin", "root", "guest"],
  "max_failed_attempts": 3
}
🚀 How to Run the Project
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/Vedant-lab-15/Intrusion-Detection-System.git
cd Intrusion-Detection-System
2. Create a Virtual Environment (Optional but Recommended)
bash
Copy
Edit
python -m venv venv
source venv/bin/activate    # On Linux/macOS
venv\Scripts\activate       # On Windows
3. Install Required Libraries
bash
Copy
Edit
pip install flask
4. Run the Application
bash
Copy
Edit
python app.py
5. Open in Browser
Visit: http://127.0.0.1:5000

🧠 How It Works
ids.py reads the login attempts from logs.txt.

It checks each attempt against rules in rules.json:

If a user is blocked, or

If a user has too many failed attempts.

Generates alerts for violations.

app.py sends these alerts to dashboard.html.

The dashboard displays the alerts using simple HTML and CSS.

📸 Demo Screenshot

✨ Features
✅ Rule-based login detection

✅ Real-time web dashboard for alerts

✅ Easily configurable rules using rules.json

✅ Beginner-friendly code structure

📈 Future Improvements
Add IP tracking and geolocation

Export alert reports as PDF

Add real-time log monitoring (instead of static logs)

Integrate user authentication for admin panel

📚 License
This project is open-source and available under the MIT License.

