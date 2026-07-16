# HUGS Harmony (Next.js)

ระบบการเงินคริสตจักรชีวิตสุขสันต์กาฬสินธุ์ — เวอร์ชั่น Next.js

เดิมเป็น TanStack Start (ดูโฟลเดอร์ `hugs-harmony` เก่า) ย้ายมา Next.js เพื่อให้มี
REST API routes แยกที่เรียกจาก vanilla-JS frontend (`public/church-app.html`) ได้สะดวก

## Stack

- Next.js (App Router) + JavaScript
- CSS ธรรมดา (ไม่ใช้ Tailwind)
- better-sqlite3 (SQLite local database)
- Frontend จริง: `public/church-app.html` (vanilla JS, โหลดผ่าน iframe ใน `app/page.js`)

## Structure

```
app/
  page.js              # iframe shell -> /church-app.html
  api/
    settings/route.js      # GET/PUT  church settings
    donations/route.js     # GET/POST donation rows
    expenses/route.js      # GET/POST expense logs
    history/route.js       # GET/POST closed-week ledger
    receipts/route.js      # GET/POST receipt list + store
    receipts/[id]/route.js # GET raw receipt image bytes
lib/
  db.js                 # SQLite connection + schema + auto-migrate
public/
  church-app.html       # the actual app UI (vanilla JS)
.data/                  # generated SQLite DB (git-ignored)
```

## Commands

```bash
npm run dev      # dev server (default :3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint
```

## Notes

- Data persists in `.data/church.db` (git-ignored). No longer localStorage-only.
- Receipt images are stored as real BLOBs, not base64 in state.
- No authentication yet — anyone who can reach the API can read/write.
