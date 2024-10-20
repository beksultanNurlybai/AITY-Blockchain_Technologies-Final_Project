import requests
import platform
import psutil

URL = "http://localhost:3000/api/pc_info"

def get_pc_info():
    info = {}

    # CPU Information
    os_info = platform.uname()
    info["Processor"] = os_info.processor
    info["CPU Count"] = psutil.cpu_count(logical=True)
    info["CPU Percent Usage"] = psutil.cpu_percent(interval=1)

    # RAM Information
    virtual_memory = psutil.virtual_memory()
    info["Total RAM (MB)"] = virtual_memory.total // (1024 ** 2)
    info["Available RAM (MB)"] = virtual_memory.available // (1024 ** 2)
    info["Used RAM (MB)"] = virtual_memory.used // (1024 ** 2)
    info["RAM Percent Usage"] = virtual_memory.percent

    # Disk Information
    disk_usage = psutil.disk_usage('/')
    info["Total Disk Space (GB)"] = disk_usage.total // (1024 ** 3)
    info["Used Disk Space (GB)"] = disk_usage.used // (1024 ** 3)
    info["Free Disk Space (GB)"] = disk_usage.free // (1024 ** 3)
    info["Disk Percent Usage"] = disk_usage.percent

    return info

def send_data(data):
    """Sends the data to the server."""
    response = requests.post(URL, json={"results": data})
    if response.status_code == 200:
        print("Data sent successfully.")
    else:
        print(f"Failed to send data: {response.status_code}")