# 🔧 Troubleshooting Guide

## Quick Checklist

Before diving into specific issues, run through this checklist:

- [ ] Node.js v18+ is installed (`node --version`)
- [ ] You're in the correct project directory
- [ ] You've run `npm install`
- [ ] No error messages during installation
- [ ] You're using `npm run dev` (not `npm start`)

---

## Common Issues & Solutions

### 1. "npm: command not found"

**Problem:** Node.js/npm is not installed or not in PATH

**Solutions:**
```bash
# Check if Node.js is installed
node --version

# If not installed:
# - Download from https://nodejs.org/
# - Install the LTS version
# - Restart your terminal
# - Verify: node --version
```

---

### 2. "Cannot find module" or "Module not found"

**Problem:** Dependencies are not installed

**Solutions:**
```bash
# Solution 1: Install dependencies
npm install

# Solution 2: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Solution 3: Clear npm cache
npm cache clean --force
npm install
```

---

### 3. Blank White Screen

**Problem:** Application fails to load

**Solutions:**

1. **Check browser console:**
   - Press F12 to open Developer Tools
   - Click "Console" tab
   - Look for red error messages
   - Share the error for specific help

2. **Check terminal for errors:**
   - Look at the terminal where you ran `npm run dev`
   - Any red error messages?

3. **Verify Node.js version:**
   ```bash
   node --version
   # Should be v18.0.0 or higher
   ```

4. **Clear browser cache:**
   - Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or use Incognito/Private mode

---

### 4. "Port 5173 is already in use"

**Problem:** Another application is using the port

**Solutions:**

1. **Let Vite use another port (automatic):**
   - Vite will automatically try port 5174, 5175, etc.

2. **Kill the process using the port:**
   ```bash
   # Windows
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -ti:5173 | xargs kill -9
   ```

3. **Use a different port manually:**
   Edit `vite.config.js`:
   ```javascript
   export default defineConfig({
     server: {
       port: 3000  // or any other port
     }
   });
   ```

---

### 5. Styles Not Loading (Page looks unstyled)

**Problem:** Tailwind CSS not loading

**Solutions:**

1. **Check imports:**
   - Open `main.jsx`
   - Ensure it has: `import './styles/globals.css';`

2. **Restart dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

3. **Verify Tailwind installation:**
   ```bash
   npm list tailwindcss
   ```

4. **Check `styles/globals.css` exists:**
   - Should be in `/styles/globals.css`
   - Should contain Tailwind directives

---

### 6. "Failed to fetch" or API Errors

**Problem:** API calls failing (expected in demo mode)

**Solutions:**

1. **This is normal!**
   - The app uses mock data by default
   - It will show demo content

2. **Dismiss the errors:**
   - The app will fallback to mock data
   - Everything should still work

3. **To fix permanently:**
   - Set up a backend API (see SETUP_GUIDE.md)
   - Or modify services to use only mock data

---

### 7. "React is not defined"

**Problem:** React import issue

**Solutions:**

1. **Check file extensions:**
   - JSX files should be `.jsx` or `.tsx`
   - Not `.js`

2. **Verify imports:**
   ```javascript
   // Top of component files should have:
   import { useState } from 'react';
   ```

3. **Reinstall React:**
   ```bash
   npm install react react-dom
   ```

---

### 8. Build Errors

**Problem:** `npm run build` fails

**Solutions:**

1. **Check for console errors:**
   ```bash
   npm run build
   # Read the error messages carefully
   ```

2. **Common fixes:**
   ```bash
   # Clear cache
   rm -rf node_modules dist
   npm install
   npm run build
   ```

3. **Check for TypeScript errors:**
   - Even though using JavaScript, .tsx files might have issues
   - Consider renaming to .jsx if problems persist

---

### 9. Slow Performance

**Problem:** App is laggy or slow

**Solutions:**

1. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Check system resources:**
   - Close other applications
   - Ensure enough RAM available

3. **Development mode is slower:**
   - This is normal
   - Production build is much faster

4. **Try production build:**
   ```bash
   npm run build
   npm run preview
   ```

---

### 10. Dependencies Version Conflicts

**Problem:** Version mismatch errors

**Solutions:**

1. **Use exact versions from package.json:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Update all dependencies:**
   ```bash
   npm update
   ```

3. **Check for peer dependency warnings:**
   - Usually safe to ignore
   - But note which packages have issues

---

## Platform-Specific Issues

### Windows

**Issue:** Long path errors
```bash
# Enable long paths
git config --system core.longpaths true
```

**Issue:** Permission errors
```bash
# Run terminal as Administrator
# Or use PowerShell with admin rights
```

### Mac/Linux

**Issue:** Permission denied
```bash
# Fix npm permissions
sudo chown -R $USER /usr/local/lib/node_modules
```

**Issue:** Command not found after installing Node
```bash
# Add to PATH in ~/.bashrc or ~/.zshrc
export PATH="/usr/local/bin:$PATH"
source ~/.bashrc  # or source ~/.zshrc
```

---

## Still Having Issues?

### Debugging Steps

1. **Check terminal output:**
   ```bash
   npm run dev
   # Copy any error messages
   ```

2. **Check browser console:**
   - F12 → Console tab
   - Copy any red errors

3. **Verify file structure:**
   ```bash
   # Should have these files:
   ls -la
   # Look for: package.json, vite.config.js, index.html, main.jsx
   ```

4. **Test with minimal setup:**
   ```bash
   # Create a test file to verify React works
   # If basic React works, issue is in app code
   ```

---

## Clean Install (Nuclear Option)

If nothing else works:

```bash
# 1. Delete everything installed
rm -rf node_modules package-lock.json dist

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall
npm install

# 4. Try to run
npm run dev
```

---

## Getting Detailed Help

When asking for help, provide:

1. **Your environment:**
   ```bash
   node --version
   npm --version
   # Operating system (Windows/Mac/Linux)
   ```

2. **Error messages:**
   - Full error from terminal
   - Browser console errors (F12)

3. **What you tried:**
   - Steps you've already taken
   - Which solutions from this guide you tried

---

## Prevention Tips

- ✅ Always use the correct Node.js version (18+)
- ✅ Run `npm install` after downloading/cloning
- ✅ Don't modify `node_modules` manually
- ✅ Keep dependencies up to date
- ✅ Use `npm run dev` for development
- ✅ Clear cache when switching branches/versions

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and reinstall
rm -rf node_modules package-lock.json && npm install

# Check versions
node --version
npm --version

# Update dependencies
npm update

# List installed packages
npm list --depth=0
```

---

Need more help? Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.
