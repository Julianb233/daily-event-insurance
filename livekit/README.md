# LiveKit Self-Hosted Infrastructure

Self-hosted LiveKit setup for the Daily Event Insurance AI call center.

## Quick Start

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Generate API key/secret
# Use a random 32+ character string for the secret
# Example: openssl rand -base64 32

# 3. Update .env with your credentials

# 4. Start services
docker compose up -d

# 5. Verify services are running
docker compose ps
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| livekit-server | 7880 (HTTP), 7881 (TCP) | Main WebRTC/signaling server |
| livekit-sip | 5060 (UDP/TCP) | SIP gateway for telephony |
| livekit-egress | - | Call recording service |
| redis | 6379 | Room state storage |

## Port Requirements

Ensure these ports are open on your firewall:

- **7880**: HTTP API (TCP)
- **7881**: WebRTC TCP fallback (TCP)
- **50000-60000**: WebRTC UDP media (UDP)
- **5060**: SIP signaling (UDP/TCP)
- **3478**: TURN UDP
- **5349**: TURN TLS

## Configuration Files

- `docker-compose.yml` - Service definitions
- `livekit.yaml` - LiveKit server configuration
- `.env` - Environment variables (create from .env.example)

## SIP/Telephony Setup

### Twilio SIP Trunk

1. Create a SIP Trunk in Twilio Console
2. Set the Origination SIP URI to your server: `sip:your-server-ip:5060`
3. Configure Termination with your server's IP
4. Update `.env` with Twilio trunk credentials

### Telnyx SIP Trunk

1. Create a SIP Connection in Telnyx
2. Add your server IP to the allowed list
3. Update `.env` with Telnyx credentials

## Production Deployment

### SSL/TLS (Required for Production)

1. Obtain SSL certificates for your domain
2. Configure TURN with TLS:
   ```yaml
   turn:
     enabled: true
     domain: turn.your-domain.com
     cert_file: /path/to/cert.pem
     key_file: /path/to/key.pem
   ```

### External IP Configuration

For cloud deployments, set `EXTERNAL_IP` in `.env` to your server's public IP.

### Scaling

For high availability, consider:
- External Redis cluster
- Multiple LiveKit server instances behind a load balancer
- S3-compatible storage for recordings

## Troubleshooting

### Check logs
```bash
docker compose logs -f livekit-server
docker compose logs -f livekit-sip
```

### Verify connectivity
```bash
# Test HTTP API
curl http://localhost:7880

# Test Redis
docker compose exec redis redis-cli ping
```

### Common Issues

1. **WebRTC not connecting**: Check UDP ports 50000-60000 are open
2. **SIP calls failing**: Verify SIP trunk credentials and IP allowlisting
3. **No audio**: Ensure TURN is properly configured for NAT traversal

## Next Steps

1. Deploy the LiveKit Python agent (see `/agents` directory)
2. Configure webhook endpoint in your Next.js app
3. Set up Twilio SMS integration
4. Create AI agent scripts in the admin dashboard
