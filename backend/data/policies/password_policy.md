# Password Policy

## 1. Purpose
Establish requirements for creating and managing passwords.

## 2. Requirements
- Minimum 14 characters
- Mix of uppercase, lowercase, numbers, symbols
- No dictionary words or personal info
- Change every 90 days (or on compromise)
- MFA required for all remote access
- No password reuse (last 12)

## 3. Storage
- Passwords stored using bcrypt/argon2
- Never stored in plaintext
- Password managers encouraged

## 4. Enforcement
Non-compliance results in account lockout and disciplinary action.