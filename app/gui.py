import tkinter as tk
from tkinter import messagebox
from network import connect

class App:
    def __init__(self, root):
        self.root = root
        self.root.title("WebSocket Connection")
        self.root.geometry("400x300")
        self.root.configure(bg="#f0f0f0")

        self.header = tk.Label(root, text="Connect to WebSocket", font=("Arial", 16, "bold"), bg="#f0f0f0", fg="#333")
        self.header.pack(pady=20)

        self.frame = tk.Frame(root, bg="#f0f0f0")
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
        key = self.key_entry.get()
        if key:
            print(f"Connecting with unique key: {key}")

            self.key_entry.config(state="disabled")
            self.submit_button.config(state="disabled")

            connect(key, self)
        else:
            messagebox.showerror("Error", "Please enter a valid key.")


if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()
