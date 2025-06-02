import React, { useState } from "react";

function JDresumeAnalyzer() {
      const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

   const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };


   const handleAnalyzeResume = async () => {
    if (!resumeFile || !jobDescription) {
      alert("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setAnalysisResult(result);
      setLoading(false);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setLoading(false);
    }
  };


  return <>

  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">AI Resume Analyzer</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload your Resume (PDF):
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Job Description:
          </label>
          <textarea
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            rows="5"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2 bg-gray-50 focus:outline-none"
            placeholder="Paste the job description here..."
          />
        </div>
        <button
          onClick={handleAnalyzeResume}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {analysisResult && (
        <div className="mt-6 w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
          <pre className="text-sm bg-gray-100 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        </div>
      )}
    </div>


  </>
}

export default JDresumeAnalyzer