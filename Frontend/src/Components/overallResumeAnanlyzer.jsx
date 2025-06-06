import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Gauge } from "@mui/x-charts"; // Correct import from MUI X Charts
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function OverallResumeAnalyzer() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  // User data from localStorage
  const userFirstName = localStorage.getItem("userFirstName") || "John";
  const userLastName = localStorage.getItem("userLastName") || "Doe";
  const userEmailAddress =
    localStorage.getItem("userEmailAddress") || "john.doe@example.com";

  // Handle logout
  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userEmailAddress");
    navigate("/");
  };

  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!file) {
      toast.warn("Please upload a file!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        className: Style.customToast,
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:3000/analyze-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(res.data);
      setShowPopup(true);
    } catch (err) {
      toast.error("An error occurred in getting the response!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        className: Style.customToast,
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreDescription = (score) => {
    if (score < 30) {
      return "Your resume score is poor. Consider improving your resume.";
    } else if (score >= 30 && score < 75) {
      return "Your resume score is good. Keep improving!";
    } else if (score >= 75) {
      return "Your resume score is excellent! Great job!";
    }
    return "";
  };

  function navigateToAiHelp() {
    navigate("/aiHelp");
  }


  const generatePDF = () => {
  // Select the content to be included in the PDF
  const element = document.querySelector(`.${Style.OverAllResumepopupContent}`);

  if (!element) {
    console.error("Element for PDF generation not found.");
    return;
  }

  // Convert the content to a canvas
  html2canvas(element).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add the canvas image to the PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save("Resume_Report.pdf");
  });
};



  return (
    <>
      <div className={Style.mainDiv}>
        <div className={Style.mainPageMainDiv}>
          {
            /* Navigation Bar */
            <div className={Style.navBarMainPage}>
              <div className={Style.logoNavBarMainPage}>
                <h1>Resumely</h1>
              </div>

              <div className={Style.linkNavBarMainPage}>
                <Link className={Style.linkElementNavBar} to="/mainPage">
                  Home
                </Link>
                <Link className={Style.linkElementNavBar}>Resume</Link>
                <Link className={Style.linkElementNavBar}>Cover Letter</Link>
              </div>

              <div className={Style.ProfileBtnNavBarMainPage}>
                <button className={Style.profileBtn} onClick={navigateToAiHelp}>
                  Ask AI
                </button>

                <button
                  className={Style.profileBtn}
                  onClick={() => setShowUserInfo(!showUserInfo)}
                >
                  Profile
                </button>
                {showUserInfo && (
                  <div className={Style.userInfoDiv}>
                    <p className={Style.userInfoDivPara1}>
                      {`${userFirstName} ${userLastName}`}
                    </p>
                    <p className={Style.userInfoDivPara2}>{userEmailAddress}</p>
                    <button className={Style.logoutBtn} onClick={logoutUser}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          }

          <div className={Style.mainDivContent}>
            {/* heading */}
            <h1 className={Style.heading}>AI Resume Analyzer</h1>
            {/* Para */}
            <p className={Style.description}>
              Unlock the potential of your resume with our AI-powered Resume
              Analyzer. This cutting-edge tool leverages natural language
              processing to extract key details, score your resume, and provide
              actionable suggestions for improvement.
            </p>
            {/* Features */}
            <div className={Style.features}>
              <div className={Style.featureItem}>
                <p>
                  Extracts key details like name, email, skills, and experience.
                </p>
              </div>
              <div className={Style.featureItem}>
                <p>Scores your resume based on essential criteria.</p>
              </div>
              <div className={Style.featureItem}>
                <p>Provides personalized suggestions for improvement.</p>
              </div>
            </div>
            <div className={Style.uploadSection}>
              <form onSubmit={handleSubmit}>
                <label htmlFor="resume" className={Style.uploadLabel}>
                  Upload your resume (PDF only)
                </label>
                <input
                  type="file"
                  id="resume"
                  accept="application/pdf"
                  className={Style.resumeInput}
                  onChange={handleFileChange}
                />
                <button type="submit" className={Style.analyzeBtn}>
                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    </Box>
                  ) : (
                    "Analyze Resume"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        {showPopup && response && (
          <div className={Style.OverAllResumePopupOverlay}>
            <div className={Style.OverAllResumepopupContent}>
              <h2>Analysis</h2>
              <div className={Style.gaugeDiv}>
                <Gauge
                  value={response.score}
                  min={0}
                  max={100}
                  startAngle={-90}
                  endAngle={90}
                  className={Style.customGauge}
                />
              </div>
              <p className={Style.userNameAndScorePara}>
                {response.user_name
                  ? `${response.user_name}, your resume has scored ${
                      response.score
                    }. ${getScoreDescription(response.score)}`
                  : `Your resume has scored ${
                      response.score
                    }. ${getScoreDescription(response.score)}`}
              </p>

              <div className={Style.suggestionDiv}>
                <p className={Style.suggestionPara}>
                  <strong>Suggestions</strong>
                </p>
                <p>{response.suggestions.join(", ")}</p>
              </div>

              <div className={Style.suggestionDiv}>
                <p className={Style.suggestionPara}>
                  <strong>Recommended Skills</strong>
                </p>
                <p>{response.recommended_skills.join(", ")}</p>
              </div>

              <div className={Style.suggestionDiv}>
                <p className={Style.suggestionPara}>
                  <strong>Tips</strong>
                </p>

                {response.resume_tips.map((tip, index) => (
                  <p key={index}>{tip}</p>
                ))}
              </div>

              <button className={Style.downloadPDFBtn} onClick={generatePDF}>
                Download PDF Report
              </button>

              <button
                className={Style.closeBtn}
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
}

export default OverallResumeAnalyzer;
