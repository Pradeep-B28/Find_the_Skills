// LOCKED CONTENT. Sample job posts for "Try a sample", demo mode and the self-test.
// These posts are written by Wrench Wise for practice. They are not from real companies.
// "expected" is exactly the skills the X-ray must find, in order (job and soft skills together).
// "expectedReqs" is exactly the "Also asks for" list it must find, in order.
// tools/verify-content.mjs checks both. Field meanings are in content/SCHEMA.md.

export const SAMPLES = [
  {
    id: "s1",
    title: "Full Stack Developer",
    role: "fsd",
    text: `Full Stack Developer (MERN) | 0 to 2 years | Chennai (Hybrid)

About the role
We are a product startup building tools for small clinics. You will work with the rest of the team to ship features every week.

What you will do
• Build responsive web pages with React, HTML5 and CSS3
• Write REST APIs using Node.js and Express
• Design MongoDB schemas and write clean queries
• Review pull requests on GitHub and use Git every day

Requirements
• B.E., B.Tech, BCA or MCA
• Strong JavaScript (ES6+) fundamentals
• Good understanding of data structures and OOP concepts
• Experience with JWT based authentication
• Basic knowledge of SQL

Good to have
• TypeScript or Next.js
• Docker and AWS basics
• Exposure to AI coding tools like GitHub Copilot

You are a go-getter with good communication who enjoys working in a team. Immediate joiners preferred.`,
    expected: ["mongodb", "express", "react", "node", "html", "css", "rest", "github", "git", "js", "dsa", "oop", "auth", "sql", "ts", "nextjs", "docker", "aws", "aitools", "motivated", "comm", "team"],
    expectedReqs: ["exp:0-2y", "place:chennai", "mode:hybrid", "edu:btech", "edu:bca", "edu:mca", "notice:immediate"],
    demoHave: ["html", "css", "js", "git", "github", "sql", "oop", "comm"]
  },
  {
    id: "s2",
    title: "Java Backend Developer",
    role: "java",
    text: `Java Backend Developer | 2 to 4 years | Bengaluru

Must have
• Core Java (Java 17), OOP and collections
• Spring Boot, Spring Security and Hibernate
• REST APIs and microservices
• MySQL or PostgreSQL
• Unit testing with JUnit and Mockito
• Git, Maven and Jenkins
• Strong problem solving and ownership of your services

Nice to have
• Kafka or RabbitMQ
• Docker and Kubernetes
• C/C++ exposure is a plus

B.E. or B.Tech in Computer Science or a related field. Notice period: up to 30 days.
We work in Agile sprints and go live every two weeks.`,
    expected: ["java", "oop", "spring", "hibernate", "rest", "micro", "mysql", "postgres", "testing", "junit", "git", "maven", "jenkins", "problem", "own", "kafka", "rabbitmq", "docker", "k8s", "c", "cpp", "agile"],
    expectedReqs: ["exp:2-4y", "place:bengaluru", "edu:btech", "edu:csdeg", "notice:30d"],
    demoHave: ["java", "oop", "mysql", "git", "problem"]
  },
  {
    id: "s3",
    title: "Data Analyst",
    role: "da",
    text: `Data Analyst | Fresher | Chennai

Responsibilities
• Pull and clean data using SQL
• Build dashboards in Power BI or Tableau
• Use Advanced Excel (VLOOKUP, pivot tables) for quick reports
• Present insights to business teams

Skills we look for
• Python with Pandas and NumPy for data analysis
• Statistics basics: mean, median and hypothesis testing
• Data visualization best practices
• Strong communication and attention to detail

Any graduate. Tamil and English preferred.
Excel at explaining numbers to people who are not from a tech background.`,
    expected: ["sql", "powerbi", "tableau", "excel", "py", "pandas", "numpy", "analysis", "stats", "dataviz", "comm", "detail"],
    expectedReqs: ["exp:fresher", "place:chennai", "edu:anygrad", "lang:tamil", "lang:english"],
    demoHave: ["excel", "sql", "stats", "comm"]
  },
  {
    id: "s4",
    title: "Machine Learning Engineer",
    role: "mle",
    text: `Machine Learning Engineer | 1 to 3 years | Remote

You will
• Train and tune ML models with scikit-learn and XGBoost
• Build deep learning models in PyTorch or TensorFlow
• Work on NLP and computer vision use cases
• Deploy models with Docker on AWS and track experiments in MLflow

You have
• Strong Python and SQL
• A solid grasp of statistics and feature engineering
• Curiosity and the ability to work independently
• Experience with Go or Rust is a bonus
• A Master's degree is a plus`,
    expected: ["ml", "sklearn", "xgboost", "dl", "pytorch", "tf", "nlp", "cv", "docker", "aws", "mlops", "py", "sql", "stats", "features", "learn", "independent", "go", "rust"],
    expectedReqs: ["exp:1-3y", "mode:remote", "edu:masters"],
    demoHave: ["py", "sql", "stats", "ml", "learn"]
  },
  {
    id: "s5",
    title: "Generative AI Engineer",
    role: "gai",
    text: `Generative AI Engineer | 2+ years | Chennai or Remote

What you will build
• RAG pipelines over company documents using LangChain and LlamaIndex
• Multi-agent workflows with LangGraph or CrewAI
• Tools for our agents using the Model Context Protocol (MCP)

What you need
• Hands-on experience with LLMs through the OpenAI API and Hugging Face
• Prompt engineering and evaluation
• Vector databases such as Pinecone or FAISS
• Fine-tuning with LoRA is a plus
• Python, FastAPI and Docker
• Clear communication with stakeholders`,
    expected: ["genai", "rag", "langchain", "llamaindex", "agents", "langgraph", "crewai", "mcp", "llm", "openai", "hf", "prompt", "vectordb", "finetune", "py", "fastapi", "docker", "comm", "stake"],
    expectedReqs: ["exp:2+y", "place:chennai", "mode:remote"],
    demoHave: ["py", "prompt", "openai", "docker", "comm"]
  },
  {
    id: "s6",
    title: "Frontend Developer",
    role: "fe",
    text: `Frontend Developer (React) | 1 to 3 years | Coimbatore

Requirements
• HTML5, CSS3 and JavaScript (ES6+)
• React with hooks, plus Redux Toolkit
• TypeScript in production
• Tailwind CSS or Sass
• Responsive design that works well on small screens
• Testing with Jest
• Turning Figma designs into clean UI
• An eye for detail and a team player

Good to have
• Next.js
• Basic Node.js`,
    expected: ["react", "html", "css", "js", "redux", "ts", "tailwind", "sass", "responsive", "jest", "figma", "detail", "team", "nextjs", "node"],
    expectedReqs: ["exp:1-3y", "place:coimbatore"],
    demoHave: ["html", "css", "js", "react", "responsive", "team"]
  },
  {
    id: "s7",
    title: "Digital Marketing Executive",
    role: "mkt",
    text: `Digital Marketing Executive | 1 to 3 years | Chennai (On-site)

What you will do
• Plan and run Google Ads and Meta Ads campaigns for lead generation
• Handle SEO for our website and blog, including keyword research
• Manage social media and plan the content calendar
• Track results in Google Analytics and report weekly in Excel
• Work with designers on ad creatives in Canva

What we need
• Hands-on performance marketing experience
• Basic knowledge of WordPress
• Good communication in English and Tamil
• Analytical mindset and attention to detail
• Any graduate. An MBA in marketing is a plus.`,
    expected: ["digitalmkt", "sem", "metaads", "leadgen", "seo", "smm", "contentmkt", "webanalytics", "excel", "graphic", "canva", "perfmkt", "wordpress", "comm", "analytical", "detail"],
    expectedReqs: ["exp:1-3y", "place:chennai", "mode:onsite", "lang:english", "lang:tamil", "edu:anygrad", "edu:mba"],
    demoHave: ["seo", "smm", "excel", "canva", "comm", "detail"]
  },
  {
    id: "s8",
    title: "Accounts Executive",
    role: "acct",
    text: `Accounts Executive | 2 to 4 years | Coimbatore

Responsibilities
• Maintain books of accounts in Tally Prime
• Prepare GST and TDS returns on time
• Handle accounts payable, accounts receivable and bank reconciliation
• Support month-end closing and MIS reports for management
• Work with the auditors during the statutory audit

Requirements
• B.Com or M.Com. CA Inter is a plus.
• Strong Advanced Excel skills
• Working knowledge of Zoho Books
• Attention to detail and good time management
• Immediate joiners preferred`,
    expected: ["accounting", "tally", "gst", "tds", "ap", "ar", "bankrec", "finreport", "mis", "audit", "excel", "acctsw", "detail", "time"],
    expectedReqs: ["exp:2-4y", "place:coimbatore", "edu:bcom", "edu:mcom", "cert:ca", "notice:immediate"],
    demoHave: ["tally", "gst", "accounting", "excel", "detail"]
  },
  {
    id: "s9",
    title: "Business Development Executive",
    role: "sales",
    text: `Business Development Executive | Freshers can apply | Chennai

About the role
You will talk to students and working professionals who want to upskill, and help them pick the right course.

What you will do
• Handle inbound calls and follow up on warm leads
• Give career counselling and explain our programs clearly
• Handle objections and close deals over phone and video calls
• Update every call in the CRM (we use LeadSquared)
• Meet targets every month

What we look for
• Excellent communication in English, plus Tamil or Hindi
• Confident, convincing and target driven
• Good listening skills and empathy
• Any graduate
• Own laptop and a two-wheeler are a plus`,
    expected: ["bizdev", "insidesales", "counselling", "objection", "pipeline", "crm", "result", "comm", "confidence", "negotiate", "empathy"],
    expectedReqs: ["exp:fresher", "place:chennai", "lang:english", "lang:tamil", "lang:hindi", "edu:anygrad", "other:laptop", "other:bike"],
    demoHave: ["counselling", "crm", "comm", "confidence", "empathy"]
  },
  {
    id: "s10",
    title: "HR Recruiter",
    role: "hr",
    text: `HR Recruiter (IT) | 1 to 2 years | Hyderabad | Hybrid

What you will do
• Handle end-to-end recruitment for tech roles
• Source candidates on Naukri and LinkedIn Recruiter, and do resume screening
• Handle interview scheduling and coordinate with hiring managers
• Run onboarding and joining formalities for new hires
• Keep candidate data updated in Keka

What we need
• MBA in HR, or any graduate with recruitment experience
• Strong communication and stakeholder management
• Able to multitask and work in a fast-paced team
• Notice period of up to 30 days`,
    expected: ["recruit", "jobportals", "sourcing", "interviewing", "onboarding", "hrms", "comm", "stake", "multi", "pressure"],
    expectedReqs: ["exp:1-2y", "place:hyderabad", "mode:hybrid", "edu:mba", "edu:anygrad", "notice:30d"],
    demoHave: ["recruit", "jobportals", "sourcing", "comm", "multi"]
  },
  {
    id: "s11",
    title: "Mechanical Design Engineer",
    role: "mech",
    text: `Mechanical Design Engineer | 0 to 2 years | Hosur

Responsibilities
• Create 3D models and 2D drawings in SolidWorks and AutoCAD
• Apply GD&T on engineering drawings and prepare the BOM
• Run basic FEA in ANSYS to check designs
• Work with the manufacturing team on sheet metal and machining
• Support continuous improvement on the shop floor

Requirements
• B.E. in Mechanical Engineering or Diploma
• Knowledge of design calculations and manufacturing processes
• Good problem solving and willingness to learn
• Two-wheeler with a valid driving licence
• Willing to work in rotational shifts`,
    expected: ["mechdesign", "solidworks", "autocad", "gdt", "drafting", "fea", "ansys", "manufacture", "process", "problem", "learn"],
    expectedReqs: ["exp:0-2y", "place:hosur", "edu:btech", "edu:mechdeg", "edu:diploma", "other:bike", "other:rotshift"],
    demoHave: ["autocad", "solidworks", "drafting", "problem", "learn"]
  }
];
