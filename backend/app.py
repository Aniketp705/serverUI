import time
import os
import psutil
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

# Define path to React production build directory (frontend/dist)
DIST_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

app = Flask(__name__, static_folder=DIST_FOLDER, static_url_path='')
CORS(app)

@app.route('/api/system/stats', methods=['GET'])
def get_system_stats():
    cpu_percent = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    boot_time = psutil.boot_time()
    uptime_seconds = time.time() - boot_time
    
    return jsonify({
        'status': 'online',
        'cpu': {
            'usage_percent': cpu_percent,
            'cores': psutil.cpu_count(logical=True)
        },
        'memory': {
            'total_gb': round(memory.total / (1024**3), 2),
            'used_gb': round(memory.used / (1024**3), 2),
            'percent': memory.percent
        },
        'disk': {
            'total_gb': round(disk.total / (1024**3), 2),
            'used_gb': round(disk.used / (1024**3), 2),
            'percent': disk.percent
        },
        'uptime_seconds': int(uptime_seconds)
    })

@app.route('/api/services', methods=['GET'])
def get_services():
    services = [
        {"id": 1, "name": "Plex Media Server", "status": "running", "port": 32400, "category": "Media", "url": "http://localhost:32400"},
        {"id": 2, "name": "Home Assistant", "status": "running", "port": 8123, "category": "Automation", "url": "http://localhost:8123"},
        {"id": 3, "name": "Pi-hole DNS", "status": "running", "port": 80, "category": "Network", "url": "http://localhost:80/admin"},
        {"id": 4, "name": "Nextcloud Storage", "status": "running", "port": 8080, "category": "Cloud", "url": "http://localhost:8080"},
        {"id": 5, "name": "Vaultwarden", "status": "running", "port": 8001, "category": "Security", "url": "http://localhost:8001"},
        {"id": 6, "name": "qBittorrent", "status": "stopped", "port": 8085, "category": "Downloads", "url": "http://localhost:8085"}
    ]
    return jsonify({'services': services})

@app.route('/api/storage', methods=['GET'])
def get_storage():
    drives = [
        {"name": "System NVMe (SSD)", "mount": "/", "total_gb": 500, "used_gb": 120, "health": "Good", "temp": "38°C"},
        {"name": "Media HDD Pool 1", "mount": "/mnt/storage1", "total_gb": 4000, "used_gb": 2800, "health": "Good", "temp": "34°C"},
        {"name": "Backup HDD Pool 2", "mount": "/mnt/backup", "total_gb": 4000, "used_gb": 1900, "health": "Good", "temp": "33°C"}
    ]
    return jsonify({'drives': drives})

# Catch-all route to serve React frontend build files (Single Page Application)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return jsonify({"error": "React production build (frontend/dist) not found. Run 'npm run build' inside frontend folder."}), 404

if __name__ == '__main__':
    print("Starting Home Server Backend & Frontend on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
