import websocket
import os
import json
from app.logic.computation import *


def on_message(ws, message):
    """Handles messages received from the server."""
    print(f"Received message from server: {message}")
    data = json.loads(message)
    
    filename = data.get('filename')
    if filename:
        file_name = fetch_file(filename)
        if file_name:
            execution_results = execute_file(file_name)
            if execution_results:
                send_results(execution_results)
            # Clean up the file after execution
            os.remove(file_name)

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
