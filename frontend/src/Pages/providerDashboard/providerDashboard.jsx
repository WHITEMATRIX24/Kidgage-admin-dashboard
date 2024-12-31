import React, { useEffect, useState } from "react";
import "./providerDashboard.css";
import axios from "axios";


import Appbar from "../../components/common/appbar/Appbar";
import CoursePage from "../courses/course";
import Enquiries from "../Enquiries/Enquiries";
import ProviderDetails from "../provider/provider";
import Settings from "../settings/Settings";



const Providerdashboard = () => {
  const [courseData, setCourseData] = useState([]);
  const [courseCategory, setCourseCategory] = useState([]);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [enquiryData, setEnquiryData] = useState([]);
  const [searchKey, setSearchKey] = useState("")
  console.log(searchKey);

  const fetchProviderAndCourses = async () => {
    setError(null);

    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      setError("No user ID found in session storage.");
      return;
    }

    try {
      const coursecategories = await axios.get(
        `https://admin.kidgage.com/api/course-category/categories-provider`
      );
      setCourseCategory(coursecategories.data);

      const providerResponse = await axios.get(
        `https://admin.kidgage.com/api/users/user/${userId}`
      );
      setProvider(providerResponse.data);

      const coursesResponse = await axios.get(
        `https://admin.kidgage.com/api/courses/by-providers`,
        {
          params: { providerIds: [userId] },
        }
      );
      setCourseData(coursesResponse.data);

      const enquiryResponse = await axios.get(
        `https://admin.kidgage.com/api/enquiries/enquiry-by-providers`,
        {
          params: { providerIds: [userId] },
        }
      );
      setEnquiryData(enquiryResponse.data);

      console.log(courseData);
    } catch (error) {
      console.log(`Error fetching courses: ${error}`);
      setError("Error fetching courses");
    }
  };

  // console.log(enquiryData);
  console.log(courseCategory);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  const handleChildData = (data) => {
    setSearchKey(data); // Set the received data to state

  };

  useEffect(() => {
    fetchProviderAndCourses();
  }, [searchKey]);

  return (
    <div className="provider-dashboardpage-container">
      <Appbar sendDataToParent={handleChildData} />
      {
        searchKey === "course" ? (
          <CoursePage searchdata={searchKey} />
        ) :searchKey === "enqu" ? (
            <Enquiries searchdata={searchKey} />
          ) : searchKey === "prof" ? (
            <ProviderDetails searchdata={searchKey} />
          ) : searchKey === "sett" ? (
            <Settings searchdata={searchKey} />
          )
            : (<div className="provider-dashboard-content-wrapper">
              <h3 className="provider-dashboard-content-h3">Dashboard</h3>
              <div className="provider-dashboardpage-tiles-container">
                <div className="provider-dashboardpage-tiles">
                  <h2 className="provider-dashboardpage-textcolor">
                    {enquiryData.length}
                  </h2>
                  <h1 className="provider-dashboard-tile-text">Enquiries</h1>
                </div>
                <div className="provider-dashboardpage-tiles">
                  <h2 className="provider-dashboardpage-textcolor">
                    {courseCategory.length}
                  </h2>
                  <h1 className="provider-dashboard-tile-text">Categories</h1>
                </div>
                <div className="provider-dashboardpage-tiles">
                  <h2 className="provider-dashboardpage-textcolor">
                    {courseData.length}
                  </h2>
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
                              <td>{courses.courseType}</td>
                              <td>
                                {formatDate(courses.startDate)} to{" "}
                                {formatDate(courses.endDate)}
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
                        {enquiryData &&
                          enquiryData.map((item) => (
                            <tr key={item._id}>
                              <td>{item.parentDetails.name}</td>
                              <td>{item.childDetails.age}</td>
                              <td>{item.parentDetails.phone}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>)
      }

    </div>
  );
};

export default Providerdashboard;
