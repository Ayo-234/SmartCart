# QuickCart - AI-Integrated E-Commerce Platform

QuickCart is a state-of-the-art e-commerce application built with **Next.js 15**, **MongoDB**, and **Google Gemini AI**. It provides a personalized shopping experience by analyzing user behavior to offer intelligent product recommendations and semantic search capabilities.

---

## 🚀 Key Features

### 👤 For Users
- **AI-Powered Recommendations**: Personalized product suggestions based on browsing and purchase history.
- **Smart Semantic Search**: AI-enhanced search that understands intent and expands queries for better results.
- **Seamless Checkout**: Integrated with **Paystack** for secure, real-time payment processing.
- **Responsive UI**: A beautiful, dark-themed interface built with **Tailwind CSS** and **Framer Motion** for smooth animations.
- **Order Tracking**: Comprehensive order history and status tracking.
- **AI Support Chatbot**: Instant help for product queries and order support.

### 🛠️ For Admins
- **Dynamic Dashboard**: Real-time sales statistics, revenue tracking, and user metrics.
- **Inventory Management**: Full CRUD operations for products with AI-assisted description generation.
- **Order Oversight**: Monitor and manage all customer orders in one place.
- **Stock Alerts**: Automatic notifications for low-stock items.

---

## 🔐 Admin Access

To access the administrative features of QuickCart (Dashboard, Inventory, and Order Management), use the following credentials:

- **Admin Email**: `admin@quickcart.com`
- **Password**: `admin123`

> [!IMPORTANT]
> The first user registered in a fresh database is automatically granted **Admin** privileges. Use the credentials above when registering for the first time to maintain consistency with the project documentation.

---

## 🏗️ Technical Architecture

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database) with [Mongoose](https://mongoosejs.com/)
- **AI Engine**: [Google Gemini 2.0 Flash](https://aistudio.google.com/)
- **Authentication**: JWT-based auth using `jose` and `bcryptjs`
- **Payments**: [Paystack API](https://paystack.com/)
- **Styling**: Tailwind CSS & Lucide Icons
- **Animations**: Framer Motion

### Directory Structure
```text
├── app/                # Next.js App Router (Pages & API Routes)
│   ├── api/            # Backend logic (Auth, Cart, Orders, AI)
│   ├── admin/          # Protected Admin Dashboard
│   ├── product/        # Dynamic product detail pages
│   └── ...             # User pages (Cart, Search, Orders)
├── components/         # Reusable UI components
├── context/            # React Context for global state (Auth, Cart)
├── lib/                # Utility functions (DB connection, AI logic)
├── models/             # Mongoose Schemas (User, Product, Interaction)
└── public/             # Static assets
```

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js 18.x or higher
- A MongoDB Atlas Database
- A Google Gemini API Key
- A Paystack Account (Test Keys)

### 2. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd QuickCart-main

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and add the following:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_random_secret_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Paystack Payment
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
```

### 4. Database Seeding
To populate your store with initial data:
1. Start the development server (see below).
2. Visit `http://localhost:3000/seed` in your browser.
3. Click the **Seed Products** button.

---

## 🖥️ Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Production Build
```bash
npm run build
npm start
```

---

## 🧪 Testing

### Manual Testing Workflow
1. **Authentication**: Register a new user. Use the credentials provided in the **Admin Access** section above to gain administrative privileges on a fresh database.
2. **AI Recommendations**: View several products in different categories, then return to the Home page to see personalized suggestions.
3. **Payments**: Use the following Paystack test credentials:
   - **Card Number**: `4084084084084081`
   - **Expiry**: `01/30`
   - **CVC**: `123`
   - **PIN/OTP**: `1234` / `123456`

### Code Quality
Run ESLint to check for code consistency:
```bash
npm run lint
```

---

## 🤖 AI Logic Explained

QuickCart uses Google Gemini in four distinct ways:
1. **User Profiling**: Analyzes `Interaction` logs (views, clicks, purchases) to generate interest keywords.
2. **Semantic Search**: When a user searches, Gemini expands the query to include synonyms and related categories to ensure the user finds what they need.
3. **Admin Assistant**: Automatically generates professional product descriptions based on a name and category.
4. **Contextual Chat**: Provides a customer support bot that understands the store's context.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.