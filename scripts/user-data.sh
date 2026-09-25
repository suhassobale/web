#!/bin/bash
# EC2 User Data script — runs automatically as root on first boot.
# Paste this into the Launch Template's "User data" field.

set -e

# --- Install Node.js LTS ---
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# --- Install pm2 globally ---
npm install -g pm2

# --- Get the app code ---
# Replace with your actual repo URL once it's pushed
git clone https://github.com/<your-username>/<your-repo>.git /var/www/myapp
cd /var/www/myapp

# --- Write the .env file (kept out of git; filled in here instead) ---
cat > .env << 'EOF'
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-password
DB_NAME=learningdb
PORT=3000
EOF

# --- Install dependencies and start the app ---
npm install
pm2 start app.js --name myapp
pm2 startup systemd -u root --hp /root
pm2 save
