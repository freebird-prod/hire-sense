import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, UploadCloud, BrainCircuit, Sparkles } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Input } from '../ui/input';

const FormUpload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [skills, setSkills] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const fileRef = useRef();

  useEffect(() => {
    const savedResult = localStorage.getItem('gemini_analysis_result');
    if (savedResult) {
      setAnalysisResult(JSON.parse(savedResult));
    }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected || selected.type !== 'application/pdf') {
      toast.error('Only PDF files allowed');
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setSkills([]);
    setAnalysisResult(null);
  };

  const handleExtractSkills = async () => {
    if (!file) return toast.error('Upload a PDF first.');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdf_file', file);

      const res = await axios.post(import.meta.env.VITE_FLASK_URL + '/extract_skills', formData);
      const data = res.data;

      if (!data.success) {
        throw new Error(data.error || 'Extraction failed');
      }

      const { name, email, skills } = data;

      // Save to localStorage
      const candidateData = JSON.parse(localStorage.getItem('candidateData') || '[]');
      const updatedData = [
        ...candidateData,
        {
          name,
          email,
          skills,
          match: 0, // you can update match after Gemini AI analysis
          role: ''  // optional: fill after analysis
        }
      ];
      localStorage.setItem('candidateData', JSON.stringify(updatedData));

      setSkills(skills);
      toast.success(`Extracted ${skills.length} skill(s) for ${name || 'Unnamed Candidate'}.`);
    } catch (e) {
      console.error(e);
      toast.error('Skill extraction failed.');
    } finally {
      setLoading(false);
    }
  };


  const handleAnalyzeWithGemini = async () => {
    if (!skills.length) {
      toast.error('No skills found. Extract them first.');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please provide a job description.');
      return;
    }

    setAnalyzing(true);

    let rawText = '';

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash'
      });

      const prompt = `
You are a resume screening AI.

Candidate's extracted skills:
${skills.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Job Description:
${jobDescription}

Analyze how well the skills match the job description.

Respond ONLY in the following JSON format:
{
  "accuracy_score": number (0-100),
  "recommended_jobs": ["string", "string", "string"],
  "explanation": "short explanation"
}
`;

      const result = await model.generateContent(prompt);
      rawText = result.response.text().trim();

      console.log('Gemini Raw Output:', rawText);

      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^json/, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      if (
        typeof parsed.accuracy_score !== 'number' ||
        !Array.isArray(parsed.recommended_jobs) ||
        typeof parsed.explanation !== 'string'
      ) {
        throw new Error('Invalid format received from Gemini.');
      }

      setAnalysisResult(parsed);
      localStorage.setItem('gemini_analysis_result', JSON.stringify(parsed)); // ✅ Save to localStorage
      toast.success('Analysis complete!');
    } catch (err) {
      console.error('Hire Sense AI Analysis Error:', err);
      console.error('Raw Hire Sense AI Output:', rawText);
      toast.error('Hire Sense AI analysis failed. Check the console for details.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <motion.div className="max-w-5xl mx-auto p-8 mt-12 bg-white rounded-xl shadow-lg">
      <ToastContainer position="bottom-right" />
      <h2 className="text-3xl font-bold text-center mb-6">Hire Sense AI Resume Analyzer</h2>

      {/* Upload Area */}
      <div
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer text-center bg-gray-50 hover:bg-gray-100"
      >
        {file ? (
          <p className="text-indigo-600 font-semibold">{file.name}</p>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <UploadCloud className="w-8 h-8" />
            <p>Click to upload PDF resume</p>
          </div>
        )}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          ref={fileRef}
          className="hidden"
        />
      </div>

      {/* Buttons */}
      {file && (
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={handleExtractSkills}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-md text-white font-semibold flex items-center gap-2 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'
              }`}
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Extracting...' : 'Extract Skills'}
          </motion.button>

          <motion.button
            onClick={handleAnalyzeWithGemini}
            disabled={analyzing || !skills?.length}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-md text-white font-semibold flex items-center gap-2 ${analyzing ? 'bg-green-400' : 'bg-green-600 hover:bg-green-500'
              }`}
          >
            {analyzing ? <Loader2 className="animate-spin w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
            {analyzing ? 'Analyzing...' : 'Analyze Skills'}
          </motion.button>
        </div>
      )}

      {/* Job Description Input */}
      <div className="mt-6">
        <label className="block font-semibold mb-2 text-gray-700">Enter Job Description:</label>
        <Input
          className="w-full p-3 border border-gray-300 rounded-md text-sm"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Extracted Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hire Sense AI Result */}
      {analysisResult && (
        <div className="mt-8 bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Hire Sense AI Analysis</h3>
          <p><strong>Match Score:</strong> {analysisResult.accuracy_score}%</p>
          <p className="mt-1"><strong>Explanation:</strong> {analysisResult.explanation}</p>
          <p className="mt-2"><strong>Recommended Roles:</strong></p>
          <ul className="list-disc ml-6">
            {analysisResult.recommended_jobs?.map((role, idx) => (
              <li key={idx}>{role}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Resume Preview */}
      {previewUrl && (
        <div className="mt-10">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Resume Preview</h3>
          <iframe src={previewUrl + '#toolbar=0'} width="100%" height="400px" className="rounded border" />
        </div>
      )}
    </motion.div>
  );
};

export default FormUpload;
