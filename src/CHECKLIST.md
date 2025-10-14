# ✅ Setup Checklist

Print this or keep it open while setting up!

---

## Pre-Installation

- [ ] I have a computer (Windows, Mac, or Linux)
- [ ] I have internet connection
- [ ] I have downloaded the project files
- [ ] I know where I saved the project folder

---

## Installation

### 1. Node.js Installation
- [ ] Visited https://nodejs.org/
- [ ] Downloaded LTS version
- [ ] Installed Node.js
- [ ] Restarted terminal/command prompt
- [ ] Verified with `node --version` (shows v18+)
- [ ] Verified with `npm --version` (shows any version)

### 2. Project Setup
- [ ] Extracted the ZIP file
- [ ] Moved project folder to easy location (Desktop/Documents)
- [ ] Know the path to my project folder

### 3. Terminal/Command Prompt
- [ ] Opened Terminal/Command Prompt
- [ ] Navigated to project folder (`cd` command)
- [ ] Confirmed I'm in right place (can see `package.json` when I type `dir` or `ls`)

### 4. Install Dependencies
- [ ] Ran `npm install`
- [ ] Waited for it to complete (2-5 minutes)
- [ ] No RED error messages (yellow warnings are OK)
- [ ] See `node_modules` folder created

### 5. Configuration Files Present
- [ ] `package.json` exists
- [ ] `vite.config.js` exists
- [ ] `index.html` exists
- [ ] `main.jsx` exists
- [ ] `styles/globals.css` exists

---

## Running the App

### First Run
- [ ] Terminal is open in project folder
- [ ] Ran `npm run dev`
- [ ] Waited for it to start (10-30 seconds)
- [ ] See message with `http://localhost:5173/`
- [ ] Browser opened automatically OR I manually opened it
- [ ] Navigated to `localhost:5173`
- [ ] See the landing page (not blank white screen)

### Login
- [ ] Clicked "Get Started"
- [ ] See login form
- [ ] Used demo credentials:
  - Email: `demo@example.com`
  - Password: `demo123`
- [ ] Clicked "Sign In"
- [ ] See the dashboard with data

### Test Features
- [ ] See summary cards (Total Balance, Income, Expenses)
- [ ] Can navigate between tabs (Overview, Transactions, Budget)
- [ ] Can add a test transaction
- [ ] Charts are visible
- [ ] Can toggle dark/light mode
- [ ] Can access Profile Settings

---

## Verification

### Everything Works If:
- [ ] ✅ No errors in terminal
- [ ] ✅ No errors in browser console (F12 → Console)
- [ ] ✅ Can see and interact with all UI elements
- [ ] ✅ Can add/delete transactions
- [ ] ✅ Charts display properly
- [ ] ✅ All tabs are accessible
- [ ] ✅ Theme toggle works
- [ ] ✅ Profile settings opens

---

## Common Problems

### If You See Errors:

**"npm: command not found"**
- [ ] Go back to Node.js installation
- [ ] Make sure you restarted terminal
- [ ] Try `node --version` again

**"Cannot find module"**
- [ ] Delete `node_modules` folder
- [ ] Delete `package-lock.json` file
- [ ] Run `npm install` again

**"Port already in use"**
- [ ] Close other apps using the port
- [ ] Or let Vite use a different port (automatic)

**Blank white screen**
- [ ] Check browser console (F12)
- [ ] Check terminal for errors
- [ ] Try hard refresh (Ctrl+Shift+R)
- [ ] Clear browser cache

**Styles look wrong**
- [ ] Check `styles/globals.css` exists
- [ ] Check `main.jsx` imports the CSS
- [ ] Restart dev server

---

## Daily Use Checklist

### Starting the App:
- [ ] Open Terminal/Command Prompt
- [ ] Navigate to project folder
- [ ] Run `npm run dev`
- [ ] Open browser to `localhost:5173`
- [ ] Login with demo account

### While Using:
- [ ] Keep Terminal window open
- [ ] Don't close Terminal
- [ ] Can minimize Terminal, but don't close it

### Stopping the App:
- [ ] Go to Terminal window
- [ ] Press `Ctrl+C` (or `Control+C` on Mac)
- [ ] Confirm with `Y` if asked
- [ ] Close browser tab
- [ ] Close Terminal

---

## Maintenance Checklist

### Weekly:
- [ ] Check for updates: `npm update`
- [ ] Clear browser cache occasionally

### If Issues Arise:
- [ ] Try restarting dev server
- [ ] Clear cache: `npm cache clean --force`
- [ ] Reinstall: `rm -rf node_modules && npm install`

---

## Documentation Quick Reference

**For different experience levels:**

- [ ] 🆕 **Complete Beginner**: Read [STEP_BY_STEP.md](STEP_BY_STEP.md)
- [ ] ⚡ **Quick Start**: Read [QUICKSTART.md](QUICKSTART.md)
- [ ] 📚 **Full Documentation**: Read [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [ ] 🔧 **Having Problems**: Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [ ] 📖 **Overview**: Read [README.md](README.md)

---

## Success Indicators

### ✅ You're All Set When:

1. **Terminal shows:**
   ```
   VITE v5.x.x ready in xxx ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

2. **Browser shows:**
   - Landing page with app description
   - Can login successfully
   - Dashboard loads with all components
   - No error messages

3. **You can:**
   - Add transactions
   - View charts
   - Change themes
   - Navigate all tabs
   - Access settings

---

## 🎉 Congratulations Checklist

If you can check ALL of these, you're done!

- [ ] ✅ Node.js installed
- [ ] ✅ Dependencies installed
- [ ] ✅ App runs without errors
- [ ] ✅ Can login with demo account
- [ ] ✅ Can see dashboard
- [ ] ✅ Can add transactions
- [ ] ✅ Charts are visible
- [ ] ✅ All features work
- [ ] ✅ No console errors
- [ ] ✅ I understand how to start/stop the app

**ALL CHECKED?** 🎊 You're ready to track your finances!

---

## Quick Command Reference

```bash
# Check Node.js
node --version
npm --version

# Navigate to project
cd path/to/project

# Install dependencies (one time)
npm install

# Start app (every time)
npm run dev

# Stop app
Ctrl+C (then Y)

# Clean install (if problems)
rm -rf node_modules package-lock.json
npm install
```

---

## Support Resources

| Issue | Documentation |
|-------|---------------|
| Can't get it running | [STEP_BY_STEP.md](STEP_BY_STEP.md) |
| Quick setup needed | [QUICKSTART.md](QUICKSTART.md) |
| Errors appearing | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Need full details | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| Want overview | [README.md](README.md) |

---

**Remember:** Keep Terminal open while using the app! 🔑

**Print this checklist and keep it handy!** 📋
