import React, { useEffect, useState } from "react";
import axios from "axios";

import "./Enquiries.css";
import Appbar from "../../components/common/appbar/Appbar";
import {
  toRedableDate,
  toRedableDateAndTime,
} from "../../components/utils/redableDate";

const Enquiries = () => {
 
  return (
    <div className="enquiriesPage-container">
      <Appbar />
      <div className="enquiriesPage-content">
        <h1 className="enquiriesPage-content-h3">Enquiries </h1>
        <div className="enquiriesPage-content-container">
          <div className="enquiriesPage-table-wrapper">
            <table className="enquiriesPage-content-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Gender</th>
                  <th>Father's Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                    <td>Ahmed Mubashir</td>
                    <td>21/02/2024</td>
                    <td>Male</td>
                    <td>Arif Abdullah</td>
                    <td>+91 8956124568</td>
                    <td>ahmedmubashir@gmail.com</td>
                </tr>
                <tr>
                    <td>Ahmed Mubashir</td>
                    <td>21/02/2024</td>
                    <td>Male</td>
                    <td>Arif Abdullah</td>
                    <td>+91 8956124568</td>
                    <td>ahmedmubashir@gmail.com</td>
                </tr>
              </tbody>
              
            </table>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Enquiries;
