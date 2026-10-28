// LOCKED CONTENT. The "Also asks for" list: things a job post asks for that are not skills.
// These are shown to the person, never ticked and never scored.
// Years of experience and notice periods in days are read by js/engine/requirements.js, not listed here.
// Every alias is checked by tools/verify-content.mjs. Field meanings are in content/SCHEMA.md.

export const REQ_TYPES = [
  { id: "exp", name: "Experience" },
  { id: "edu", name: "Education" },
  { id: "job", name: "Job type" },
  { id: "mode", name: "Work mode" },
  { id: "place", name: "Location" },
  { id: "notice", name: "Joining" },
  { id: "lang", name: "Languages" },
  { id: "cert", name: "Certifications" },
  { id: "other", name: "Other" }
];

export const REQS = [
  // Experience (numbers like "2 to 4 years" are read by the engine)
  { id: "fresher", type: "exp", name: "Freshers", aliases: ["fresher", "freshers", "fresh graduate", "fresh graduates", "entry level", "no experience required"] },

  // Education
  {
    id: "btech", type: "edu", name: "B.E. or B.Tech",
    aliases: ["b.tech", "btech", "b tech", "b.e.", "b.e", "bachelor of engineering", "bachelor of technology", "be/b.tech", "be/btech", "b.e/b.tech", "b.e./b.tech"],
    cased: ["BE"], context: true
  },
  { id: "mtech", type: "edu", name: "M.E. or M.Tech", aliases: ["m.tech", "mtech", "m tech", "m.e.", "master of engineering", "master of technology"] },
  { id: "bca", type: "edu", name: "BCA", aliases: ["bca", "bachelor of computer applications"] },
  { id: "mca", type: "edu", name: "MCA", aliases: ["mca", "master of computer applications"] },
  { id: "bsc", type: "edu", name: "B.Sc", aliases: ["b.sc", "b.sc.", "bsc", "b sc", "bachelor of science"] },
  { id: "msc", type: "edu", name: "M.Sc", aliases: ["m.sc", "m.sc.", "msc", "m sc", "master of science"] },
  { id: "bcom", type: "edu", name: "B.Com", aliases: ["b.com", "bcom", "b com", "bachelor of commerce"] },
  { id: "mcom", type: "edu", name: "M.Com", aliases: ["m.com", "mcom", "m com", "master of commerce"] },
  { id: "bba", type: "edu", name: "BBA or BBM", aliases: ["bba", "bbm", "bachelor of business administration"] },
  { id: "mba", type: "edu", name: "MBA or PGDM", aliases: ["mba", "pgdm", "pgdba", "master of business administration"] },
  { id: "ba", type: "edu", name: "B.A.", aliases: ["b.a.", "bachelor of arts"] },
  { id: "ma", type: "edu", name: "M.A.", aliases: ["m.a.", "master of arts"] },
  { id: "diploma", type: "edu", name: "Diploma", aliases: ["diploma", "polytechnic"] },
  { id: "iti", type: "edu", name: "ITI", aliases: ["iti"] },
  { id: "phd", type: "edu", name: "PhD", aliases: ["phd", "ph.d", "ph.d.", "doctorate"] },
  { id: "twelfth", type: "edu", name: "12th pass", aliases: ["12th pass", "12th standard", "12th grade", "hsc", "higher secondary", "plus two", "class 12"] },
  {
    id: "anygrad", type: "edu", name: "Any graduate",
    aliases: ["any graduate", "any degree", "any graduation", "graduate in any", "graduation in any", "any bachelor's degree", "any bachelors degree"]
  },
  {
    id: "bachelors", type: "edu", name: "Bachelor's degree",
    aliases: ["bachelor's degree", "bachelor’s degree", "bachelors degree", "bachelor degree", "bachelor's", "bachelors", "undergraduate degree", "ug degree", "graduation"]
  },
  {
    id: "masters", type: "edu", name: "Master's degree",
    aliases: ["master's degree", "master’s degree", "masters degree", "master degree", "postgraduate", "post graduate", "post graduation", "postgraduation", "pg degree", "any postgraduate"]
  },
  { id: "engdeg", type: "edu", name: "Engineering degree", aliases: ["engineering degree", "degree in engineering", "engineering graduate", "engineering graduates"] },
  { id: "csdeg", type: "edu", name: "Computer Science or IT", aliases: ["computer science", "cse", "cs/it", "computer engineering", "information technology"] },
  { id: "mechdeg", type: "edu", name: "Mechanical engineering", aliases: ["mechanical engineering", "mechanical engineer", "mechanical background"] },
  { id: "ecedeg", type: "edu", name: "ECE or EEE", aliases: ["ece", "eee", "electronics and communication", "electrical and electronics", "electrical engineering", "electronics engineering"] },

  // Job type
  { id: "fulltime", type: "job", name: "Full-time", aliases: ["full time", "fulltime", "permanent role", "permanent position"] },
  { id: "parttime", type: "job", name: "Part-time", aliases: ["part time", "parttime"] },
  { id: "intern", type: "job", name: "Internship", aliases: ["internship", "intern", "interns", "paid internship"] },
  {
    id: "contract", type: "job", name: "Contract",
    aliases: ["contract", "contract role", "contractual", "c2h", "contract to hire", "third party payroll"],
    not: ["smart contract", "smart contracts", "contract testing", "api contract", "api contracts", "data contract", "data contracts"]
  },
  { id: "freelance", type: "job", name: "Freelance", aliases: ["freelance", "freelancer", "freelancing", "project basis"] },

  // Work mode
  {
    id: "remote", type: "mode", name: "Remote",
    aliases: ["remote", "work from home", "wfh", "fully remote", "remote first", "remote work", "remote job"],
    not: ["remote sensing", "remote debugging", "remote server", "remote servers", "remote repository", "remote repositories", "remote branch", "remote control", "remote teams"]
  },
  {
    id: "hybrid", type: "mode", name: "Hybrid",
    aliases: ["hybrid", "hybrid work", "hybrid mode", "hybrid model"],
    not: ["hybrid app", "hybrid apps", "hybrid mobile", "hybrid cloud", "hybrid search", "hybrid rag", "hybrid vehicle", "hybrid vehicles"]
  },
  {
    id: "onsite", type: "mode", name: "On-site",
    aliases: ["onsite", "on site", "work from office", "wfo", "in office", "office based", "5 days from office", "five days from office"],
    not: ["in office hours"]
  },

  // Location
  { id: "chennai", type: "place", name: "Chennai", aliases: ["chennai"] },
  { id: "bengaluru", type: "place", name: "Bengaluru", aliases: ["bengaluru", "bangalore", "blr"] },
  { id: "hyderabad", type: "place", name: "Hyderabad", aliases: ["hyderabad", "secunderabad"] },
  { id: "mumbai", type: "place", name: "Mumbai", aliases: ["mumbai", "navi mumbai"] },
  { id: "pune", type: "place", name: "Pune", aliases: ["pune"] },
  { id: "delhi", type: "place", name: "Delhi NCR", aliases: ["delhi", "new delhi", "delhi ncr", "ncr", "noida", "greater noida", "gurugram", "gurgaon", "faridabad", "ghaziabad"] },
  { id: "kolkata", type: "place", name: "Kolkata", aliases: ["kolkata"] },
  { id: "coimbatore", type: "place", name: "Coimbatore", aliases: ["coimbatore", "kovai"] },
  { id: "madurai", type: "place", name: "Madurai", aliases: ["madurai"] },
  { id: "trichy", type: "place", name: "Trichy", aliases: ["trichy", "tiruchirappalli", "tiruchy"] },
  { id: "salem", type: "place", name: "Salem", aliases: ["salem"] },
  { id: "hosur", type: "place", name: "Hosur", aliases: ["hosur"] },
  { id: "vellore", type: "place", name: "Vellore", aliases: ["vellore"] },
  { id: "tirunelveli", type: "place", name: "Tirunelveli", aliases: ["tirunelveli"] },
  { id: "pondy", type: "place", name: "Puducherry", aliases: ["pondicherry", "puducherry"] },
  { id: "kochi", type: "place", name: "Kochi", aliases: ["kochi", "cochin", "ernakulam", "infopark"] },
  { id: "trivandrum", type: "place", name: "Thiruvananthapuram", aliases: ["trivandrum", "thiruvananthapuram", "technopark"] },
  { id: "mysuru", type: "place", name: "Mysuru", aliases: ["mysuru", "mysore"] },
  { id: "ahmedabad", type: "place", name: "Ahmedabad", aliases: ["ahmedabad", "gandhinagar"] },
  { id: "jaipur", type: "place", name: "Jaipur", aliases: ["jaipur"] },
  { id: "chandigarh", type: "place", name: "Chandigarh", aliases: ["chandigarh", "mohali"] },
  { id: "indore", type: "place", name: "Indore", aliases: ["indore"] },
  { id: "vizag", type: "place", name: "Visakhapatnam", aliases: ["visakhapatnam", "vizag"] },
  { id: "lucknow", type: "place", name: "Lucknow", aliases: ["lucknow"] },
  { id: "bhubaneswar", type: "place", name: "Bhubaneswar", aliases: ["bhubaneswar"] },
  { id: "nagpur", type: "place", name: "Nagpur", aliases: ["nagpur"] },
  { id: "tamilnadu", type: "place", name: "Tamil Nadu", aliases: ["tamil nadu", "tamilnadu"] },
  { id: "panindia", type: "place", name: "Anywhere in India", aliases: ["pan india", "anywhere in india", "multiple locations"] },

  // Joining (notice periods in days or months are read by the engine)
  {
    id: "immediate", type: "notice", name: "Immediate joiners",
    aliases: ["immediate joiner", "immediate joiners", "immediate joining", "join immediately", "joining immediately", "immediate start", "start immediately", "immediately available", "early joiners", "early joiner"]
  },

  // Languages
  { id: "english", type: "lang", name: "English", aliases: ["english"] },
  { id: "tamil", type: "lang", name: "Tamil", aliases: ["tamil"] },
  { id: "hindi", type: "lang", name: "Hindi", aliases: ["hindi"] },
  { id: "telugu", type: "lang", name: "Telugu", aliases: ["telugu"] },
  { id: "kannada", type: "lang", name: "Kannada", aliases: ["kannada"] },
  { id: "malayalam", type: "lang", name: "Malayalam", aliases: ["malayalam"] },
  { id: "marathi", type: "lang", name: "Marathi", aliases: ["marathi"] },
  { id: "bengali", type: "lang", name: "Bengali", aliases: ["bengali", "bangla"] },
  { id: "gujarati", type: "lang", name: "Gujarati", aliases: ["gujarati"] },
  { id: "punjabi", type: "lang", name: "Punjabi", aliases: ["punjabi"] },
  { id: "urdu", type: "lang", name: "Urdu", aliases: ["urdu"] },
  { id: "odia", type: "lang", name: "Odia", aliases: ["odia", "oriya"] },
  { id: "french", type: "lang", name: "French", aliases: ["french"] },
  { id: "german", type: "lang", name: "German", aliases: ["german"] },
  { id: "spanish", type: "lang", name: "Spanish", aliases: ["spanish"] },
  { id: "japanese", type: "lang", name: "Japanese", aliases: ["japanese"] },
  { id: "arabic", type: "lang", name: "Arabic", aliases: ["arabic"] },
  { id: "mandarin", type: "lang", name: "Mandarin", aliases: ["mandarin", "chinese language"] },
  { id: "korean", type: "lang", name: "Korean", aliases: ["korean"] },

  // Certifications and professional qualifications
  {
    id: "ca", type: "cert", name: "CA",
    aliases: ["chartered accountant", "ca inter", "ca intermediate", "ca final", "semi qualified ca", "qualified ca", "ca/cma"],
    cased: ["CA"], context: true
  },
  { id: "cma", type: "cert", name: "CMA", aliases: ["cma", "icwa", "cost accountant"] },
  { id: "cs", type: "cert", name: "Company Secretary", aliases: ["company secretary", "cs executive", "cs professional", "acs"] },
  { id: "acca", type: "cert", name: "ACCA or CFA", aliases: ["acca", "cfa", "chartered financial analyst"] },
  {
    id: "cloudcert", type: "cert", name: "Cloud certification",
    aliases: ["aws certified", "aws certification", "aws certifications", "azure certified", "azure certification", "az 900", "az 104", "az 204", "google cloud certified", "google cloud certification", "gcp certification"]
  },
  { id: "pmp", type: "cert", name: "PMP or PRINCE2", aliases: ["pmp", "prince2", "capm"] },
  { id: "scrumcert", type: "cert", name: "Scrum certification", aliases: ["csm", "certified scrum master", "psm", "scrum master certification", "safe agilist"] },
  {
    id: "sixsigmacert", type: "cert", name: "Six Sigma certification",
    aliases: ["six sigma green belt", "six sigma black belt", "lean six sigma green belt", "green belt certified", "black belt certified", "six sigma certification", "six sigma certified"]
  },
  { id: "itcert", type: "cert", name: "IT and security certification", aliases: ["ccna", "ccnp", "comptia", "ceh", "cissp", "oscp", "cisa", "cism"] },
  { id: "itil", type: "cert", name: "ITIL", aliases: ["itil", "itil v4", "itil foundation"] },
  { id: "javacert", type: "cert", name: "Oracle or Java certification", aliases: ["ocjp", "oracle certified", "java certification"] },
  { id: "sfcert", type: "cert", name: "Salesforce certification", aliases: ["salesforce certified", "salesforce certification", "salesforce administrator"] },
  {
    id: "mktcert", type: "cert", name: "Google or Meta ads certification",
    aliases: ["google ads certification", "google ads certified", "google analytics certification", "google analytics certified", "gaiq", "meta blueprint", "meta certified", "hubspot certification"]
  },
  { id: "langtest", type: "cert", name: "IELTS or TOEFL", aliases: ["ielts", "toefl"] },

  // Other
  { id: "bike", type: "other", name: "Two-wheeler and licence", aliases: ["two wheeler", "2 wheeler", "own vehicle", "own bike", "driving licence", "driving license", "valid licence", "valid license"] },
  { id: "laptop", type: "other", name: "Own laptop", aliases: ["own laptop", "personal laptop", "laptop with internet", "bring your own laptop", "byod"] },
  { id: "travel", type: "other", name: "Willing to travel", aliases: ["willing to travel", "travel required", "extensive travel", "frequent travel", "field work", "open to travel", "ready to travel"] },
  { id: "relocate", type: "other", name: "Willing to relocate", aliases: ["willing to relocate", "ready to relocate", "open to relocation", "open to relocate", "relocation"] },
  { id: "bond", type: "other", name: "Service agreement", aliases: ["service agreement", "bond", "service bond", "lock in period", "training bond"] },
  { id: "nightshift", type: "other", name: "Night or US shift", aliases: ["night shift", "night shifts", "us shift", "us shifts", "uk shift", "graveyard shift"] },
  { id: "rotshift", type: "other", name: "Rotational shifts", aliases: ["rotational shift", "rotational shifts", "rotating shifts", "rotational"] },
  { id: "dayshift", type: "other", name: "Day shift", aliases: ["day shift", "day shifts", "general shift"] },
  { id: "weekend", type: "other", name: "Weekend or 6-day work", aliases: ["weekend working", "work on weekends", "saturday working", "6 days working", "six days working", "6 day work week", "alternate saturdays"] }
];
