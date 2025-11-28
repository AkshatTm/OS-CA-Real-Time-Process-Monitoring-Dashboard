# Creating and Resolving GitHub Issue for Repository Insights

## 📋 How to Create the Issue

1. **Go to your repository on GitHub:**
   https://github.com/AkshatTm/OS-CA-Real-Time-Process-Monitoring-Dashboard

2. **Click on "Issues" tab**

3. **Click "New Issue" button**

4. **Fill in the details:**

   - **Title:** `[ENHANCEMENT] Add system alerts for high resource usage`
   - **Description:** Copy the content from `.github/ISSUE_TEMPLATE.md`
   - **Labels:** Add `enhancement`, `good first issue`
   - **Assignees:** Assign to yourself (@AkshatTm)

5. **Click "Submit new issue"**

## ✅ Issue Already Resolved!

The issue has already been implemented in the `feature/updates` branch with commit `9a9435f`.

### What was implemented:

✨ **Backend Changes:**

- Added configurable alert thresholds:
  - CPU: Warning at 80%, Critical at 95%
  - Memory: Warning at 85%, Critical at 95%
  - Disk: Warning at 90%, Critical at 95%
- Added `check_alerts()` function to monitor resources
- Modified `/api/system/stats` endpoint to include alerts

✨ **Frontend Changes:**

- Created new `AlertBanner.jsx` component with:
  - Color-coded alerts (yellow for warning, red for critical)
  - Smooth animations with Framer Motion
  - Icons for different severity levels
  - Real-time usage percentage display
- Integrated AlertBanner into Dashboard component

## 🔄 Next Steps to Generate Repository Insights

### Option 1: Merge via Pull Request (Recommended)

1. **Create Pull Request:**

   - Go to: https://github.com/AkshatTm/OS-CA-Real-Time-Process-Monitoring-Dashboard/pull/new/feature/updates
   - Title: `Add system resource alerts functionality`
   - Description: Mention `Closes #1` (replace with actual issue number)
   - Click "Create Pull Request"

2. **Review and Merge:**
   - Review the changes
   - Click "Merge Pull Request"
   - This will close the issue automatically and generate insights

### Option 2: Close Issue Manually

1. After creating the issue, go to it
2. Reference the commit: `9a9435f`
3. Add comment: "Fixed in commit 9a9435f"
4. Close the issue

## 📊 What This Generates for Insights

- ✅ Issue created (shows activity)
- ✅ Code commits (shows development activity)
- ✅ Pull request (if using Option 1)
- ✅ Issue closed (shows completion)
- ✅ File changes tracked
- ✅ Lines of code added/removed
- ✅ Contributor activity
- ✅ Code frequency graphs

## 🎯 Current Statistics

**Commits on feature/updates branch:**

- Total: 9 commits
- Latest: `9a9435f` - feat: add system resource alerts functionality

**Files Changed:**

- Backend: `main.py` (+80 lines)
- Frontend: New `AlertBanner.jsx` (+58 lines)
- Frontend: Modified `Dashboard.jsx` (+5 lines)
- Documentation: New `.github/ISSUE_TEMPLATE.md` (+70 lines)

**Total Changes:**

- 4 files modified
- 213 insertions

## 📝 Testing the Feature

To test the alerts feature:

1. Start the backend: `cd backend && python main.py`
2. Start the frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173
4. The dashboard will show alerts when:
   - CPU > 80% (yellow warning) or > 95% (red critical)
   - Memory > 85% (yellow warning) or > 95% (red critical)
   - Disk > 90% (yellow warning) or > 95% (red critical)

## 🎉 Benefits

This workflow demonstrates:

- ✅ Issue tracking
- ✅ Feature development
- ✅ Branch management
- ✅ Commit best practices
- ✅ Code organization
- ✅ Pull request workflow
- ✅ Active repository maintenance

All of this contributes to your GitHub repository insights and activity graph!
