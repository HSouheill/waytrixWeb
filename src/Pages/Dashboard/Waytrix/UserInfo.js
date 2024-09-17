import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './UserInfo.css';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';

export const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('waytrixToken');
        // https://waytrix-backend.onrender.com
        const response = await axios.get('https://waytrixback.onrender.com/api/DashBoardRoutes/total_customers_info_for_waytrix', {
          headers: {
            Authorization: token
          }
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchData(); // Fetch data immediately on first render

    const intervalId = setInterval(fetchData, 3000); // Fetch data every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const exportToExcel = () => {
    if (!userInfo) return;
  
    // Extracting name, email, and phone from userInfo
    const filteredUserInfo = userInfo.map(user => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(filteredUserInfo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserInfo");
  
    // Style header
    const header = worksheet['!ref'].split(':')[0];
    for (let col = 0; col < 3; col++) { // Adjusted for 3 columns
      const cell = worksheet[`${String.fromCharCode(65 + col)}1`];
      if (cell) {
        cell.s = {
          font: { name: "Arial", sz: 14, bold: true },
          alignment: { vertical: "center", horizontal: "center" },
          fill: { fgColor: { rgb: "CCCCCC" } }
        };
      }
    }
  
    // Style rows
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (cell) {
          cell.s = {
            font: { name: "Arial", sz: 12, bold: false },
            alignment: { vertical: "center", horizontal: "center" },
            fill: { fgColor: { rgb: "FFFFFF" } }
          };
        }
      }
    }
  
    // Adjust column widths
    worksheet['!cols'] = [
      { wch: 30 },  // Name
      { wch: 30 },  // Email
      { wch: 30 }   // Phone
    ];
  
    XLSX.writeFile(workbook, "user_info.xlsx");
  };
  
  const exportToPDF = async () => {
    if (!userInfo) return;
  
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(PageSizes.A4);
  
    const { width, height } = page.getSize();
    const margin = 50;
    const fontSize = 12;
  
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const textColor = rgb(0, 0, 0);
  
    let y = height - margin;
  
    const headers = ['Name',  'Phone', 'Email'];
    const data = userInfo.map(user => [
      user.name,
      user.phone,
      user.email,
      
    
    ]);
  
    // Draw title
    page.drawText('User Informations', {
      x: margin,
      y,
      size: fontSize + 2,
      font: font,
      color: textColor,
    });
    y -= fontSize * 2;
  
    // Draw horizontal line under title
    page.drawLine({
      start: { x: margin, y: y - fontSize },
      end: { x: width - margin, y: y - fontSize },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    y -= fontSize * 2;
  
    // Calculate column width dynamically based on number of columns
    const columnWidth = (width - 2 * margin) / headers.length;
  
    // Draw headers
    headers.forEach((header, index) => {
      page.drawText(header, {
        x: margin + index * columnWidth,
        y,
        size: fontSize,
        font: font,
        color: textColor,
      });
    });
    y -= fontSize * 1.5;
  
    // Draw data rows
    data.forEach(row => {
      row.forEach((cell, index) => {
        page.drawText(cell.toString(), {
          x: margin + index * columnWidth,
          y,
          size: fontSize,
          font: font,
          color: textColor,
        });
      });
      y -= fontSize * 1.5;
    });
  
    // Save PDF and create download link
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'user_info.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <div className="dark-theme-table">
      <button onClick={exportToExcel}>Export to Excel</button>
      <button onClick={exportToPDF} style={{float: 'right'}}>Export to PDF</button>
      <table style={{marginTop:10}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Password</th>
            <th>Role</th>
            <th>Verified</th>
          </tr>
        </thead>
        <tbody>
          {userInfo && userInfo.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.password}</td>
              <td>{user.role}</td>
              <td>{user.verified ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserInfo;
