#!/usr/bin/env python3
import subprocess
import os
def install_node_python():
    try:
        #subprocess.run(['npm', 'install'], check=True)
        os.umask(0)
        subprocess.run(['npm', 'install'], check=True)
        subprocess.run(['node', 'index.js'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
        print("Please run this script with sudo privileges.")

if __name__ == "__main__":
    install_node_python()