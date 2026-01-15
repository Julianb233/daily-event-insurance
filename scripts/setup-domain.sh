#!/bin/bash
set -e

DOMAIN="dashboard-daddy.com"

# 1. Ensure Nginx is installed
echo "Ensuring Nginx and Certbot are installed..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# 2. Create Nginx Configuration
echo "Creating Nginx configuration for $DOMAIN..."
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 8080;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:6080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        
        # Ensure vnc.html is the default if landing on root
        rewrite ^/$ /vnc.html break;
    }
}
EOF

# 3. Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 4. Test Nginx and reload
nginx -t
systemctl reload nginx

# 5. Provision SSL (Only if DNS is pointed)
echo "Attempting to provision SSL for $DOMAIN..."
# We use --nginx plugin for automatic configuration
# Note: This will fail if DNS is not yet pointed to the VPS.
certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m julian@daily-event-insurance.com --redirect || echo "SSL provisioning failed. Ensure DNS A record for $DOMAIN is pointed to 191.101.233.52 and try again later."

echo "Domain mapping configuration complete!"
