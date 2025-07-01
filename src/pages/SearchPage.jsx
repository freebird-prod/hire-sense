import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader } from 'lucide-react';

const jobOpenings = [
  {
    title: "Senior Full Stack Developer",
    company: "TechVision Solutions",
    salary: "₹12,00,000 - ₹15,00,000",
    location: "Remote (India-based)",
    requirements: "5+ years experience with React, Node.js, and AWS"
  },
  {
    title: "Cloud Infrastructure Architect",
    company: "Nexus Systems",
    salary: "₹20,00,000 - ₹25,00,000",
    location: "Bangalore, Karnataka (Hybrid)",
    requirements: "Expert knowledge in Azure, Kubernetes, and CI/CD pipelines"
  },
  {
    title: "Cybersecurity Analyst",
    company: "SecureNet Technologies",
    salary: "₹10,00,000 - ₹13,00,000",
    location: "Pune, Maharashtra",
    requirements: "CISSP certification, 3+ years in threat detection"
  },
  {
    title: "Machine Learning Engineer",
    company: "Cognitive AI Labs",
    salary: "₹15,00,000 - ₹20,00,000",
    location: "Hyderabad, Telangana",
    requirements: "Experience with TensorFlow, PyTorch, and NLP"
  },
  {
    title: "DevOps Engineer",
    company: "InfraCore Solutions",
    salary: "₹11,00,000 - ₹14,00,000",
    location: "Remote",
    requirements: "Experience with Docker, Terraform, and monitoring tools"
  },
  {
    title: "Mobile App Developer (iOS)",
    company: "AppSphere Inc.",
    salary: "₹10,00,000 - ₹13,00,000",
    location: "Mumbai, Maharashtra",
    requirements: "Swift expertise, 3+ years iOS development"
  },
  {
    title: "Data Scientist",
    company: "DataCraft Analytics",
    salary: "₹14,00,000 - ₹18,00,000",
    location: "Bangalore, Karnataka (Hybrid)",
    requirements: "Strong statistics background, Python, and visualization tools"
  },
  {
    title: "UI/UX Designer",
    company: "Interface Innovations",
    salary: "₹8,00,000 - ₹10,00,000",
    location: "Chennai, Tamil Nadu",
    requirements: "Portfolio showcasing user-centered design, Figma proficiency"
  },
  {
    title: "Backend Engineer (Python)",
    company: "ByteLogic Systems",
    salary: "₹11,00,000 - ₹14,00,000",
    location: "Kochi, Kerala",
    requirements: "Django/Flask expertise, SQL and NoSQL databases"
  },
  {
    title: "IT Project Manager",
    company: "ProjectPro Technologies",
    salary: "₹14,00,000 - ₹18,00,000",
    location: "New Delhi, Delhi",
    requirements: "PMP certification, 5+ years managing tech projects"
  },
  {
    title: "Network Security Engineer",
    company: "Guardian Networks",
    salary: "₹13,00,000 - ₹16,00,000",
    location: "Gurgaon, Haryana",
    requirements: "CCNP Security, firewall configuration, VPN implementation"
  },
  {
    title: "Blockchain Developer",
    company: "ChainNova Technologies",
    salary: "₹15,00,000 - ₹20,00,000",
    location: "Ahmedabad, Gujarat",
    requirements: "Smart contract development, Solidity, Web3.js"
  },
  {
    title: "QA Automation Engineer",
    company: "Quality Assurance Systems",
    salary: "₹9,00,000 - ₹11,00,000",
    location: "Noida, Uttar Pradesh",
    requirements: "Selenium, TestNG, CI/CD integration"
  },
  {
    title: "AR/VR Developer",
    company: "Immersive Futures",
    salary: "₹10,00,000 - ₹13,00,000",
    location: "Chandigarh",
    requirements: "Unity3D, C#, 3D modeling experience"
  },
  {
    title: "Technical Support Lead",
    company: "SupportEdge Solutions",
    salary: "₹7,00,000 - ₹9,00,000",
    location: "Jaipur, Rajasthan",
    requirements: "3+ years in IT support, ticketing systems expertise, team management"
  },

  // Additional 35 job entries to make a total of 50
  {
    title: "Frontend Developer (React)",
    company: "PixelTech Pvt. Ltd.",
    salary: "₹9,00,000 - ₹12,00,000",
    location: "Bangalore, Karnataka",
    requirements: "2+ years experience with React, Tailwind CSS"
  },
  {
    title: "Junior Python Developer",
    company: "SoftBridge",
    salary: "₹5,00,000 - ₹7,00,000",
    location: "Hyderabad, Telangana",
    requirements: "Python basics, Django, REST APIs"
  },
  {
    title: "Product Manager - SaaS",
    company: "CloudManage",
    salary: "₹20,00,000 - ₹26,00,000",
    location: "Mumbai, Maharashtra",
    requirements: "SaaS experience, agile product lifecycle"
  },
  {
    title: "Angular Developer",
    company: "WebStack Technologies",
    salary: "₹8,50,000 - ₹10,50,000",
    location: "Pune, Maharashtra",
    requirements: "Angular 13+, RxJS, TypeScript"
  },
  {
    title: "Site Reliability Engineer",
    company: "ReliGuard Systems",
    salary: "₹12,00,000 - ₹16,00,000",
    location: "Chennai, Tamil Nadu",
    requirements: "Monitoring, logging, incident response"
  },
  {
    title: "Business Analyst",
    company: "VisionIT",
    salary: "₹9,00,000 - ₹12,00,000",
    location: "New Delhi, Delhi",
    requirements: "UML, Agile, requirement gathering"
  },
  {
    title: "IT Support Specialist",
    company: "DeskFix",
    salary: "₹4,50,000 - ₹6,00,000",
    location: "Nagpur, Maharashtra",
    requirements: "Helpdesk tools, troubleshooting, customer service"
  },
  {
    title: "Junior Web Developer",
    company: "BrightCode",
    salary: "₹3,50,000 - ₹5,00,000",
    location: "Kolkata, West Bengal",
    requirements: "HTML, CSS, JavaScript basics"
  },
  {
    title: "AI Research Intern",
    company: "NeuroByte Labs",
    salary: "₹15,000 - ₹25,000 (stipend)",
    location: "Remote",
    requirements: "Ongoing M.Tech, basic ML/AI knowledge"
  },
  {
    title: "PHP Developer",
    company: "CodeCraft",
    salary: "₹6,00,000 - ₹8,00,000",
    location: "Coimbatore, Tamil Nadu",
    requirements: "Laravel, MySQL, JavaScript"
  },
  {
    title: "Cloud DevOps Intern",
    company: "SkyShift",
    salary: "₹20,000 - ₹30,000 (stipend)",
    location: "Remote",
    requirements: "AWS/GCP basics, Bash scripting"
  },
  {
    title: "Flutter Developer",
    company: "Mobiquity Solutions",
    salary: "₹8,00,000 - ₹10,00,000",
    location: "Indore, Madhya Pradesh",
    requirements: "Flutter, Dart, Firebase"
  },
  {
    title: "CRM Developer (Salesforce)",
    company: "CRM360 India",
    salary: "₹11,00,000 - ₹14,00,000",
    location: "Bangalore, Karnataka",
    requirements: "Salesforce Apex, Visualforce"
  },
  {
    title: "Game Developer (Unity)",
    company: "PlayVerse Studios",
    salary: "₹9,00,000 - ₹12,00,000",
    location: "Hyderabad, Telangana",
    requirements: "Unity3D, C#, mobile optimization"
  },
  {
    title: "System Administrator",
    company: "SysAdminPro",
    salary: "₹6,00,000 - ₹8,50,000",
    location: "Lucknow, Uttar Pradesh",
    requirements: "Linux admin, shell scripting"
  },
  {
    title: "ETL Developer",
    company: "DataSync",
    salary: "₹10,00,000 - ₹13,00,000",
    location: "Gurgaon, Haryana",
    requirements: "Informatica, SQL, data pipelines"
  },
  {
    title: "Technical Writer",
    company: "WriteTech",
    salary: "₹6,00,000 - ₹8,00,000",
    location: "Remote",
    requirements: "Documentation, Markdown, Git"
  },
  {
    title: "AI Chatbot Developer",
    company: "BotForge India",
    salary: "₹11,00,000 - ₹14,00,000",
    location: "Bangalore, Karnataka",
    requirements: "Rasa, Dialogflow, Node.js"
  },
  {
    title: "Penetration Tester",
    company: "HackSecure",
    salary: "₹12,00,000 - ₹16,00,000",
    location: "Mumbai, Maharashtra",
    requirements: "Burp Suite, Kali Linux, OSCP"
  },
  {
    title: "Software Engineer Intern",
    company: "TechBridge",
    salary: "₹10,000 - ₹20,000 (stipend)",
    location: "Remote",
    requirements: "Basic coding skills, willingness to learn"
  },
  {
    title: "Java Developer",
    company: "CoreLogic Pvt. Ltd.",
    salary: "₹9,00,000 - ₹12,00,000",
    location: "Chennai, Tamil Nadu",
    requirements: "Java, Spring Boot, MySQL"
  },
  {
    title: "No-Code Developer",
    company: "ZapBuild",
    salary: "₹7,00,000 - ₹9,00,000",
    location: "Mohali, Punjab",
    requirements: "Bubble.io, Webflow, Zapier"
  },
  {
    title: "WordPress Developer",
    company: "SiteWorx",
    salary: "₹4,50,000 - ₹6,50,000",
    location: "Trivandrum, Kerala",
    requirements: "Elementor, WooCommerce, PHP"
  },
  {
    title: "Tech Support Engineer (L1)",
    company: "FixIT Services",
    salary: "₹3,00,000 - ₹4,00,000",
    location: "Surat, Gujarat",
    requirements: "Basic networking, system troubleshooting"
  },
  {
    title: "Big Data Engineer",
    company: "DataWave Analytics",
    salary: "₹13,00,000 - ₹17,00,000",
    location: "Bangalore, Karnataka",
    requirements: "Hadoop, Spark, Hive, Kafka"
  }
];

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const filtered = jobOpenings.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase()) ||
        job.requirements.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 600);
  };

  const handleInputChange = (value) => {
    setQuery(value);
    const matched = jobOpenings
      .filter(job =>
        job.title.toLowerCase().includes(value.toLowerCase())
      )
      .map(job => job.title)
      .slice(0, 5);
    setSuggestions(value ? matched : []);
  };

  const selectSuggestion = (title) => {
    setQuery(title);
    setSuggestions([]);
  };

  return (
    <motion.div
      className="min-h-screen bg-white text-gray-900 p-6 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-10 mt-8 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🔍 Discover Trending IT Jobs
      </motion.h1>

      <div className="relative w-full max-w-3xl">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-full shadow-lg px-6 py-4"
        >
          <Search className="text-gray-600 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Search by role, company, skills..."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full text-gray-900 placeholder-gray-500 text-base outline-none bg-transparent"
          />
          <button
            type="submit"
            className="ml-4 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
          >
            Search
          </button>
        </form>

        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white text-gray-900 shadow-xl rounded-xl mt-2 w-full">
            {suggestions.map((sug, index) => (
              <li
                key={index}
                onClick={() => selectSuggestion(sug)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-lg transition"
              >
                {sug}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-12 w-full max-w-3xl">
        {loading ? (
          <div className="flex justify-center mt-10 animate-spin text-gray-900">
            <Loader className="w-6 h-6" />
          </div>
        ) : (
          <AnimatePresence>
            {results.length > 0 ? (
              results.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white text-gray-900 rounded-xl p-6 mb-5 shadow hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-sm font-medium text-gray-700 mb-1">{job.company}</p>
                  <p className="text-sm">💰 {job.salary}</p>
                  <p className="text-sm">📍 {job.location}</p>
                  <p className="text-sm mt-2 text-gray-700">📝 <span className="font-medium">{job.requirements}</span></p>
                </motion.div>
              ))
            ) : query && (
              <motion.p
                className="text-center text-gray-600 mt-10 text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No matching jobs found. Try a different keyword.
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default SearchPage;
