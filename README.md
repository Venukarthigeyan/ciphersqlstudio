# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries
against pre-configured assignments with real-time execution and intelligent hints.

---

## Tech Stack

| Component       | Technology              |
|-----------------|-------------------------|
| Frontend        | React.js                |
| Styling         | Vanilla SCSS (mobile-first) |
| Code Editor     | Monaco Editor           |
| Backend         | Node.js + Express.js    |
| Sandbox DB      | PostgreSQL              |
| Persistence DB  | MongoDB Atlas           |
| LLM Hints       | Groq API (Llama 3.3)    |
| Auth            | JWT + bcryptjs          |

---

## Why These Technologies?

- **React.js** — Component-based UI makes it easy to manage complex state
  (editor, results, hints) independently
- **Monaco Editor** — Same editor as VS Code, gives SQL syntax highlighting
  and a professional coding experience
- **PostgreSQL** — Powerful relational database; schema-based sandboxing
  isolates each user's query environment
- **MongoDB Atlas** — Flexible document storage for assignments and user
  progress; schema-less design handles varied assignment structures
- **Groq (Llama 3.3 70B)** — Free, fast LLM API; prompt-engineered to give
  hints without revealing solutions
- **JWT** — Stateless authentication; tokens stored in localStorage for
  persistent sessions
- **Vanilla SCSS** — Variables, mixins, nesting, and partials for maintainable
  mobile-first responsive CSS without frameworks

---

## Features

- User authentication (Signup / Login / Logout)
- Assignment listing with difficulty badges (Easy / Medium / Hard)
- Monaco SQL editor with syntax highlighting
- Real-time query execution against sandboxed PostgreSQL
- Query sanitization (SELECT only — blocks DROP, DELETE, etc.)
- AI-powered hints via Groq Llama 3.3 (hints only, not solutions)
- Save and restore previous query attempts per assignment
- Fully mobile-responsive (320px → 1281px+)
- PostgreSQL schema sandboxing (isolated per assignment)

---

## Project Structure
```
ciphersqlstudio/
├── backend/
│   ├── config/
│   │   ├── db.js              # PostgreSQL connection pool
│   │   ├── mongo.js           # MongoDB connection
│   │   └── sandbox.js         # Schema sandboxing logic
│   ├── controllers/
│   │   ├── assignmentController.js
│   │   ├── authController.js
│   │   ├── hintController.js
│   │   ├── progressController.js
│   │   └── queryController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── sanitize.js        # SQL injection prevention
│   ├── models/
│   │   ├── Assignment.js      # MongoDB assignment schema
│   │   ├── User.js            # MongoDB user schema
│   │   └── UserProgress.js    # MongoDB progress schema
│   ├── routes/
│   │   ├── assignments.js
│   │   ├── auth.js
│   │   ├── hints.js
│   │   ├── progress.js
│   │   └── query.js
│   ├── seed.js                # Seeds assignments into MongoDB
│   ├── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AssignmentCard.jsx
    │   │   ├── HintPanel.jsx
    │   │   ├── ResultsTable.jsx
    │   │   ├── SavedQuery.jsx
    │   │   ├── SampleDataViewer.jsx
    │   │   └── SqlEditor.jsx
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   │   └── useQuery.js
    │   ├── pages/
    │   │   ├── AssignmentsPage.jsx
    │   │   ├── AttemptPage.jsx
    │   │   └── AuthPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── main.scss
    │   │   └── partials/
    │   │       ├── _assignments.scss
    │   │       ├── _auth.scss
    │   │       ├── _editor.scss
    │   │       ├── _layout.scss
    │   │       ├── _mixins.scss
    │   │       ├── _reset.scss
    │   │       ├── _results.scss
    │   │       └── _variables.scss
    │   ├── App.jsx
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 15+
- MongoDB Atlas account (free tier)
- Groq API key (free at console.groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/Venukarthigeyan/ciphersqlstudio.git
cd ciphersqlstudio
```

### 2. PostgreSQL Setup
```bash
psql postgres
```
```sql
CREATE DATABASE ciphersql_sandbox;
\c ciphersql_sandbox

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  department VARCHAR(100),
  salary NUMERIC,
  hire_date DATE
);

INSERT INTO employees VALUES
  (1, 'Alice', 'Engineering', 85000, '2020-01-15'),
  (2, 'Bob', 'Marketing', 62000, '2019-06-01'),
  (3, 'Carol', 'Engineering', 92000, '2018-03-22'),
  (4, 'Dave', 'HR', 55000, '2021-09-10');

\q
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 4. Seed Assignments into MongoDB
```bash
node seed.js
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```

### 6. Open the app
Visit `http://localhost:3000`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable      | Description                        | Example                          |
|---------------|------------------------------------|----------------------------------|
| PORT          | Backend server port                | 8000                             |
| PG_HOST       | PostgreSQL host                    | localhost                        |
| PG_PORT       | PostgreSQL port                    | 5432                             |
| PG_USER       | PostgreSQL username                | your_mac_username                |
| PG_PASSWORD   | PostgreSQL password                | (leave empty for local)          |
| PG_DATABASE   | PostgreSQL database name           | ciphersql_sandbox                |
| MONGO_URI     | MongoDB Atlas connection string    | mongodb+srv://...                |
| GROQ_API_KEY  | Groq API key for LLM hints         | gsk_...                          |
| JWT_SECRET    | Secret key for JWT tokens          | any_long_random_string           |

---

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/auth/signup            | Register new user        |
| POST   | /api/auth/login             | Login user               |
| GET    | /api/auth/me                | Get current user         |
| GET    | /api/assignments            | List all assignments     |
| GET    | /api/assignments/:id        | Get assignment + sandbox |
| POST   | /api/query/execute          | Execute SQL query        |
| POST   | /api/hints                  | Get AI hint              |
| GET    | /api/progress/:assignmentId | Get user progress        |
| POST   | /api/progress/complete      | Mark assignment complete |
