// LOCKED. Tricky sentences the X-ray must read correctly. Run by tools/verify-content.mjs and the browser self-test.
// Add a case for every mistake you ever find, with the right answer.
//   CASES:     [text, the skill ids that must be found, in order]
//   REQ_CASES: [text, the "Also asks for" keys that must be found, in order]

export const CASES = [
  // Similar names
  ["JavaScript developer needed", ["js"]],
  ["Java and Spring Boot", ["java", "spring"]],
  ["Java/J2EE with Hibernate", ["java", "hibernate"]],
  ["React Native and React", ["rn", "react"]],
  ["Node.js, Express and MongoDB", ["node", "express", "mongodb"]],
  ["MySQL and NoSQL databases", ["mysql", "nosql"]],
  ["PL/SQL and T-SQL", ["oracle", "mssql"]],
  ["ASP.NET Core and C#", ["dotnet", "cs"]],
  ["GitHub Copilot, GitHub Actions and GitHub", ["aitools", "gha", "github"]],
  ["Tailwind CSS", ["tailwind"]],
  ["LlamaIndex and Llama 3", ["llamaindex", "llm"]],
  ["Spring-Boot, Node JS and Fine-Tuning", ["spring", "node", "finetune"]],

  // Short names that need care
  ["Proficiency in C, C++ or Java", ["c", "cpp", "java"]],
  ["Knowledge of C/C++", ["c", "cpp"]],
  ["Experience with Go and Kubernetes", ["go", "k8s"]],
  ["A go-getter attitude with Python", ["motivated", "py"]],
  ["Go above and beyond for customers", ["own"]],
  ["Python or R for analysis", ["py", "r"]],
  ["Our R&D team in Chennai", []],
  ["Grade C or above in all subjects", []],
  ["C-level stakeholders and Python", ["stake", "py"]],
  ["Express your ideas clearly", []],
  ["Spring 2027 graduates can apply", []],
  ["Rust is a plus", []],
  ["Rust and Go for systems work, plus Docker", ["rust", "go", "docker"]],
  ["We react quickly to change", []],
  ["Work with the rest of the team", []],
  ["Build REST APIs", ["rest"]],
  ["Excel at problem solving", ["problem"]],
  ["Advanced Excel and Power BI", ["excel", "powerbi"]],
  ["Excel and SQL reports", ["excel", "sql"]],

  // Stacks
  ["MERN stack developer", ["mongodb", "express", "react", "node"]],
  ["MEAN stack or MEVN", ["mongodb", "express", "angular", "node", "vue"]],
  ["The mean of the scores", []],

  // Algorithms
  ["Strong data structures and algorithms", ["dsa"]],
  ["Machine learning algorithms and statistics", ["ml", "stats"]],
  ["Deep learning algorithms in PyTorch", ["dl", "pytorch"]],

  // Links and emails are ignored
  ["Send your GitHub profile link to careers@reactlabs.co", ["github"]],
  ["Apply at https://example.com/jobs/react-developer", []],
  ["See www.nodeworks.org/python for details", []],
  ["Post the job on Naukri.com", []],

  // Spacing and hyphens
  ["ci/cd pipelines and CI CD", ["cicd"]],
  ["Object-oriented programming", ["oop"]],
  ["Test-driven development", ["testing"]],
  ["Retrieval-Augmented Generation", ["rag"]],
  ["Multi-agent systems", ["agents"]],

  // Case rules
  ["javascript and JS", ["js"]],
  ["ML engineer with HTML skills", ["ml", "html"]],
  ["The MCP server and ADK", ["mcp", "adk"]],
  ["Gemini and LangChain", ["gemini", "langchain"]],
  ["Born a Gemini", []],

  // Other fields
  ["Tally the numbers at the end of the day", []],
  ["Tally Prime and GST returns", ["tally", "gst"]],
  ["Word of mouth marketing", []],
  ["MS Word, Excel and PowerPoint", ["word", "excel", "ppt"]],
  ["SEO, Google Ads and Meta Ads", ["seo", "sem", "metaads"]],
  ["Cold calling and lead generation", ["coldcall", "leadgen"]],
  ["Salesforce and HubSpot CRM", ["crm"]],
  ["HubSpot for email campaigns", ["mautomation", "emailmkt"]],
  ["Sales funnel and sales forecasting", ["pipeline"]],
  ["Time series forecasting with Python", ["ml", "py"]],
  ["Budgeting and forecasting", ["budget"]],
  ["Audit logs for every API call", []],
  ["Internal audit and statutory audit", ["audit"]],
  ["Type casting in Java", ["java"]],
  ["Casting and forging", ["manufacture"]],
  ["User onboarding flow in React", ["react"]],
  ["Employee onboarding and induction", ["onboarding"]],
  ["CSS animations in React", ["css", "react"]],
  ["2D animation and motion graphics", ["animation", "motion"]],
  ["Billing system in Node.js", ["node"]],
  ["Invoicing and billing", ["invoicing"]],
  ["Collaborative filtering for recommendations", ["recsys"]],
  ["SolidWorks, CATIA and NX", ["solidworks", "catia", "nx"]],
  ["Electronics and Communication Engineering graduates", []],
  ["GD&T and tolerance stack-up", ["gdt"]],
  ["We are hiring for our recruitment drive", []],
  ["End-to-end recruitment and sourcing candidates", ["recruit", "sourcing"]],
  ["Career counselling for students", ["counselling"]],

  // Soft skills
  ["Good communication and teamwork", ["comm", "team"]],
  ["Communication protocols like UART and SPI", []],
  ["Report to the leadership team", []],
  ["Lead a team of five", ["leader"]],
  ["Confidence intervals and p-values", []],
  ["A confident speaker", ["confidence"]],
  ["Data integrity checks", []],
  ["Integrity and ownership", ["own"]],
  ["Analytical tools like Mixpanel", []],
  ["Strong analytical and problem solving skills", ["analytical", "problem"]],
  ["The presentation layer of the app", []],
  ["Presentation and public speaking", ["present"]],
  ["Proactive monitoring with Grafana", ["monitor"]],
  ["Self-motivated and proactive", ["motivated"]],
  ["System resilience and failover", []],
  ["Works well in a fast-paced startup", ["pressure"]],
  ["Coaching institute in Chennai", []],
  ["Mentor junior developers", ["mentor"]],
  ["Detail-oriented, with strong time management", ["detail", "time"]],

  // Plain text with nothing in it
  ["", []],
  ["We are a friendly company", []]
];

export const REQ_CASES = [
  // Experience
  ["0 to 2 years of experience", ["exp:0-2y"]],
  ["2-4 yrs", ["exp:2-4y"]],
  ["2 \u2013 4 years", ["exp:2-4y"]],
  ["Experience: 3+ years", ["exp:3+y"]],
  ["Minimum 2 years in sales", ["exp:2+y"]],
  ["at least 5 yrs", ["exp:5+y"]],
  ["2 years of experience in React", ["exp:2y"]],
  ["two to four years", ["exp:2-4y"]],
  ["6+ months of internship experience", ["exp:6+m", "job:intern"]],
  ["1.5 years of experience", ["exp:1.5y"]],
  ["Age: 21 to 28 years", []],
  ["Founded 15+ years ago", []],
  ["We have 10+ years in the industry", []],
  ["A 4 year degree in engineering", ["edu:engdeg"]],
  ["2 year service agreement", ["other:bond"]],
  ["Every 2 years we review roles", []],
  ["Within 2 years you will lead a team", []],
  ["Freshers can apply", ["exp:fresher"]],

  // Education
  ["B.E./B.Tech in CSE", ["edu:btech", "edu:csdeg"]],
  ["BE in Mechanical Engineering", ["edu:btech", "edu:mechdeg"]],
  ["MUST BE ABLE TO TRAVEL", []],
  ["B.Com or M.Com with Tally", ["edu:bcom", "edu:mcom"]],
  ["MBA from a reputed college", ["edu:mba"]],
  ["Any graduate with a bachelor's degree", ["edu:anygrad", "edu:bachelors"]],
  ["Post graduation in commerce", ["edu:masters"]],
  ["Electronics and Communication Engineering graduates", ["edu:ecedeg", "edu:engdeg"]],

  // Work mode, job type, location
  ["Hybrid search with RAG", []],
  ["Remote debugging tools", []],
  ["Work from office, 5 days a week", ["mode:onsite"]],
  ["Location: Coimbatore (On-site)", ["place:coimbatore", "mode:onsite"]],
  ["Chennai or Bangalore", ["place:chennai", "place:bengaluru"]],
  ["Based in Tamil Nadu", ["place:tamilnadu"]],
  ["Smart contracts on Ethereum", []],
  ["Internship with a full-time offer", ["job:intern", "job:fulltime"]],
  ["6 month contract role", ["job:contract"]],

  // Joining
  ["Notice period: 30 days", ["notice:30d"]],
  ["Notice period of up to 2 months", ["notice:2m"]],
  ["Can join with 15 days notice", ["notice:15d"]],
  ["Immediate joiners preferred", ["notice:immediate"]],

  // Languages, certifications, other
  ["Fluent in Tamil and English", ["lang:tamil", "lang:english"]],
  ["AWS Certified Solutions Architect preferred", ["cert:cloudcert"]],
  ["CA Inter or CMA", ["cert:ca", "cert:cma"]],
  ["Two-wheeler with a valid driving licence", ["other:bike"]],
  ["2-year bond", ["other:bond"]],
  ["Night shift (US hours)", ["other:nightshift"]],
  ["Please mail your CV to hr@company.in", []],
  ["", []]
];
