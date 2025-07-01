import React from 'react';
import { motion } from 'framer-motion';
import emailjs from 'emailjs-com';
import { SendHorizonal, Send } from 'lucide-react';

const topCandidates = [
  {
    name: 'Dharun Kumar',
    email: 'nithishbg137@gmail.com',
    role: 'Frontend Developer',
    match: '100%',
    skills: 'React, Tailwind CSS, Framer Motion',
  },
  {
    name: 'Arjun S',
    email: 'arjun@example.com',
    role: 'Python Developer',
    match: '100%',
    skills: 'Python, Flask, REST APIs',
  },
  {
    name: 'Priya M',
    email: 'priya@example.com',
    role: 'React Native Engineer',
    match: '100%',
    skills: 'React Native, Expo, Mobile UX',
  },
];

const sendMail = (candidate) => {
  const templateParams = {
    to_name: candidate.name,
    to_email: candidate.email,
    position: candidate.role,
    company: 'TechNova Solutions',
    skills: candidate.skills,
    hr_name: 'ABCDEFG',
    hr_contact: '1234567890',
  };

  return emailjs.send(
    'service_6o6ljlg',
    'template_gdm7rsq',
    templateParams,
    'k9brA3kH9BU6FsQZb'
  );
};

const sendAllMails = async () => {
  if (!window.confirm("Are you sure you want to send emails to all top-notch candidates?")) return;

  for (const candidate of topCandidates) {
    try {
      await sendMail(candidate);
      console.log(`✅ Email sent to ${candidate.name}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${candidate.name}:`, error);
      alert(`Failed to send email to ${candidate.name}`);
    }
  }

  alert('✅ All emails have been processed!');
};

const TopNotchPage = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 text-gray-900 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-center mb-6">
        🏆 Top Notch Candidates (100% Match)
      </h1>

      {/* Send All Button */}
      <div className="text-center mb-10">
        <button
          onClick={sendAllMails}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full transition shadow-lg"
        >
          <Send size={20} /> Send All Mails
        </button>
      </div>

      {/* Candidate Cards */}
      <div className="max-w-4xl mx-auto grid gap-6">
        {topCandidates.map((candidate, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-xl rounded-xl p-6 flex justify-between items-center border-l-4 border-blue-600"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div>
              <h2 className="text-xl font-semibold">{candidate.name}</h2>
              <p className="text-sm text-gray-600">{candidate.role}</p>
              <p className="text-sm text-green-600 font-medium">{candidate.match} Match</p>
              <p className="text-sm text-gray-500">{candidate.email}</p>
              <p className="text-sm text-gray-500 mt-1 italic">Skills: {candidate.skills}</p>
            </div>

            <button
              onClick={() =>
                sendMail(candidate)
                  .then(() => alert(`✅ Email sent to ${candidate.name}`))
                  .catch((err) => alert(`❌ Failed to send to ${candidate.name}`))
              }
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition shadow-md"
            >
              <SendHorizonal size={18} /> Send Mail
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopNotchPage;
