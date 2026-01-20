#!/bin/bash
# The Daily Bread - Mac Launcher

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Run Electron
./node_modules/.bin/electron .
