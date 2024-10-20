import requests
import subprocess
import sys

SERVER_URL = "http://localhost:3000"
FILE_ENDPOINT = "/api/files/"
RESULTS_ENDPOINT = "/api/results"

def fetch_file(filename):
    """Fetches the Python file from the server and saves it locally."""
    response = requests.get(SERVER_URL + RESULTS_ENDPOINT + filename)
    
    if response.status_code == 200:
        with open(filename, 'w') as file:
            file.write(response.text)
        print(f"File '{filename}' fetched and saved.")
        return filename
    else:
        print(f"Failed to fetch file: {response.status_code}")
        return None

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

def send_results(results):
    """Sends the execution results back to the server."""
    response = requests.post(SERVER_URL + RESULTS_ENDPOINT, json={"results": results})
    if response.status_code == 200:
        print("Results sent successfully.")
    else:
        print(f"Failed to send results: {response.status_code}")
