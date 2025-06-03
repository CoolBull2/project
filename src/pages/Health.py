from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import re
import platform

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests


def get_network_health(host="google.com", packets=4):
    system = platform.system().lower()

    # Select correct ping command based on OS
    if system == "windows":
        ping_cmd = ["ping", "-n", str(packets), host]
    else:
        ping_cmd = ["ping", "-c", str(packets), host]

    try:
        result = subprocess.run(
            ping_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        output = result.stdout

        if result.returncode != 0:
            return {"status": "critical", "reason": "Network unreachable."}

        # Extract packet loss and latency
        if system == "windows":
            packet_loss = re.search(r"(\d+)% loss", output)
            latency = re.findall(r"Average = (\d+)ms", output)
        else:
            packet_loss = re.search(r"(\d+)% packet loss", output)
            latency = re.findall(r"time=(\d+\.?\d*) ms", output)

        packet_loss = int(packet_loss.group(1)) if packet_loss else 100
        latency = [float(l) for l in latency] if latency else [9999]

        avg_latency = sum(latency) / len(latency)

        # Categorize network health
        if packet_loss == 100:
            return {"status": "critical", "reason": "No response from host.", "data": f"{avg_latency, packet_loss}"}
        elif packet_loss > 50 or avg_latency > 500:
            return {"status": "critical", "reason": f"High latency: {avg_latency} ms, {packet_loss}% packet loss.", "data": f"{avg_latency, packet_loss}"}
        elif packet_loss > 10 or avg_latency > 200:
            return {"status": "warning", "reason": f"Moderate latency: {avg_latency} ms, {packet_loss}% packet loss.", "data": f"{avg_latency, packet_loss}"}
        else:
            return {"status": "healthy", "reason": f"Stable connection: {avg_latency} ms, {packet_loss}% packet loss.", "data": f"{avg_latency, packet_loss}"}

    except Exception as e:
        return {"status": "critical", "reason": f"Error: {e}"}


@app.route('/network-health', methods=['GET'])
def network_health_api():
    result = get_network_health()
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
