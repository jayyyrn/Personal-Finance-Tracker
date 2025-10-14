# 💰 Personal Finance Tracker

A modern, full-featured personal finance management application built with React and designed for easy financial tracking and budgeting.

![Personal Finance Tracker](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=400&fit=crop)

## ✨ Features

- 📊 **Dashboard Overview** - Real-time financial statistics and insights
- 💳 **Transaction Management** - Add, view, edit, and delete transactions
- 🎯 **Budget Tracking** - Set budgets by category and monitor spending
- 🏆 **Financial Goals** - Create and track savings goals
- 📈 **Visual Analytics** - Interactive charts and spending analysis
- 📄 **Reports** - Generate and download financial reports (CSV, PDF)
- 👤 **Profile Settings** - Manage account and preferences
- 🌓 **Dark/Light Mode** - Toggle between themes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔐 **Authentication** - Secure login with demo mode

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed ([Download here](https://nodejs.org/))

### Installation

1. **Extract the project** to your desired location

2. **Open terminal** in the project folder

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:5173`

### Demo Account
```
Email: demo@example.com
Password: demo123
```

**That's it!** 🎉 See [QUICKSTART.md](QUICKSTART.md) for more details.

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in minutes
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup and troubleshooting guide
- **[DEMO_ACCOUNT.md](DEMO_ACCOUNT.md)** - Demo account information

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Forms:** React Hook Form
- **Database (Optional):** MySQL

## 📁 Project Structure

```
personal-finance-tracker/
├── components/          # React components
│   ├── auth/           # Authentication
│   ├── goals/          # Financial goals
│   ├── landing/        # Landing page
│   ├── profile/        # Profile settings
│   ├── reports/        # Reports
│   └── ui/             # Shadcn UI components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── services/           # API services
├── styles/             # CSS files
├── utils/              # Utility functions
├── database/           # MySQL schema
├── App.tsx             # Main app component
├── main.jsx            # Entry point
└── index.html          # HTML template
```

## 🎯 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌟 Key Features Explained

### Transaction Management
- Add income and expense transactions
- Categorize transactions
- Search and filter transaction history
- Delete transactions with confirmation

### Budget Tracking
- Set monthly budgets by category
- Real-time budget vs. actual spending
- Visual progress indicators
- Budget warnings and alerts

### Financial Goals
- Create custom savings goals
- Track progress with visual indicators
- Set target amounts and deadlines
- Mark goals as complete

### Reports & Analytics
- Monthly/yearly financial summaries
- Category-wise spending breakdown
- Income vs. expense trends
- Export data as CSV or PDF

### Profile & Settings
- Update personal information
- Change password and security settings
- Manage notification preferences
- Export all your data

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Personal Finance Tracker
```

### Theme Customization

Edit `styles/globals.css` to customize colors:

```css
:root {
  --primary: #030213;
  --secondary: #e9ebef;
  /* Add your custom colors */
}
```

## 🗄️ Database Setup (Optional)

The app works with mock data by default. To connect to MySQL:

1. Import the schema:
   ```bash
   mysql -u root -p finance_tracker < database/mysql-schema.sql
   ```

2. Configure API endpoint in `services/api.js`

3. Update `.env` with your database URL

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

## 🐛 Troubleshooting

### Common Issues

**"npm not found"**
- Install Node.js from https://nodejs.org/

**"Module not found"**
- Run `npm install` to install dependencies

**Blank screen**
- Check browser console (F12) for errors
- Ensure Node.js version is 18+

**Port already in use**
- Vite will automatically use the next available port

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for more troubleshooting.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder will contain the production build.

### Deploy to Popular Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
- Drag and drop the `dist` folder to Netlify

**GitHub Pages:**
- Push the `dist` folder to your repository's `gh-pages` branch

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- UI Components by [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

## 💬 Support

If you encounter any issues:

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Look in the browser console for errors
3. Ensure all dependencies are installed
4. Try clearing cache and reinstalling

## 🎉 Getting Started

Ready to start tracking your finances?

1. Install dependencies: `npm install`
2. Start the app: `npm run dev`
3. Open `http://localhost:5173`
4. Login with demo account (see above)

Happy tracking! 💰

---

Made with ❤️ using React and Tailwind CSS
