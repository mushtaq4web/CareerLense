# Resume Builder & Career Tracker SaaS

A full-stack application for creating professional resumes and tracking job applications. Built with React, Node.js, Express, and SQLite.

## 🚀 Features

### Resume Builder
- **Multiple Resume Support** - Create and manage unlimited resumes
- **5 Professional Templates**:
  - Classic - Traditional professional layout
  - Modern - Bold and contemporary design
  - Minimal - Clean white-space focused
  - Professional - Corporate sidebar layout
  - Creative - Stylish with gradients
- **PDF Export** - Download high-quality PDF resumes
- **Rich Editor** - Comprehensive form with all resume sections

### Job Application Tracker
- **Track Applications** - Manage all job applications in one place
- **Status Management** - Applied, Interview, Offer, Rejected
- **Search & Filter** - Find jobs by company or status
- **Statistics Dashboard** - Visual overview of application progress
- **Notes & Dates** - Keep track of important details

### User Experience
- **JWT Authentication** - Secure login and registration
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Premium UI** - Modern design with Tailwind CSS
- **Toast Notifications** - Real-time feedback
- **Loading States** - Smooth user experience

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- html2canvas & jsPDF
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Application will open at `http://localhost:3000`

## 🎯 Usage

### Getting Started

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Dashboard** - View your statistics and quick actions
4. **Create Resume** - Fill in your details and choose a template
5. **Preview & Download** - View your resume and export as PDF
6. **Track Jobs** - Add job applications and manage their status

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Resumes
- `GET /api/resumes` - Get all resumes
- `POST /api/resumes` - Create resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

#### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

## 📁 Project Structure

```
CareerLense/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resumes.js
│   │   └── jobs.js
│   ├── database.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── templates/
│   │   │   │   ├── ClassicTemplate.jsx
│   │   │   │   ├── ModernTemplate.jsx
│   │   │   │   ├── MinimalTemplate.jsx
│   │   │   │   ├── ProfessionalTemplate.jsx
│   │   │   │   └── CreativeTemplate.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── ResumeList.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   └── JobTracker.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected API routes
- CORS enabled for frontend-backend communication

## 🚀 Future Enhancements

- **Monetization**:
  - Free tier: 1 resume, 1 template
  - Pro tier: Unlimited resumes, all templates
  - Pro Plus: Analytics, sharing links
- **Features**:
  - Resume sharing links
  - Cover letter builder
  - Interview preparation tools
  - Application analytics
  - Email notifications

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Development

### Run in Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

**Frontend:**
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and modern web technologies**
