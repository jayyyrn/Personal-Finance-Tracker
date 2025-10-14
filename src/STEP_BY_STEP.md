# 👣 Step-by-Step Guide for Beginners

This guide assumes you have ZERO experience with web development. Follow these steps exactly.

---

## 🎯 What You Need

Just a computer with internet connection. That's it!

---

## 📦 Step 1: Install Node.js

**What is Node.js?** It's software that lets you run this app on your computer.

### Instructions:

1. **Open your web browser** (Chrome, Firefox, Edge, Safari - any)

2. **Go to this website:** https://nodejs.org/

3. **Download the LTS version:**
   - You'll see two big green buttons
   - Click the one that says **"LTS"** (Long Term Support)
   - It will download a file (`.exe` on Windows, `.pkg` on Mac)

4. **Install Node.js:**
   - Find the downloaded file (usually in Downloads folder)
   - Double-click it
   - Click "Next" → "Next" → "Install"
   - Wait for it to finish
   - Click "Finish"

5. **Verify it worked:**
   - **Windows:** Press `Windows Key + R`, type `cmd`, press Enter
   - **Mac:** Press `Cmd + Space`, type `terminal`, press Enter
   - **Type this:** `node --version`
   - **Press Enter**
   - You should see something like `v18.17.0` or higher
   - ✅ Success! If you see a version number, Node.js is installed

---

## 📂 Step 2: Extract the Project

**What is this?** You downloaded a ZIP file of this project. Now you need to unzip it.

### Instructions:

1. **Find the ZIP file** you downloaded (probably in Downloads folder)

2. **Extract it:**
   - **Windows:** Right-click → "Extract All" → Choose a location → Click "Extract"
   - **Mac:** Double-click the ZIP file (it extracts automatically)

3. **Move it somewhere easy to find:**
   - Suggestion: Move the extracted folder to your Desktop
   - Or: Move it to Documents
   - The folder should be named something like `personal-finance-tracker`

4. **Remember where you put it!** You'll need this location in the next step.

---

## 💻 Step 3: Open Terminal/Command Prompt

**What is Terminal?** It's where you'll type commands to run the app.

### Instructions:

**Windows:**
1. Hold `Shift` key
2. Right-click on your project folder (the one you extracted)
3. Click "Open PowerShell window here" or "Open command window here"
4. A black or blue window will open ✅

**Mac:**
1. Open Finder
2. Go to your project folder
3. Right-click the folder
4. Hold the `Option` key
5. Click "Open in Terminal"
6. A white or black window will open ✅

**Alternative for both:**
- Open Terminal/Command Prompt normally
- Type: `cd ` (that's "cd" followed by a space)
- Drag your project folder into the window
- Press Enter
- ✅ You're now in the project folder

---

## 📥 Step 4: Install Dependencies

**What are dependencies?** Think of them as all the tools the app needs to work.

### Instructions:

1. **In the Terminal/Command Prompt window you just opened:**

2. **Type exactly this:**
   ```
   npm install
   ```

3. **Press Enter**

4. **Wait:**
   - You'll see a lot of text scrolling
   - This is normal! ✅
   - It might take 2-5 minutes
   - Don't close the window!

5. **Wait for it to finish:**
   - When it's done, you'll see the cursor blinking again
   - You might see some warnings (yellow text) - that's okay!
   - As long as there are no red errors, you're good ✅

**If you see errors:**
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Most common: Node.js not installed correctly (go back to Step 1)

---

## 🚀 Step 5: Start the App

**Almost there!** Now let's run the app.

### Instructions:

1. **In the same Terminal/Command Prompt window:**

2. **Type exactly this:**
   ```
   npm run dev
   ```

3. **Press Enter**

4. **Wait a few seconds:**
   - You'll see some text
   - Look for a line that says something like:
   ```
   ➜  Local:   http://localhost:5173/
   ```

5. **Your browser should open automatically!**
   - If it doesn't, manually open your web browser
   - Type this in the address bar: `localhost:5173`
   - Press Enter

6. **🎉 SUCCESS!** You should see the Personal Finance Tracker app!

---

## 🔐 Step 6: Login to the App

**The app is now running!** Let's log in.

### Instructions:

1. **You'll see the landing page** with the app description

2. **Click "Get Started"**

3. **You'll see a login form**

4. **Use the demo account:**
   - **Email:** `demo@example.com`
   - **Password:** `demo123`

5. **Click "Sign In"**

6. **🎊 You're in!** You'll see the dashboard with:
   - Your balance
   - Recent transactions
   - Budget information
   - Charts and graphs

---

## 🎮 Step 7: Explore the App

### What Can You Do?

**Dashboard:**
- See your financial overview
- View total income, expenses, and balance
- Check budget status

**Add Transaction:**
- Click on "Transactions" tab
- Fill in the form on the right
- Choose Income or Expense
- Select a category
- Enter amount and description
- Click "Add Transaction"

**Set Budgets:**
- Click on "Budget" tab
- Set spending limits for different categories
- Watch your progress with visual bars

**Financial Goals:**
- Click on "Goals" tab
- Create savings goals
- Track your progress

**Reports:**
- Click "Reports" in the header
- View detailed financial reports
- Download data as CSV or PDF

**Profile Settings:**
- Click your avatar (top right)
- Click "Profile Settings"
- Update your information

---

## 🛑 How to Stop the App

When you're done using the app:

1. **Go back to the Terminal/Command Prompt window**

2. **Press:** `Ctrl + C` (Windows) or `Control + C` (Mac)

3. **It will ask "Terminate batch job?"**
   - Type `Y` and press Enter

4. **The app will stop**

5. **Close the browser tab**

---

## 🔄 How to Start It Again Later

1. **Open Terminal/Command Prompt in the project folder** (see Step 3)

2. **Type:** `npm run dev`

3. **Press Enter**

4. **Open browser to:** `localhost:5173`

That's it! No need to install again.

---

## 📝 Common Questions

### Q: Do I need to keep the Terminal window open?
**A:** YES! As long as you want to use the app, keep it open.

### Q: Can I close my browser and the app keeps running?
**A:** The app runs in the Terminal, not the browser. The browser is just how you view it. If Terminal is open, you can close and reopen the browser.

### Q: Will this cost money?
**A:** No! Everything is free and runs on your computer.

### Q: Do I need internet?
**A:** Only for the initial setup (to download Node.js and install dependencies). After that, it works offline.

### Q: Is my data saved?
**A:** In demo mode, data is stored in your browser. It will reset if you clear browser data. For permanent storage, you need to set up a database (advanced).

### Q: Can I use real data?
**A:** Yes! You can create transactions, budgets, and goals. But in demo mode, they're only saved in your browser.

### Q: What if I close Terminal by accident?
**A:** Just open it again and run `npm run dev` again. Your data should still be there.

### Q: Something's not working!
**A:** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for help.

---

## 🎯 Summary

**To Install (one time only):**
1. Install Node.js
2. Extract the project
3. Open Terminal in project folder
4. Run `npm install`

**To Run the App (every time):**
1. Open Terminal in project folder
2. Run `npm run dev`
3. Open browser to `localhost:5173`
4. Login with `demo@example.com` / `demo123`

**To Stop:**
1. Press `Ctrl+C` in Terminal
2. Close browser tab

---

## 🆘 Need Help?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Read the error messages carefully
4. Try the "Clean Install" in TROUBLESHOOTING.md

---

## 🎉 Congratulations!

You've successfully set up and run your Personal Finance Tracker!

Now you can:
- ✅ Track your income and expenses
- ✅ Set and monitor budgets
- ✅ Create financial goals
- ✅ Generate reports
- ✅ Analyze your spending

Happy tracking! 💰

---

**Pro Tips:**
- Keep the Terminal window open while using the app
- Bookmark `localhost:5173` for easy access
- The app works offline after initial setup
- Your data stays in your browser (demo mode)

---

Made it this far? You're awesome! 🌟
