import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [userChartData, setUserChartData] = useState({});
  const [filter, setFilter] = useState("All");
  const [subFilter, setSubFilter] = useState("All");
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    fetch("/Login_ngdr Manojsir.xlsx")
      .then((response) => response.arrayBuffer())
      .then((dataBuffer) => {
        const workbook = XLSX.read(dataBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(sheet);

        setOriginalData(data);
        updateChartData(data, "All", "All");
      })
      .catch((error) => {
        console.error("Error loading the Excel file:", error);
      });
  }, []);

  const updateChartData = (data, filter, subFilter) => {
    let filteredData;

    if (filter === "Government") {
      filteredData = data.filter(
        (row) =>
          typeof row.email === "string" &&
          row.email.toLowerCase().includes(".gov")
      );

      if (subFilter === "GSI") {
        filteredData = filteredData.filter(
          (row) =>
            typeof row.email === "string" &&
            row.email.toLowerCase().endsWith("gsi.gov.in")
        );
      }
    } else if (filter === "Non-Government") {
      filteredData = data.filter(
        (row) =>
          typeof row.email !== "undefined" &&
          (typeof row.email !== "string" || !row.email.toLowerCase().includes(".gov"))
      );
    } else {
      filteredData = data;
    }

    const nationalUsers = filteredData.filter(
      (row) => row.country_name === "India"
    );
    const internationalUsers = filteredData.filter(
      (row) => row.country_name !== "India"
    );

    const userLabels = ["National", "International"];
    const userCounts = [nationalUsers.length, internationalUsers.length];

    setUserChartData({
      labels: userLabels,
      datasets: [
        {
          label: "Number of Users",
          data: userCounts,
          backgroundColor: ["#0A5678", "#3B9EA0"],
          borderColor: ["#073A50", "#E0E0E0"],
          borderWidth: 2,
          barThickness: 120,
        },
      ],
    });
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    setSubFilter("All");
    updateChartData(originalData, selectedFilter, "All");
  };

  const handleSubFilterChange = (e) => {
    const selectedSubFilter = e.target.value;
    setSubFilter(selectedSubFilter);
    updateChartData(originalData, filter, selectedSubFilter);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#F5F5F5",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {}
      <div
        style={{
          backgroundColor: "#0A5678",
          color: "#FFFFFF",
          padding: "10px 20px",
          borderRadius: "8px 8px 0 0",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>National/International Users</h2>
      </div>

      {}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="filter" style={{ marginRight: "10px" }}>
            Filter Users:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            style={{ padding: "5px", borderRadius: "4px" }}
          >
            <option value="All">All</option>
            <option value="Government">Government</option>
            <option value="Non-Government">Non-Government</option>
          </select>
        </div>

        {}
        {filter === "Government" && (
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="sub-filter" style={{ marginRight: "10px" }}>
              Sub-Filter:
            </label>
            <select
              id="sub-filter"
              value={subFilter}
              onChange={handleSubFilterChange}
              style={{ padding: "5px", borderRadius: "4px" }}
            >
              <option value="All">All</option>
              <option value="GSI">GSI</option>
            </select>
          </div>
        )}

        {}
        <div
          style={{
            marginTop: "20px",
            height: "300px", 
            position: "relative",
          }}
        >
          {userChartData.labels ? (
            <Bar
              data={userChartData}
              options={{
                maintainAspectRatio: false, 
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
              }}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
