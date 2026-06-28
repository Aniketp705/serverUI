import time
import os
import platform
import psutil
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS

DIST_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

app = Flask(__name__, static_folder=DIST_FOLDER, static_url_path='')
CORS(app)

_last_net_io = psutil.net_io_counters()
_last_net_time = time.time()

@app.route('/api/system/stats', methods=['GET'])
def get_system_stats():
    global _last_net_io, _last_net_time
    
    per_cpu = psutil.cpu_percent(interval=0.1, percpu=True)
    cpu_overall = round(sum(per_cpu) / len(per_cpu), 1) if per_cpu else 0.0
    
    mem = psutil.virtual_memory()
    swap = psutil.swap_memory()
    
    root_mount = 'C:\\' if platform.system() == 'Windows' else '/'
    try:
        disk = psutil.disk_usage(root_mount)
    except Exception:
        disk = psutil.disk_usage(os.getcwd())
        
    current_net_io = psutil.net_io_counters()
    current_time = time.time()
    elapsed = max(current_time - _last_net_time, 0.1)
    
    bytes_sent_sec = (current_net_io.bytes_sent - _last_net_io.bytes_sent) / elapsed
    bytes_recv_sec = (current_net_io.bytes_recv - _last_net_io.bytes_recv) / elapsed
    
    _last_net_io = current_net_io
    _last_net_time = current_time
    
    boot_time = psutil.boot_time()
    uptime_seconds = time.time() - boot_time
    
    return jsonify({
        'status': 'online',
        'hostname': platform.node(),
        'os': f"{platform.system()} {platform.release()}",
        'cpu': {
            'usage_percent': cpu_overall,
            'cores': psutil.cpu_count(logical=True),
            'per_core': per_cpu
        },
        'memory': {
            'total_gb': round(mem.total / (1024**3), 2),
            'used_gb': round(mem.used / (1024**3), 2),
            'free_gb': round(mem.available / (1024**3), 2),
            'percent': mem.percent
        },
        'swap': {
            'total_gb': round(swap.total / (1024**3), 2),
            'used_gb': round(swap.used / (1024**3), 2),
            'percent': swap.percent
        },
        'disk': {
            'total_gb': round(disk.total / (1024**3), 2),
            'used_gb': round(disk.used / (1024**3), 2),
            'percent': disk.percent
        },
        'network': {
            'sent_kbps': round(bytes_sent_sec / 1024, 1),
            'recv_kbps': round(bytes_recv_sec / 1024, 1),
            'total_sent_mb': round(current_net_io.bytes_sent / (1024**2), 1),
            'total_recv_mb': round(current_net_io.bytes_recv / (1024**2), 1)
        },
        'uptime_seconds': int(uptime_seconds)
    })

@app.route('/api/storage', methods=['GET'])
def get_storage():
    drives = []
    try:
        partitions = psutil.disk_partitions(all=False)
        for part in partitions:
            if 'cdrom' in part.opts or part.fstype == '':
                continue
            try:
                usage = psutil.disk_usage(part.mountpoint)
                drives.append({
                    "device": part.device,
                    "mount": part.mountpoint,
                    "fstype": part.fstype,
                    "total_gb": round(usage.total / (1024**3), 1),
                    "used_gb": round(usage.used / (1024**3), 1),
                    "free_gb": round(usage.free / (1024**3), 1),
                    "percent": usage.percent
                })
            except PermissionError:
                continue
    except Exception as e:
        print(f"Error reading disk partitions: {e}")
        
    return jsonify({'drives': drives})

@app.route('/api/storage/browse', methods=['GET'])
def browse_storage():
    target_path = request.args.get('path', '')
    if not target_path:
        return jsonify({'error': 'No path provided'}), 400

    if not os.path.exists(target_path):
        return jsonify({'error': 'Path does not exist'}), 404

    items = []
    try:
        with os.scandir(target_path) as entries:
            for entry in entries:
                try:
                    is_dir = entry.is_dir(follow_symlinks=False)
                    stat = entry.stat(follow_symlinks=False)
                    size_mb = round(stat.st_size / (1024**2), 2) if not is_dir else None
                    items.append({
                        'name': entry.name,
                        'path': entry.path,
                        'is_dir': is_dir,
                        'size_mb': size_mb
                    })
                except (PermissionError, OSError):
                    continue
        items = sorted(items, key=lambda x: (not x['is_dir'], x['name'].lower()))[:150]
    except PermissionError:
        return jsonify({'error': 'Access Denied / Permission Error'}), 403
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'current_path': target_path, 'items': items})

@app.route('/api/processes', methods=['GET'])
def get_processes():
    processes = []
    try:
        for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'memory_info']):
            try:
                pinfo = proc.info
                mem_mb = round((pinfo['memory_info'].rss if pinfo['memory_info'] else 0) / (1024**2), 1)
                processes.append({
                    'pid': pinfo['pid'],
                    'name': pinfo['name'] or 'Unknown',
                    'cpu_percent': round(pinfo['cpu_percent'] or 0.0, 1),
                    'memory_mb': mem_mb,
                    'memory_percent': round(pinfo['memory_percent'] or 0.0, 1)
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
                
        processes = sorted(processes, key=lambda x: x['memory_mb'], reverse=True)[:8]
    except Exception as e:
        print(f"Error fetching processes: {e}")
        
    return jsonify({'processes': processes})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    else:
        return jsonify({"error": "React production build not found."}), 404

if __name__ == '__main__':
    print("Starting ServerUI Backend on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
