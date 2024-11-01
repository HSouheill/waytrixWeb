import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './UserInfo.css';
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import { ipAddress } from '../../../config';

export const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('waytrixToken');
        // https://waytrix-backend.onrender.com
        const response = await axios.get(`${ipAddress}/api/DashBoardRoutes/total_customers_info_for_waytrix`, {
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
      ID: user._id,
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Gender: user.gender,
      Age: user.age,
      Role: user.role,
      Verified: user.verified,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(filteredUserInfo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserInfo");
  
    // Style header
    //const header = worksheet['!ref'].split(':')[0];
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
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let page = pdfDoc.addPage(PageSizes.A4);

    const { height } = page.getSize();
    const margin = 50;
    const fontSize = 10;
    const lineHeight = fontSize * 1.8;
    const textColor = rgb(0, 0, 0);

    const headers = ['Name', 'Phone', 'Email', 'Gender', 'Age', 'Verified'];
    const data = userInfo.map(user => [
        user.name || "",
        user.phone || "",
        user.email || "",
        user.gender || "",
        user.age || "",
        user.verified ? "Yes" : "No",
    ]);

    let y = height - margin;

    // Define specific column widths
    const columnWidths = {
        name: 80,
        phone: 100,
        email: 150,
        gender: 60,
        age: 40,
        verified: 50,
    };

    //const totalWidth = Object.values(columnWidths).reduce((sum, w) => sum + w, 0);

    // Draw title
    page.drawText('User Information', {
        x: margin,
        y,
        size: fontSize + 2,
        font,
        color: textColor,
    });
    y -= lineHeight * 2;

    // Draw headers
    let xPosition = margin;
    headers.forEach((header, index) => {
        const colKey = headers[index].toLowerCase();
        page.drawText(header, {
            x: xPosition,
            y,
            size: fontSize,
            font,
            color: textColor,
        });
        xPosition += columnWidths[colKey];
    });
    y -= lineHeight;

    // Draw data rows
    data.forEach(row => {
        if (y < margin + lineHeight) {  // Check for page space
            page = pdfDoc.addPage(PageSizes.A4);
            y = height - margin;

            // Redraw headers on new page
            xPosition = margin;
            headers.forEach((header, index) => {
                const colKey = headers[index].toLowerCase();
                page.drawText(header, {
                    x: xPosition,
                    y,
                    size: fontSize,
                    font,
                    color: textColor,
                });
                xPosition += columnWidths[colKey];
            });
            y -= lineHeight;
        }

        xPosition = margin;
        row.forEach((cell, index) => {
            const colKey = headers[index].toLowerCase();
            page.drawText(cell.toString(), {
                x: xPosition,
                y,
                size: fontSize,
                font,
                color: textColor,
            });
            xPosition += columnWidths[colKey];
        });
        y -= lineHeight;
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
            <th>Gender</th>
            <th>Age</th>
            {/* <th>Password</th> */}
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
              <td>{user.gender}</td>
              <td>{user.age}</td>
              {/* <td>{user.password}</td> */}
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
