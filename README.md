# ShopEase — Full Stack E-commerce Store
### DevOps Course Project | Node.js + Express + MongoDB + EJS

---

## 🗂 Project Structure

```
shopease/
├── server.js          ← App entry point
├── package.json       ← Dependencies
├── seed.js            ← Seed 10 products into DB
├── .env               ← Environment variables (never commit!)
├── Procfile           ← For AWS deployment
├── models/
│   ├── User.js        ← User schema (auth)
│   └── Product.js     ← Product schema
├── routes/
│   ├── index.js       ← Home page
│   ├── auth.js        ← Register / Login / Logout
│   ├── products.js    ← All products, single product
│   └── cart.js        ← Cart (add, remove, update, checkout)
├── middleware/
│   └── auth.js        ← Protect routes (require login)
├── views/             ← EJS HTML templates
│   ├── partials/      ← header.ejs, footer.ejs
│   ├── index.ejs      ← Home / landing page
│   ├── 404.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── products/
│   │   ├── index.ejs  ← All products page
│   │   └── show.ejs   ← Single product page
│   └── cart/
│       ├── index.ejs  ← Cart page
│       └── success.ejs
└── public/
    ├── css/style.css
    └── js/main.js
```

---

## 💻 LOCAL SETUP (Step by Step)

### Step 1 — Install Prerequisites

You need these tools installed on your laptop:

**Node.js** (v18 or later):
- Go to https://nodejs.org and download the LTS version
- Run the installer
- Verify: open Terminal and type `node -v`

**MongoDB** (Community Edition):
- Go to https://www.mongodb.com/try/download/community
- Download and install for your OS (Windows/Mac/Linux)
- On Mac with Homebrew: `brew tap mongodb/brew && brew install mongodb-community`
- On Windows: use the .msi installer, enable "Install MongoDB as a Service"
- Verify: `mongod --version`

**Git**:
- Download from https://git-scm.com
- Verify: `git --version`

---

### Step 2 — Get the Project Running

Open your Terminal (Mac/Linux) or Command Prompt (Windows) and run:

```bash
# 1. Go into the project folder
cd shopease

# 2. Install all Node.js packages
npm install

# 3. Start MongoDB (if not running as a service)
# On Mac/Linux:
mongod --dbpath /data/db
# On Windows: it runs automatically as a service

# 4. Open a NEW terminal tab and seed the database
node seed.js
# You should see: ✅ Database seeded with 10 products!

# 5. Start the development server
npm run dev
# You should see: 🚀 ShopEase running at http://localhost:3000

# 6. Open your browser and go to:
http://localhost:3000
```

---

### Step 3 — Test the App

- Visit http://localhost:3000 — landing page should load
- Click "Sign Up" and create an account
- Browse products, add to cart
- Try filtering by category and sorting
- Checkout (it's a demo, no real payments)

---

## ☁️ AWS DEPLOYMENT (EC2 + Elastic Beanstalk)

### Prerequisites
- AWS Account (free tier works!)
- AWS CLI installed: https://aws.amazon.com/cli/
- Install EB CLI: `pip install awsebcli`

---

### Part A — Set up MongoDB Atlas (Cloud Database)

For production, we use MongoDB Atlas (free tier) instead of local MongoDB.

1. Go to https://cloud.mongodb.com and create a free account
2. Create a new project → Build a Cluster → Choose "FREE M0 tier"
3. Choose AWS as provider, pick a region close to you
4. Click "Create Cluster" (takes 2-3 minutes)
5. Under "Security" → "Database Access": create a user with username/password
6. Under "Security" → "Network Access": Add IP 0.0.0.0/0 (allow all — fine for course)
7. Click "Connect" → "Connect your application" → Copy the connection string
   It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shopease`
8. Replace `<password>` with your actual password in that string

---

### Part B — Prepare for Deployment

```bash
# In your project folder:

# Initialize a Git repository
git init
git add .
git commit -m "Initial ShopEase commit"

# Initialize Elastic Beanstalk
eb init

# When prompted:
# - Select region: pick one closest to you (e.g., us-east-1)
# - Application name: shopease
# - Platform: Node.js
# - Platform version: Node.js 18
# - Do you want to set up SSH? Yes (create a new keypair)
```

---

### Part C — Configure Environment Variables

Never put your .env file in Git! Instead, set them in Elastic Beanstalk:

```bash
eb setenv PORT=8080 \
  MONGODB_URI="mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/shopease" \
  SESSION_SECRET="pick-a-long-random-string-here" \
  NODE_ENV=production
```

---

### Part D — Create and Deploy

```bash
# Create the environment and deploy (this takes 5-10 minutes)
eb create shopease-env

# When it's done, open your app:
eb open

# For future deployments, just run:
eb deploy
```

---

### Part E — Seed the Production Database

After deployment, run the seed script once with your Atlas URI:

```bash
MONGODB_URI="mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/shopease" node seed.js
```

---

### Part F — View Logs (Troubleshooting)

```bash
# View recent logs
eb logs

# SSH into the server
eb ssh

# Check app status
eb status
```

---

## 🔧 Key Concepts Explained

### Stack Overview
| Layer | Technology | Why |
|---|---|---|
| Runtime | Node.js | JavaScript on the server |
| Framework | Express.js | Handles HTTP routes |
| Database | MongoDB | NoSQL, flexible, easy to start |
| ODM | Mongoose | Makes MongoDB easier to use |
| Templates | EJS | HTML with JavaScript embedded |
| Auth | bcryptjs + express-session | Secure password hashing + cookies |
| Hosting | AWS Elastic Beanstalk | Auto-manages EC2 instances |

### How Routes Work
```
User visits /products → Express matches route → 
Query MongoDB → Render EJS template → Send HTML to browser
```

### How the Cart Works
The cart is stored in the user's **session** (on the server, tied to a cookie).
This means:
- Cart persists across page refreshes
- Cart clears on logout
- No extra database table needed

### How Auth Works
1. User registers → password is hashed with bcrypt → stored in MongoDB
2. User logs in → password compared with stored hash → session created
3. Protected routes check `req.session.user` before proceeding

---

## 🐛 Common Problems & Fixes

**"Cannot connect to MongoDB"**
→ Make sure MongoDB is running: `mongod` (or check Services on Windows)

**"Port 3000 already in use"**
→ Change PORT in .env to 3001 or kill the process using that port

**"npm command not found"**
→ Node.js isn't installed correctly, reinstall from nodejs.org

**Elastic Beanstalk deploy fails**
→ Run `eb logs` to see the error. Usually a missing env variable or wrong Node version.

**Session not working in production**
→ Make sure SESSION_SECRET is set in `eb setenv`
# CI test
# CI test
# test trigger
# trigger
# test
# test
