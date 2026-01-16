export const AIRecruiterAgents = [
    {
        id: 1,
        specialist: "Software Engineer Recruiter",
        description: "Screens candidates for software engineering roles - frontend, backend, and full-stack positions.",
        image: "/recruiter-tech.jpg",
        agentPrompt:
            "Hello! I'm calling from the recruitment team. We have an excellent Software Engineer role that matches your profile. Let me tell you a bit about it - we are looking for a talented software engineer who can work on frontend, backend, or full-stack development. Does this role sound interesting to you for further discussion?",
        voiceId: "chris",
        gender: "male" as const,
        subscriptionRequired: false,
    },

    {
        id: 2,
        specialist: "Sales & Marketing Recruiter",
        description: "Specializes in hiring for sales representatives, account executives, and marketing professionals.",
        image: "/recruiter-sales.jpg",
        agentPrompt:
            "Hello! How are you? I'm from the Sales and Marketing recruitment team. I reviewed your profile and thought you could be a perfect fit for our new role. This is a dynamic position focused on driving business growth. Would you like to discuss this opportunity further?",
        voiceId: "sarge",
        gender: "male" as const,
        subscriptionRequired: true,
    },

    {
        id: 3,
        specialist: "Product Manager Recruiter",
        description: "Recruits product managers, product owners, and product designers for tech companies.",
        image: "/recruiter-product.jpg",
        agentPrompt:
            "Hi! I'm calling regarding a Product Manager role. This position involves product strategy and leading cross-functional teams. Before we dive into details, I'd like to understand your current experience and career goals. Are you interested in discussing this further?",
        voiceId: "atlas",
        gender: "male" as const,
        subscriptionRequired: true,
    },

    {
        id: 4,
        specialist: "Data Science Recruiter",
        description: "Focuses on hiring data scientists, ML engineers, and analytics professionals.",
        image: "/recruiter-data.jpg",
        agentPrompt:
            "Hello! I'm reaching out about Data Science and ML roles. We have a Data Scientist opening where you'll work on cutting-edge AI projects. I'd like to discuss your data analysis experience. Are you interested in this role?",
        voiceId: "hudson",
        gender: "male" as const,
        subscriptionRequired: true,
    },

    {
        id: 5,
        specialist: "Operations Manager Recruiter",
        description: "Recruits for operations, supply chain, and logistics management positions.",
        image: "/recruiter-ops.jpg",
        agentPrompt:
            "Hi! I'm calling about an Operations Manager position. We're looking for a candidate with strong organizational skills who can improve efficiency. I'd love to hear about your operations experience. Can we explore this opportunity together?",
        voiceId: "eileen",
        gender: "female" as const,
        subscriptionRequired: true,
    },

    {
        id: 6,
        specialist: "Finance & Accounting Recruiter",
        description: "Specializes in finance professionals, accountants, and financial analysts.",
        image: "/recruiter-finance.jpg",
        agentPrompt:
            "Hello! I recruit for Finance and Accounting roles. We have an opening for financial analysis and budgeting. The ideal candidate should have strong reporting skills. Would you be interested in discussing your finance background?",
        voiceId: "charlotte",
        gender: "female" as const,
        subscriptionRequired: true,
    },

    {
        id: 7,
        specialist: "UX/UI Designer Recruiter",
        description: "Recruits designers for user experience, user interface, and product design roles.",
        image: "/ux-ui.png",
        agentPrompt:
            "Hi! I'm hiring for a UX/UI Designer position. This is an innovative company where design is highly valued. You'll be designing intuitive interfaces. I'd love to hear about your portfolio and design process. Does this role sound exciting to you?",
        voiceId: "ayla",
        gender: "female" as const,
        subscriptionRequired: true,
    },

    {
        id: 8,
        specialist: "Customer Success Recruiter",
        description: "Hires customer success managers, support specialists, and account managers.",
        image: "/recruiter-customer.jpg",
        agentPrompt:
            "Hello! I'm reaching out about a Customer Success Manager role. In this position, you'll be the key contact for our clients. We need a candidate with excellent communication skills. Would you like to discuss your customer-facing experience?",
        voiceId: "aaliyah",
        gender: "female" as const,
        subscriptionRequired: true,
    },

    {
        id: 9,
        specialist: "Human Resources Recruiter",
        description: "Recruits HR professionals, talent acquisition specialists, and people operations roles.",
        image: "/recruiter-hr.jpg",
        agentPrompt:
            "Hi! I'm a recruiter for HR positions. We have an opening for talent management and employee relations. If you're passionate about building workplace culture, this role is for you. Would you like to explore this opportunity?",
        voiceId: "susan",
        gender: "female" as const,
        subscriptionRequired: true,
    },

    {
        id: 10,
        specialist: "Executive & Leadership Recruiter",
        description: "Specializes in C-level executives, directors, and senior leadership positions.",
        image: "/recruiter-exec.jpg",
        agentPrompt:
            "Hello! I'm conducting an executive search for a senior leadership position. This role requires strategic vision and team leadership. Based on your background, you could be an excellent fit. Can we discuss your leadership philosophy and career goals?",
        voiceId: "Rohan",
        gender: "male" as const,
        subscriptionRequired: true,
    },
];