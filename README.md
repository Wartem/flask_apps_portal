![Python](https://img.shields.io/badge/python-v3.7+-blue.svg)
![Flask](https://img.shields.io/badge/flask-v2.0+-lightgrey.svg)
![Platform](https://img.shields.io/badge/platform-linux%20%7C%20windows-lightgrey)
![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

![Network](https://img.shields.io/badge/Network-Local-blue)
![UI](https://img.shields.io/badge/UI-Responsive-blue)
![Theme](https://img.shields.io/badge/Theme-Dark%20%7C%20Light-lightgrey)
![Monitoring](https://img.shields.io/badge/Monitoring-Real--time-green)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-Compatible-C51A4A)

# Flask Apps Portal

A local network dashboard for monitoring and managing Flask applications. This portal provides real-time status monitoring, easy access management, and a clean interface for all your Flask services running on the local network.

## Screenshots

> **Note**: Screenshots show the portal with example apps. The portal is provided as-is; no additional applications are included in this repository. You'll need to configure your own services.

<div align="center">

| Screenshot 1 | Screenshot 2 | Screenshot 3 |
|:-------------------------:|:-------------------------:|:-------------------------:|
| ![image](https://github.com/user-attachments/assets/ec71e97f-d039-4931-97ad-228de102c9db) | ![image](https://github.com/user-attachments/assets/136f5348-1ce0-4c22-a771-06165565cc8f) | ![image](https://github.com/user-attachments/assets/6220fe10-d620-401d-aad0-0348b192926b) |
| Dark theme | Responsive | White theme |

</div>

## Key Features

- **Real-Time Monitoring**: Automatic status checks and response time monitoring for all registered services
- **Dark/Light Theme**: System-aware theme switching with manual override capability
- **Grid/List Views**: Flexible layout options for service display
- **Service Categories**: Organize services by categories for better management
- **Search & Filter**: Quick service lookup by name, tags, or categories
- **Copy URLs**: One-click URL copying with visual feedback
- **Status Indicators**: Clear visual indicators for service status with response times
- **Local Storage**: Remembers your theme and view preferences

## Technical Details

- **Frontend**:
  - Vanilla JavaScript with no framework dependencies
  - Lucide icons for consistent visual elements
  - CSS Grid for responsive layouts
  - CSS Variables for theming

- **Backend**:
  - Flask web framework
  - RESTful API architecture
  - JSON configuration storage
  - Background service monitoring

- **Monitoring System**:
  - Periodic health checks (60-second intervals)
  - Response time tracking
  - Service status persistence
  - Automatic service recovery detection

## Requirements

- Python 3.7+
- Flask
- Modern web browser
- Local network access
- Requests library

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Wartem/flask_apps_portal.git
cd flask_apps_portal
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure your services in `config.json`:
```json
{
    "services": [
        {
            "name": "Example Service",
            "url": "http://192.168.1.100:5000",
            "description": "Example service description",
            "category": "monitoring",
            "tags": ["example", "service"]
        }
    ]
}
```

5. Set up the systemd service (Linux):
```bash
sudo cp flask-apps-portal.service /etc/systemd/system/
sudo systemctl enable flask-apps-portal
sudo systemctl start flask-apps-portal
```

More info inside the install_service.sh
<br>
You will have to change file paths before running it. Then run: sudo bash install_service.sh

## Usage

### Starting the Portal

Development mode:
```bash
python app.py
```

Production mode (using systemd):
```bash
sudo systemctl start flask-apps-portal
```

### Accessing the Portal

Open your browser and navigate to:
```
http://localhost:5010
```

### Adding New Services

Edit `config.json` to add new services:
```json
{
    "name": "New Service",
    "url": "http://192.168.1.x:port",
    "description": "Service description",
    "category": "category_name",
    "tags": ["tag1", "tag2"],
    "icon": "icon_name"
}
```

## API Endpoints

### GET /api/services
Returns status information for all registered services.

Response:
```json
[
    {
        "name": "Service Name",
        "status": "online",
        "response_time": 123,
        "last_checked": "13:45:30"
    }
]
```

### GET /api/stats
Returns aggregate statistics about service status.

Response:
```json
{
    "total": 4,
    "online": 3,
    "offline": 1
}
```

## Limitations

- Designed for local network use only
- Limited to HTTP/HTTPS services
- No authentication system
- Single configuration file
- Manual service registration required
- No historical data storage
- Maximum recommended services: 50

## Troubleshooting

### Common Issues

1. **Service Status Not Updating**
   - Check network connectivity
   - Verify service URL is correct
   - Ensure service is running
   - Check firewall settings

2. **Copy Button Not Working**
   - Ensure browser supports clipboard API
   - Check for HTTPS requirement
   - Try using fallback copy method

3. **Theme Not Persisting**
   - Clear browser cache
   - Check localStorage permissions
   - Verify JavaScript is enabled

### Logs

View service logs:
```bash
sudo journalctl -u flask-apps-portal -f
```

Check application logs:
```bash
tail -f /var/log/flask-apps-portal/error.log
```

## Explination of Flask Apps Portal, and why it's designed this way.

The name "Flask Apps Portal" comes from its primary purpose and architecture:

1. **Flask Backend Integration**:
   - The portal itself is built with Flask (Python web framework)
   - It's designed to specifically monitor and interact with other Flask applications through their APIs
   - The status checking system (`check_service_status` function) is optimized for Flask apps that follow common Flask patterns for health checks and status reporting

2. **Local Network Focus**:
   - It's called "Local Network Services Dashboard" because it's designed to monitor services within your local network (like your 192.168.x.x addresses)
   - This provides several advantages:
     - Faster response times for status checks
     - More secure as it's not exposed to the internet
     - Better reliability for internal services
     - Lower latency when checking service health

3. **Why Flask-specific?**:
   - Flask applications typically share common patterns for:
     - Health endpoints
     - Status reporting
     - Error handling
     - Response time metrics
   - The portal understands these patterns and can reliably:
     - Check service health
     - Monitor response times
     - Handle Flask-specific error codes
     - Parse Flask application responses

Explanation of what would be needed to make it more universal:

```python
# Enhanced version of the service checker that could handle different types of services

def check_service_status(service):
    """Enhanced service checker with protocol and service type awareness"""
    try:
        service_type = service.get('type', 'flask')  # Default to Flask for backward compatibility
        
        if service_type == 'flask':
            # Flask-specific checks
            response = requests.head(f"{service['url']}/health", timeout=2)
            service["status"] = "online" if response.status_code < 400 else "offline"
            service["response_time"] = response.elapsed.total_seconds() * 1000
            
            # Flask-specific metrics
            if response.status_code == 200:
                metrics = requests.get(f"{service['url']}/metrics").json()
                service["worker_count"] = metrics.get("workers", 0)
                service["memory_usage"] = metrics.get("memory", "N/A")
                
        elif service_type == 'generic-web':
            # Basic web service check
            response = requests.head(service['url'], timeout=2)
            service["status"] = "online" if response.status_code < 400 else "offline"
            service["response_time"] = response.elapsed.total_seconds() * 1000
            
        elif service_type == 'tcp-service':
            # Raw TCP service check
            host, port = service['url'].split(':')
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex((host, int(port)))
            service["status"] = "online" if result == 0 else "offline"
            
        elif service_type == 'database':
            # Database-specific checks
            db_type = service.get('db_type', 'postgresql')
            if db_type == 'postgresql':
                conn = psycopg2.connect(service['connection_string'])
                service["status"] = "online"
                service["connections"] = get_pg_connection_count(conn)
                
        service["last_checked"] = datetime.now().strftime('%H:%M:%S')
        
    except Exception as e:
        service["status"] = "offline"
        service["last_checked"] = datetime.now().strftime('%H:%M:%S')
        service["error"] = str(e)

```

To evolve this into a universal service monitor, we would need:

1. **Protocol Support**:
   - HTTP/HTTPS for web services
   - TCP/UDP for raw network services
   - Database-specific protocols
   - Custom protocols for IoT devices

2. **Authentication Methods**:
   - Basic Auth
   - API Keys
   - OAuth
   - Client Certificates

3. **Service-Specific Features**:
   - Different health check endpoints
   - Various metrics collection methods
   - Custom status indicators

4. **Security Considerations**:
   - Cross-network monitoring
   - Encrypted communications
   - Access control

The current implementation focuses on Flask apps because:
1. It provides a consistent monitoring interface
2. It can understand Flask-specific metrics
3. It's optimized for Flask's error handling patterns
4. It works well with Flask's built-in health check endpoints

## License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
