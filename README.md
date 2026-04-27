# ☁️ CloudOptix: AWS Cost Optimizer Dashboard

CloudOptix ek powerful tool hai jo AWS infrastructure (EC2 instances) ko monitor karta hai aur idle ya oversized resources ko identify karke cloud spending kam karne mein madad karta hai. Ye project **FastAPI** (Backend), **Next.js** (Frontend), aur **Moto** (AWS Emulator) ka istemal karta hai.

## 🚀 Features

- **Real-time Monitoring:** Active servers aur waste points ka live data.
- **Smart Actions:** Oversized instances (t3.large) ko detect karke terminate karne ki suggestion.
- **Infrastructure Nodes:** Active instances ki mukammal list aur unki health status.
- **Cost Analytics:** Standard vs Optimized spending ka visual comparison.
- **AWS Emulation:** Bina asli AWS bill ke Moto server par testing ki sahulat.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, Tailwind CSS, Lucide React, Recharts.
- **Backend:** FastAPI (Python), Boto3.
- **Mock AWS:** Moto (Server Mode).

## 📋 Prerequisites

Is project ko chalane ke liye aapke system mein niche di gayi cheezein honi chahiye:
- Python 3.10+
- Node.js 18+
- Git

## ⚙️ Installation & Setup

Project ko local machine par chalane ke liye 3 alag terminals mein niche diye gaye steps follow karein:

### 1. Moto Server (AWS Mock)
Pehle terminal mein AWS EC2 environment ko emulate karein:
```bash
pip install "moto[server]"
python -m moto.server -p 4566
