# Next.js Masterclass: The QuickCart Curriculum

Welcome to your self-paced guide to mastering **Next.js 15** using the **QuickCart** project as your live laboratory. This document breaks down the entire full-stack architecture into digestible phases.

---

## 🟢 Phase 1: The Skeleton (File-Based Routing)

In Next.js, the folder structure in the `app/` directory *is* your website's navigation.

### Lesson 1: Folders as URLs
- **Root Path (`/`)**: Handled by `app/page.jsx`.
- **Sub-pages**: Any folder with a `page.jsx` becomes a route. 
    - `app/cart/page.jsx` → `yourdomain.com/cart`
    - `app/login/page.jsx` → `yourdomain.com/login`

### Lesson 2: Layouts (The Wrapper)
- **`app/layout.js`**: This file wraps every page. Use it for elements that never change, like the **Navbar**, **Footer**, and **Global State Providers**.
- **`{children}`**: This is a special prop in the layout that tells Next.js where to "inject" the specific page content.

### Lesson 3: Dynamic Routes `[id]`
- **The Bracket Syntax**: Look at `app/product/[id]/page.jsx`. 
- The `[id]` acts as a wildcard. Whether the user visits `/product/123` or `/product/abc`, this same file will load and "catch" that ID to fetch the correct product from the database.

---

## 🔵 Phase 2: Client vs. Server Components

Next.js 15 is "Server-First." This is crucial for speed and SEO.

### Lesson 4: Server Components (The Kitchen)
- By default, all files in `app/` are Server Components. 
- They run on the server, fetch data from the database, and send finished HTML to the browser.
- **Benefit**: Faster load times and your database credentials stay hidden.

### Lesson 5: Client Components (The Living Room)
- If you need **Interactivity** (buttons, state, forms), you must add `'use client'` at the very top of the file.
- **Example**: Check `context/AppContext.jsx`. It needs to track your cart in the browser's memory, so it must be a Client Component.

---

## 🟡 Phase 3: The Brain (Context API)

How do you tell the Navbar that a user added an item to their cart from a Product page? You use **Context**.

### Lesson 6: Global State
- Open `context/AppContext.jsx`. 
- We use `createContext()` to build a "broadcast station" and a `Provider` to wrap the app.
- **The `value` object**: Everything inside the `value` object (like `cartItems`, `addToCart`, `userData`) is now accessible to **any** component in the app using the `useAppContext()` hook.

---

## 🟠 Phase 4: The Hidden Backend (API Routes)

Next.js is a "Full-Stack" framework. You don't need a separate Express server.

### Lesson 7: API Endpoints
- Any file named `route.js` inside `app/api/` becomes a backend URL.
- **Example**: `app/api/products/route.js` handles `GET` requests to fetch products and `POST` requests to add new ones.
- **Security**: These files run on the server, so you can safely use your `MONGODB_URI` or `GEMINI_API_KEY` here.

---

## 🟣 Phase 5: Intelligence (AI Integration)

This is what makes QuickCart unique. 

### Lesson 8: Talking to Gemini
- Look at `lib/ai.js`. We use the `@google/generative-ai` library.
- **Prompt Engineering**: We send a specific string to the AI: *"Based on these products [history], what should this user buy next?"*
- **JSON Parsing**: The AI returns text. We use `JSON.parse()` to turn that text into an array of keywords we can use to query our database.

---

## 🔴 Phase 6: Security (Middleware & Auth)

### Lesson 9: JWT Authentication
- We use **JSON Web Tokens (JWT)**. When a user logs in, we send them a "Token" stored in a cookie.
- **Verification**: On every request, the server checks this token to see who the user is and what their "role" is (Admin vs. User).

### Lesson 10: Middleware (The Guard)
- Look at `middleware.js` in the root folder.
- This file intercepts requests **before** they reach the page. 
- If a user tries to go to `/admin` without an "Admin" role, the middleware kicks them back to the login page.

---

## ⚪ Phase 7: Aesthetics (Tailwind & Motion)

### Lesson 11: Utility-First CSS
- **Tailwind CSS**: Instead of writing separate `.css` files, we use classes like `flex`, `p-4`, and `bg-blue-500` directly in our HTML.
- **Dark Mode**: Use the `dark:` prefix (e.g., `dark:bg-gray-900`) to define how an element looks when the user toggles the moon icon.

### Lesson 12: Micro-Animations
- **Framer Motion**: Used for the "pop" effects. Look for `<motion.div>` in your components. It makes the site feel "premium" and alive.

---

## 📚 Glossary for Beginners
- **JSX**: JavaScript XML. It looks like HTML but allows you to write JavaScript logic inside it.
- **Hook**: Functions starting with `use` (like `useState`, `useEffect`) that let you "hook" into React features.
- **Props**: Short for "Properties." It's how you pass data from a Parent component to a Child component.
- **Hydration**: The process of the browser taking static HTML from the server and "attaching" JavaScript to make it interactive.

---

### Pro Tip for Learning:
The best way to learn is to **break things**. Go into `app/page.jsx`, delete a line, and see what happens. Use the `Explanation.txt` as a journal to write down what you discover!
