# Common Security Issues and Fixes

## SQL Injection

**Bad:**
```javascript
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

**Good:**
```javascript
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

## XSS (Cross-Site Scripting)

**Bad:**
```javascript
element.innerHTML = userInput;
```

**Good:**
```javascript
element.textContent = userInput;
// Or use a sanitization library
```

## Hardcoded Secrets

**Bad:**
```javascript
const API_KEY = "sk-1234567890abcdef";
```

**Good:**
```javascript
const API_KEY = process.env.API_KEY;
```

## Insecure Authentication

**Bad:**
```javascript
if (password === storedPassword) { /* authenticate */ }
```

**Good:**
```javascript
const isValid = await bcrypt.compare(password, hashedPassword);
```
