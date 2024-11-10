#!/bin/bash

# Create systemd service file
sudo cat > /etc/systemd/system/flask_apps_portal.service << 'EOF'
[Unit]
Description=Flask Apps Portal
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=wartem
Group=wartem
WorkingDirectory=/home/wartem/projects/flask_apps_portal
Environment="PATH=/home/wartem/projects/flask_apps_portal/.venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Environment="FLASK_APP=app.py"
Environment="FLASK_ENV=production"
ExecStart=/home/wartem/projects/flask_apps_portal/.venv/bin/python3 /home/wartem/projects/flask_apps_portal/app.py
Restart=always
RestartSec=3

# Hardening
ProtectSystem=full
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

# Set correct permissions
sudo chmod 644 /etc/systemd/system/flask_apps_portal.service

# Create log directory if needed
# sudo mkdir -p /var/log/flask_apps_portal
# sudo chown wartem:wartem /var/log/flask_apps_portal

# Create virtual environment and install requirements if they don't exist
if [ ! -d "/home/wartem/flask_apps_portal/.venv" ]; then
    mkdir -p /home/wartem/flask_apps_portal
    cd /home/wartem/flask_apps_portal
    python3 -m venv .venv
    .venv/bin/pip install flask
fi

# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable flask_apps_portal.service

# Start the service
sudo systemctl start flask_apps_portal.service

# Check service status
sudo systemctl status flask_apps_portal.service

# Optional: Follow the logs (uncomment if needed)
# journalctl -u flask_apps_portal.service -f