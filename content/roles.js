// LOCKED CONTENT. Job roles the X-ray can recognise from the job skills it finds.
// The role with the most "core" skills found wins (at least config.limits.minRoleHits). Ties go to the role higher in this list.
// track "tech": the result shows the program that covers the most of the gap. "program" breaks ties.
// track "nontech": the result shows the switch-to-tech card with "program" and "switchWhy".
// Field meanings are in content/SCHEMA.md.

export const ROLES = [
  // Tech roles
  {
    id: "gai", name: "Generative AI Engineer", track: "tech", program: "genai",
    core: ["genai", "llm", "rag", "langchain", "langgraph", "llamaindex", "prompt", "vectordb", "agents", "openai", "hf", "finetune", "embeddings", "crewai", "mcp", "gemini"]
  },
  {
    id: "mle", name: "Machine Learning Engineer", track: "tech", program: "aiml",
    core: ["ml", "dl", "tf", "pytorch", "keras", "mlops", "sklearn", "cv", "nlp", "py", "docker", "transformers"]
  },
  {
    id: "ds", name: "Data Scientist", track: "tech", program: "aiml",
    core: ["py", "ml", "stats", "pandas", "numpy", "sklearn", "dl", "nlp", "features", "xgboost", "jupyter"]
  },
  {
    id: "de", name: "Data Engineer", track: "tech", program: "aiml",
    core: ["etl", "spark", "airflow", "kafka", "hadoop", "snowflake", "sql", "py", "aws", "gcp", "azure"]
  },
  {
    id: "da", name: "Data Analyst", track: "tech", program: "aiml",
    core: ["excel", "sql", "powerbi", "tableau", "looker", "py", "pandas", "stats", "dataviz", "analysis"]
  },
  {
    id: "devops", name: "DevOps Engineer", track: "tech", program: "fsd",
    core: ["docker", "k8s", "cicd", "jenkins", "terraform", "ansible", "linux", "shell", "aws", "azure", "gcp", "gha", "monitor", "nginx"]
  },
  {
    id: "mob", name: "Mobile App Developer", track: "tech", program: null,
    core: ["android", "ios", "kotlin", "swift", "flutter", "dart", "rn", "firebase"]
  },
  {
    id: "qa", name: "QA Engineer", track: "tech", program: "sde",
    core: ["selenium", "cypress", "playwright", "testing", "postman", "jest", "junit", "pytest", "jira", "agile"]
  },
  {
    id: "java", name: "Java Developer", track: "tech", program: "sde",
    core: ["java", "spring", "hibernate", "oop", "micro", "junit", "maven", "sql", "rest", "kafka"]
  },
  {
    id: "fsd", name: "Full Stack Developer", track: "tech", program: "fsd",
    core: ["js", "react", "node", "express", "mongodb", "html", "css", "rest", "ts", "nextjs", "sql", "git"]
  },
  {
    id: "fe", name: "Frontend Developer", track: "tech", program: "fsd",
    core: ["html", "css", "js", "ts", "react", "angular", "vue", "nextjs", "redux", "tailwind", "responsive", "sass", "figma"]
  },
  {
    id: "be", name: "Backend Developer", track: "tech", program: "sde",
    core: ["node", "express", "java", "spring", "py", "django", "flask", "fastapi", "rest", "sql", "postgres", "mysql", "mongodb", "micro", "redis", "kafka", "docker"]
  },
  {
    id: "sde", name: "Software Engineer", track: "tech", program: "sde",
    core: ["dsa", "oop", "sysdesign", "cpp", "java", "py", "c", "git", "patterns", "testing"]
  },

  // Non-tech roles
  {
    id: "mkt", name: "Digital Marketing Executive", track: "nontech", program: "aiml",
    core: ["digitalmkt", "seo", "sem", "metaads", "smm", "contentmkt", "emailmkt", "perfmkt", "webanalytics", "mautomation", "wordpress", "brand", "mresearch", "influencer", "cro", "growth"],
    switchWhy: "Marketing already runs on data. It starts from the basics, and its Statistics and BI phase covers analysis and Power BI."
  },
  {
    id: "sales", name: "Business Development Executive", track: "nontech", program: "aiml",
    core: ["b2b", "b2c", "insidesales", "coldcall", "fieldsales", "leadgen", "crm", "bizdev", "accmgmt", "upsell", "pipeline", "objection", "demo", "counselling"],
    switchWhy: "It starts from the basics and ends with Generative AI and automation tools."
  },
  {
    id: "support", name: "Customer Support Executive", track: "nontech", program: "aiml",
    core: ["custservice", "ticketing", "voice", "crm", "typing", "msoffice", "dataentry", "emailwrite"],
    switchWhy: "It starts from the basics and ends with Generative AI, including the kind of chatbots support teams work with."
  },
  {
    id: "acct", name: "Accounts Executive", article: "an", track: "nontech", program: "aiml",
    core: ["tally", "gst", "tds", "accounting", "bookkeeping", "ap", "ar", "bankrec", "finreport", "tax", "audit", "acctsw", "invoicing", "mis", "excel", "sapfico", "indas"],
    switchWhy: "Accounts work is already data work. It starts from the basics, and its Statistics and BI phase covers analysis and Power BI."
  },
  {
    id: "fin", name: "Financial Analyst", track: "nontech", program: "aiml",
    core: ["finanalysis", "finmodel", "budget", "finreport", "excel", "powerbi", "mis", "banking", "indas", "sql"],
    switchWhy: "Finance work is already data work. It starts from the basics and builds up to machine learning for prediction."
  },
  {
    id: "hr", name: "HR Recruiter", article: "an", track: "nontech", program: "aiml",
    core: ["recruit", "sourcing", "jobportals", "onboarding", "hrms", "engagement", "perf", "hrops", "ld", "payroll", "compliance", "interviewing"],
    switchWhy: "It starts from the basics and ends with Generative AI and automation tools that HR teams can use."
  },
  {
    id: "ops", name: "Operations Executive", article: "an", track: "nontech", program: "aiml",
    core: ["opsmgmt", "scm", "logistics", "inventory", "procurement", "vendor", "process", "sixsigma", "qc", "erp", "mis", "admin"],
    switchWhy: "Operations work is full of data. It starts from the basics and covers analysis, Power BI and automation."
  },
  {
    id: "pm", name: "Product or Project Manager", track: "nontech", program: "aiml",
    core: ["pm", "prodmgmt", "ba", "agile", "jira", "techwriting", "analysis"],
    switchWhy: "It covers data, machine learning and Generative AI, the parts of tech that product teams work with every day."
  },
  {
    id: "design", name: "Graphic Designer or Video Editor", track: "nontech", program: "fsd",
    core: ["photoshop", "illustrator", "indesign", "premiere", "aftereffects", "lightroom", "canva", "corel", "davinci", "finalcut", "capcut", "graphic", "video", "motion", "animation", "threed", "photo", "typography", "illustration", "audio"],
    switchWhy: "Design skills carry into front end work. It starts with HTML, CSS and responsive layouts."
  },
  {
    id: "writer", name: "Content Writer", track: "nontech", program: "aiml",
    core: ["contentwrite", "copywriting", "techwriting", "proofread", "script", "fiction", "research", "translation", "contentmkt"],
    switchWhy: "It starts from the basics, and its Generative AI phase covers prompt engineering."
  },
  {
    id: "mech", name: "Mechanical Design Engineer", track: "nontech", program: "sde",
    core: ["autocad", "solidworks", "catia", "creo", "nx", "ansys", "cfd", "fea", "gdt", "drafting", "mechdesign", "manufacture", "cnc", "thermal", "hvac", "plc", "civil", "robotics", "electronics"],
    switchWhy: "Engineering maths and problem solving carry over well. It starts with Java basics and builds up to DSA and full stack."
  },
  {
    id: "teach", name: "Trainer or Teacher", track: "nontech", program: "aiml",
    core: ["teaching", "lesson", "curriculum", "trainingdel", "lms", "assessment", "classroom", "ld"],
    switchWhy: "It starts from the basics and covers Python, data and Generative AI."
  }
];
