import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MainPage() {
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

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  function createResume() {
    toast.warn("Coming Soon!", {
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
  }

  function navigateToAiHelp(){
    navigate("/aiHelp");
  }

  return (
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
              <Link className={Style.linkElementNavBar}>
                Resume
              </Link>
              <Link className={Style.linkElementNavBar}>
                Cover Letter
              </Link>
            </div>
          
          <div className={Style.ProfileBtnNavBarMainPage}>

              <button
              className={Style.profileBtn}
              onClick={navigateToAiHelp}
            >
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

        <div className={Style.mainPageContentDiv}>
          {/* This div is for the heading and para */}
          <div className={Style.mainPageContentDiv1}>
            <h1 className={Style.getStartedHeading}>
              Get Expert Feedback on your{" "}
              <span className={Style.cryptoCurrencyText}>Resume</span>,
              instantly
            </h1>
            <p className={Style.paraMainPageContentDiv}>
              Get hired faster with an ATS-friendly resume. Our free ATS Resume
              Checker scans for 30+ criteria and delivers instant suggestions to
              improve your resume score — right from your desktop or mobile
              device.Our free AI-Powered resume checker scores your resume on
              key criteria recruiters and hiring managers look for. Get
              actionable steps to revamp your resume and land more interviews.
            </p>

            <div className={Style.btnDivs}>
              <button className={Style.analysisBtn} onClick={createResume}>
                Create My Resume
              </button>
              <button className={Style.analysisBtn} onClick={()=> setShowPopup(true)}>Analyze My Resume</button>
            </div>

            <div className={Style.imageAndContentDiv}>
              <div className={Style.imageContentDiv}>
                <div className={Style.imageDivImageContentDiv}>
                  <img
                    src="https://www.myperfectresume.com/wp-content/uploads/2025/05/Elizabeth-Muenzen-Author-Photo-scaled.jpg?w=150"
                    alt=""
                  />
                </div>
                <div>
                  <p>
                    By <strong>Elizabeth Muenzen, CPRW</strong>
                  </p>
                  <p>Career Advice Writer</p>
                  <p>
                    Last Updated: <strong>January 22, 2025</strong>
                  </p>
                </div>
              </div>
              <div className={Style.OtherInfoDiv}>
                <p>
                  <i
                    className="fa-solid fa-arrow-up"
                    style={{ color: "#ffffff" }}
                  ></i>{" "}
                  30% higher chance of getting a job
                </p>
                <p>
                  <i
                    className="fa-solid fa-arrow-up"
                    style={{ color: "#ffffff" }}
                  ></i>{" "}
                  42% higher response rate from recruiters
                </p>
              </div>
            </div>

            <div className={Style.reviewParaDiv}>
              <p>
                <strong>EXCELLENT</strong>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star-half-stroke"></i>
                <span className="reviews">
                  <strong>15,047 reviews on</strong>
                  <i
                    className="fa-solid fa-star"
                    style={{ marginLeft: "5px" }}
                  ></i>
                  <span>Trustpilot</span>
                </span>
              </p>
            </div>
          </div>

          {/* This div is for the side image */}
          <div className={Style.mainPageContentDiv2}>
            <video
              ref={videoRef}
              src="/Assets/resume_score_left-ByFEivQ5.mp4"
              loop
              muted
              className={Style.hiddenControls}
            ></video>
          </div>
        </div>
      </div>
       {/* Popup Overlay */}
      {showPopup && (
        <div className={Style.popupOverlay} onClick={() => setShowPopup(false)}>
          <div
            className={Style.popupContent}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2>Choose Your Analysis</h2>
            <Link className={Style.popupBtn} to="/overallResumeAnalyzer">General Resume Score</Link>
            <Link className={Style.popupBtn} to="/jdResumeAnalyzer">
              Score Based on Job Description
            </Link>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default MainPage;
