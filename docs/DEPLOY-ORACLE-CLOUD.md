# SpurTalk — Oracle Cloud Deployment Guide

## Overview
Deploy SpurTalk on Oracle Cloud Always Free (ARM/Ampere A1) using `docker-compose.prod.yml`.

**Specs:** 4 OCPUs + 24 GB RAM · 200 GB storage · Forever free

---

## Step 1: Create Oracle Cloud Account

1. Go to **https://cloud.oracle.com**
2. Sign up with email + password (use a real email for verification)
3. **Do NOT add credit card** — request Always Free resources only
4. After verification, log into the OCI Console

---

## Step 2: Create a Always Free Ampere Instance

1. In OCI Console → **Compute → Instances → Create instance**
2. Name: `spurtalk-server`
3. **Image:** Oracle Linux 8+ (or Ubuntu 22.04)
4. **Shape:** `Ampere` → select **VM.Standard.A1.Flex** (4 OCPUs, 24 GB RAM — always free)
5. **Subnet:** Create new or use existing (must allow public IP)
6. **Add SSH keys:** Upload your `~/.ssh/id_rsa.pub` or create a new key pair
7. Click **Create**

Wait ~2-3 minutes for provisioning.

---

## Step 3: Reserve a Public IP

1. Go to **Networking → Virtual Cloud Networks**
2. Select your VCN → **Reserved IPs** → **Reserve a New IP**
3. Name it `spurtalk-ip` → Assign to your instance

---

## Step 4: SSH Into the Server

```bash
ssh opc@<your-public-ip>
```

Update the system:
```bash
sudo dnf update -y   # Oracle Linux
# OR on Ubuntu: sudo apt update && sudo apt upgrade -y
```

Install Docker:
```bash
sudo dnf install -y docker docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker opc
# Log out and back in for group change to take effect
```

---

## Step 5: Upload SpurTalk Code

From your local machine:

```bash
cd ~/dev/spurtalk
scp -r . opc@<your-public-ip>:/home/opc/spurtalk/
```

**Or use git on the server:**
```bash
# On the server
ssh opc@<your-public-ip>
git clone <your-spurtalk-repo-url> /home/opc/spurtalk
```

---

## Step 6: Configure Environment

On the server, create `.env`:

```bash
cd /home/opc/spurtalk
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=7101

# Generate secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Database (credentials from docker-compose.prod.yml)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=spurtalk
DB_USER=postgres
DB_PASSWORD=YourSecurePassword123!

# Redis
REDIS_URL=redis://redis:6379

# OpenRouter (use your key from openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-your-key-here
EOF
```

Update `DB_PASSWORD` in both `backend/.env` and `docker-compose.prod.yml`.

---

## Step 7: Deploy

```bash
cd /home/opc/spurtalk
docker-compose -f docker-compose.prod.yml up -d
```

Check status:
```bash
docker ps
docker-compose -f docker-compose.prod.yml logs -f
```

---

## Step 8: Configure Firewall

In OCI Console → Security Lists → Add ingress rules for:
- **7100** (web frontend)
- **7101** (API backend)

Or via command line on the server:
```bash
sudo firewall-cmd --permanent --add-port=7100/tcp
sudo firewall-cmd --permanent --add-port=7101/tcp
sudo firewall-cmd --reload
```

---

## Step 9: Point Domain (Optional)

Add an A record pointing your domain to the public IP:
```
A  spurtalk.yourdomain.com  →  <your-public-ip>
```

Update `next.config.ts` rewrites if using a custom domain.

---

## Updating Deployment

```bash
cd /home/opc/spurtalk
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## Troubleshooting

**Container won't start:**
```bash
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs web
```

**Database connection fails:**
```bash
docker exec spurtalk-postgres psql -U postgres -d spurtalk -c "SELECT 1"
```

**Check resource usage:**
```bash
docker stats
```

---

## Cost Summary

| Resource | Price |
|----------|-------|
| Ampere A1 (4 OCPU/24GB) | **$0** |
| 200 GB Block Storage | **$0** |
| Data transfer | **$0** (within always free limits) |
| Domain (optional) | ~$10/yr |
| **Total** | **$0** |
