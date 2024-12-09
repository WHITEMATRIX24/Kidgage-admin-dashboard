import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import {
  faBook,
  faSchool,
  faTags,
  faUsers,
  faUserGraduate,
  faBullhorn,
  faImages,
  faAd,
  faCog,
  faRightFromBracket,
  faGraduationCap,
  faBorderAll,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/images/logo2.png";
import "./sidebar.css";
import {
  faBell,
  faFile,
  faImage,
  faUser, faMessage
} from "@fortawesome/free-regular-svg-icons";

const Sidebar = ({
  sidebarOpen,
  toggleSidebar,
  onSignOut,
  onChangePassword,
}) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const sectionRefs = useRef({});
  const [adminId, setAdminId] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [Name, setName] = useState("");
  const [user, setUser] = useState({
    academyImg: null, // Store the file object
    logo: null, // Store the file object
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  useEffect(() => {
    // Retrieve adminId and adminRole from sessionStorage
    const storedId = sessionStorage.getItem("adminId");
    const storedRole = sessionStorage.getItem("adminRole");
    const storedName = sessionStorage.getItem("Name");

    if (storedId && storedRole) {
      setAdminId(storedId);
      setName(storedName);
      setAdminRole(
        storedRole.charAt(0).toUpperCase() + storedRole.slice(1).toLowerCase()
      );
    }
  }, []);
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = sessionStorage.getItem("userid");
      try {
        const response = await fetch(
          `https://kidgage-dashboar-newui.onrender.com/api/users/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const userData = await response.json();

        // Update user state with the fetched data including the logo
        setUser({
          ...userData,
          logo: userData.logo, // Assuming userData.logo is base64 encoded
        });

        // Show the form if the verification status is 'accepted'
        if (userData.verificationStatus === "accepted") {
          // Add logic if needed
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const sections = [
      "dashboard",
      "requests",
      "inspections",
      "academies",
      "courses",
      "profile",
      // "students",
      "campaigns",
      // "event-posters",
      // "advertisements",
      "categories",
      "settings",
    ];

    sections.forEach((section) => {
      sectionRefs.current[section] = document.getElementById(section);
    });

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveItem(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    sections.forEach((section) => {
      const ref = sectionRefs.current[section];
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const icons = {
    courses: faBook,
    academies: faUser,
    categories: faGraduationCap,
    requests: faBell,
    inspections: faFile,
    dashboard: faBorderAll,
    profile: faUsers,
    // students: faUserGraduate,
    campaigns: faImage,
    // "event-posters": faImages,
    settings: faCog,
    enquiries: faMessage,
    // advertisements: faAd, // or faBullseye or faMegaphone
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    const section = document.getElementById(item);

    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }

    if (window.innerWidth <= 768) {
      toggleSidebar(); // Close sidebar on smaller screens
    }
  };
  useEffect(() => {
    if (adminRole === "Provider") {
      setActiveItem('dashboard')
      document.getElementsByClassName("sidebar-logout-icon")[0].style.color = "white"
      document.getElementsByClassName("sidebar-logout-icon")[0].style.backgroundColor = "#b3aea6"
      document.getElementsByClassName("sidebar-logout-btn")[0].style.color = "grey"
    }
  }, [adminRole])
  useEffect(() => {
    if (adminRole == "Provider") {
      document.getElementsByClassName("active")[0].style.color = "black"
      document.getElementsByClassName("active")[0].style.borderLeftColor = "#b3aea6"
      document.getElementsByClassName("activeIcon")[0].style.backgroundColor = "black"
      const notActiveElement = document.getElementsByClassName("notActive")
      for (var i = 0; i < notActiveElement.length; i++) {
        notActiveElement[i].style.color = "grey";
      }
      const sidebarIcons = document.getElementsByClassName("sidebar-icon")
      for (var i = 0; i < sidebarIcons.length; i++) {
        sidebarIcons[i].style.color = "white";
        sidebarIcons[i].style.backgroundColor = "#b3aea6"
      }
    }

  }, [adminRole, activeItem])


  const allowedSectionsByRole = {
    admin: [
      "dashboard",
      "requests",
      "inspections",
      "academies",
      // "courses",
      // "profile",
      // "students",
      "campaigns",
      // "event-posters",
      // "advertisements",
      "categories",
      "settings",
    ],
    provider: ["dashboard", "courses", "enquiries", "profile", "settings"],
  };
  const allowedSections = allowedSectionsByRole[adminRole.toLowerCase()] || [];

  return (
    <div className={`dashboard-sidebar ${sidebarOpen ? "show" : ""}`}>
      <div className="sidebar-logo-image-container">
        <img src={Logo} alt="logo" className="sidebar-logo-img" />
      </div>
      <nav className="sidebar-nav-menus">
        <ul>
          {allowedSections.map((section) => (
            <a href={`#${section}`}>
              <li
                key={section}
                className={activeItem === section ? "active" : "notActive"}
                onClick={() => handleItemClick(section)}
              >
                <FontAwesomeIcon
                  icon={icons[section]}
                  className={activeItem === section ? "activeIcon" : "sidebar-icon"}
                />
                {section.charAt(0).toUpperCase() +
                  section.slice(1).replace("-", " ")}
              </li>
            </a>
          ))}
        </ul>
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="sidebar-logout-icon"
          />
          logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
