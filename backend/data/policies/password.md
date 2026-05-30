# Password Policy

## 1. Purpose
Define requirements for creating, managing, and protecting passwords.

## 2. Requirements

### 2.1 Password Complexity
- Minimum 14 characters
- Must include: uppercase, lowercase, numbers, special characters
- Must not contain username or common dictionary words
- Must not be in known breach databases

### 2.2 Password Management
- Change every 90 days (or upon suspected compromise)
- No reuse within 12 generations
- Account lockout after 5 failed attempts (30-minute lockout)
- Use approved password manager for storage

### 2.3 Multi-Factor Authentication
- Required for all remote access
- Required for all administrative access
- Required for access to sensitive data

### 2.4 Service Accounts
- Minimum 24 characters
- Managed via privileged access management (PAM)
- Rotated every 60 days

## 3. Prohibited Practices
- Writing passwords on paper or sticky notes
- Sharing passwords with anyone
- Storing passwords in plaintext files
- Using the same password across multiple systems

## 4. Enforcement
Non-compliance may result in account suspension and disciplinary action.
