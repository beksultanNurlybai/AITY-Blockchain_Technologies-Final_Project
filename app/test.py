import tkinter as tk
from tkinter import messagebox
import websocket
import json
import threading

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("WebSocket Connection")
        self.root.geometry("400x300")
        self.root.configure(bg="#f0f0f0")

        self.create_login_screen()

    def create_login_screen(self):
        """Create the login screen interface."""
        self.header = tk.Label(self.root, text="Connect to WebSocket", font=("Arial", 16, "bold"), bg="#f0f0f0", fg="#333")
        self.header.pack(pady=20)

        self.frame = tk.Frame(self.root, bg="#f0f0f0")
        self.frame.pack(pady=10)

        self.label = tk.Label(self.frame, text="Enter your unique key:", font=("Arial", 12), bg="#f0f0f0", fg="#555")
        self.label.grid(row=0, column=0, pady=10, padx=10, sticky="w")

        self.key_entry = tk.Entry(self.frame, width=30, font=("Arial", 12), bd=2, relief="groove")
        self.key_entry.grid(row=1, column=0, padx=10, pady=10)

        self.submit_button = tk.Button(self.frame, text="Submit and Start", font=("Arial", 12, "bold"),
                                       bg="#4CAF50", fg="white", bd=0, padx=10, pady=5,
                                       activebackground="#45a049", command=self.start_app)
        self.submit_button.grid(row=2, column=0, pady=20)

    def start_app(self):
        """Handles key submission and starts WebSocket connection in a separate thread."""
        self.key = self.key_entry.get()
        if self.key:
            print(f"Connecting with unique key: {self.key}")
            messagebox.showinfo("Info", f"Connecting with key: {self.key}")

            self.key_entry.config(state="disabled")
            self.submit_button.config(state="disabled")

            thread = threading.Thread(target=self.connect, args=(self.key,))
            thread.daemon = True
            thread.start()
        else:
            messagebox.showerror("Error", "Please enter a valid key.")

    def connect(self, key):
        """Initiates the WebSocket connection and listens for messages."""
        self.ws = websocket.WebSocketApp(
            f"ws://localhost:3000?key={key}",
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close
        )
        self.ws.run_forever()

    def on_message(self, ws, message):
        """Handles messages from the server."""
        print(f"Received message from server: {message}")
        data = json.loads(message)

        if data['event'] == "login":
            if data['is_valid']:
                print("Login successful.")
                self.root.after(0, self.create_connected_screen)
            else:
                print("Login failed.")
                self.root.after(0, lambda: messagebox.showerror("Error", "Invalid key. Please try again."))
                self.root.after(0, self.reset_login_screen)

    def on_error(self, ws, error):
        """Handles WebSocket errors."""
        print(f"Error: {error}")
        self.root.after(0, lambda: messagebox.showerror("Error", f"WebSocket error: {error}"))

    def on_close(self, ws, close_status_code, close_msg):
        """Handles WebSocket disconnection."""
        print("WebSocket connection closed.")
        self.root.after(0, lambda: messagebox.showinfo("Disconnected", "You have been disconnected."))
        self.root.after(0, self.reset_login_screen)

    def create_connected_screen(self):
        """Creates the screen after successful connection."""
        self.clear_screen()

        self.connected_label = tk.Label(self.root, text=f"Connected with Key: {self.key}", font=("Arial", 18), bg="#f0f0f0", fg="#333")
        self.connected_label.pack(pady=20)

        self.disconnect_button = tk.Button(self.root, text="Disconnect", font=("Arial", 12, "bold"),
                                           bg="#e74c3c", fg="white", bd=0, padx=10, pady=5,
                                           activebackground="#c0392b", command=self.disconnect)
        self.disconnect_button.pack(pady=20)

    def reset_login_screen(self):
        """Resets the login screen after disconnection or failed login."""
        self.clear_screen()
        self.create_login_screen()

    def clear_screen(self):
        """Clears the current screen's widgets."""
        for widget in self.root.winfo_children():
            widget.destroy()

    def disconnect(self):
        """Handles disconnection from the WebSocket server."""
        if self.ws:
            self.ws.close()
        self.reset_login_screen()


# Create and run the GUI app
root = tk.Tk()
app = App(root)
root.mainloop()
