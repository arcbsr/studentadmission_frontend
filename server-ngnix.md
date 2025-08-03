🛠️ Deployment Instructions for rnbridge.online (NGINX + SSL)
🔧 1. Edit and Create NGINX Site Configuration

sudo nano /etc/nginx/sites-available/rnbridge.online

Paste the following configuration into the file:

# Block direct IP access on port 80 (HTTP)
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    return 444;  # silently close the connection
}

# Block direct IP access on port 443 (HTTPS)
server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

    ssl_certificate /etc/letsencrypt/live/rnbridge.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rnbridge.online/privkey.pem;

    return 444;
}

# Redirect all HTTP requests to HTTPS for the domain
server {
    listen 80;
    listen [::]:80;
    server_name rnbridge.online www.rnbridge.online;

    return 301 https://$host$request_uri;
}

# Main HTTPS server block for rnbridge.online
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name rnbridge.online www.rnbridge.online;

    ssl_certificate /etc/letsencrypt/live/rnbridge.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rnbridge.online/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384";

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    root /var/www/rnbridge.online;
    index index.html index.htm index.nginx-debian.html;

    access_log /var/log/nginx/rnbridge.online.access.log;
    error_log /var/log/nginx/rnbridge.online.error.log;

    location / {
        try_files $uri $uri/ =404;
    }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}

🔗 2. Enable the Site

sudo ln -s /etc/nginx/sites-available/rnbridge.online /etc/nginx/sites-enabled/

📁 3. Create Web Root and Set Permissions

sudo mkdir -p /var/www/rnbridge.online
sudo chown -R www-data:www-data /var/www/rnbridge.online
sudo chmod -R 755 /var/www/rnbridge.online

Create a basic test page:

echo "<h1>Welcome to rnbridge.online</h1>" | sudo tee /var/www/rnbridge.online/index.html

✅ 4. Test and Reload NGINX

sudo nginx -t
sudo systemctl reload nginx

🔐 5. Install Certbot (If Needed)

sudo apt update
sudo apt install certbot python3-certbot-nginx

🔏 6. Obtain SSL Certificate with Certbot

sudo certbot --nginx -d rnbridge.online -d www.rnbridge.online

Verify certificates:

ls -l /etc/letsencrypt/live/rnbridge.online/

🔄 7. Test Auto-Renewal

sudo certbot renew --dry-run

🧼 8. Optional: Clean Up or Reload Again

sudo nginx -t
sudo systemctl reload nginx

✅ Final Notes

    You can view logs at:

        Access log: /var/log/nginx/rnbridge.online.access.log

        Error log: /var/log/nginx/rnbridge.online.error.log

    Firewall ports (if not already open):

sudo ufw allow 'Nginx Full'

