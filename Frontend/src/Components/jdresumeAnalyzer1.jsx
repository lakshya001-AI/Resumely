import React, { useState } from "react";

function JDresumeAnalyzer1() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("Please select a resume file.");
      return;
    }
    if (file && file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setResumeFile(file);
    setError(""); // Clear previous errors
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
    setError(""); // Clear previous errors
  };

  const handleAnalyzeResume = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload a resume and enter a valid job description.");
      return;
    }

    // Create FormData to send resume and job description
    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_title", jobDescription.trim()); // Ensure no empty job descriptions

    try {
      setLoading(true);
      setError(""); // Clear previous errors

      const response = await fetch("http://localhost:8000/analyze-resume-with-title", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Failed to analyze the resume. Server responded with: ${errorText}`);
        return;
      }

      const result = await response.json();

      // Check if the backend returns the necessary fields
      if (result && result.match_score !== undefined && result.suggestions !== undefined) {
        setAnalysisResult(result);
      } else {
        setError("Invalid response from the server. Please try again.");
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setError(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Resume Analyzer</h1>
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
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleAnalyzeResume}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 focus:outline-none flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 100 12z"
                ></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </div>

      {analysisResult && (
        <div className="mt-6 w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Analysis Result</h2>
          <div className="space-y-4">
            <div>
              <strong>Name:</strong> {analysisResult.parsed_resume.name || "N/A"}
            </div>
            <div>
              <strong>Match Score:</strong> {analysisResult.match_score ? `${analysisResult.match_score}%` : "N/A"}
            </div>
            <div>
              <strong>Suggestions:</strong>
              <ul className="list-disc list-inside">
                {analysisResult.suggestions && analysisResult.suggestions.length > 0
                  ? analysisResult.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))
                  : "No suggestions available."}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JDresumeAnalyzer1;
