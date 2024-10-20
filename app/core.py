import platform
import psutil
import subprocess
import sys

def get_pc_info():
    info = {}
    
    os_info = platform.uname()
    info["Processor"] = os_info.processor
    info["CPU Count"] = psutil.cpu_count(logical=True)
    info["CPU Percent Usage"] = psutil.cpu_percent(interval=1)

    virtual_memory = psutil.virtual_memory()
    info["Total RAM (MB)"] = virtual_memory.total // (1024 ** 2)
    info["Available RAM (MB)"] = virtual_memory.available // (1024 ** 2)
    info["Used RAM (MB)"] = virtual_memory.used // (1024 ** 2)
    info["RAM Percent Usage"] = virtual_memory.percent

    disk_usage = psutil.disk_usage('/')
    info["Total Disk Space (GB)"] = disk_usage.total // (1024 ** 3)
    info["Used Disk Space (GB)"] = disk_usage.used // (1024 ** 3)
    info["Free Disk Space (GB)"] = disk_usage.free // (1024 ** 3)
    info["Disk Percent Usage"] = disk_usage.percent

    return info


def execute_file(file_name):
    """Executes the fetched Python file and returns the output or error."""
    try:
        result = subprocess.run([sys.executable, file_name], capture_output=True, text=True)
        if result.returncode == 0:
            print("Execution successful!")
            return result.stdout
        else:
            print("Error during execution.")
            return result.stderr
    except Exception as e:
        print(f"Exception occurred while executing the file: {e}")
        return None