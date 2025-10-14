# Personal Finance Tracker - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your computer:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify npm: `npm --version`
   - Or install yarn: `npm install -g yarn`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

---

## 🚀 Installation Steps

### Step 1: Extract and Navigate to Project

```bash
# Navigate to your project directory
cd path/to/personal-finance-tracker
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

This will install all required packages including:
- React & React DOM
- Tailwind CSS v4
- Shadcn UI components
- Lucide React (icons)
- Recharts (for charts)
- Sonner (for toast notifications)
- And other dependencies

### Step 3: Create Required Configuration Files

#### 3.1 Create `package.json` (if missing)

Create a file named `package.json` in the root directory:

```json
{
  "name": "personal-finance-tracker",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.index.447.0",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "react-hook-form": "^7.55.0",
    "date-fns": "^3.6.0",
    "axios": "^1.7.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.20"
  }
}
```

#### 3.2 Create `vite.config.js`

Create a file named `vite.config.js` in the root directory:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
```

#### 3.3 Create `index.html`

Create a file named `index.html` in the root directory:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Personal Finance Tracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.jsx"></script>
  </body>
</html>
```

#### 3.4 Create `main.jsx`

Create a file named `main.jsx` in the root directory:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### 3.5 Create `.gitignore` (optional)

```
node_modules
dist
.env
.env.local
*.log
.DS_Store
```

---

## 🎯 Running the Application

### Development Mode

```bash
# Using npm
npm run dev

# OR using yarn
yarn dev
```

The application will start on `http://localhost:5173` (default Vite port)

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Troubleshooting

### Issue 1: "Module not found" errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Port already in use

**Solution:**
```bash
# Vite will automatically try the next available port
# Or specify a custom port in vite.config.js:

export default defineConfig({
  server: {
    port: 3000
  }
});
```

### Issue 3: Tailwind styles not loading

**Solution:**
1. Ensure `styles/globals.css` is imported in `main.jsx`
2. Check that Tailwind v4 is installed: `npm list tailwindcss`
3. Restart the dev server

### Issue 4: TypeScript errors (even though using JavaScript)

**Solution:**
The project uses `.tsx` file extensions but contains JavaScript code. This is fine for Vite, but if you encounter issues:

1. Rename all `.tsx` files to `.jsx` (except protected UI components)
2. Update imports to use `.jsx` extensions

### Issue 5: "Cannot find module" for services/hooks

**Solution:**
Ensure all imports include the correct file extensions:
```javascript
// Correct
import { useApi } from './hooks/useApi.js';
import { transactionService } from './services/transactionService.js';

// Incorrect (missing .js)
import { useApi } from './hooks/useApi';
```

### Issue 6: Build fails with Tailwind v4

**Solution:**
Ensure your `tailwind.config.js` is NOT present (Tailwind v4 uses CSS-based configuration)

---

## 📱 Using the Application

### Default Demo Account

The application includes a demo mode with pre-populated data:

**Email:** demo@example.com  
**Password:** demo123

### Features

1. **Dashboard** - View financial overview
2. **Transactions** - Add, view, and delete transactions
3. **Budget Tracker** - Set and monitor budgets
4. **Financial Goals** - Track savings goals
5. **Reports** - Generate financial reports
6. **Profile Settings** - Manage account settings

---

## 🗄️ Database Setup (Optional - For Backend Integration)

If you want to integrate with a MySQL backend:

1. **Create MySQL Database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE finance_tracker;
   ```

2. **Run Schema:**
   ```bash
   mysql -u root -p finance_tracker < database/mysql-schema.sql
   ```

3. **Configure Environment Variables:**
   Create `.env` file:
   ```
   VITE_API_URL=http://localhost:8000/api
   VITE_APP_NAME=Personal Finance Tracker
   ```

4. **Update API Base URL:**
   Edit `services/api.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
   ```

---

## 🎨 Customization

### Change Theme Colors

Edit `styles/globals.css` and modify the CSS variables:

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* etc... */
}
```

### Add New Components

```bash
# Components go in /components directory
components/
  ├── YourComponent.jsx
  └── ui/
      └── shadcn-components.tsx
```

---

## 📦 Project Structure

```
personal-finance-tracker/
├── App.tsx                 # Main application component
├── main.jsx               # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── goals/            # Financial goals components
│   ├── landing/          # Landing page
│   ├── profile/          # Profile settings
│   ├── reports/          # Reports components
│   └── ui/               # Shadcn UI components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── services/             # API services
├── styles/               # CSS files
├── utils/                # Utility functions
└── database/             # Database schema
```

---

## 🆘 Common Questions

### Q: Can I use this without a backend?
**A:** Yes! The app includes mock data and works entirely in the browser.

### Q: How do I deploy this?
**A:** Build the project (`npm run build`) and deploy the `dist` folder to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Q: The app shows "Failed to load application data"
**A:** This is normal. The app is trying to connect to a backend. It will fallback to demo/mock data automatically.

### Q: How do I update dependencies?
**A:** Run `npm update` or `yarn upgrade`

---

## 🐛 Getting Help

If you encounter issues:

1. Check the browser console for errors (F12 → Console)
2. Ensure all dependencies are installed
3. Try clearing cache: `rm -rf node_modules && npm install`
4. Check that you're using Node.js v18+
5. Restart the development server

---

## 📄 License

This project is for educational purposes.

---

## 🎉 You're Ready!

Your Personal Finance Tracker should now be running successfully!

Visit: `http://localhost:5173`

Happy tracking! 💰
