# 🧠 AI-Powered Analytics Dashboard

A visually stunning, full-stack analytics dashboard powered by AI. Built with modern technologies like **Vite + React**, integrated with **OpenAI** and **Express**, and deployed on **Render**. This project was developed with performance, scalability, and clean UI/UX in mind.

## 🚀 Live Demo
🌍 [Click here to view the live project](https://your-render-app.onrender.com)  
*(Replace with your actual Render link)*

---

## 📸 Preview

![Dashboard Preview](public/preview.png)  
*(Add your preview screenshot in `public/preview.png` or update this path)*

---

## ⚙️ Tech Stack

| Frontend  | Backend   | AI & Tools     | Deployment  |
|-----------|-----------|----------------|-------------|
| React + Vite | Express.js | OpenAI API | Render.com |
| TailwindCSS | Node.js | Chart.js / Custom Logic | GitHub |

---

## 🧠 AI Integration

This dashboard integrates AI to:

- Analyze uploaded data
- Generate dynamic insights
- Assist with natural language queries (e.g., via OpenAI)

> You can modify the `.env` file to include your own OpenAI API key.

---

## 📁 Project Structure

AI-Dashboard/
├── client/ # React + Vite frontend
│ ├── public/ # Static assets
│ ├── src/ # Components, pages, logic
│ └── vite.config.ts # Build config
├── server/ # Express backend
│ ├── routes/ # API endpoints
│ └── app.js # Main backend app
├── .env # Environment variables
├── README.md # This file
└── package.json # Root dependencies

yaml
Copy
Edit

---

## 🔧 How to Run Locally

### Prerequisites
- Node.js v18+
- Git
- Your OpenAI API Key (for `.env`)

### 1. Clone the Repository

```bash
git clone https://github.com/YashvantHange/AI-Dashboard.git
cd AI-Dashboard
2. Install Dependencies
bash
Copy
Edit
# For frontend
cd client
npm install

# For backend
cd ../server
npm install
3. Setup Environment Variables
Create a .env file in the root and add:

env
Copy
Edit
VITE_OPENAI_API_KEY=your_openai_key_here
(If needed, include backend variables too)

4. Run the Project
bash
Copy
Edit
# Terminal 1 - Backend
cd server
node app.js

# Terminal 2 - Frontend
cd client
npm run dev
☁️ Deployment on Render
Push your code to GitHub

Go to Render

Create:

A Web Service for your Express backend

A Static Site for your Vite frontend (client/dist)

Connect your GitHub repo and enable auto-deploy

🧠 AI Usage Report
This project was partially built using AI (e.g., ChatGPT, GitHub Copilot) to accelerate:

Code generation

UI layout suggestions

Deployment troubleshooting

📜 License
This project is open-source under the MIT License.

🙌 Author
Yashvant Mahadev Hange
🔗 GitHub | 📫 yashvanthange@gmail.com

