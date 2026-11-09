# IELTS 30 kunlik challenge

Listening va Reading maslahatlari, Writing AI tekshiruvi (band bahosi bilan), 30 kunlik reja va fokus vositalari (Pomodoro, kunlik maqsad).

## Lokal ishga tushirish (VS Code)

```bash
npm install
cp .env.example .env      # ichiga ANTHROPIC_API_KEY ni yozing
export $(cat .env | xargs) # Windows PowerShell: $env:ANTHROPIC_API_KEY="sk-ant-..."
npm start
```

Brauzerda: http://localhost:3000

## GitHub ga chiqarish

```bash
git init
git add .
git commit -m "IELTS 30 day challenge"
git branch -M main
git remote add origin https://github.com/USERNAME/ielts-30-day-challenge.git
git push -u origin main
```

## Render ga joylash

1. render.com da **New > Web Service** ni tanlang va GitHub repozitoriyni ulang.
2. Build command: `npm install`, Start command: `npm start` (render.yaml dan avtomatik olinadi).
3. **Environment** bo'limida `ANTHROPIC_API_KEY` qo'shing (console.anthropic.com dan olinadi).
4. Deploy tugagach, berilgan havola orqali kiring.

Eslatma: progress (kunlar, tarix) brauzeringizning localStorage ida saqlanadi. Bepul Render rejasi 15 daqiqa faolsizlikdan keyin uxlaydi, birinchi ochilish sekin bo'lishi mumkin.
