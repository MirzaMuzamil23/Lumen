# Lumen — Full-Stack Production Deployment Guide

A premium studio website built with **Next.js** (frontend) and **Node.js/Express + PostgreSQL** (backend), deployed two ways:

- **Option A:** EC2 + PM2 + Nginx + Let's Encrypt SSL (simple, single-server production)
- **Option B:** Kubernetes + Helm + Prometheus/Grafana (scalable, observable production)

This document is written as a step-by-step runbook. Follow it top to bottom the first time; after that, use it as a reference.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Repository Structure](#2-repository-structure)
3. [Prerequisites](#3-prerequisites)
4. [Step 1 — Push Latest Code to GitHub](#step-1--push-latest-code-to-github)
5. [Step 2 — Create the EC2 Instance](#step-2--create-the-ec2-instance)
6. [Step 3 — Server Setup (Node, PM2, Nginx, PostgreSQL)](#step-3--server-setup-node-pm2-nginx-postgresql)
7. [Step 4 — Deploy the Backend](#step-4--deploy-the-backend)
8. [Step 5 — Deploy the Frontend](#step-5--deploy-the-frontend)
9. [Step 6 — Run Both Apps with PM2](#step-6--run-both-apps-with-pm2)
10. [Step 7 — Configure Nginx as a Reverse Proxy](#step-7--configure-nginx-as-a-reverse-proxy)
11. [Step 8 — Point the Domain at the Server](#step-8--point-the-domain-at-the-server)
12. [Step 9 — Generate an SSL Certificate](#step-9--generate-an-ssl-certificate)
13. [Step 10 — Build & Push Docker Images](#step-10--build--push-docker-images)
14. [Step 11 — Kubernetes: Core Resources](#step-11--kubernetes-core-resources)
15. [Step 12 — Kubernetes: Ingress + SSL](#step-12--kubernetes-ingress--ssl)
16. [Step 13 — Kubernetes: Autoscaling](#step-13--kubernetes-autoscaling)
17. [Step 14 — Package Everything as a Helm Chart](#step-14--package-everything-as-a-helm-chart)
18. [Step 15 — Add Prometheus Metrics to the Backend](#step-15--add-prometheus-metrics-to-the-backend)
19. [Step 16 — Install Prometheus + Grafana](#step-16--install-prometheus--grafana)
20. [Step 17 — Verify Monitoring Is Working](#step-17--verify-monitoring-is-working)
21. [Environment Variables Reference](#environment-variables-reference)
22. [Day-to-Day Commands](#day-to-day-commands)
23. [Troubleshooting](#troubleshooting)

---

## 1. Architecture Overview

```
                         ┌─────────────────────────┐
   Browser  ───HTTPS───▶ │   Nginx / Ingress (SSL)  │
                         └───────────┬─────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        /api/*  → Backend (Express, :5000)      /  → Frontend (Next.js, :3000)
                 │                                       
                 ▼
          PostgreSQL (:5432)
```

Two independent deployment paths exist for the same codebase:

| | EC2 path | Kubernetes path |
|---|---|---|
| Process manager | PM2 | Kubernetes Deployments |
| Reverse proxy | Nginx | NGINX Ingress Controller |
| SSL | Certbot (Let's Encrypt) | cert-manager (Let's Encrypt) |
| Database | PostgreSQL on the same VM | PostgreSQL StatefulSet + PVC |
| Scaling | Manual | HorizontalPodAutoscaler |
| Monitoring | PM2 logs | Prometheus + Grafana |

You can run either one on its own, or both against the same GitHub repo for comparison/learning.

---

## 2. Repository Structure

```
.
├── backend/
│   ├── config/          # DB connection pool
│   ├── controllers/      # Route handlers (auth, contact, projects)
│   ├── middleware/       # JWT auth guard, admin guard, error handler
│   ├── models/            # SQL query functions
│   ├── routes/             # Express routers
│   ├── sql/                 # schema.sql + migrations
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── app/               # Next.js App Router pages
│   ├── components/         # Reusable React components
│   ├── lib/                  # API client, auth/theme context
│   ├── Dockerfile
│   └── package.json
├── k8s/                     # Raw Kubernetes manifests
├── lumen-chart/              # Helm chart (parameterized k8s/)
└── docker-compose.yml         # Local dev: all services in one command
```

---

## 3. Prerequisites

Before starting, make sure you have:

- [ ] A GitHub account with this repo already pushed and a remote configured
- [ ] An AWS account with billing set up (EC2 has a free tier, but a `t3.small` is not fully free)
- [ ] A domain name you control the DNS for (in this case, provided by a friend)
- [ ] `kubectl` and `helm` installed locally if you're doing the Kubernetes path (`brew install kubectl helm` on Mac, or see [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) for other OSes)
- [ ] A Docker Hub account (free) if you're doing the Kubernetes path
- [ ] An SSH key pair for EC2 (created during instance launch, covered below)

---

## Step 1 — Push Latest Code to GitHub

**1.1** Open a terminal in your project's root folder (the one containing `backend/` and `frontend/`).

**1.2** Check what's changed:
```bash
git status
```

**1.3** Stage everything:
```bash
git add .
```

**1.4** Commit with a clear message:
```bash
git commit -m "Add role-based dashboard, projects system, dark mode, and redesigned UI"
```

**1.5** Confirm which branch you're on:
```bash
git branch --show-current
```

**1.6** Push:
```bash
git push origin main
```
(replace `main` with your actual branch name if different)

**1.7** If push is rejected (`non-fast-forward`), someone/something added a commit on GitHub you don't have locally:
```bash
git pull origin main --rebase
git push origin main
```

**1.8** Confirm `.env` files were never committed (they contain secrets):
```bash
git ls-files | grep .env
```
If `backend/.env` or `frontend/.env.local` shows up, remove them from tracking immediately:
```bash
echo "backend/.env" >> .gitignore
echo "frontend/.env.local" >> .gitignore
git rm --cached backend/.env frontend/.env.local
git add .gitignore
git commit -m "Stop tracking env files"
git push origin main
```

✅ **Checkpoint:** Your GitHub repo's latest commit matches your local `HEAD`. Confirm on github.com that the commit and files you expect are there.

---

## Step 2 — Create the EC2 Instance

**2.1** Log into the [AWS Console](https://console.aws.amazon.com/) → search **EC2** → **Launch Instance**.

**2.2** Fill in the launch form:
| Field | Value |
|---|---|
| Name | `lumen-production` |
| AMI | **Ubuntu Server 24.04 LTS** (free tier eligible) |
| Instance type | `t3.small` recommended (`t2.micro` works but is tight running Node + Postgres + Nginx together) |
| Key pair | Create new → name it `lumen-key` → **download the `.pem` file and store it safely** (cannot be re-downloaded) |

**2.3** Under **Network settings → Edit**, allow these inbound rules:
| Type | Port | Source |
|---|---|---|
| SSH | 22 | My IP (not 0.0.0.0/0 — keep this locked to you) |
| HTTP | 80 | Anywhere (0.0.0.0/0) |
| HTTPS | 443 | Anywhere (0.0.0.0/0) |

**2.4** Under **Storage**, set to **20 GiB** (the 8 GiB default is tight).

**2.5** Click **Launch instance**.

**2.6** Once it's running, allocate a permanent IP so it doesn't change on reboot:
- EC2 dashboard → **Elastic IPs** → **Allocate Elastic IP address** → Allocate
- Select the new IP → **Actions → Associate Elastic IP address** → choose your instance → Associate

**2.7** Note the Elastic IP — you'll need it for DNS later.

**2.8** Connect via SSH:
```bash
chmod 400 ~/Downloads/lumen-key.pem
ssh -i ~/Downloads/lumen-key.pem ubuntu@<YOUR_ELASTIC_IP>
```

✅ **Checkpoint:** You have a shell prompt like `ubuntu@ip-xxx-xxx-xxx-xxx:~$`.

---

## Step 3 — Server Setup (Node, PM2, Nginx, PostgreSQL)

Run these **on the EC2 instance**, one block at a time.

**3.1** Update the system:
```bash
sudo apt update && sudo apt upgrade -y
```

**3.2** Install Node.js 20:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # should print v20.x.x
npm -v
```

**3.3** Install PM2 globally (keeps your Node apps alive, restarts them on crash or reboot):
```bash
sudo npm install -g pm2
```

**3.4** Install Nginx (reverse proxy — routes incoming traffic to your apps):
```bash
sudo apt install -y nginx
```

**3.5** Install PostgreSQL:
```bash
sudo apt install -y postgresql postgresql-contrib
```

**3.6** Install Git (usually pre-installed on Ubuntu, but confirm):
```bash
sudo apt install -y git
git --version
```

**3.7** Configure the firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```
Type `y` when prompted.

✅ **Checkpoint:**
```bash
node -v && pm2 -v && nginx -v && psql --version
```
All four should print version numbers without errors.

---

## Step 4 — Deploy the Backend

**4.1** Clone your repo:
```bash
cd ~
git clone https://github.com/<your-username>/<your-repo>.git lumen
cd lumen/backend
```

**4.2** Install dependencies:
```bash
npm install --production
```

**4.3** Create the database and a dedicated app user:
```bash
sudo -u postgres psql
```
Inside the `psql` prompt:
```sql
CREATE USER lumen_app WITH PASSWORD 'choose-a-strong-password-here';
CREATE DATABASE premium_website OWNER lumen_app;
\q
```

**4.4** Generate a strong JWT secret:
```bash
openssl rand -hex 32
```
Copy the output — you'll paste it into `.env` next.

**4.5** Create the environment file:
```bash
cp .env.example .env
nano .env
```
Fill in:
```
PORT=5000
NODE_ENV=production
PGHOST=localhost
PGPORT=5432
PGUSER=lumen_app
PGPASSWORD=<the password from step 4.3>
PGDATABASE=premium_website
JWT_SECRET=<the random string from step 4.4>
JWT_EXPIRES_IN=7d
CLIENT_URL=https://yourdomain.com
```
Save with `Ctrl+O`, `Enter`, then exit with `Ctrl+X`.

**4.6** Run the database schema:
```bash
psql -U lumen_app -d premium_website -h localhost -f sql/schema.sql
```
Enter the password from step 4.3 when prompted.

**4.7** Test the backend runs correctly:
```bash
node server.js
```
You should see `Server running on http://localhost:5000`. Press `Ctrl+C` to stop — PM2 will run it properly in the next step.

✅ **Checkpoint:**
```bash
psql -U lumen_app -d premium_website -h localhost -c "\dt"
```
Should list `users`, `contact_messages`, and `projects` tables.

---

## Step 5 — Deploy the Frontend

**5.1** Move into the frontend folder:
```bash
cd ~/lumen/frontend
npm install
```

**5.2** Create the frontend environment file:
```bash
echo "NEXT_PUBLIC_API_URL=https://yourdomain.com/api" > .env.local
```

**5.3** Build the production bundle:
```bash
npm run build
```
This takes a minute or two. Watch for `✓ Compiled successfully` at the end.

✅ **Checkpoint:** A `.next/` folder now exists in `frontend/`.

---

## Step 6 — Run Both Apps with PM2

**6.1** Create a logs folder:
```bash
mkdir -p ~/logs
```

**6.2** Create `~/lumen/backend/ecosystem.config.js`:
```js
module.exports = {
  apps: [
    {
      name: "lumen-backend",
      script: "server.js",
      cwd: "/home/ubuntu/lumen/backend",
      env: { NODE_ENV: "production" },
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      error_file: "/home/ubuntu/logs/backend-error.log",
      out_file: "/home/ubuntu/logs/backend-out.log",
    },
  ],
};
```

**6.3** Create `~/lumen/frontend/ecosystem.config.js`:
```js
module.exports = {
  apps: [
    {
      name: "lumen-frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/home/ubuntu/lumen/frontend",
      env: { NODE_ENV: "production" },
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      error_file: "/home/ubuntu/logs/frontend-error.log",
      out_file: "/home/ubuntu/logs/frontend-out.log",
    },
  ],
};
```

**6.4** Start both apps:
```bash
cd ~/lumen/backend && pm2 start ecosystem.config.js
cd ~/lumen/frontend && pm2 start ecosystem.config.js
```

**6.5** Save the process list and enable startup-on-boot:
```bash
pm2 save
pm2 startup
```
`pm2 startup` prints a command starting with `sudo env PATH=...` — **copy that exact line and run it**. This registers PM2 as a system service so your apps survive a server reboot.

✅ **Checkpoint:**
```bash
pm2 list
```
Both `lumen-backend` and `lumen-frontend` should show status `online`.

```bash
curl http://localhost:5000/api/health
curl -I http://localhost:3000
```
First should return `{"status":"ok"}`. Second should return `HTTP/1.1 200 OK`.

---

## Step 7 — Configure Nginx as a Reverse Proxy

**7.1** Create the site config:
```bash
sudo nano /etc/nginx/sites-available/lumen
```

**7.2** Paste (replace `yourdomain.com` with your real domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

**7.3** Enable the site and remove the default:
```bash
sudo ln -s /etc/nginx/sites-available/lumen /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

**7.4** Test the config syntax:
```bash
sudo nginx -t
```
Should print `syntax is ok` and `test is successful`.

**7.5** Restart Nginx:
```bash
sudo systemctl restart nginx
```

**How this works:** a request to `yourdomain.com/api/anything` gets matched by the `location /api/` block and forwarded to your backend on port 5000. Any other path falls through to `location /` and goes to the frontend on port 3000. One domain, two apps.

✅ **Checkpoint:** Visiting `http://<YOUR_ELASTIC_IP>` in a browser should load your site (domain not wired up yet, but the IP works).

---

## Step 8 — Point the Domain at the Server

**8.1** Log into wherever the domain's DNS is managed (GoDaddy, Namecheap, Cloudflare, etc. — wherever your friend registered it, or wherever they've given you access).

**8.2** Add these two DNS records:
| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `<YOUR_ELASTIC_IP>` | Auto / 3600 |
| A | `www` | `<YOUR_ELASTIC_IP>` | Auto / 3600 |

**8.3** Wait for propagation (usually 15–30 minutes, can take up to 24 hours). Check with:
```bash
nslookup yourdomain.com
```
Once it returns your Elastic IP, you're good.

✅ **Checkpoint:** `http://yourdomain.com` loads your site in a browser (still no padlock — that's next).

---

## Step 9 — Generate an SSL Certificate

**9.1** Install Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

**9.2** Run Certbot against your domain:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**9.3** Answer the prompts:
- Enter your email (used for renewal notices)
- Agree to the Terms of Service
- When asked about redirecting HTTP to HTTPS, **choose the redirect option** — this is what you want in production

Certbot edits your Nginx config automatically to add the certificate and the redirect — you don't need to touch `/etc/nginx/sites-available/lumen` yourself.

**9.4** Verify auto-renewal is set up (Let's Encrypt certs expire every 90 days; Certbot renews them automatically via a systemd timer):
```bash
sudo certbot renew --dry-run
```
Should complete with no errors.

✅ **Checkpoint:** `https://yourdomain.com` loads with a padlock icon in the browser. 🎉

---

## Step 10 — Build & Push Docker Images

*(Only needed for the Kubernetes path — Steps 10 onward.)*

**10.1** Create a free account at [hub.docker.com](https://hub.docker.com) if you don't have one.

**10.2** Log in from your terminal:
```bash
docker login
```

**10.3** Build and push the backend image:
```bash
cd ~/lumen/backend
docker build -t <dockerhub-username>/lumen-backend:v1 .
docker push <dockerhub-username>/lumen-backend:v1
```

**10.4** Build and push the frontend image:
```bash
cd ~/lumen/frontend
docker build -t <dockerhub-username>/lumen-frontend:v1 \
  --build-arg NEXT_PUBLIC_API_URL=https://yourdomain.com/api .
docker push <dockerhub-username>/lumen-frontend:v1
```

✅ **Checkpoint:** Both images appear under **Repositories** on your Docker Hub account page.

---

## Step 11 — Kubernetes: Core Resources

You need access to a Kubernetes cluster — either a managed one (AWS EKS, DigitalOcean, GKE) or a local one for learning (`minikube start` or `kind create cluster`). The commands below are identical either way.

**11.1** Create the namespace — `k8s/00-namespace.yaml`:
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: lumen
```
Apply:
```bash
kubectl apply -f k8s/00-namespace.yaml
```

**11.2** Create secrets (never commit this file — add `k8s/01-secrets.yaml` to `.gitignore`):
```bash
kubectl create secret generic lumen-secrets \
  --namespace=lumen \
  --from-literal=PGPASSWORD='<strong-password>' \
  --from-literal=JWT_SECRET='<64-char-random-string>' \
  --dry-run=client -o yaml > k8s/01-secrets.yaml

kubectl apply -f k8s/01-secrets.yaml
```

**11.3** Create the ConfigMap — `k8s/02-configmap.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: lumen-config
  namespace: lumen
data:
  PORT: "5000"
  NODE_ENV: "production"
  PGHOST: "postgres-service"
  PGPORT: "5432"
  PGUSER: "lumen_app"
  PGDATABASE: "premium_website"
  JWT_EXPIRES_IN: "7d"
  CLIENT_URL: "https://yourdomain.com"
  NEXT_PUBLIC_API_URL: "https://yourdomain.com/api"
```
```bash
kubectl apply -f k8s/02-configmap.yaml
```

**11.4** Deploy PostgreSQL — `k8s/03-postgres.yaml`:
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: lumen
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 5Gi
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: lumen
spec:
  serviceName: postgres-service
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_USER
              valueFrom:
                configMapKeyRef: { name: lumen-config, key: PGUSER }
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef: { name: lumen-secrets, key: PGPASSWORD }
            - name: POSTGRES_DB
              valueFrom:
                configMapKeyRef: { name: lumen-config, key: PGDATABASE }
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
              subPath: postgres
          resources:
            requests: { cpu: "100m", memory: "256Mi" }
            limits: { cpu: "500m", memory: "512Mi" }
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: lumen
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  clusterIP: None
```
```bash
kubectl apply -f k8s/03-postgres.yaml
```

**11.5** Deploy the backend — `k8s/04-backend.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: lumen
spec:
  replicas: 2
  selector:
    matchLabels: { app: backend }
  template:
    metadata:
      labels: { app: backend }
    spec:
      containers:
        - name: backend
          image: <dockerhub-username>/lumen-backend:v1
          ports:
            - name: "5000"
              containerPort: 5000
          envFrom:
            - configMapRef: { name: lumen-config }
          env:
            - name: PGPASSWORD
              valueFrom: { secretKeyRef: { name: lumen-secrets, key: PGPASSWORD } }
            - name: JWT_SECRET
              valueFrom: { secretKeyRef: { name: lumen-secrets, key: JWT_SECRET } }
          resources:
            requests: { cpu: "100m", memory: "150Mi" }
            limits: { cpu: "300m", memory: "300Mi" }
          readinessProbe:
            httpGet: { path: /api/health, port: 5000 }
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /api/health, port: 5000 }
            initialDelaySeconds: 10
            periodSeconds: 20
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: lumen
spec:
  selector: { app: backend }
  ports:
    - name: "5000"
      port: 5000
      targetPort: 5000
```
```bash
kubectl apply -f k8s/04-backend.yaml
```

**11.6** Deploy the frontend — `k8s/05-frontend.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: lumen
spec:
  replicas: 2
  selector:
    matchLabels: { app: frontend }
  template:
    metadata:
      labels: { app: frontend }
    spec:
      containers:
        - name: frontend
          image: <dockerhub-username>/lumen-frontend:v1
          ports:
            - containerPort: 3000
          resources:
            requests: { cpu: "100m", memory: "150Mi" }
            limits: { cpu: "300m", memory: "300Mi" }
          readinessProbe:
            httpGet: { path: /, port: 3000 }
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: lumen
spec:
  selector: { app: frontend }
  ports:
    - port: 3000
      targetPort: 3000
```
```bash
kubectl apply -f k8s/05-frontend.yaml
```

**11.7** Load the database schema into the K8s Postgres pod:
```bash
kubectl port-forward -n lumen statefulset/postgres 5432:5432 &
psql -U lumen_app -d premium_website -h localhost -f backend/sql/schema.sql
# then press Ctrl+C or `kill %1` to stop the port-forward
```

✅ **Checkpoint:**
```bash
kubectl get pods -n lumen
```
All pods should show `STATUS: Running` and `READY: 1/1` (or `2/2` if replicas=2 both came up).

---

## Step 12 — Kubernetes: Ingress + SSL

**12.1** Install the NGINX Ingress Controller:
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.0/deploy/static/provider/cloud/deploy.yaml
```

**12.2** Install cert-manager (handles Let's Encrypt certificates natively in Kubernetes):
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.0/cert-manager.yaml
```

**12.3** Wait for both to be ready:
```bash
kubectl get pods -n ingress-nginx
kubectl get pods -n cert-manager
```
All pods should be `Running` before continuing.

**12.4** Create the ClusterIssuer — `k8s/06-cluster-issuer.yaml`:
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: you@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```
```bash
kubectl apply -f k8s/06-cluster-issuer.yaml
```

**12.5** Create the Ingress — `k8s/07-ingress.yaml`:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: lumen-ingress
  namespace: lumen
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  tls:
    - hosts: ["yourdomain.com", "www.yourdomain.com"]
      secretName: lumen-tls
  rules:
    - host: yourdomain.com
      http:
        paths:
          - path: /api(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service: { name: backend-service, port: { number: 5000 } }
          - path: /(.*)
            pathType: ImplementationSpecific
            backend:
              service: { name: frontend-service, port: { number: 3000 } }
```
```bash
kubectl apply -f k8s/07-ingress.yaml
```

**12.6** Get the Ingress Controller's external IP and point your domain's DNS A records at it (same process as Step 8, but pointing to this new IP instead of the EC2 one):
```bash
kubectl get svc -n ingress-nginx
```
Look for the `EXTERNAL-IP` column on the `ingress-nginx-controller` service.

✅ **Checkpoint:**
```bash
kubectl get certificate -n lumen
```
Should eventually show `READY: True` (can take a few minutes while cert-manager talks to Let's Encrypt).

---

## Step 13 — Kubernetes: Autoscaling

**13.1** Create the HPA — `k8s/08-hpa.yaml`:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: lumen
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 70 }
```
```bash
kubectl apply -f k8s/08-hpa.yaml
```

**13.2** Confirm it's tracking:
```bash
kubectl get hpa -n lumen
```
This will show current CPU usage vs. target, and will automatically add backend pods if load crosses 70% CPU.

---

## Step 14 — Package Everything as a Helm Chart

This turns every YAML file above into a reusable, parameterized package — so a whole environment can be installed or upgraded with one command.

**14.1** Scaffold the chart:
```bash
cd ~/lumen
helm create lumen-chart
rm -rf lumen-chart/templates/*
```

**14.2** `lumen-chart/Chart.yaml`:
```yaml
apiVersion: v2
name: lumen-chart
description: Helm chart for the Lumen full-stack app (frontend + backend + postgres)
version: 0.1.0
appVersion: "1.0.0"
```

**14.3** `lumen-chart/values.yaml`:
```yaml
namespace: lumen

backend:
  image: <dockerhub-username>/lumen-backend
  tag: v1
  replicas: 2
  port: 5000

frontend:
  image: <dockerhub-username>/lumen-frontend
  tag: v1
  replicas: 2
  port: 3000

postgres:
  image: postgres:16-alpine
  storage: 5Gi
  user: lumen_app
  database: premium_website

domain: yourdomain.com

secrets:
  pgPassword: "changeme"
  jwtSecret: "changeme"
```

**14.4** `lumen-chart/templates/deployment-backend.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: {{ .Values.namespace }}
spec:
  replicas: {{ .Values.backend.replicas }}
  selector:
    matchLabels: { app: backend }
  template:
    metadata:
      labels: { app: backend }
    spec:
      containers:
        - name: backend
          image: "{{ .Values.backend.image }}:{{ .Values.backend.tag }}"
          ports:
            - containerPort: {{ .Values.backend.port }}
          envFrom:
            - configMapRef: { name: lumen-config }
          env:
            - name: PGPASSWORD
              valueFrom: { secretKeyRef: { name: lumen-secrets, key: PGPASSWORD } }
            - name: JWT_SECRET
              valueFrom: { secretKeyRef: { name: lumen-secrets, key: JWT_SECRET } }
          readinessProbe:
            httpGet: { path: /api/health, port: {{ .Values.backend.port }} }
            initialDelaySeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: {{ .Values.namespace }}
spec:
  selector: { app: backend }
  ports:
    - port: {{ .Values.backend.port }}
      targetPort: {{ .Values.backend.port }}
```

**14.5** `lumen-chart/templates/deployment-frontend.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: {{ .Values.namespace }}
spec:
  replicas: {{ .Values.frontend.replicas }}
  selector:
    matchLabels: { app: frontend }
  template:
    metadata:
      labels: { app: frontend }
    spec:
      containers:
        - name: frontend
          image: "{{ .Values.frontend.image }}:{{ .Values.frontend.tag }}"
          ports:
            - containerPort: {{ .Values.frontend.port }}
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: {{ .Values.namespace }}
spec:
  selector: { app: frontend }
  ports:
    - port: {{ .Values.frontend.port }}
      targetPort: {{ .Values.frontend.port }}
```

**14.6** `lumen-chart/templates/configmap-secrets.yaml`:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: lumen-config
  namespace: {{ .Values.namespace }}
data:
  PORT: "{{ .Values.backend.port }}"
  NODE_ENV: "production"
  PGHOST: "postgres-service"
  PGUSER: "{{ .Values.postgres.user }}"
  PGDATABASE: "{{ .Values.postgres.database }}"
  CLIENT_URL: "https://{{ .Values.domain }}"
---
apiVersion: v1
kind: Secret
metadata:
  name: lumen-secrets
  namespace: {{ .Values.namespace }}
type: Opaque
stringData:
  PGPASSWORD: "{{ .Values.secrets.pgPassword }}"
  JWT_SECRET: "{{ .Values.secrets.jwtSecret }}"
```

**14.7** Install the chart (pass secrets on the command line, never hardcode them in `values.yaml`):
```bash
kubectl create namespace lumen   # skip if already created in Step 11.1
helm install lumen ./lumen-chart \
  --set secrets.pgPassword='<strong-password>' \
  --set secrets.jwtSecret='<64-char-random>'
```

**14.8** To deploy a new version later:
```bash
docker build -t <dockerhub-username>/lumen-backend:v2 backend/
docker push <dockerhub-username>/lumen-backend:v2
helm upgrade lumen ./lumen-chart --set backend.tag=v2
```

✅ **Checkpoint:**
```bash
helm status lumen
kubectl get all -n lumen
```

---

## Step 15 — Add Prometheus Metrics to the Backend

**15.1** Install the metrics library:
```bash
cd ~/lumen/backend
npm install prom-client
```

**15.2** Add this to `server.js` (near where `/api/health` is defined):
```js
const promClient = require("prom-client");
promClient.collectDefaultMetrics();

const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

**15.3** Rebuild and push a new backend image, then redeploy:
```bash
docker build -t <dockerhub-username>/lumen-backend:v2 .
docker push <dockerhub-username>/lumen-backend:v2
helm upgrade lumen ./lumen-chart --set backend.tag=v2
```

✅ **Checkpoint:**
```bash
kubectl port-forward -n lumen deployment/backend 5000:5000
curl http://localhost:5000/metrics
```
Should print a long list of Prometheus-formatted metrics.

---

## Step 16 — Install Prometheus + Grafana

**16.1** Add the Helm repositories:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

**16.2** Create a namespace and install the full monitoring stack:
```bash
kubectl create namespace monitoring

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --set grafana.adminPassword='<choose-a-password>'
```
This installs Prometheus, Grafana, Alertmanager, and pre-built Kubernetes dashboards in one shot.

**16.3** Wait for everything to come up:
```bash
kubectl get pods -n monitoring
```
All should reach `Running`.

**16.4** Tell Prometheus to scrape your backend — `k8s/09-servicemonitor.yaml`:
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: backend-monitor
  namespace: lumen
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: backend
  endpoints:
    - port: "5000"
      path: /metrics
      interval: 15s
```
```bash
kubectl apply -f k8s/09-servicemonitor.yaml
```
The `release: prometheus` label is required — it's how `kube-prometheus-stack` finds ServiceMonitors to pick up.

---

## Step 17 — Verify Monitoring Is Working

**17.1** Open Prometheus:
```bash
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus 9090:9090
```
Visit `http://localhost:9090` → **Status → Targets**. Find `backend-monitor` — it should say **UP**.

**17.2** Run a test query in the search box:
```
http_request_duration_seconds_count
```
You should see real numbers — this is live request-count data from your backend.

**17.3** Open Grafana:
```bash
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```
Visit `http://localhost:3000`:
- Username: `admin`
- Password: the one you set in Step 16.2

**17.4** Explore the pre-built dashboards under **Dashboards** — try "Kubernetes / Compute Resources / Namespace (Pods)" to see live CPU/memory for the `lumen` namespace.

**17.5** Build a custom panel for your backend:
1. **+ → New Dashboard → Add visualization**
2. Data source: **Prometheus**
3. Query: `rate(http_request_duration_seconds_count[5m])`
4. This shows requests-per-second, live, updating as real traffic hits your API

✅ **Checkpoint:** You can watch this graph move in real time by hitting your API a few times from another terminal:
```bash
for i in {1..20}; do curl -s https://yourdomain.com/api/health > /dev/null; done
```

---

## Environment Variables Reference

### `backend/.env`
| Variable | Description |
|---|---|
| `PORT` | Port Express listens on (5000) |
| `NODE_ENV` | `production` in deployed environments |
| `PGHOST` / `PGPORT` / `PGUSER` / `PGPASSWORD` / `PGDATABASE` | PostgreSQL connection details |
| `JWT_SECRET` | Signs auth tokens — must be a long random string, never reused across environments |
| `JWT_EXPIRES_IN` | How long login sessions last (e.g. `7d`) |
| `CLIENT_URL` | Used for CORS and password-reset email links |

### `frontend/.env.local`
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Full URL the frontend uses to reach the backend API |

---

## Day-to-Day Commands

**EC2 / PM2:**
```bash
pm2 list                    # see running apps and their status
pm2 logs                    # tail live logs from all apps
pm2 logs lumen-backend      # tail logs from just the backend
pm2 restart all             # restart both apps (e.g. after pulling new code)
pm2 restart lumen-backend   # restart just the backend
```

**Deploying a code update (EC2 path):**
```bash
cd ~/lumen
git pull origin main
cd backend && npm install --production && pm2 restart lumen-backend
cd ../frontend && npm install && npm run build && pm2 restart lumen-frontend
```

**Kubernetes:**
```bash
kubectl get pods -n lumen                          # pod status
kubectl logs -n lumen deployment/backend -f         # live backend logs
kubectl logs -n lumen deployment/frontend -f        # live frontend logs
kubectl describe pod <pod-name> -n lumen            # debug a stuck/crashing pod
kubectl rollout restart deployment/backend -n lumen # restart without downtime
```

**Helm:**
```bash
helm list                                            # installed releases
helm status lumen                                    # current state
helm upgrade lumen ./lumen-chart --set backend.tag=v3  # deploy a new version
helm rollback lumen 1                                 # roll back to a previous revision
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `502 Bad Gateway` from Nginx | App crashed or isn't running | `pm2 list` → if stopped, `pm2 logs` to see why, then `pm2 restart` |
| SSL certificate renewal fails | Port 80 blocked, or DNS changed | `sudo certbot renew --dry-run` for details; confirm ports 80/443 still open in EC2 security group |
| K8s pod stuck in `Pending` | Not enough cluster resources, or PVC can't bind | `kubectl describe pod <name> -n lumen` — look at the Events section at the bottom |
| K8s pod in `CrashLoopBackOff` | App is erroring on startup | `kubectl logs <pod-name> -n lumen --previous` to see the crash log |
| Grafana shows "No data" | ServiceMonitor label mismatch, or backend not exposing `/metrics` | Confirm `release: prometheus` label is on the ServiceMonitor; `curl` the `/metrics` endpoint directly |
| `git push` rejected | Remote has commits you don't have locally | `git pull origin main --rebase` then push again |
| Domain doesn't resolve | DNS not propagated yet, or wrong record type | Wait up to 24h; verify with `nslookup yourdomain.com`; must be an **A** record, not CNAME, for the root domain |
| Database connection refused | Wrong credentials, or Postgres not running | EC2: `sudo systemctl status postgresql`. K8s: `kubectl logs -n lumen statefulset/postgres` |

---

*Questions or something not matching this guide exactly? Re-check the corresponding step above first — this document is meant to be the single source of truth for how this project is deployed.*
