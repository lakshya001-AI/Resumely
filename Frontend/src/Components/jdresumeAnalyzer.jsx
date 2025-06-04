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

function JDResumeAnalyzer() {
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
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
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
    formData.append("job_title", jobDescription.trim()); // Ensure no empty job descriptions

    try {
      const res = await axios.post(
        "http://localhost:8000/analyze-resume-with-title",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);

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
                <Link className={Style.linkElementNavBar}>Pricing</Link>
              </div>

              <div className={Style.ProfileBtnNavBarMainPage}>
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
            <h1 className={Style.heading}>SMART RESUME OPTIMIZER</h1>
            {/* Para */}
            <p className={Style.description}>
              Elevate your career prospects with our AI-powered Smart Resume
              Optimizer. This innovative tool extracts essential details,
              analyzes your resume against job titles, and delivers actionable
              suggestions to make your resume stand out.
            </p>
            {/* Features */}
            <div className={Style.features}>
              <div className={Style.featureItem}>
                <p>
                  Accurately extracts key information, including name, job
                  title, skills, and experience.
                </p>
              </div>
              <div className={Style.featureItem}>
                <p>Calculates match scores based on the provided job title.</p>
              </div>
              <div className={Style.featureItem}>
                <p>
                  Offers personalized recommendations to enhance your resume.
                </p>
              </div>
            </div>
            <div className={Style.uploadSection}>
              <form onSubmit={handleSubmit}>
                <div className={Style.inputFieldForResumeAndJT}>
                  <div className={Style.labelAndInputBalancer}>
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
                  </div>

                  <div className={Style.labelAndInputBalancer}>
                    <label htmlFor="resume" className={Style.uploadLabel}>
                      Please enter your Job title
                    </label>
                    <input
                      type="text"
                      id="resume"
                      className={Style.resumeInputJT}
                      value={jobDescription}
                      onChange={handleJobDescriptionChange}
                      placeholder="Job Title"
                    />
                  </div>
                </div>
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
          <div className={Style.JTPopupOverlay}>
            <div className={Style.JTpopupContent}>
              <h2>Analysis</h2>
              <div className={Style.gaugeDiv}>
                <Gauge
                  value={Number(response.match_score)}
                  min={0}
                  max={100}
                  startAngle={-90}
                  endAngle={90}
                  className={Style.customGauge}
                />
              </div>

              <p className={Style.userNameAndScorePara}>
                {response.parsed_resume.name
                  ? `${response.parsed_resume.name}, your resume matches ${
                      response.match_score
                    }% with the provided job title. ${getScoreDescription(
                      response.match_score
                    )}`
                  : `Your resume matches ${
                      response.match_score
                    }% with the provided job title. ${getScoreDescription(
                      response.match_score
                    )}`}
              </p>

              <div className={Style.suggestionDiv}>
                <p className={Style.suggestionPara}>
                  <strong>Suggestions</strong>
                </p>
                {response.suggestions.map((tip, index) => (
                  <p key={index}>{tip}</p>
                ))}
              </div>

              <div className={Style.suggestionDiv}>
                <p className={Style.suggestionPara}>
                  <strong>Tips</strong>
                </p>
                {response.tips.map((tip, index) => (
                  <p key={index}>{tip}</p>
                ))}
              </div>

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

export default JDResumeAnalyzer;
