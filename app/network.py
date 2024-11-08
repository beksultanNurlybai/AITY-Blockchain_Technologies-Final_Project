import websocket
import json
import threading
import os
import time
from core import *


class WebSocketClient:
    def __init__(self, key, app):
        self.key = key
        self.app = app
        self.ws = None
        self.resource_data_thread = None
        self.is_connected = False
    
    def on_login_event(self, data):
        """Verify the login."""
        if data['is_valid']:
            print("Login successful.")
            self.send_message("login_res", {"content": get_pc_info()})
            self.is_connected = True
            self.app.on_login_success()
        else:
            print("Login failed.")
            self.app.on_login_failed()
    
    def on_resource_data_event(self, data):
        """Continuously send resource data in a separate thread."""
        self.is_connected = True
        while self.is_connected:
            self.send_message("resource_data_res", {"content": get_pc_info(), "user_id": data['user_id']})
            time.sleep(1)

    def start_resource_data_thread(self, data):
        """Starts the resource data thread."""
        if self.resource_data_thread is None or not self.resource_data_thread.is_alive():
            self.resource_data_thread = threading.Thread(target=self.on_resource_data_event, args=(data,))
            self.resource_data_thread.daemon = True
            self.resource_data_thread.start()
    
    def on_new_file_event(self, data):
        """Execute the file and send the output results back to server."""
        filename = 'temp.py'
        print(data)
        with open(filename, 'w') as file:
            file.write(data['content'])
        execution_results = execute_file(filename)
        print(f"File '{filename}' executed.\n{execution_results}")
        self.send_message("new_file_res", {"content": execution_results, "request_id": data['request_id']})
        os.remove(filename)
    
    def send_message(self, event, data):
        """Sends a message to the server with a specified event and data."""
        message = json.dumps({"event": event, **data})
        self.ws.send(message)

    def connect(self):
        """Starts the WebSocket connection in a separate thread."""
        self.ws = websocket.WebSocketApp(
            f"ws://localhost:3001?key={self.key}",
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close
        )
        thread = threading.Thread(target=self.ws.run_forever)
        thread.daemon = True
        thread.start()

    def on_message(self, ws, message):
        """Handle messages from the server."""
        print(f"Received message from server: {message}")
        data = json.loads(message)
        if data['event'] == "login_req":
            self.on_login_event(data)
        elif data['event'] == "new_file_req":
            self.on_new_file_event(data)
        elif data['event'] == "resource_data_req":
            self.start_resource_data_thread(data)
        elif data['event'] == "stop_resource_data":
            self.is_connected = False
        else:
            print("An unhandled event occurred.")

    def on_error(self, ws, error):
        """Handle WebSocket errors."""
        print(f"Error: {error}")
        self.app.on_error(error)

    def on_close(self, ws, close_status_code, close_msg):
        """Handle WebSocket disconnection."""
        print("WebSocket connection closed.")
        self.is_connected = False
        self.app.on_disconnect()

    def disconnect(self):
        """Disconnects the WebSocket."""
        if self.ws:
            self.ws.close()
