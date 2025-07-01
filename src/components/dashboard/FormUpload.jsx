import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Loader2, SparklesIcon, UploadCloud } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormUpload = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            toast.error('Only PDF files allowed');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const byteArray = new Uint8Array(reader.result);
            const text = new TextDecoder().decode(byteArray);
            const pages = (text.match(/\/Type\s*\/Page\b/g) || []).length;

            if (pages !== 1) {
                toast.error('Upload only 1-page PDF');
                setFile(null);
                setPreviewUrl('');
            } else {
                setFile(selectedFile);
                setPreviewUrl(URL.createObjectURL(selectedFile));
                toast.success('PDF uploaded!');
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleSubmit = async () => {
        if (!file || !description.trim()) {
            toast.warn('Upload resume and fill description');
            return;
        }

        setLoading(true);

        try {
            // 1. Upload the file to /upload
            const formData = new FormData();
            formData.append('pdf', file);

            const uploadRes = await axios.post('http://localhost:3000/api/pdf/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const { pdf } = uploadRes.data;

            // 2. Send job description + filename to /check-eligibility
            const checkRes = await axios.post('http://localhost:3000/api/pdf/check-eligibility', {
                pdf,
                jobDescription: description,
            });

            toast.success(checkRes.data.message || 'Resume analyzed!');
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong during upload or analysis.');
        } finally {
            setLoading(false);
            setFile(null);
            setPreviewUrl('');
            setDescription('');
            fileRef.current.value = '';
        }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto p-8 mt-12 bg-white rounded-xl shadow-lg select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Resume Analyzer</h2>

            <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer text-center bg-gray-50 hover:bg-gray-100 transition"
            >
                {file ? (
                    <p className="text-indigo-600 font-semibold">{file.name}</p>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        <UploadCloud className="w-8 h-8" />
                        <p>Click to upload 1-page PDF resume</p>
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

            {file && (
                <>
                    <textarea
                        className="w-full mt-6 p-4 border border-gray-300 rounded-md resize-none"
                        placeholder="Enter the job description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={5}
                    />

                    <div className="mt-4 text-center">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: description.trim() && !loading ? 1.03 : 1 }}
                            disabled={loading || !description.trim()}
                            onClick={handleSubmit}
                            className={`px-6 py-2 rounded-md text-white font-semibold transition-all duration-300
                            ${description.trim() && !loading
                                    ? 'bg-gray-900 hover:bg-gray-700'
                                    : 'bg-gray-400 cursor-not-allowed'}
                            ${loading ? 'animate-pulse' : ''}
                            flex items-center justify-center gap-2 mx-auto`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-5 h-5" />
                                    <span>Analyze</span>
                                </>
                            )}
                        </motion.button>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium mb-2">Resume Preview</h3>
                        <embed
                            src={previewUrl}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                            className="rounded-md border"
                        />
                    </div>
                </>
            )}

            <ToastContainer position="bottom-right" />
        </motion.div>
    );
};

export default FormUpload;
