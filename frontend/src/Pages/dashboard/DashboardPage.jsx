import React, { useEffect, useState } from "react";
import "./dashboardPage.css";
import Appbar from "../../components/common/appbar/Appbar";
import axios from "axios";
import { toRedableDateAndTime } from "../../components/utils/redableDate";
import InboundRequest from "../../components/InboundRequest";
import InspectionPage from "../inspection/InspectionPage";
import ActivityProviders from "../academy/ActivityProviders";
import Settings from "../settings/Settings";
import PosterView from "../poster/PosterView";
import CategoryPage from "../category/categoryPage";
import Campaigns from "../campaigns/Campaigns";
import KidgageNews from "../kidgageNews/kidgageNews";
import TermsAndPrivacy from "../Terms &Conditions/TermsAndPrivacy";
const DashboardPage = () => {
  const [activeProviderCounts, setActiveProviderCounts] = useState(0);
  const [campaignsCounts, setCampaignsCounts] = useState(0);
  const [coursesCounts, setCoursesCounts] = useState(0);
  const [leadsGeneratedCount, setLeadsGeneratedCount] = useState(0);
  const [upcommingMeetingsData, setUpcommingMeetingsData] = useState([]);
  const [upcommingExpiresData, setUpcomingExpiresData] = useState([]);
  const [searchKey, setSearchKey] = useState("")
  // console.log(searchKey);

  // Activity Provider initial data fetching
  const activityProviderInitialDataHandler = async () => {
    try {
      const res = await axios.get(
        "https://admin.kidgage.com/api/users/accepted"
      );
      // setUpcomingExpires(res)
      const count = res.data.length;
      setActiveProviderCounts(count);
    } catch (error) {
      console.log(`Error fetching Activity Providers error:${error}`);
    }
  };

  // Active Campaigns initial Data Handler
  const campaignsInitialDataHandler = async () => {
    try {
      const res = await axios.get("https://admin.kidgage.com/api/banners");
      const count = res.data.length;
      setCampaignsCounts(count);
    } catch (error) {
      console.log(`Error fetching Campaigns error: ${error}`);
    }
  };

  // Programs & courses initial Data Handler
  const coursesInitialDataHandler = async () => {
    try {
      const res = await axios.get(
        "https://admin.kidgage.com/api/courses/get-all-courses"
      );
      const count = res.data.courseCounts;
      setCoursesCounts(count);
    } catch (error) {
      console.log(`Error fetching courses & Programs error: ${error}`);
    }
  };

  // Leads genetaed initial data Handler
  const leadsGeneratedinitialDataHandler = async () => {
    try {
      const res = await axios.get("https://admin.kidgage.com/api/customers/bookings");
      const count = res.data.length; // Correct key from API response
      setLeadsGeneratedCount(count);
    } catch (error) {
      console.log("Error in fetching booking count", error);
    }
  };

  // upcomming meetings data fetch
  const upcommingMeetingsInitialDataHandler = async () => {
    try {
      const response = await axios.get(
        "https://admin.kidgage.com/api/users/meeting-scheduled-users"
      );
      setUpcommingMeetingsData(response.data);
    } catch (error) {
      console.log(
        `error in fetching upcomming meetings data in dashboard error: ${error}`
      );
    }
  };

  //upcoming expires data fetch

  const upcommingExpiresInitialDataHandler = async () => {
    try {
      const response = await axios.get(
        "https://admin.kidgage.com/api/users/accepted"
      );
      // console.log(response);
      setUpcomingExpiresData(response.data);
    } catch (error) {
      console.log(
        `error in fetching upcomming meetings data in dashboard error: ${error}`
      );
    }
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB").replace(/\//g, ".");
  };
  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);

    // Get the date in DD.MM.YYYY format
    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, ".");

    // Get the time in HH:MM AM/PM format
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 AM/PM case
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  };


  const handleChildData = (data) => {
    setSearchKey(data); // Set the received data to state

  };

  // if(searchKey =="request"){
  //   <InboundRequest />
  // }


  useEffect(() => {
    activityProviderInitialDataHandler();
    campaignsInitialDataHandler();
    coursesInitialDataHandler();
    leadsGeneratedinitialDataHandler();
    upcommingMeetingsInitialDataHandler();
    upcommingExpiresInitialDataHandler();
  }, [searchKey]);

  // console.log(upcommingExpires);

  return (
    <div className="dashboardpage-container">
      <Appbar sendDataToParent={handleChildData} />
      {searchKey === "req" ? (
        <InboundRequest searchdata={searchKey} />
      ) : searchKey === "ins" ? (
        <InspectionPage searchdata={searchKey} />
      ) : searchKey === "aca" ? (
        <ActivityProviders searchdata={searchKey} />
      ) : searchKey === "camp" ? (
        <Campaigns searchdata={searchKey} />
      ) : searchKey === "cate" ? (
        <CategoryPage searchdata={searchKey} />
      ) : searchKey === "even" ? (
        <PosterView searchdata={searchKey} />
      ) : searchKey === "news" ? (
        <KidgageNews searchdata={searchKey} />
      ) : searchKey === "footer" ? (
        <TermsAndPrivacy searchdata={searchKey} />
      ) : searchKey === "sett" ? (
        <Settings searchdata={searchKey} />
      )
        : (<div className="dashboard-content-wrapper">
          <h3 className="dashboard-content-h3">Dashboard</h3>
          <div className="dashboardpage-tiles-container">
            <div className="dashboardpage-tiles">
              <h2 className="dashboardpage-blue">{activeProviderCounts}</h2>
              <h1 className="dashboard-tile-text">Activity Provider</h1>
            </div>
            <div className="dashboardpage-tiles">
              <h2 className="dashboardpage-green">{leadsGeneratedCount}</h2>
              <h1 className="dashboard-tile-text">Leads generated</h1>
            </div>
            <div className="dashboardpage-tiles">
              <h2 className="dashboardpage-red">{coursesCounts}</h2>
              <h1 className="dashboard-tile-text">Programs & Courses</h1>
            </div>
            <div className="dashboardpage-tiles">
              <h2 className="dashboardpage-yellow">{campaignsCounts}</h2>
              <h1 className="dashboard-tile-text">Active Campaigns</h1>
            </div>
          </div>
          <div className="dashboardpage-table-container">
            <div className="dashboardpage-tables">
              <div className="dashboardpage-table-header">
                <h3 className="dashboardpage-table-header-h3">
                  Upcoming Meetings
                </h3>
              </div>
              <div className="dashboardpage-table-wrapper">
                <table className="dashboardpage-table">
                  <thead>
                    <tr>
                      <th>Academy Name</th>
                      <th>Meeting Date</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcommingMeetingsData &&
                      upcommingMeetingsData.map((meetings) => (
                        <tr key={meetings._id}>
                          <td>{meetings.fullName}</td>
                          <td>{formatDateTime(meetings.meetingScheduleDate)}</td>
                          <td>{meetings.location}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="dashboardpage-tables">
              <div className="dashboardpage-table-header">
                <h3 className="dashboardpage-table-header-h3">
                  Upcoming Expires
                </h3>
              </div>
              <div className="dashboardpage-table-wrapper">
                <table className="dashboardpage-table">
                  <thead>
                    <tr>
                      <th>Academy Name</th>
                      <th>Expiry Date</th>
                      <th>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcommingExpiresData &&
                      upcommingExpiresData.map((expires) => (
                        <tr>
                          <td>{expires.fullName}</td>
                          <td> {formatDate(expires.expiryDate)}</td>
                          <td>{expires.location}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>)}
    </div>
  );
};

export default DashboardPage;
