import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

function MainPage() {
  const navigate = useNavigate();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recommendationPopUp, setRecommendationPopUp] = useState(false);
  const [cohereRecommendation, setCohereRecommendation] = useState(null);
  const [geminiRecommendation, setGeminiRecommendation] = useState(null);
  const [showCohere, setShowCohere] = useState(true);
  const [showGemini, setShowGemini] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User data from localStorage
  const userFirstName = localStorage.getItem("userFirstName") || "John";
  const userLastName = localStorage.getItem("userLastName") || "Doe";
  const userEmailAddress =
    localStorage.getItem("userEmailAddress") || "john.doe@example.com";

  // Form state
  const [formData, setFormData] = useState({
    interest: "",
    skills: "",
    goals: "",
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Clear error on input change
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic form validation
    if (!formData.interest || !formData.skills || !formData.goals) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/counsel",
        {
          interests: formData.interest,
          skills_to_learn: formData.skills,
          career_goals: formData.goals,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setCohereRecommendation(response.data.cohere_recommendation);
      setGeminiRecommendation(response.data.gemini_recommendation);
      setShowPopup(false);
      setRecommendationPopUp(true);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userEmailAddress");
    navigate("/");
  };

  // Toggle recommendation display
  const handleCohereClick = () => {
    setShowCohere(true);
    setShowGemini(false);
  };

  const handleGeminiClick = () => {
    setShowCohere(false);
    setShowGemini(true);
  };

  // Parse and format recommendation data
  const formatRecommendation = (recommendation) => {
    if (!recommendation) return null;
    return (
      <div className={Style.recommendationContent}>
        <h3>Career Paths</h3>
        <ul>
          {recommendation.career_paths.map((path, index) => (
            <li key={index}>{path}</li>
          ))}
        </ul>
        <h3>Skills to Learn</h3>
        <ul>
          {recommendation.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
        <h3>Learning Resources</h3>
        <ul>
          {recommendation.resources.map((resource, index) => (
            <li key={index}>{resource}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={Style.mainDiv}>
      <div className={Style.mainPageMainDiv}>
        {/* Navigation Bar */}
        <div className={Style.navBarMainPage}>
          <div className={Style.logoNavBarMainPage}>
            <h1>Resumely</h1>
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

        <div className={Style.mainPageContentDiv}>
          {/* This div is for the heading and para */}
          <div className={Style.mainPageContentDiv1}>
            <h1 className={Style.getStartedHeading}>Get Expert Feedback on your <span className={Style.cryptoCurrencyText}>Resume</span>, instantly</h1>
            <p className={Style.paraMainPageContentDiv}>
              Get hired faster with an ATS-friendly resume. Our free ATS Resume Checker scans for 30+ criteria and delivers instant suggestions to improve your resume score — right from your desktop or mobile device.Our free AI-Powered resume checker scores your resume on key criteria recruiters and hiring managers look for. Get actionable
              steps to revamp your resume and land more interviews.
            </p>

            <div className={Style.btnDivs}>
<button className={Style.analysisBtn}>Create My Resume</button>
            <button className={Style.analysisBtn}>Analyze My Resume</button>
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
          </div>

          {/* This div is for the side image */}
         <div className={Style.mainPageContentDiv2}>
  <video src="\Assets\resume_score_left-ByFEivQ5.mp4" autoplay loop muted controls className={Style.hiddenControls}></video>

</div>

        </div>
      </div>
    </div>
  );
}

export default MainPage;
