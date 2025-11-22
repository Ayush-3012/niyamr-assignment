  # 📝 Niyamr AI – PDF Rule Checker
A simple full-stack web app that allows users to upload a PDF, enter rules, and get AI-powered PASS/FAIL results with evidence.

## 🚀 Features
* Upload any PDF (2–10 pages)
* Enter 3 custom rules
* Extracts text from PDF
* Uses Groq Llama 3.3 LLM to check rules
* Returns:
    * Pass / Fail
    * Evidence sentence
    * Reasoning
    * Confidence score
* Clean React UI
* Auto-delete uploaded PDFs (no storage)

## 🛠️ Tech Stack
* Frontend: React + Axios + Tailwind + Framer Motion
* Backend: Node.js, Express, pdfjs-dist
* LLM: Groq API (Llama 3.3 70B)
* Other: Multer for uploads, dotenv for env vars

## 📥 Installation & Setup
1️⃣ Clone the repo
```
git clone [https://github.com/yourusername/niyamr-ai.git](https://github.com/Ayush-3012/niyamr-assignment/)
cd niyamr-assignment
```
📌 Backend Setup
```
cd backend
npm install

Add .env
GROQ_API_KEY=your_api_key_here
```
Run backend
```
npm run dev
```

Backend runs on:
👉 http://localhost:5000

💻 Frontend Setup
```
cd frontend
npm install
npm run dev
```

Frontend runs on:
👉 http://localhost:5173

## 📘 How It Works

* Upload a PDF
* Enter any 3 rules (example: “document must include a date”)
* App extracts text
* Sends text + rules to LLM
* LLM returns structured results
* Results are shown in a clean table

## 📸 Screenshot
<img width="567" height="380" alt="image" src="https://github.com/user-attachments/assets/6231f894-182b-4e5a-a020-2e33480da5c8" />
<img width="551" height="675" alt="image" src="https://github.com/user-attachments/assets/bcf937c8-79eb-4dba-8dda-d76aa7d49961" />
<img width="852" height="1072" alt="image" src="https://github.com/user-attachments/assets/60401e92-6218-4488-8951-0a13ace9a61b" />


## ✔️ Status

Assignment completed successfully ✅
Ready for review.
