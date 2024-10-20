import websocket
import requests
import json
import threading
import os
from core import *


SERVER_URL = "http://localhost:3000"
KEY = ""
FILE_URL = SERVER_URL + "/api/files/"
FILE_OUTPUT_URL = SERVER_URL + "/api/results?key=" + KEY
PC_INFO_URL = SERVER_URL+ "/api/pc_info?key=" + KEY

def fetch_file(filename):
    """Fetches the Python file from the server and saves it locally."""
    response = requests.get(FILE_URL + filename + "?key=" + KEY)
    
    if response.status_code == 200:
        with open(filename, 'w') as file:
            file.write(response.text)
        print(f"File '{filename}' fetched and saved.")
        return filename
    else:
        print(f"Failed to fetch file: {response.status_code}")
        return None

def send_file_output(data):
    """Sends the execution results back to the server."""
    response = requests.post(FILE_OUTPUT_URL, json={"file_output": data})
    if response.status_code == 200:
        print("File output sent successfully.")
    else:
        print(f"Failed to send file output: {response.status_code}")

def on_new_file_event(data):
    """Fetch the new file, excute it and send the output results back to server."""
    filename = data['filename']
    if filename:
        file_name = fetch_file(filename)
        if file_name:
            execution_results = execute_file(file_name)
            if execution_results:
                send_file_output(execution_results)
            os.remove(file_name)

def on_pc_info_event():
    """Sends the computer information to the server."""
    response = requests.post(PC_INFO_URL, json={"pc_info": get_pc_info()})
    if response.status_code == 200:
        print("PC info sent successfully.")
    else:
        print(f"Failed to send PC info: {response.status_code}")

def on_login_event(app, data):
    """Verify the login."""
    if data['is_valid']:
        print("Login successful.")
        app.on_login_success()
    else:
        print("Login failed.")
        app.on_login_failed()


class WebSocketClient:
    def __init__(self, key, app):
        global KEY
        KEY = key
        self.key = key
        self.app = app
        self.ws = None

    def connect(self):
        """Starts the WebSocket connection in a separate thread."""
        self.ws = websocket.WebSocketApp(
            f"ws://localhost:3000?key={self.key}",
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close
        )
        # Start WebSocket connection in a new thread so it doesn't block the GUI
        thread = threading.Thread(target=self.ws.run_forever)
        thread.daemon = True  # Daemonize thread to close it when the app closes
        thread.start()

    def on_message(self, ws, message):
        """Handle messages from the server."""
        print(f"Received message from server: {message}")
        data = json.loads(message)
        if data['event'] == "login":
            on_login_event(self.app, data)
        elif data['event'] == "new_file":
            on_new_file_event(data)
        elif data['event'] == "pc_info":
            on_pc_info_event()
        else:
            print("An unhandled event occurred.")

    def on_error(self, ws, error):
        """Handle WebSocket errors."""
        print(f"Error: {error}")
        self.app.on_error(error)

    def on_close(self, ws, close_status_code, close_msg):
        """Handle WebSocket disconnection."""
        print("WebSocket connection closed.")
        self.app.on_disconnect()

    def disconnect(self):
        """Disconnects the WebSocket."""
        if self.ws:
            self.ws.close()
