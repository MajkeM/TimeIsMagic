# Database Setup Instructions

## 🚀 Jak dokončit nastavení databáze

### 1. Získání databázových údajů z Vercelu
1. Jděte do [Vercel Dashboard](https://vercel.com/dashboard)
2. Vyberte váš projekt
3. Klikněte na **Storage** tab
4. Vyberte vaši Postgres databázi
5. Jděte na **Settings** → **Connection String**
6. Zkopírujte všechny environment variables

### 2. Aktualizace .env.local souboru
Nahraďte prázdné hodnoty ve `.env.local` skutečnými údaji z Vercelu:

```env
POSTGRES_URL="postgresql://username:password@host:port/database"
POSTGRES_PRISMA_URL="postgresql://username:password@host:port/database"
# ... zbytek údajů
```

### 3. Inicializace databáze
Po nastavení .env.local spusťte:

```bash
# Spustit aplikaci
npm run dev

# V prohlížeči jděte na:
http://localhost:1111

# Potom zavolejte inicializaci databáze:
curl -X POST http://localhost:1111/api/init
```

### 4. Test systému
1. Otevřete aplikaci v prohlížeči
2. Měli byste vidět login/register formulář
3. Zaregistrujte se jako nový uživatel
4. Přihlaste se
5. Váš progress se nyní ukládá do databáze!

### 5. Deployment na Vercel
```bash
# Push do GitHub
git add .
git commit -m "Add database integration with auth system"
git push

# V Vercel dashboard nastavte environment variables:
# - POSTGRES_URL
# - POSTGRES_PRISMA_URL
# - POSTGRES_URL_NON_POOLING
# - POSTGRES_USER
# - POSTGRES_HOST
# - POSTGRES_PASSWORD
# - POSTGRES_DATABASE
# - JWT_SECRET
```

### 6. Po deploymetu na produkci
Inicializujte databázi na produkci:
```bash
curl -X POST https://your-app.vercel.app/api/init
```

## 🎮 Co se změnilo
- ✅ **Auth systém**: Login/Register
- ✅ **Databáze**: Postgres místo localStorage  
- ✅ **User accounts**: Každý má svůj progress
- ✅ **JWT tokeny**: Bezpečná autentizace
- ✅ **API routes**: /api/auth/login, /api/auth/register, /api/progress

## 🔄 Migrace dat
Stávající localStorage data zůstanou, ale nová data se ukládají do databáze.
Pokud chcete migrovat existující data, kontaktujte vývojáře.

## 🆘 Troubleshooting
- **Database connection error**: Zkontrolujte .env.local údaje
- **Auth not working**: Zkontrolujte JWT_SECRET
- **Can't login**: Zkuste zavolat /api/init endpoint