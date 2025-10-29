# 🪙 GoldDigger App

**GoldDigger** is a sleek Node.js-based web application that allows users to invest in gold securely and instantly.  
Users can input their investment amount, view the corresponding gold quantity based on live pricing, and receive a detailed confirmation email automatically.


## ✨ Features

- 💰 Real-time gold price calculation  
- 📩 Automated email confirmations (via Gmail SMTP + Nodemailer)  
- 🎨 Smooth, accessible investment summary dialog  
- 🔐 Secure configuration using environment variables (`.env`)  
- 🧩 Modular architecture (clean separation between logic, utilities, and data)


## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js *(no Express)* |
| Email | Nodemailer (Gmail App Password) |
| Deployment | Render |


## 🗂️ Project Structure

├── data/ # Gold price data & purchase logs
│ ├── prices.js
│ └── purchasedData.jsonl
│
├── handlers/ # Route logic
│ └── routeHandlers.js
│
├── public/ # Frontend files served by Node
│ ├── index.html
│ ├── index.css
│ ├── index.js
│ └── uploadPurchasedData.js
│
├── utils/ # Utility modules
│ ├── sendPurchaseEmail.js
│ ├── serveStatic.js
│ ├── parseJSONBody.js
│ ├── addNewPurchasedData.js
│ └── getData.js
│
├── .env # Environment variables (ignored by Git)
├── .gitignore # Files excluded from version control
├── package.json # Dependencies and scripts
└── server.js # Main Node server entry point
