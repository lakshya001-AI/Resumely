import React, { useState } from 'react';
import axios from 'axios';
import { Gauge } from '@mui/x-charts'; // Correct import from MUI X Charts

function OverallResumeAnalyzer1() {

    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please upload a file.");
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const res = await axios.post('http://127.0.0.1:3000/analyze-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponse(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred.");
        }
    };

    const getScoreDescription = (score) => {
        if (score < 30) {
            return 'Your resume score is poor. Consider improving your resume.';
        } else if (score >= 30 && score < 75) {
            return 'Your resume score is good. Keep improving!';
        } else if (score >= 75) {
            return 'Your resume score is excellent! Great job!';
        }
        return '';
    };

    return (
        <>
            <div>
                <h1>Resume Analyzer</h1>
                <form onSubmit={handleSubmit}>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    <button type="submit">Analyze Resume</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {response && (
                    <div>
                        <h2>Analysis</h2>
                        <p><strong>Name:</strong> {response.user_name}</p>
                        <p><strong>Score:</strong> {response.score}</p>
                        <p>{getScoreDescription(response.score)}</p>
                        <p><strong>Suggestions:</strong> {response.suggestions.join(', ')}</p>
                        <p><strong>Recommended Skills:</strong> {response.recommended_skills.join(', ')}</p>
                        <h3>Tips</h3>
                        <ul>
                            {response.resume_tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>

                        {/* Material UI Gauge */}
                        <div style={{ width: '200px', height: '200px', margin: 'auto' }}>
                            <Gauge
                                value={response.score}
                                min={0}
                                max={100}
                                startAngle={-90}
                                endAngle={90}
                                color={response.score < 30 ? 'red' : response.score < 75 ? 'orange' : 'green'}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default OverallResumeAnalyzer1;
