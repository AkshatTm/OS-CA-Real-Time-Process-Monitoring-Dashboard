---
name: Enhancement
about: Suggest an improvement for this project
title: "[ENHANCEMENT] Add system alerts for high resource usage"
labels: enhancement, good first issue
assignees: AkshatTm
---

## 📋 Issue Description

Add a notification/alert system that warns users when system resources exceed certain thresholds.

## 🎯 Proposed Enhancement

Implement a resource monitoring alert system with the following features:

### Features to Add:

1. **CPU Alert** - Warning when CPU usage exceeds 80%
2. **Memory Alert** - Warning when memory usage exceeds 85%
3. **Disk Alert** - Warning when disk usage exceeds 90%
4. **Visual Indicators** - Color-coded alerts (yellow for warning, red for critical)
5. **Toast Notifications** - Non-intrusive notifications in the UI

## 💡 Benefits

- Helps users identify resource bottlenecks quickly
- Improves user experience with proactive warnings
- Makes the dashboard more useful for system monitoring
- Demonstrates OS concepts of resource management

## 🔧 Technical Implementation

### Backend Changes:

- Add threshold checking logic in `/api/system/stats` endpoint
- Return alert status with system statistics
- Make thresholds configurable

### Frontend Changes:

- Create `AlertBanner.jsx` component
- Add alert state management
- Display visual indicators on dashboard
- Show toast notifications for new alerts

## 📝 Acceptance Criteria

- [ ] Backend returns alert status with system stats
- [ ] Frontend displays alert banner when thresholds exceeded
- [ ] Alerts use appropriate colors (yellow/red)
- [ ] Toast notifications appear for new alerts
- [ ] Alerts clear when usage returns to normal
- [ ] Thresholds are configurable

## 🎨 UI Mockup

```
┌─────────────────────────────────────────┐
│ ⚠️  Warning: CPU usage is at 85%        │
│ 🔴 Critical: Memory usage is at 92%     │
└─────────────────────────────────────────┘
```

## 📚 Related Documentation

- Enhances: Dashboard component
- Relates to: Performance monitoring
- Improves: User experience

## 🏷️ Labels

- `enhancement`
- `good first issue`
- `ui/ux`
- `backend`
- `frontend`

---

**Note:** This issue can be assigned to contributors looking to enhance the monitoring capabilities.
