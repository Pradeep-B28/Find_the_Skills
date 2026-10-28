// LOCKED CONTENT. Every skill the X-ray looks for: tech skills, other job skills and soft skills.
// Every alias here is checked by tools/verify-content.mjs. Run it after any change.
// Field meanings are in content/SCHEMA.md.

// kind decides how a group is scored and shown:
//   tech  job skills our programs can teach
//   work  job skills from other fields (marketing, accounts, HR, design and more)
//   soft  soft skills, scored separately and never used to pick a program
export const GROUPS = [
  { id: "lang", name: "Languages", kind: "tech" },
  { id: "web", name: "Front end", kind: "tech" },
  { id: "backend", name: "Back end", kind: "tech" },
  { id: "db", name: "Databases", kind: "tech" },
  { id: "cloud", name: "Cloud and DevOps", kind: "tech" },
  { id: "practice", name: "Tools and practices", kind: "tech" },
  { id: "data", name: "Data and analytics", kind: "tech" },
  { id: "ai", name: "AI and ML", kind: "tech" },
  { id: "genai", name: "Generative AI", kind: "tech" },
  { id: "mobile", name: "Mobile", kind: "tech" },
  { id: "office", name: "Office tools", kind: "work" },
  { id: "marketing", name: "Marketing", kind: "work" },
  { id: "sales", name: "Sales and customer service", kind: "work" },
  { id: "finance", name: "Finance and accounts", kind: "work" },
  { id: "hr", name: "HR", kind: "work" },
  { id: "ops", name: "Operations and management", kind: "work" },
  { id: "design", name: "Design and media", kind: "work" },
  { id: "writing", name: "Writing", kind: "work" },
  { id: "core", name: "Core engineering", kind: "work" },
  { id: "teach", name: "Teaching and training", kind: "work" },
  { id: "soft", name: "Soft skills", kind: "soft" }
];

export const SKILLS = [
  // Languages
  { id: "py", name: "Python", group: "lang", aliases: ["python", "python3", "python 3"], bridge: true },
  { id: "java", name: "Java", group: "lang", aliases: ["java", "core java", "advanced java", "j2ee", "java ee", "jee"] },
  { id: "js", name: "JavaScript", group: "lang", aliases: ["javascript", "java script", "ecmascript", "es6", "es6+", "vanilla js", "vanilla javascript"], cased: ["JS"] },
  { id: "ts", name: "TypeScript", group: "lang", aliases: ["typescript", "type script"] },
  {
    id: "c", name: "C", group: "lang",
    aliases: ["c programming", "c language", "embedded c", "ansi c"],
    cased: ["C"], context: true,
    not: ["c level", "c suite", "grade c", "plan c", "type c", "vitamin c", "(c)"]
  },
  { id: "cpp", name: "C++", group: "lang", aliases: ["c++", "cpp", "c plus plus"] },
  { id: "cs", name: "C#", group: "lang", aliases: ["c#", "c sharp", "csharp"] },
  {
    id: "go", name: "Go", group: "lang",
    aliases: ["golang", "go language", "go lang", "go programming"],
    cased: ["Go"], context: true,
    not: ["go getter", "go above", "go beyond", "go to", "go live", "go through", "go ahead", "go along"]
  },
  { id: "rust", name: "Rust", group: "lang", aliases: ["rust programming", "rustlang"], cased: ["Rust"], context: true },
  { id: "kotlin", name: "Kotlin", group: "lang", aliases: ["kotlin"] },
  { id: "swift", name: "Swift", group: "lang", aliases: ["swift programming", "swift language"], cased: ["Swift"], context: true, not: ["swift learner"] },
  { id: "php", name: "PHP", group: "lang", aliases: ["php"] },
  { id: "ruby", name: "Ruby", group: "lang", aliases: ["ruby programming"], cased: ["Ruby"], context: true },
  { id: "scala", name: "Scala", group: "lang", aliases: ["scala"] },
  { id: "r", name: "R", group: "lang", aliases: ["r programming", "r language", "rstudio", "r studio"], cased: ["R"], context: true, not: ["(r)"] },
  { id: "dart", name: "Dart", group: "lang", aliases: ["dart"] },
  { id: "matlab", name: "MATLAB", group: "lang", aliases: ["matlab", "simulink"], bridge: true },
  { id: "shell", name: "Shell scripting", group: "lang", aliases: ["shell scripting", "shell script", "shell scripts", "bash", "bash scripting", "powershell"] },

  // Front end
  { id: "html", name: "HTML", group: "web", aliases: ["html", "html5", "html 5"] },
  { id: "css", name: "CSS", group: "web", aliases: ["css", "css3", "css 3"] },
  { id: "react", name: "React", group: "web", aliases: ["react.js", "reactjs", "react js"], cased: ["React"] },
  { id: "angular", name: "Angular", group: "web", aliases: ["angularjs", "angular.js", "angular js"], cased: ["Angular"] },
  { id: "vue", name: "Vue.js", group: "web", aliases: ["vue.js", "vuejs", "vue js", "vue3", "vue 3"], cased: ["Vue"] },
  { id: "nextjs", name: "Next.js", group: "web", aliases: ["next.js", "nextjs", "next js"] },
  { id: "redux", name: "Redux", group: "web", aliases: ["redux", "redux toolkit"] },
  { id: "tailwind", name: "Tailwind CSS", group: "web", aliases: ["tailwind", "tailwind css", "tailwindcss"] },
  { id: "bootstrap", name: "Bootstrap", group: "web", aliases: ["bootstrap"] },
  { id: "sass", name: "Sass", group: "web", aliases: ["sass", "scss"] },
  { id: "jquery", name: "jQuery", group: "web", aliases: ["jquery"] },
  { id: "responsive", name: "Responsive design", group: "web", aliases: ["responsive design", "responsive web design", "responsive ui", "responsive layout", "responsive layouts", "mobile first design"] },
  { id: "figma", name: "Figma", group: "web", aliases: ["figma"], bridge: true },
  { id: "uiux", name: "UI and UX design", group: "web", aliases: ["ui/ux", "ui ux", "ux design", "ui design", "user experience design", "user interface design", "product design"], bridge: true },

  // Back end
  { id: "node", name: "Node.js", group: "backend", aliases: ["node.js", "nodejs", "node js"], cased: ["Node"] },
  { id: "express", name: "Express.js", group: "backend", aliases: ["express.js", "expressjs", "express js"], cased: ["Express"], context: true },
  { id: "django", name: "Django", group: "backend", aliases: ["django", "django rest framework"], cased: ["DRF"] },
  { id: "flask", name: "Flask", group: "backend", aliases: ["flask"] },
  { id: "fastapi", name: "FastAPI", group: "backend", aliases: ["fastapi", "fast api"] },
  {
    id: "spring", name: "Spring Boot", group: "backend",
    aliases: ["spring boot", "springboot", "spring framework", "spring mvc", "spring cloud", "spring security", "spring data"],
    cased: ["Spring"], context: true
  },
  { id: "hibernate", name: "Hibernate and JPA", group: "backend", aliases: ["hibernate", "jpa"] },
  { id: "dotnet", name: ".NET", group: "backend", aliases: ["dotnet", "dot net", ".net", ".net core", "asp.net", "asp.net core", "vb.net"] },
  { id: "laravel", name: "Laravel", group: "backend", aliases: ["laravel"] },
  { id: "rails", name: "Ruby on Rails", group: "backend", aliases: ["ruby on rails"], cased: ["Rails"], context: true },
  { id: "nestjs", name: "NestJS", group: "backend", aliases: ["nestjs", "nest.js"] },
  {
    id: "rest", name: "REST APIs", group: "backend",
    aliases: ["rest api", "rest apis", "restful", "restful api", "restful apis", "restful services", "rest services", "restful web services", "rest web services"],
    cased: ["REST"]
  },
  { id: "graphql", name: "GraphQL", group: "backend", aliases: ["graphql"] },
  { id: "micro", name: "Microservices", group: "backend", aliases: ["microservices", "microservice", "micro services", "microservice architecture", "microservices architecture"] },
  { id: "auth", name: "Authentication (JWT, OAuth)", group: "backend", aliases: ["authentication", "jwt", "json web token", "json web tokens", "oauth", "oauth2", "oauth 2.0", "sso", "single sign on"] },
  { id: "sockets", name: "WebSockets", group: "backend", aliases: ["websocket", "websockets", "web sockets", "socket.io"] },
  { id: "kafka", name: "Kafka", group: "backend", aliases: ["kafka", "apache kafka"] },
  { id: "rabbitmq", name: "RabbitMQ", group: "backend", aliases: ["rabbitmq", "rabbit mq"] },
  { id: "maven", name: "Maven and Gradle", group: "backend", aliases: ["maven", "gradle"] },

  // Databases
  { id: "sql", name: "SQL", group: "db", aliases: ["sql"], bridge: true },
  { id: "mysql", name: "MySQL", group: "db", aliases: ["mysql", "my sql"] },
  { id: "postgres", name: "PostgreSQL", group: "db", aliases: ["postgresql", "postgres", "postgre sql"] },
  { id: "mongodb", name: "MongoDB", group: "db", aliases: ["mongodb", "mongo db", "mongo", "mongoose"] },
  { id: "nosql", name: "NoSQL", group: "db", aliases: ["nosql", "no sql"] },
  { id: "redis", name: "Redis", group: "db", aliases: ["redis"] },
  { id: "oracle", name: "Oracle Database", group: "db", aliases: ["oracle database", "oracle db", "oracle sql", "pl/sql", "plsql"], cased: ["Oracle"], context: true },
  { id: "mssql", name: "SQL Server", group: "db", aliases: ["sql server", "mssql", "ms sql", "t sql", "tsql"] },
  { id: "firebase", name: "Firebase", group: "db", aliases: ["firebase", "firestore"] },
  { id: "dynamodb", name: "DynamoDB", group: "db", aliases: ["dynamodb", "dynamo db"] },
  { id: "cassandra", name: "Cassandra", group: "db", aliases: ["cassandra"] },
  { id: "elastic", name: "Elasticsearch", group: "db", aliases: ["elasticsearch", "elastic search", "opensearch"] },
  { id: "sqlite", name: "SQLite", group: "db", aliases: ["sqlite"] },
  { id: "neo4j", name: "Neo4j and graph databases", group: "db", aliases: ["neo4j", "graph database", "graph databases"] },
  {
    id: "vectordb", name: "Vector databases", group: "db",
    aliases: ["vector database", "vector databases", "vector db", "vector dbs", "vector store", "vector stores", "pinecone", "chromadb", "chroma db", "faiss", "weaviate", "milvus", "qdrant", "pgvector"]
  },
  { id: "supabase", name: "Supabase", group: "db", aliases: ["supabase"] },

  // Cloud and DevOps
  { id: "aws", name: "AWS", group: "cloud", aliases: ["aws", "amazon web services", "ec2", "amazon ec2", "aws lambda", "amazon s3", "aws s3"] },
  { id: "azure", name: "Azure", group: "cloud", aliases: ["azure", "microsoft azure"] },
  { id: "gcp", name: "Google Cloud", group: "cloud", aliases: ["gcp", "google cloud", "google cloud platform", "bigquery"] },
  { id: "docker", name: "Docker", group: "cloud", aliases: ["docker", "dockerfile", "docker compose", "containerization", "containerisation"] },
  { id: "k8s", name: "Kubernetes", group: "cloud", aliases: ["kubernetes", "k8s", "helm", "eks", "aks", "gke"] },
  { id: "cicd", name: "CI/CD", group: "cloud", aliases: ["ci/cd", "ci cd", "cicd", "continuous integration", "continuous delivery", "continuous deployment"] },
  { id: "jenkins", name: "Jenkins", group: "cloud", aliases: ["jenkins"] },
  { id: "gha", name: "GitHub Actions", group: "cloud", aliases: ["github actions", "github action"] },
  { id: "terraform", name: "Terraform", group: "cloud", aliases: ["terraform", "infrastructure as code"] },
  { id: "ansible", name: "Ansible", group: "cloud", aliases: ["ansible"] },
  { id: "linux", name: "Linux", group: "cloud", aliases: ["linux", "unix", "ubuntu"] },
  { id: "nginx", name: "Nginx", group: "cloud", aliases: ["nginx"] },
  { id: "serverless", name: "Serverless", group: "cloud", aliases: ["serverless"] },
  { id: "devops", name: "DevOps", group: "cloud", aliases: ["devops", "dev ops"] },
  { id: "monitor", name: "Monitoring (Prometheus, Grafana)", group: "cloud", aliases: ["prometheus", "grafana", "datadog", "new relic"] },

  // Tools and practices
  { id: "git", name: "Git", group: "practice", aliases: ["git", "version control"] },
  { id: "github", name: "GitHub", group: "practice", aliases: ["github"] },
  { id: "gitlab", name: "GitLab", group: "practice", aliases: ["gitlab"] },
  { id: "jira", name: "Jira", group: "practice", aliases: ["jira"], bridge: true },
  { id: "agile", name: "Agile and Scrum", group: "practice", aliases: ["agile", "scrum", "kanban", "sprint planning"], bridge: true },
  { id: "postman", name: "API testing (Postman)", group: "practice", aliases: ["postman", "api testing"] },
  {
    id: "testing", name: "Unit testing", group: "practice",
    aliases: ["unit testing", "unit test", "unit tests", "integration testing", "automated testing", "test automation", "tdd", "test driven development"]
  },
  { id: "jest", name: "Jest", group: "practice", aliases: ["jest"] },
  { id: "junit", name: "JUnit", group: "practice", aliases: ["junit", "mockito"] },
  { id: "selenium", name: "Selenium", group: "practice", aliases: ["selenium"] },
  { id: "cypress", name: "Cypress", group: "practice", aliases: ["cypress"] },
  { id: "playwright", name: "Playwright", group: "practice", aliases: ["playwright"] },
  { id: "pytest", name: "PyTest", group: "practice", aliases: ["pytest"] },
  { id: "oop", name: "OOP", group: "practice", aliases: ["oop", "oops", "object oriented", "object oriented programming", "object oriented design", "ooad"] },
  {
    id: "dsa", name: "Data structures and algorithms", group: "practice",
    aliases: ["dsa", "data structures", "data structure", "algorithms", "data structures and algorithms", "data structures & algorithms", "algorithms and data structures", "competitive programming", "leetcode", "time complexity"],
    not: ["learning algorithms", "ml algorithms", "ai algorithms", "recommendation algorithms", "trading algorithms"]
  },
  { id: "patterns", name: "Design patterns", group: "practice", aliases: ["design patterns", "design pattern", "solid principles"], cased: ["SOLID"] },
  { id: "sysdesign", name: "System design", group: "practice", aliases: ["system design", "high level design", "low level design", "hld", "lld", "distributed systems"] },
  {
    id: "aitools", name: "AI coding tools", group: "practice",
    aliases: ["github copilot", "copilot", "cursor ai", "cursor ide", "claude code", "codeium", "chatgpt", "ai coding tools", "ai coding tool", "ai coding assistants", "ai assisted development", "ai assisted coding"],
    cased: ["Cursor"], context: true
  },
  { id: "n8n", name: "Workflow automation (n8n)", group: "practice", aliases: ["n8n", "zapier", "workflow automation"] },
  { id: "streamlit", name: "Streamlit", group: "practice", aliases: ["streamlit"] },
  { id: "security", name: "Cybersecurity", group: "practice", aliases: ["cybersecurity", "cyber security", "information security", "network security", "application security", "owasp", "secure coding"] },
  { id: "chain", name: "Blockchain", group: "practice", aliases: ["blockchain", "web3", "solidity", "smart contract", "smart contracts"] },

  // Data and analytics
  {
    id: "excel", name: "Excel", group: "data",
    aliases: ["ms excel", "microsoft excel", "advanced excel", "excel vba", "vlookup", "pivot table", "pivot tables"],
    cased: ["Excel"], not: ["excel at", "excel in"], bridge: true
  },
  { id: "powerbi", name: "Power BI", group: "data", aliases: ["power bi", "powerbi"], cased: ["DAX"], bridge: true },
  { id: "tableau", name: "Tableau", group: "data", aliases: ["tableau"], bridge: true },
  { id: "looker", name: "Looker", group: "data", aliases: ["looker", "looker studio", "google data studio"], bridge: true },
  { id: "pandas", name: "Pandas", group: "data", aliases: ["pandas"] },
  { id: "numpy", name: "NumPy", group: "data", aliases: ["numpy"] },
  { id: "mpl", name: "Matplotlib", group: "data", aliases: ["matplotlib"] },
  { id: "seaborn", name: "Seaborn", group: "data", aliases: ["seaborn"] },
  {
    id: "stats", name: "Statistics", group: "data",
    aliases: ["statistics", "statistical analysis", "statistical modeling", "statistical modelling", "probability", "hypothesis testing", "a/b testing", "ab testing"],
    bridge: true
  },
  { id: "analysis", name: "Data analysis", group: "data", aliases: ["data analysis", "data analytics", "exploratory data analysis", "eda"], bridge: true },
  { id: "dataviz", name: "Data visualization", group: "data", aliases: ["data visualization", "data visualisation", "data viz", "dashboarding"], bridge: true },
  { id: "etl", name: "ETL and data pipelines", group: "data", aliases: ["etl", "elt", "data pipeline", "data pipelines", "data warehouse", "data warehousing", "data engineering"] },
  { id: "spark", name: "Apache Spark", group: "data", aliases: ["apache spark", "pyspark", "spark sql", "databricks"], cased: ["Spark"], context: true },
  { id: "hadoop", name: "Hadoop", group: "data", aliases: ["hadoop", "hdfs", "hive", "mapreduce"] },
  { id: "airflow", name: "Airflow", group: "data", aliases: ["airflow", "apache airflow"] },
  { id: "snowflake", name: "Snowflake", group: "data", aliases: [], cased: ["Snowflake"], context: true },
  { id: "jupyter", name: "Jupyter", group: "data", aliases: ["jupyter", "jupyter notebook", "jupyter notebooks", "google colab", "colab"] },

  // AI and ML
  {
    id: "ml", name: "Machine learning", group: "ai",
    aliases: ["machine learning", "ml models", "supervised learning", "unsupervised learning", "predictive modeling", "predictive modelling", "time series", "time series forecasting", "time series analysis"],
    cased: ["ML"]
  },
  { id: "dl", name: "Deep learning", group: "ai", aliases: ["deep learning", "neural network", "neural networks", "cnn", "cnns", "rnn", "rnns", "lstm"] },
  { id: "nlp", name: "NLP", group: "ai", aliases: ["nlp", "natural language processing", "spacy", "nltk", "text analytics"] },
  { id: "cv", name: "Computer vision", group: "ai", aliases: ["computer vision", "opencv", "image processing", "object detection", "image recognition", "yolo"] },
  { id: "sklearn", name: "Scikit-learn", group: "ai", aliases: ["scikit learn", "sklearn"] },
  { id: "tf", name: "TensorFlow", group: "ai", aliases: ["tensorflow", "tensor flow"] },
  { id: "keras", name: "Keras", group: "ai", aliases: ["keras"] },
  { id: "pytorch", name: "PyTorch", group: "ai", aliases: ["pytorch", "py torch"] },
  { id: "xgboost", name: "XGBoost", group: "ai", aliases: ["xgboost", "lightgbm", "catboost", "gradient boosting"] },
  { id: "features", name: "Feature engineering", group: "ai", aliases: ["feature engineering", "feature selection", "feature extraction"] },
  { id: "mlops", name: "MLOps and model deployment", group: "ai", aliases: ["mlops", "ml ops", "model deployment", "model serving", "mlflow", "kubeflow", "sagemaker", "vertex ai"] },
  { id: "recsys", name: "Recommendation systems", group: "ai", aliases: ["recommendation system", "recommendation systems", "recommender system", "recommender systems", "recommendation engine", "recommendation engines", "collaborative filtering", "content based filtering"] },
  { id: "transformers", name: "Transformers", group: "ai", aliases: ["transformers", "transformer models", "transformer architecture", "bert"] },
  { id: "rl", name: "Reinforcement learning", group: "ai", aliases: ["reinforcement learning"] },
  { id: "respai", name: "Responsible AI", group: "ai", aliases: ["responsible ai", "ai ethics"] },

  // Generative AI
  { id: "genai", name: "Generative AI", group: "genai", aliases: ["generative ai", "genai", "gen ai", "generative models"] },
  { id: "llm", name: "LLMs", group: "genai", aliases: ["llm", "llms", "large language model", "large language models", "llama"] },
  { id: "prompt", name: "Prompt engineering", group: "genai", aliases: ["prompt engineering", "prompt design", "prompting"] },
  { id: "rag", name: "RAG", group: "genai", aliases: ["rag", "retrieval augmented generation", "graphrag", "graph rag"] },
  { id: "langchain", name: "LangChain", group: "genai", aliases: ["langchain", "lang chain"] },
  { id: "langgraph", name: "LangGraph", group: "genai", aliases: ["langgraph", "lang graph"] },
  { id: "llamaindex", name: "LlamaIndex", group: "genai", aliases: ["llamaindex", "llama index"] },
  { id: "crewai", name: "CrewAI", group: "genai", aliases: ["crewai", "crew ai"] },
  {
    id: "agents", name: "AI agents", group: "genai",
    aliases: ["ai agents", "ai agent", "agentic ai", "agentic", "autonomous agents", "multi agent", "multi agent systems", "agentic workflows"]
  },
  { id: "openai", name: "OpenAI API", group: "genai", aliases: ["openai", "open ai", "openai api", "chatgpt api", "gpt api"] },
  { id: "gemini", name: "Gemini API", group: "genai", aliases: ["gemini api", "google gemini"], cased: ["Gemini"], context: true },
  { id: "hf", name: "Hugging Face", group: "genai", aliases: ["hugging face", "huggingface"] },
  { id: "finetune", name: "Fine-tuning", group: "genai", aliases: ["fine tuning", "finetuning", "lora", "qlora", "peft"] },
  { id: "embeddings", name: "Embeddings", group: "genai", aliases: ["embeddings", "embedding models", "vector embeddings"] },
  { id: "mcp", name: "MCP (Model Context Protocol)", group: "genai", aliases: ["model context protocol", "mcp server", "mcp servers"], cased: ["MCP"] },
  { id: "adk", name: "Google ADK", group: "genai", aliases: ["google adk", "agent development kit"], cased: ["ADK"] },
  { id: "llmops", name: "LLMOps", group: "genai", aliases: ["llmops", "llm ops"] },

  // Mobile
  { id: "android", name: "Android", group: "mobile", aliases: ["android", "android studio", "android sdk"] },
  { id: "ios", name: "iOS", group: "mobile", aliases: ["ios", "swiftui", "xcode"] },
  { id: "rn", name: "React Native", group: "mobile", aliases: ["react native"] },
  { id: "flutter", name: "Flutter", group: "mobile", aliases: ["flutter"] },

  // Office tools
  { id: "msoffice", name: "MS Office", group: "office", aliases: ["ms office", "microsoft office", "office 365", "microsoft 365", "ms office suite"] },
  { id: "word", name: "MS Word", group: "office", aliases: ["ms word", "microsoft word"], cased: ["Word"], context: true, not: ["word of mouth"] },
  { id: "ppt", name: "PowerPoint", group: "office", aliases: ["powerpoint", "power point", "ms powerpoint", "microsoft powerpoint"] },
  { id: "gsheets", name: "Google Sheets", group: "office", aliases: ["google sheets", "google sheet", "gsheets", "google spreadsheets"], bridge: true },
  { id: "gworkspace", name: "Google Workspace", group: "office", aliases: ["google workspace", "g suite", "gsuite", "google docs", "google slides", "google drive", "google forms"] },
  { id: "outlook", name: "Outlook", group: "office", aliases: ["ms outlook", "microsoft outlook"], cased: ["Outlook"], context: true },
  { id: "typing", name: "Typing", group: "office", aliases: ["typing speed", "typing skills", "fast typing", "touch typing", "good typing", "wpm", "typewriting"] },
  { id: "dataentry", name: "Data entry", group: "office", aliases: ["data entry", "data entry operator"] },
  { id: "emailwrite", name: "Email writing", group: "office", aliases: ["email writing", "email etiquette", "business email", "email drafting", "business writing", "business correspondence"] },

  // Marketing
  { id: "digitalmkt", name: "Digital marketing", group: "marketing", aliases: ["digital marketing", "online marketing", "internet marketing"] },
  {
    id: "seo", name: "SEO", group: "marketing",
    aliases: ["seo", "search engine optimization", "search engine optimisation", "on page seo", "off page seo", "technical seo", "keyword research", "link building", "backlinks", "seo audit", "site audit"]
  },
  { id: "sem", name: "Google Ads and SEM", group: "marketing", aliases: ["google ads", "google adwords", "adwords", "sem", "search engine marketing", "ppc", "pay per click", "paid search"] },
  { id: "metaads", name: "Meta Ads", group: "marketing", aliases: ["meta ads", "facebook ads", "instagram ads", "facebook advertising", "meta ads manager", "ads manager", "meta business suite"] },
  {
    id: "smm", name: "Social media marketing", group: "marketing",
    aliases: ["social media marketing", "social media management", "social media", "smm", "instagram marketing", "linkedin marketing", "community management", "social media strategy"]
  },
  { id: "contentmkt", name: "Content marketing", group: "marketing", aliases: ["content marketing", "content strategy", "content calendar", "content planning", "content distribution"] },
  { id: "emailmkt", name: "Email marketing", group: "marketing", aliases: ["email marketing", "email campaigns", "mailchimp", "newsletter", "newsletters", "drip campaigns", "email automation"] },
  { id: "perfmkt", name: "Performance marketing", group: "marketing", aliases: ["performance marketing", "paid marketing", "paid media", "paid social", "media buying", "roas", "paid ads", "paid campaigns"] },
  {
    id: "webanalytics", name: "Google Analytics", group: "marketing",
    aliases: ["google analytics", "ga4", "universal analytics", "web analytics", "google tag manager", "tag manager", "search console", "google search console"],
    bridge: true
  },
  { id: "mautomation", name: "Marketing automation", group: "marketing", aliases: ["marketing automation", "hubspot", "zoho campaigns", "moengage", "webengage", "clevertap", "marketo"] },
  { id: "wordpress", name: "WordPress and site builders", group: "marketing", aliases: ["wordpress", "wix", "webflow", "elementor"] },
  { id: "ecommerce", name: "E-commerce", group: "marketing", aliases: ["ecommerce", "e commerce", "shopify", "woocommerce", "amazon seller central", "marketplace management"] },
  { id: "brand", name: "Brand management", group: "marketing", aliases: ["brand management", "branding", "brand strategy", "brand building", "brand marketing", "brand awareness"] },
  {
    id: "mresearch", name: "Market research", group: "marketing",
    aliases: ["market research", "competitor analysis", "competitive analysis", "market analysis", "consumer research", "customer research"],
    bridge: true
  },
  { id: "influencer", name: "Influencer and affiliate marketing", group: "marketing", aliases: ["influencer marketing", "affiliate marketing", "influencer outreach", "creator partnerships"] },
  {
    id: "cro", name: "Conversion optimisation", group: "marketing",
    aliases: ["conversion rate optimization", "conversion rate optimisation", "cro", "landing page optimization", "landing page optimisation", "landing pages"]
  },
  {
    id: "growth", name: "Growth marketing", group: "marketing",
    aliases: ["growth marketing", "growth hacking", "user acquisition", "customer acquisition", "funnel optimization", "funnel optimisation", "marketing funnel"]
  },
  { id: "pr", name: "Public relations", group: "marketing", aliases: ["public relations", "media relations", "press release", "press releases"] },
  { id: "events", name: "Event management", group: "marketing", aliases: ["event management", "event planning", "event coordination", "event marketing"] },

  // Sales and customer service
  {
    id: "b2b", name: "B2B sales", group: "sales",
    aliases: ["b2b sales", "b2b selling", "enterprise sales", "corporate sales", "institutional sales", "solution selling", "consultative selling", "consultative sales"]
  },
  { id: "b2c", name: "B2C sales", group: "sales", aliases: ["b2c sales", "retail sales", "direct sales", "consumer sales", "counter sales", "showroom sales"] },
  {
    id: "insidesales", name: "Inside sales and calling", group: "sales",
    aliases: ["inside sales", "telesales", "tele sales", "telecalling", "tele calling", "telecaller", "outbound calling", "outbound calls", "inbound calls", "inbound sales", "outbound sales"]
  },
  { id: "coldcall", name: "Cold calling and outreach", group: "sales", aliases: ["cold calling", "cold calls", "cold call", "cold outreach", "cold emailing", "cold email", "cold emails"] },
  {
    id: "fieldsales", name: "Field and channel sales", group: "sales",
    aliases: ["field sales", "territory sales", "channel sales", "dealer network", "distribution network", "channel partners", "distributor management", "area sales"]
  },
  { id: "leadgen", name: "Lead generation", group: "sales", aliases: ["lead generation", "lead gen", "prospecting", "lead qualification", "pipeline generation", "demand generation", "lead nurturing"] },
  {
    id: "crm", name: "CRM tools", group: "sales",
    aliases: ["crm", "crm tools", "crm software", "salesforce", "zoho crm", "hubspot crm", "leadsquared", "freshsales", "pipedrive", "sales crm", "customer relationship management"]
  },
  { id: "bizdev", name: "Business development", group: "sales", aliases: ["business development", "bde", "bdm", "new business development", "market expansion", "client acquisition", "new client acquisition"] },
  {
    id: "accmgmt", name: "Account management", group: "sales",
    aliases: ["account management", "key account management", "kam", "client management", "client relationship management", "client servicing", "relationship management", "customer success", "customer onboarding", "client onboarding"]
  },
  { id: "upsell", name: "Upselling and cross-selling", group: "sales", aliases: ["upselling", "up selling", "cross selling", "upsell", "cross sell", "renewals"] },
  {
    id: "pipeline", name: "Sales pipeline", group: "sales",
    aliases: ["sales pipeline", "pipeline management", "sales funnel", "sales forecasting", "deal closing", "closing deals", "close deals", "deal closure", "sales cycle"]
  },
  { id: "objection", name: "Objection handling", group: "sales", aliases: ["objection handling", "handling objections", "handle objections", "overcoming objections"] },
  {
    id: "demo", name: "Product demos", group: "sales",
    aliases: ["product demos", "product demo", "product demonstrations", "product demonstration", "presales", "pre sales", "sales presentations", "demo sessions", "sales demos"]
  },
  {
    id: "counselling", name: "Counselling", group: "sales",
    aliases: ["counselling", "counseling", "career counselling", "career counseling", "admission counselling", "admissions counselling", "student counselling", "academic counselling", "education counselling", "course counselling"]
  },
  {
    id: "custservice", name: "Customer service", group: "sales",
    aliases: ["customer service", "customer support", "client support", "customer care", "customer handling", "customer queries", "customer complaints", "complaint handling", "after sales", "after sales support", "customer experience"]
  },
  {
    id: "ticketing", name: "Ticketing tools", group: "sales",
    aliases: ["freshdesk", "zendesk", "ticketing", "ticketing tool", "ticketing tools", "ticketing system", "helpdesk", "help desk", "servicenow", "intercom", "jira service desk"]
  },
  {
    id: "voice", name: "Voice and chat support", group: "sales",
    aliases: ["voice process", "non voice", "chat support", "email support", "chat process", "blended process", "international voice", "domestic voice", "international bpo", "bpo"]
  },

  // Finance and accounts
  { id: "tally", name: "Tally", group: "finance", aliases: ["tally erp", "tally erp 9", "tally prime"], cased: ["Tally", "TALLY"], context: true },
  { id: "gst", name: "GST", group: "finance", aliases: ["gst", "gst filing", "gst returns", "gstr", "gst compliance", "goods and services tax", "gst reconciliation"] },
  { id: "tds", name: "TDS", group: "finance", aliases: ["tds", "tds filing", "tds returns", "tax deducted at source"] },
  {
    id: "accounting", name: "Accounting", group: "finance",
    aliases: ["accounting", "accountancy", "general ledger", "journal entries", "ledger", "finalisation of accounts", "finalization of accounts", "books of accounts", "book of accounts", "accounting principles"]
  },
  { id: "bookkeeping", name: "Bookkeeping", group: "finance", aliases: ["bookkeeping", "book keeping"] },
  { id: "ap", name: "Accounts payable", group: "finance", aliases: ["accounts payable", "vendor payments", "ap process", "payables"] },
  {
    id: "ar", name: "Accounts receivable", group: "finance",
    aliases: ["accounts receivable", "receivables", "ar process", "payment follow up", "payment collection", "payment collections", "debt collection", "credit control"]
  },
  { id: "bankrec", name: "Reconciliation", group: "finance", aliases: ["bank reconciliation", "brs", "reconciliation", "reconciliations", "vendor reconciliation", "ledger reconciliation"] },
  {
    id: "finreport", name: "Financial reporting", group: "finance",
    aliases: ["financial reporting", "financial statements", "balance sheet", "p&l", "profit and loss", "profit & loss", "cash flow statement", "month end closing", "month end close", "year end closing", "financial reports"]
  },
  {
    id: "finanalysis", name: "Financial analysis", group: "finance",
    aliases: ["financial analysis", "ratio analysis", "variance analysis", "financial planning", "fp&a", "fp & a", "investment analysis", "equity research"],
    bridge: true
  },
  { id: "finmodel", name: "Financial modelling", group: "finance", aliases: ["financial modelling", "financial modeling", "financial model", "financial models", "valuation", "valuations", "dcf"], bridge: true },
  { id: "budget", name: "Budgeting and forecasting", group: "finance", aliases: ["budgeting", "forecasting", "budget planning", "cost control", "cost analysis", "costing", "cost reduction"], bridge: true },
  { id: "tax", name: "Taxation", group: "finance", aliases: ["taxation", "income tax", "direct tax", "indirect tax", "tax filing", "itr filing", "tax returns", "tax compliance", "tax planning"] },
  {
    id: "audit", name: "Auditing", group: "finance",
    aliases: ["audit", "auditing", "internal audit", "statutory audit", "audits", "audit support", "tax audit"],
    not: ["audit logs", "audit log", "audit trail", "audit trails", "audit logging", "security audit", "security audits", "accessibility audit", "code audit"]
  },
  { id: "sapfico", name: "SAP FICO", group: "finance", aliases: ["sap fico", "sap fi", "sap co", "sap fi co", "sap fi/co"] },
  { id: "acctsw", name: "Accounting software", group: "finance", aliases: ["quickbooks", "zoho books", "xero", "busy accounting", "marg erp", "accounting software"] },
  {
    id: "invoicing", name: "Invoicing and billing", group: "finance",
    aliases: ["invoicing", "invoice processing", "billing", "invoices", "e invoicing", "e way bill", "eway bill"],
    not: ["billing system", "billing systems", "billing module", "billing service", "billing platform", "billing engineer"]
  },
  {
    id: "mis", name: "MIS reporting", group: "finance",
    aliases: ["mis reporting", "mis reports", "mis report", "management reporting", "management information system", "management information systems"],
    cased: ["MIS"], bridge: true
  },
  { id: "indas", name: "Ind AS and IFRS", group: "finance", aliases: ["ifrs", "ind as", "us gaap", "gaap", "accounting standards"] },
  {
    id: "banking", name: "Banking and credit", group: "finance",
    aliases: ["banking operations", "kyc", "loan processing", "credit analysis", "credit appraisal", "underwriting", "aml", "anti money laundering"]
  },

  // HR
  {
    id: "recruit", name: "Recruitment", group: "hr",
    aliases: ["recruitment", "talent acquisition", "end to end recruitment", "it recruitment", "non it recruitment", "campus hiring", "campus recruitment", "bulk hiring", "volume hiring", "lateral hiring", "technical recruitment", "full cycle recruiting"],
    not: ["recruitment process", "recruitment drive", "recruitment fraud", "recruitment scam"]
  },
  {
    id: "sourcing", name: "Sourcing and screening", group: "hr",
    aliases: ["candidate sourcing", "talent sourcing", "profile sourcing", "sourcing candidates", "boolean search", "headhunting", "head hunting", "resume screening", "cv screening", "screening resumes", "profile screening", "screening candidates"]
  },
  { id: "jobportals", name: "Job portals", group: "hr", aliases: ["naukri", "linkedin recruiter", "job portals", "job portal", "job boards", "foundit", "naukri rms"] },
  {
    id: "onboarding", name: "Onboarding", group: "hr",
    aliases: ["onboarding", "employee onboarding", "induction", "joining formalities", "background verification", "bgv", "new hire onboarding"],
    not: ["user onboarding", "onboarding flow", "onboarding flows", "onboarding screens", "onboarding experience"]
  },
  { id: "hrms", name: "HRMS tools", group: "hr", aliases: ["hrms", "hris", "keka", "darwinbox", "zoho people", "greythr", "workday", "successfactors", "sap successfactors", "hrms tools"] },
  {
    id: "engagement", name: "Employee engagement", group: "hr",
    aliases: ["employee engagement", "employee relations", "employee experience", "grievance handling", "exit interviews", "employee retention", "culture building"]
  },
  {
    id: "perf", name: "Performance management", group: "hr",
    aliases: ["performance management", "performance appraisal", "performance appraisals", "appraisals", "appraisal", "kra", "kras", "okrs", "kpi setting"],
    not: ["application performance management"]
  },
  {
    id: "hrops", name: "HR operations", group: "hr",
    aliases: ["hr operations", "hr ops", "hr policies", "hr policy", "hr generalist", "personnel management", "attendance management", "leave management", "employee records", "hr administration", "exit formalities", "full and final settlement"]
  },
  { id: "ld", name: "Training and development", group: "hr", aliases: ["training and development", "learning and development", "l&d", "l & d", "training needs analysis", "employee training", "tna"] },
  { id: "payroll", name: "Payroll", group: "hr", aliases: ["payroll", "payroll processing", "payroll management", "payroll software"] },
  { id: "compliance", name: "Statutory compliance", group: "hr", aliases: ["statutory compliance", "pf", "esi", "epf", "esic", "labour law", "labor law", "labour laws", "labor laws", "posh"] },
  {
    id: "interviewing", name: "Interview coordination", group: "hr",
    aliases: ["interview scheduling", "interview coordination", "scheduling interviews", "conducting interviews", "telephonic interviews", "telephonic screening", "hr interviews", "offer letters", "offer rollout", "offer negotiation"]
  },

  // Operations and management
  {
    id: "pm", name: "Project management", group: "ops",
    aliases: ["project management", "project planning", "project coordination", "project tracking", "ms project", "microsoft project", "asana", "trello", "clickup", "smartsheet", "project execution", "project delivery", "pmo"],
    bridge: true
  },
  {
    id: "prodmgmt", name: "Product management", group: "ops",
    aliases: ["product management", "product roadmap", "product roadmaps", "product strategy", "product requirements", "prd", "prds", "product discovery", "user stories", "backlog grooming", "backlog management", "product backlog", "product lifecycle", "go to market"],
    bridge: true
  },
  {
    id: "ba", name: "Business analysis", group: "ops",
    aliases: ["business analysis", "requirement gathering", "requirements gathering", "requirements analysis", "brd", "frd", "gap analysis", "process mapping", "business requirements"],
    bridge: true
  },
  {
    id: "opsmgmt", name: "Operations management", group: "ops",
    aliases: ["operations management", "business operations", "day to day operations", "daily operations", "process management", "sop", "sops", "standard operating procedures", "operational excellence"]
  },
  { id: "scm", name: "Supply chain", group: "ops", aliases: ["supply chain", "supply chain management", "scm", "demand planning", "demand forecasting", "s&op", "material planning", "mrp"] },
  {
    id: "logistics", name: "Logistics", group: "ops",
    aliases: ["logistics", "warehousing", "warehouse management", "fleet management", "last mile delivery", "freight", "shipment tracking", "exim", "export import", "import export", "customs clearance"]
  },
  { id: "inventory", name: "Inventory management", group: "ops", aliases: ["inventory management", "inventory control", "stock management", "stock control", "inventory", "stock audit"] },
  { id: "procurement", name: "Procurement", group: "ops", aliases: ["procurement", "purchasing", "purchase orders", "purchase order", "strategic sourcing", "vendor sourcing", "purchase management", "rfq"] },
  { id: "vendor", name: "Vendor management", group: "ops", aliases: ["vendor management", "vendor relations", "vendor coordination", "supplier management", "vendor negotiation", "vendor development"] },
  {
    id: "process", name: "Process improvement", group: "ops",
    aliases: ["process improvement", "process optimization", "process optimisation", "continuous improvement", "kaizen", "lean manufacturing", "lean principles", "lean methodology", "5s", "root cause analysis", "rca", "process excellence"]
  },
  { id: "sixsigma", name: "Six Sigma", group: "ops", aliases: ["six sigma", "lean six sigma", "dmaic", "green belt", "black belt"] },
  {
    id: "qc", name: "Quality control", group: "ops",
    aliases: ["quality control", "quality inspection", "quality checks", "quality check", "qc", "iso 9001", "quality management system", "qms", "spc", "statistical process control", "inspection"]
  },
  {
    id: "erp", name: "SAP and ERP", group: "ops",
    aliases: ["erp", "sap", "sap erp", "s/4hana", "sap s/4hana", "sap hana", "sap mm", "sap sd", "sap pp", "oracle erp", "erpnext", "odoo", "microsoft dynamics", "dynamics 365", "netsuite"]
  },
  {
    id: "admin", name: "Office administration", group: "ops",
    aliases: ["office administration", "admin work", "front office", "facility management", "facilities management", "administrative support", "back office", "back office operations", "office management"]
  },

  // Design and media
  { id: "photoshop", name: "Photoshop", group: "design", aliases: ["photoshop", "adobe photoshop"] },
  { id: "illustrator", name: "Illustrator", group: "design", aliases: ["illustrator", "adobe illustrator"] },
  { id: "indesign", name: "InDesign", group: "design", aliases: ["indesign", "adobe indesign"] },
  { id: "premiere", name: "Premiere Pro", group: "design", aliases: ["premiere pro", "adobe premiere", "adobe premiere pro", "premiere"] },
  { id: "aftereffects", name: "After Effects", group: "design", aliases: ["after effects", "adobe after effects"] },
  { id: "lightroom", name: "Lightroom", group: "design", aliases: ["lightroom", "adobe lightroom"] },
  { id: "canva", name: "Canva", group: "design", aliases: ["canva"] },
  { id: "corel", name: "CorelDRAW", group: "design", aliases: ["coreldraw", "corel draw", "corel"] },
  { id: "davinci", name: "DaVinci Resolve", group: "design", aliases: ["davinci resolve", "davinci", "da vinci resolve"] },
  { id: "finalcut", name: "Final Cut Pro", group: "design", aliases: ["final cut pro", "final cut", "fcp"] },
  { id: "capcut", name: "CapCut and mobile editors", group: "design", aliases: ["capcut", "inshot", "vn editor"] },
  {
    id: "graphic", name: "Graphic design", group: "design",
    aliases: ["graphic design", "graphic designing", "graphics design", "visual design", "layout design", "print design", "poster design", "logo design", "packaging design", "brochure design", "brand identity", "brand guidelines", "social media creatives", "static creatives", "ad creatives", "creatives"],
    bridge: true
  },
  {
    id: "video", name: "Video editing", group: "design",
    aliases: ["video editing", "video editor", "video production", "editing videos", "reels editing", "reel editing", "youtube editing", "short form video", "short form videos", "video content"]
  },
  { id: "motion", name: "Motion graphics", group: "design", aliases: ["motion graphics", "motion design", "motion graphic", "kinetic typography"] },
  {
    id: "animation", name: "Animation", group: "design",
    aliases: ["animation", "2d animation", "3d animation", "animations", "character animation"],
    not: ["css animation", "css animations", "ui animations", "web animations", "micro animations"]
  },
  { id: "threed", name: "3D modelling", group: "design", aliases: ["3d modelling", "3d modeling", "blender", "autodesk maya", "3ds max", "cinema 4d", "c4d", "3d design", "3d rendering"] },
  { id: "photo", name: "Photography and videography", group: "design", aliases: ["photography", "photo editing", "product photography", "videography", "camera operation", "shooting videos", "video shoots", "photo shoots"] },
  { id: "typography", name: "Typography and colour", group: "design", aliases: ["typography", "colour theory", "color theory", "font pairing"], bridge: true },
  { id: "illustration", name: "Illustration", group: "design", aliases: ["illustration", "illustrations", "digital illustration", "procreate"] },
  { id: "audio", name: "Audio editing", group: "design", aliases: ["audio editing", "sound design", "audacity", "voice over", "voiceover", "sound editing", "podcast editing", "audio mixing"] },

  // Writing
  {
    id: "contentwrite", name: "Content writing", group: "writing",
    aliases: ["content writing", "content writer", "blog writing", "blogging", "article writing", "web content", "website content", "seo writing", "seo content", "blog posts"]
  },
  { id: "copywriting", name: "Copywriting", group: "writing", aliases: ["copywriting", "copy writing", "ad copy", "ad copies", "copywriter", "sales copy", "marketing copy", "ux writing", "microcopy", "brand copy"] },
  {
    id: "techwriting", name: "Technical writing and documentation", group: "writing",
    aliases: ["technical writing", "technical documentation", "documentation", "user manuals", "api documentation", "technical writer", "process documentation", "report writing", "knowledge base articles"],
    bridge: true
  },
  { id: "proofread", name: "Editing and proofreading", group: "writing", aliases: ["proofreading", "proof reading", "copy editing", "copyediting", "content editing", "line editing", "grammar"] },
  { id: "script", name: "Scriptwriting and storytelling", group: "writing", aliases: ["scriptwriting", "script writing", "video scripts", "reel scripts", "storytelling", "storyboarding", "storyboard"] },
  { id: "fiction", name: "Creative writing", group: "writing", aliases: ["creative writing", "fiction writing", "poetry", "ghostwriting", "ghost writing"] },
  { id: "research", name: "Research", group: "writing", aliases: ["secondary research", "desk research", "primary research", "research skills", "content research", "topic research", "internet research", "online research"] },
  { id: "translation", name: "Translation and transcription", group: "writing", aliases: ["translation", "translating", "transcription", "localisation", "localization", "subtitling", "subtitles"] },

  // Core engineering
  { id: "autocad", name: "AutoCAD", group: "core", aliases: ["autocad", "auto cad", "autocad 2d", "autocad 3d", "autocad mechanical"] },
  { id: "solidworks", name: "SolidWorks", group: "core", aliases: ["solidworks", "solid works"] },
  { id: "catia", name: "CATIA", group: "core", aliases: ["catia", "catia v5"] },
  { id: "creo", name: "Creo", group: "core", aliases: ["creo", "ptc creo", "pro e", "pro/e", "pro engineer", "pro/engineer"] },
  { id: "nx", name: "Siemens NX", group: "core", aliases: ["siemens nx", "unigraphics", "ug nx"], cased: ["NX"], context: true },
  { id: "ansys", name: "ANSYS", group: "core", aliases: ["ansys", "ansys fluent", "ansys workbench", "ansys mechanical", "ansys cfx"] },
  { id: "cfd", name: "CFD", group: "core", aliases: ["cfd", "computational fluid dynamics", "openfoam", "star ccm+"] },
  {
    id: "fea", name: "FEA", group: "core",
    aliases: ["fea", "finite element analysis", "finite element method", "fem", "structural analysis", "abaqus", "nastran", "hypermesh", "ls dyna", "static structural"]
  },
  {
    id: "gdt", name: "GD&T", group: "core",
    aliases: ["gd&t", "gd & t", "gdt", "geometric dimensioning", "geometric dimensioning and tolerancing", "tolerance stack up", "tolerance stackup", "tolerance analysis"]
  },
  {
    id: "drafting", name: "Engineering drawing", group: "core",
    aliases: ["engineering drawing", "engineering drawings", "drafting", "2d drafting", "technical drawing", "technical drawings", "detailing", "bom", "bill of materials"]
  },
  {
    id: "mechdesign", name: "Mechanical design", group: "core",
    aliases: ["mechanical design", "machine design", "jigs and fixtures", "design calculations", "tooling design", "sheet metal design", "plastic part design", "dfm", "dfma"]
  },
  {
    id: "manufacture", name: "Manufacturing processes", group: "core",
    aliases: ["manufacturing processes", "manufacturing", "machining", "casting", "forging", "welding", "fabrication", "sheet metal", "injection moulding", "injection molding", "assembly line", "production planning"],
    not: ["type casting"]
  },
  { id: "cnc", name: "CNC programming", group: "core", aliases: ["cnc", "cnc programming", "vmc", "cad cam", "cad/cam", "mastercam", "g code", "cnc machining"] },
  { id: "plc", name: "PLC and automation", group: "core", aliases: ["plc", "plc programming", "scada", "hmi", "industrial automation", "dcs", "ladder logic"] },
  { id: "robotics", name: "Robotics", group: "core", aliases: ["robotics", "ros", "robot programming", "industrial robots", "robot operating system"] },
  { id: "hvac", name: "HVAC and MEP", group: "core", aliases: ["hvac", "hvac design", "mep", "plumbing design", "fire fighting", "fire protection systems"] },
  {
    id: "thermal", name: "Thermal and fluid engineering", group: "core",
    aliases: ["heat transfer", "thermodynamics", "thermal analysis", "thermal engineering", "fluid mechanics", "fluid dynamics", "thermal management", "strength of materials"]
  },
  {
    id: "civil", name: "Civil and site engineering", group: "core",
    aliases: ["staad pro", "staad", "etabs", "revit", "autodesk revit", "civil 3d", "primavera", "primavera p6", "quantity surveying", "site supervision", "site execution", "estimation and costing", "bar bending schedule"]
  },
  {
    id: "electronics", name: "Electronics and embedded", group: "core",
    aliases: ["pcb design", "circuit design", "altium", "proteus", "multisim", "kicad", "embedded systems", "arduino", "raspberry pi", "microcontroller", "microcontrollers", "iot", "internet of things", "8051", "stm32", "esp32", "vlsi", "verilog", "vhdl"]
  },

  // Teaching and training
  {
    id: "teaching", name: "Teaching", group: "teach",
    aliases: ["teaching", "tutoring", "classroom teaching", "online teaching", "lecturing", "doubt clearing", "doubt solving", "teaching experience", "subject expertise"]
  },
  { id: "lesson", name: "Lesson planning", group: "teach", aliases: ["lesson planning", "lesson plans", "lesson plan", "session planning", "class planning"] },
  {
    id: "curriculum", name: "Curriculum and course design", group: "teach",
    aliases: ["curriculum design", "curriculum development", "course design", "course creation", "content development", "syllabus design", "instructional design", "learning design", "e learning", "elearning", "course content"]
  },
  {
    id: "trainingdel", name: "Training delivery", group: "teach",
    aliases: ["training delivery", "corporate training", "conducting training", "delivering training", "facilitation", "train the trainer", "trainer", "conduct workshops", "conducting workshops", "workshop delivery", "technical training"]
  },
  { id: "lms", name: "LMS tools", group: "teach", aliases: ["lms", "moodle", "google classroom", "canvas lms", "blackboard", "learning management system", "learning management systems"] },
  {
    id: "assessment", name: "Assessment design", group: "teach",
    aliases: ["assessment design", "question paper", "question papers", "question bank", "paper setting", "answer sheet evaluation", "grading", "quiz creation", "test creation"]
  },
  { id: "classroom", name: "Classroom management", group: "teach", aliases: ["classroom management", "student engagement", "parent communication", "parent teacher meetings", "ptm", "student mentoring"] },

  // Soft skills
  {
    id: "comm", name: "Communication", group: "soft",
    aliases: ["communication", "communication skills", "verbal communication", "written communication", "oral communication", "spoken communication", "communicate", "communicating", "communicator", "articulate"],
    not: ["communication protocol", "communication protocols", "serial communication", "wireless communication", "communication systems", "inter process communication", "interprocess communication", "electronics and communication", "electronics & communication", "communication engineering"],
    bridge: true
  },
  { id: "people", name: "Interpersonal skills", group: "soft", aliases: ["interpersonal", "interpersonal skills", "people skills", "relationship building", "rapport building", "build rapport", "building rapport", "rapport"] },
  {
    id: "team", name: "Teamwork", group: "soft",
    aliases: ["teamwork", "team work", "team player", "team spirit", "collaboration", "collaborative", "collaborate", "collaborating", "cross functional", "work in a team", "work well in a team", "working in a team"],
    bridge: true
  },
  {
    id: "leader", name: "Leadership", group: "soft",
    aliases: ["leadership", "leadership skills", "team leadership", "lead a team", "leading a team", "leading teams", "lead teams", "team handling", "team management", "people management", "manage a team", "managing a team", "managing teams"],
    not: ["leadership team", "leadership teams", "senior leadership", "company leadership"]
  },
  {
    id: "mentor", name: "Mentoring and coaching", group: "soft",
    aliases: ["mentoring", "mentoring juniors", "mentor juniors", "mentor junior", "guide juniors", "coaching", "coach and mentor", "mentor and coach", "mentor and guide"],
    not: ["coaching institute", "coaching institutes", "coaching centre", "coaching center", "coaching classes"]
  },
  { id: "problem", name: "Problem solving", group: "soft", aliases: ["problem solving", "problem solver", "solve problems", "solving problems", "solve complex problems", "problem solving skills"], bridge: true },
  {
    id: "critical", name: "Critical thinking", group: "soft",
    aliases: ["critical thinking", "logical thinking", "logical reasoning", "reasoning skills", "think critically", "first principles thinking", "structured thinking"],
    bridge: true
  },
  {
    id: "analytical", name: "Analytical thinking", group: "soft",
    aliases: ["analytical", "analytical skills", "analytical thinking", "analytical mindset", "analytical ability", "analytical abilities", "analytically"],
    not: ["analytical tools", "analytical chemistry", "analytical instruments", "analytical database", "analytical databases", "analytical queries", "analytical workloads", "analytical dashboards", "analytical reports"],
    bridge: true
  },
  { id: "detail", name: "Attention to detail", group: "soft", aliases: ["attention to detail", "attention to details", "detail oriented", "eye for detail", "keen eye", "meticulous", "detail orientation"], bridge: true },
  {
    id: "time", name: "Time management", group: "soft",
    aliases: ["time management", "manage time", "managing time", "meet deadlines", "meeting deadlines", "meet tight deadlines", "deadline driven", "deadline oriented", "punctual", "punctuality", "prioritisation", "prioritization", "prioritize", "prioritise", "prioritizing", "prioritising"]
  },
  {
    id: "multi", name: "Multitasking", group: "soft",
    aliases: ["multitasking", "multi tasking", "multitask", "multi task", "juggle multiple", "handle multiple tasks", "manage multiple tasks", "manage multiple priorities", "handle multiple priorities"]
  },
  {
    id: "adapt", name: "Adaptability", group: "soft",
    aliases: ["adaptability", "adaptable", "adapt quickly", "adapt to change", "adapting to change", "comfortable with ambiguity", "handle ambiguity", "flexible attitude", "open to change"]
  },
  {
    id: "learn", name: "Willingness to learn", group: "soft",
    aliases: ["quick learner", "fast learner", "eager to learn", "willingness to learn", "willing to learn", "curious", "curiosity", "growth mindset", "learning attitude", "continuous learning", "learn new technologies", "learn quickly", "self learner", "self learning", "learning mindset", "keen to learn", "love for learning"],
    bridge: true
  },
  {
    id: "motivated", name: "Self-motivation", group: "soft",
    aliases: ["self motivated", "self motivation", "self starter", "go getter", "highly motivated", "motivated", "proactive", "initiative", "take initiative", "takes initiative", "self driven", "driven individual", "hustle"],
    not: ["proactive monitoring", "proactive alerts"]
  },
  {
    id: "result", name: "Result orientation", group: "soft",
    aliases: ["result oriented", "results oriented", "result driven", "results driven", "target driven", "target oriented", "goal oriented", "outcome oriented", "achieve targets", "achieving targets", "meet targets", "meeting targets", "outcome driven", "performance driven"]
  },
  {
    id: "pressure", name: "Working under pressure", group: "soft",
    aliases: ["work under pressure", "working under pressure", "handle pressure", "perform under pressure", "high pressure", "fast paced", "fast paced environment", "high growth environment", "resilience", "stress management", "thrive under pressure"],
    not: ["system resilience", "resilience engineering", "cyber resilience", "operational resilience", "network resilience"]
  },
  {
    id: "negotiate", name: "Negotiation and persuasion", group: "soft",
    aliases: ["negotiation", "negotiation skills", "negotiating", "negotiate", "persuasion", "persuasive", "convincing", "convince", "influencing", "influencing skills"]
  },
  {
    id: "present", name: "Presentation and public speaking", group: "soft",
    aliases: ["presentation skills", "presentation", "presentations", "presenting", "public speaking", "present ideas", "present findings", "stage presence", "anchoring"],
    not: ["presentation layer", "presentation tier", "presentation logic"],
    bridge: true
  },
  {
    id: "decision", name: "Decision making", group: "soft",
    aliases: ["decision making", "decision maker", "make decisions", "making decisions", "sound judgement", "good judgement", "sound judgment", "good judgment", "judgement", "judgment", "decisive"]
  },
  {
    id: "own", name: "Ownership and work ethic", group: "soft",
    aliases: ["ownership", "accountability", "accountable", "take ownership", "taking ownership", "sense of ownership", "go above and beyond", "going above and beyond", "work ethic", "strong work ethic", "integrity", "professionalism", "dependable", "disciplined"],
    not: ["data integrity", "referential integrity", "total cost of ownership", "code integrity", "message integrity", "integrity checks"]
  },
  {
    id: "customer", name: "Customer focus", group: "soft",
    aliases: ["customer focus", "customer focused", "customer centric", "customer centricity", "customer obsession", "customer obsessed", "customer first", "customer orientation", "customer oriented", "client focused", "client centric", "user focused", "user centric", "user first"]
  },
  {
    id: "stake", name: "Stakeholder management", group: "soft",
    aliases: ["stakeholder management", "stakeholders", "stakeholder", "managing stakeholders", "stakeholder communication", "client communication", "client facing", "client interaction", "client coordination"],
    bridge: true
  },
  {
    id: "conflict", name: "Conflict resolution", group: "soft",
    aliases: ["conflict resolution", "conflict management", "resolve conflicts", "handle conflicts", "dispute resolution", "de escalation", "escalation handling", "handling escalations", "handle escalations", "escalations"]
  },
  { id: "empathy", name: "Empathy and listening", group: "soft", aliases: ["empathy", "empathetic", "emotional intelligence", "patience", "listening skills", "active listening", "good listener", "compassion"] },
  {
    id: "creative", name: "Creativity", group: "soft",
    aliases: ["creativity", "creative thinking", "creative mindset", "creative flair", "creative problem solving", "out of the box thinking", "think outside the box", "innovative thinking", "innovative mindset", "ideation"]
  },
  {
    id: "organise", name: "Organisation and planning", group: "soft",
    aliases: ["organisational skills", "organizational skills", "organisation skills", "organization skills", "well organised", "well organized", "highly organised", "highly organized", "planning and organising", "planning and organizing", "planning skills"],
    bridge: true
  },
  {
    id: "confidence", name: "Confidence", group: "soft",
    aliases: ["confident", "confidence", "self confidence", "self confident"],
    not: ["confidence interval", "confidence intervals", "confidence score", "confidence scores", "confidence level", "confidence levels"]
  },
  {
    id: "positive", name: "Positive attitude", group: "soft",
    aliases: ["positive attitude", "can do attitude", "positive mindset", "enthusiasm", "enthusiastic", "passion", "passionate", "energetic", "high energy", "pleasant personality", "good attitude", "right attitude"]
  },
  {
    id: "independent", name: "Working independently", group: "soft",
    aliases: ["work independently", "working independently", "minimal supervision", "little supervision", "self managed", "independent worker", "independently manage", "independently handle", "work on your own"]
  },
  {
    id: "feedback", name: "Openness to feedback", group: "soft",
    aliases: ["open to feedback", "receptive to feedback", "accept feedback", "accepting feedback", "take feedback", "taking feedback", "coachable", "constructive feedback"]
  }
];
