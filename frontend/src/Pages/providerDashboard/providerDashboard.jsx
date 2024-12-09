import React, { useEffect, useState } from "react";
import "./providerDashboard.css";
import axios from "axios";

import Appbar from "../../components/common/appbar/Appbar";

const Providerdashboard = () => {
  const [courseData, setCourseData] = useState([]);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const fetchProviderAndCourses = async () => {
    setError(null);

    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      setError("No user ID found in session storage.");
      return;
    }

    try {
      const providerResponse = await axios.get(
        `https://kidgage-dashboar-newui.onrender.com/api/users/user/${userId}`
      );
      setProvider(providerResponse.data);

      const coursesResponse = await axios.get(
        `https://kidgage-dashboar-newui.onrender.com/api/courses/by-providers`,
        {
          params: { providerIds: [userId] },
        }
      );
      setCourseData(coursesResponse.data);
      console.log(courseData);

    } catch (error) {
      console.log(`Error fetching courses: ${error}`);
      setError("Error fetching courses");
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  useEffect(() => {
    fetchProviderAndCourses();
  }, []);

  return (
    <div className="provider-dashboardpage-container">
      <Appbar />
      <div className="provider-dashboard-content-wrapper">
        <h3 className="provider-dashboard-content-h3">Dashboard</h3>
        <div className="provider-dashboardpage-tiles-container">
          <div className="provider-dashboardpage-tiles">
            <h2 className="provider-dashboardpage-textcolor">67</h2>
            <h1 className="provider-dashboard-tile-text">Enquiries</h1>
          </div>
          <div className="provider-dashboardpage-tiles">
            <h2 className="provider-dashboardpage-textcolor">38</h2>
            <h1 className="provider-dashboard-tile-text">Categories</h1>
          </div>
          <div className="provider-dashboardpage-tiles">
            <h2 className="provider-dashboardpage-textcolor">52</h2>
            <h1 className="provider-dashboard-tile-text">Courses</h1>
          </div>
        </div>
        <div className="provider-dashboardpage-table-container">
          <div className="provider-dashboardpage-tables">
            <div className="provider-dashboardpage-table-header">
              <h3 className="provider-dashboardpage-table-header-h3">
                Courses / Programs
              </h3>
            </div>
            <div className="provider-dashboardpage-table-wrapper">
              <table className="provider-dashboardpage-table">
                <thead>
                  <tr>
                    <th>Courses</th>
                    <th>Category</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData &&
                    courseData.map((courses) => (
                      <tr key={courses._id}>
                        <td>{courses.name}</td>
                        <td>
                          {courses.courseType}
                        </td>
                        <td>
                          {formatDate(courses.startDate)} to {formatDate(courses.endDate)}
                        </td>

                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="provider-dashboardpage-tables">
            <div className="provider-dashboardpage-table-header">
              <h3 className="provider-dashboardpage-table-header-h3">
                Student Enquires
              </h3>
            </div>
            <div className="provider-dashboardpage-table-wrapper">
              <table className="provider-dashboardpage-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date of Birth</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ahmed Mubashir</td>
                    <td>21/02/2024</td>
                    <td>+971 89561245</td>
                  </tr>
                  <tr>
                    <td>Anwar Sadath</td>
                    <td>21/02/2020</td>
                    <td>+971 89561243</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Providerdashboard;
