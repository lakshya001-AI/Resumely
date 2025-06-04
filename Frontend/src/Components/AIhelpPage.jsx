import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Style from "../App.module.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AIhelpPage() {

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

  function navigateToAiHelp(){
    navigate("/aiHelp");
  }




  return <>
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


        </div>
    </div>
  </>
}

export default AIhelpPage