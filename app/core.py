import psutil
import subprocess
import sys
import cpuinfo

def get_pc_info():
    info = {}
    
    info["processor_name"] = cpuinfo.get_cpu_info()['brand_raw']
    info["cpu_count"] = psutil.cpu_count(logical=True)
    info["cpu_usage"] = psutil.cpu_percent(interval=1)

    virtual_memory = psutil.virtual_memory()
    info["total_ram"] = virtual_memory.total // (1024 ** 2)
    info["available_ram"] = virtual_memory.available // (1024 ** 2)
    info["ram_usage"] = virtual_memory.percent

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