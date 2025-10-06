# 🔒 BEZPEČNOSTNÍ VYLEPŠENÍ

## 1. OKAMŽITĚ IMPLEMENTOVAT:

### Environment Variables:
```bash
# .env.local
NODE_ENV=production
JWT_SECRET=your-super-secret-256-bit-key
DATABASE_URL=your-database-url
LOG_LEVEL=error
```

### Console Logs - Odstranit v produkci:
```javascript
// Nahradit všechny console.log s:
if (process.env.NODE_ENV !== 'production') {
  console.log("Debug info");
}
```

## 2. RATE LIMITING (Doporučeno):

### Pro Vercel - využít edge functions:
```javascript
// api/auth/login.js
const attempts = new Map();

// Před ověřením hesla:
const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
const now = Date.now();
const userAttempts = attempts.get(ip) || [];

// Filtrovat pokusy za posledních 15 minut
const recentAttempts = userAttempts.filter(time => now - time < 15 * 60 * 1000);

if (recentAttempts.length >= 5) {
  return res.status(429).json({ error: "Too many attempts" });
}
```

## 3. DODATEČNÁ BEZPEČNOST:

### Input Sanitization:
```javascript
const sanitizeInput = (str) => {
  return str.trim().substring(0, 255); // Limit délky
};
```

### CORS Headers:
```javascript
res.setHeader('Access-Control-Allow-Origin', 'your-domain.com');
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
```

## 4. MONITORING:

### Error Tracking:
- Implementovat Sentry nebo podobný nástroj
- Logovat security events
- Monitoring neobvyklého chování

## SOUČASNÝ STAV: 🟡 STŘEDNÍ RIZIKO
Hra je **relativně bezpečná** pro malý provoz, ale potřebuje úpravy pro produkci.