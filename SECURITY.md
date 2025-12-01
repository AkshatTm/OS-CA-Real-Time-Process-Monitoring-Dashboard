# Security Policy

## Supported Versions

We provide security updates for the following versions of Task Manager Pro:

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | ✅ Current hybrid architecture |
| 1.x     | ❌ Legacy Python-only version |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Task Manager Pro, please report it responsibly.

### 🔒 How to Report

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please:

1. **Email**: Send details to the project maintainers (contact information in README)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if you have one)

### 📋 What to Include

Please provide as much information as possible:

```
Subject: [SECURITY] Brief description

Vulnerability Details:
- Component affected (Rust backend, Python backend, Frontend)
- Type of vulnerability (e.g., privilege escalation, code injection, etc.)
- Attack vector (local, network, etc.)
- Authentication required? (admin rights, specific user, etc.)

Steps to Reproduce:
1. Step one
2. Step two
3. Step three

Impact Assessment:
- What can an attacker do?
- What data/systems are at risk?
- Severity level (Critical, High, Medium, Low)

Environment:
- OS version
- Task Manager Pro version
- Browser (if frontend vulnerability)
```

### ⏰ Response Timeline

We aim to:
- **Acknowledge** your report within 48 hours
- **Investigate** and provide initial assessment within 1 week
- **Fix** critical vulnerabilities within 2 weeks
- **Release** security updates as soon as possible

### 🎁 Recognition

We appreciate security researchers who help keep our project safe:
- Public acknowledgment (if desired) after fix is released
- Credit in security advisory and changelog
- Hall of fame section for significant contributions

## 🔐 Security Considerations

### Current Architecture Security

Our hybrid architecture has specific security implications:

#### Rust Backend (Port 8000)
- **Admin Rights**: Required for process termination
- **Process Control**: Can kill any process user has rights to
- **System Access**: Full system monitoring capabilities
- **Network**: Listens on all interfaces (0.0.0.0:8000)

#### Python Backend (Port 8001)  
- **No Admin Rights**: Read-only system monitoring
- **Local Only**: Bound to 127.0.0.1 for security
- **Limited Access**: Cannot modify system state

#### Frontend (Port 5173)
- **Client-Side**: No direct system access
- **API Calls**: All system interaction via backends
- **CORS**: Restricted to localhost origins

### Known Security Considerations

#### 1. Process Termination Capabilities
- **Risk**: Can terminate critical system processes
- **Mitigation**: 
  - Requires explicit admin elevation
  - User confirmation for process killing
  - Protected processes are marked and harder to kill

#### 2. System Information Exposure
- **Risk**: Reveals detailed system information
- **Mitigation**: 
  - Local access only (no remote exposure by default)
  - No sensitive credential exposure

#### 3. Network Binding
- **Risk**: Rust backend binds to all interfaces
- **Mitigation**: 
  - Firewall should block external access
  - Consider changing to 127.0.0.1 for enhanced security

#### 4. Admin Privilege Escalation
- **Risk**: Rust backend requires admin rights
- **Mitigation**: 
  - Explicit user consent via START_RUST_ADMIN.bat
  - Limited scope (only process control, not full admin)

### 🛡️ Security Best Practices

#### For Users

1. **Firewall Configuration**
   ```bash
   # Block external access to backend ports
   netsh advfirewall firewall add rule name="Block Task Manager Pro - Rust" dir=in action=block protocol=TCP localport=8000
   netsh advfirewall firewall add rule name="Block Task Manager Pro - Python" dir=in action=block protocol=TCP localport=8001
   ```

2. **Admin Rights**
   - Only run with admin rights when process termination is needed
   - Use regular user mode for monitoring only

3. **Network Security**
   - Don't expose ports 8000/8001 externally
   - Use only on trusted networks

#### For Developers

1. **Input Validation**
   ```rust
   // Always validate PIDs
   if pid == 0 || pid > u32::MAX {
       return Err(AppError::InvalidPid);
   }
   ```

2. **Error Handling**
   ```rust
   // Don't expose internal paths in errors
   match kill_process(pid) {
       Ok(_) => "Process terminated successfully",
       Err(_) => "Failed to terminate process", // Generic message
   }
   ```

3. **CORS Configuration**
   ```rust
   let cors = CorsLayer::new()
       .allow_origin("http://localhost:5173".parse().unwrap()) // Specific origin only
       .allow_methods([Method::GET, Method::POST])
       .allow_headers([CONTENT_TYPE]);
   ```

## 🚨 Common Vulnerabilities to Avoid

### 1. Path Traversal
```rust
// ❌ DON'T: Allow arbitrary file access
let file_path = format!("/proc/{}/exe", pid);

// ✅ DO: Validate and sanitize
if !pid.to_string().chars().all(|c| c.is_numeric()) {
    return Err(AppError::InvalidPid);
}
```

### 2. Command Injection
```rust
// ❌ DON'T: Execute shell commands with user input
std::process::Command::new("taskkill").arg(&format!("/PID {}", pid));

// ✅ DO: Use proper APIs
System::new().process(Pid::from_u32(pid))?.kill();
```

### 3. Information Disclosure
```rust
// ❌ DON'T: Expose internal errors
return Err(format!("Failed to access {}: {}", internal_path, error));

// ✅ DO: Generic error messages
return Err("Operation failed".to_string());
```

### 4. CSRF Protection
```typescript
// ✅ DO: Use proper HTTP methods
// GET for reading, POST for actions
await axios.post(`/api/process/${pid}/kill`); // Correct
await axios.get(`/api/process/${pid}/kill`);  // Wrong - CSRF vulnerable
```

## 🔍 Security Testing

### Automated Security Scanning

We recommend running these tools:

```bash
# Rust security audit
cargo audit

# Python dependency check
pip-audit

# Frontend vulnerability scan
npm audit

# OWASP ZAP (for web application security)
# Run against http://localhost:5173
```

### Manual Security Testing

1. **Privilege Escalation**
   - Test process killing without admin rights
   - Verify error handling

2. **Input Validation**
   - Test with malformed PIDs
   - Test with extremely large numbers
   - Test with negative numbers

3. **Network Security**
   - Test CORS restrictions
   - Test with different origins
   - Check for open ports

4. **System Impact**
   - Monitor resource usage
   - Test with high process counts
   - Check for memory leaks

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Rust Security Guidelines](https://anssi-fr.github.io/rust-guide/)
- [Python Security](https://python-security.readthedocs.io/)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)

## 🔄 Security Updates

Security fixes will be:
- Released as patch versions (e.g., 2.0.1)
- Documented in security advisories
- Announced in README and release notes
- Tagged with `security` label in GitHub

## ⚖️ Disclosure Policy

We follow **responsible disclosure**:

1. **Private Report** → Investigation → **Private Fix** → **Public Disclosure**
2. **90-day maximum** from report to public disclosure
3. **Coordinated release** with security advisory
4. **Credit given** to security researcher (if desired)

---

**Remember**: Security is everyone's responsibility. When in doubt, report it! 🛡️