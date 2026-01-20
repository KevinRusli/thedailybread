#!/bin/bash
# The Daily Bread - Install Script for Mac
# This creates a launcher in Applications folder

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Make launcher executable
chmod +x "$DIR/TheDailyBread.command"

# Create alias in Applications (optional)
echo "Creating alias in Applications folder..."
if [ -d "/Applications" ]; then
    ln -sf "$DIR/TheDailyBread.command" ~/Applications/TheDailyBread.command 2>/dev/null || true
fi

# Add to Dock (user can manually add)
echo ""
echo "===================================="
echo "  Installation Complete!"
echo "===================================="
echo ""
echo "You can now run The Daily Bread by:"
echo "1. Double-clicking TheDailyBread.command"
echo "2. Or drag TheDailyBread.command to your Dock"
echo ""
echo "Press any key to close..."
read -n 1
