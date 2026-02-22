const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Question bank organized by category
const questionBank = {
    behavioral: [
        "Tell me about yourself.",
        "What are your greatest strengths?",
        "What is your biggest weakness?",
        "Why do you want to work here?",
        "Where do you see yourself in 5 years?",
        "Tell me about a time you faced a challenge and how you overcame it.",
        "Describe a situation where you had to work with a difficult team member.",
        "Give an example of a goal you set and achieved.",
        "Tell me about a time you failed and what you learned from it.",
        "How do you handle stress and pressure?"
    ],
    technical: {
        'software engineer': [
            "What programming languages are you most comfortable with?",
            "Explain the difference between object-oriented and functional programming.",
            "What is your approach to debugging code?",
            "How do you ensure code quality?",
            "What is your experience with version control systems like Git?",
            "Explain the concept of RESTful APIs.",
            "What are design patterns you've used in your projects?",
            "How do you optimize application performance?",
            "What is your experience with databases?",
            "Describe your testing methodology."
        ],
        'data scientist': [
            "What is your experience with machine learning algorithms?",
            "Explain the difference between supervised and unsupervised learning.",
            "How do you handle missing data?",
            "What statistical methods are you familiar with?",
            "Describe your experience with data visualization tools.",
            "How do you validate a machine learning model?",
            "What is overfitting and how do you prevent it?",
            "Explain A/B testing and when you would use it.",
            "What big data technologies have you worked with?",
            "How do you approach feature engineering?"
        ],
        'product manager': [
            "How do you prioritize features?",
            "How do you gather and incorporate user feedback?",
            "Describe your experience with product roadmaps.",
            "How do you measure product success?",
            "What is your process for defining product requirements?",
            "How do you work with engineering teams?",
            "Describe a product you launched from start to finish.",
            "How do you handle stakeholder disagreements?",
            "What frameworks do you use for product decisions?",
            "How do you stay current with market trends?"
        ],
        'marketing manager': [
            "How do you develop a marketing strategy?",
            "What metrics do you use to measure campaign success?",
            "Describe your experience with digital marketing channels.",
            "How do you determine target audiences?",
            "What is your approach to brand positioning?",
            "How do you allocate marketing budgets?",
            "Describe a successful campaign you led.",
            "How do you stay updated on marketing trends?",
            "What marketing tools and platforms are you experienced with?",
            "How do you approach content marketing?"
        ],
        'default': [
            "What relevant technical skills do you have for this role?",
            "How do you stay current with industry trends?",
            "Describe your most significant project.",
            "What tools and technologies do you use daily?",
            "How do you approach problem-solving?",
            "What certifications or training have you completed?",
            "Describe your workflow for typical tasks.",
            "How do you collaborate with team members?",
            "What industry-specific knowledge do you have?",
            "How do you prioritize your work?"
        ]
    },
    company: [
        "What do you know about our company?",
        "Why do you want this specific position?",
        "How would you contribute to our team?",
        "What do you think sets our company apart?",
        "What questions do you have for us?",
        "How do your values align with our company culture?",
        "What attracts you to our industry?",
        "How would you describe our products/services?",
        "What do you think are the biggest challenges facing our company?",
        "Why should we hire you over other candidates?"
    ]
};

// Generate interview questions based on role
router.post('/questions', (req, res) => {
    const { role, categories } = req.body;

    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }

    // Normalize role to lowercase for matching
    const normalizedRole = role.toLowerCase();

    // Default categories if none specified
    const selectedCategories = categories && categories.length > 0
        ? categories
        : ['behavioral', 'technical', 'company'];

    const questions = [];
    let questionId = 1;

    selectedCategories.forEach(category => {
        if (category === 'behavioral') {
            questionBank.behavioral.forEach((question) => {
                questions.push({ id: questionId++, question, category: 'behavioral' });
            });
        } else if (category === 'technical') {
            // Try to match role keywords
            let techQuestions = questionBank.technical.default;

            for (const [jobRole, roleQuestions] of Object.entries(questionBank.technical)) {
                if (normalizedRole.includes(jobRole) || jobRole === 'default') {
                    techQuestions = roleQuestions;
                    break;
                }
            }
            techQuestions.forEach((question) => {
                questions.push({ id: questionId++, question, category: 'technical' });
            });
        } else if (category === 'company') {
            questionBank.company.forEach((question) => {
                questions.push({ id: questionId++, question, category: 'company' });
            });
        }
    });

    res.json({
        role,
        categories: selectedCategories,
        questions
    });
});

// Get available categories
router.get('/categories', (req, res) => {
    res.json({
        categories: [
            { id: 'behavioral', name: 'Behavioral', description: 'Questions about past experiences and soft skills' },
            { id: 'technical', name: 'Technical', description: 'Role-specific technical questions' },
            { id: 'company', name: 'Company Fit', description: 'Questions about company knowledge and culture fit' }
        ]
    });
});

module.exports = router;
