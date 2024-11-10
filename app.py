# app.py
from flask import Flask, render_template, jsonify
from datetime import datetime
import json
import requests
import threading
import time

app = Flask(__name__)

def load_config():
    with open('config.json', 'r') as f:
        return json.load(f)

def save_config(config):
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=4)

def check_service_status(service):
    """Check if a service is available by making a HEAD request"""
    try:
        response = requests.head(service["url"], timeout=2)
        service["status"] = "online" if response.status_code < 400 else "offline"
        service["last_checked"] = datetime.now().strftime('%H:%M:%S')
        service["response_time"] = response.elapsed.total_seconds() * 1000  # in milliseconds
    except requests.exceptions.RequestException:
        service["status"] = "offline"
        service["last_checked"] = datetime.now().strftime('%H:%M:%S')
        service["response_time"] = None

def update_services_status():
    """Update status for all services periodically"""
    while True:
        config = load_config()
        for service in config['services']:
            check_service_status(service)
        save_config(config)
        time.sleep(60)  # Check every minute

# Start the status checking in a background thread
status_thread = threading.Thread(target=update_services_status, daemon=True)
status_thread.start()

@app.route('/')
def home():
    config = load_config()
    return render_template('index.html',
                         services=config['services'],
                         settings=config['settings'],  # Pass settings separately
                         current_time=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

@app.route('/api/services')
def get_services():
    config = load_config()
    return jsonify(config['services'])

@app.route('/api/stats')
def get_stats():
    config = load_config()
    services = config['services']
    return jsonify({
        'total': len(services),
        'online': sum(1 for s in services if s['status'] == 'online'),
        'offline': sum(1 for s in services if s['status'] == 'offline'),
        'unknown': sum(1 for s in services if s['status'] == 'unknown')
    })

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5010, debug=False)
    except Exception as e:
        print(f"Failed to start the server: {e}")