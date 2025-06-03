import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OverallResumeAnalyzer() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
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

  return (
    <>
      <div className={Style.mainDiv}>
        <div className={Style.mainPageMainDiv}>
          {/* Navigation Bar */}
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

          {/* MainDiv for taking the user resume file and button for analysis */}
          {/* Design this div with light white color border and in modern lock with shadow */}
          {/* Properly format the heading and para */}
          <div className={Style.mainDivContent}>
  <h1 className={Style.heading}>AI Resume Analyzer</h1>
  <p className={Style.description}>
    Unlock the potential of your resume with our AI-powered Resume Analyzer. This cutting-edge tool leverages natural language processing to extract key details, score your resume, and provide actionable suggestions for improvement.
  </p>
  <div className={Style.features}>
    <div className={Style.featureItem}>
      <p>Extracts key details like name, email, skills, and experience.</p>
    </div>
    <div className={Style.featureItem}>
      <p>Scores your resume based on essential criteria.</p>
    </div>
    <div className={Style.featureItem}>
      <p>Provides personalized suggestions for improvement.</p>
    </div>
  </div>
  <div className={Style.uploadSection}>
    <form>
      <label htmlFor="resume" className={Style.uploadLabel}>
        Upload your resume (PDF only)
      </label>
      <input
        type="file"
        id="resume"
        accept="application/pdf"
        className={Style.resumeInput}
      />
      <button type="submit" className={Style.analyzeBtn}>
        Analyze Resume
      </button>
    </form>
  </div>
</div>

        
        </div>
      </div>
    </>
  );
}

export default OverallResumeAnalyzer;
