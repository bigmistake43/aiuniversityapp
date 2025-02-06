import React from 'react';
import './ShowUniversityFacSheet.css'; // Make sure to add styles in this file
import { jsPDF } from "jspdf";

const ShowUniversityFacSheet = () => {
    const factSheet = JSON.parse(localStorage.getItem('universityFactSheet'));

    if (!factSheet) {
        return <p>No university fact sheet data available. Please submit a form first.</p>;
    }

    // Function to download the data as a PDF including both JSON and the table
    const downloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Set up fonts
        doc.setFont("helvetica");

        // Add university name as the title in a larger and bolder font
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(factSheet.university_name, 20, 20);

        // Add spacing before the next section
        let yPosition = 30;

        // Add a descriptive heading for the JSON data
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text('University Fact Sheet (JSON):', 20, yPosition);
        yPosition += 10;

        // Add JSON data with wrapping
        doc.setFontSize(10);
        const jsonText = JSON.stringify(factSheet, null, 2);
        const maxWidth = pageWidth - 40; // Avoid going beyond page width

        // Add JSON data with wrapping to prevent overflow
        doc.textWithLink(jsonText, 20, yPosition, { maxWidth });
        yPosition += 100; // Adding space before the table

        // Check if content overflows, if so add a page break
        if (yPosition + 40 > pageHeight) {
            doc.addPage();
            yPosition = 20; // Reset Y position for new page
        }

        // Section heading for the fact sheet table
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('University Fact Sheet Table:', 20, yPosition);
        yPosition += 10;

        // Table setup: width, margins, and spacing
        const tableColumnWidth = (pageWidth - 40) / 2;  // Adjusting column width to fit the page
        const tableMarginLeft = 20;
        const rowHeight = 10;
        const headerRowHeight = 12;

        // Draw table header with a background color and bold text
        doc.setFillColor(45, 45, 45); // Dark gray background for header
        doc.rect(tableMarginLeft, yPosition - 5, tableColumnWidth, headerRowHeight, 'F'); // Fill header background
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255); // White text for header
        doc.text('Fact', tableMarginLeft + 2, yPosition + 3);
        doc.text('Details', tableMarginLeft + tableColumnWidth + 10, yPosition + 3);

        // Draw the table rows
        yPosition += headerRowHeight; // Move to the row position
        let rowCount = 0;

        // Loop through each fact entry and draw it on the table
        Object.entries(factSheet.facts).forEach(([fact, details]) => {
            // Check if we need to add a page break
            if (yPosition + rowHeight > pageHeight) {
                doc.addPage();
                yPosition = 20; // Reset to the top of the new page
                // Re-draw the table header on the new page
                doc.setFillColor(45, 45, 45); // Dark gray background for header
                doc.rect(tableMarginLeft, yPosition - 5, tableColumnWidth, headerRowHeight, 'F');
                doc.setFontSize(12);
                doc.setTextColor(255, 255, 255);
                doc.text('Fact', tableMarginLeft + 2, yPosition + 3);
                doc.text('Details', tableMarginLeft + tableColumnWidth + 10, yPosition + 3);
                yPosition += headerRowHeight; // Move to the next line after the header
            }

            // Alternate row colors for better readability
            if (rowCount % 2 === 0) {
                doc.setFillColor(240, 240, 240); // Light gray for even rows
            } else {
                doc.setFillColor(255, 255, 255); // White for odd rows
            }

            // Draw background for row
            doc.rect(tableMarginLeft, yPosition - 5, tableColumnWidth, rowHeight, 'F');

            // Add the fact and details text
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0); // Black text for data
            doc.text(fact, tableMarginLeft + 2, yPosition + 3);
            doc.text(details, tableMarginLeft + tableColumnWidth + 10, yPosition + 3);

            // Move to the next row
            yPosition += rowHeight;
            rowCount++;
        });

        // Save the generated PDF with a dynamic file name based on the university name
        doc.save(`${factSheet.university_name}_FactSheet.pdf`);
    };

    return (
        <div className="show_university_facsheet_container">
            <div className="fact-sheet-container">
                <h1 className="university-name">{factSheet.university_name}</h1>
                <table className="fact-sheet-table">
                    <thead>
                        <tr>
                            <th>Fact</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(factSheet.facts).map(([fact, details]) => (
                            <tr key={fact} className="fact-row">
                                <td className="fact-column">{fact}</td>
                                <td className="details-column">{details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Button to trigger the PDF download */}
                <div className="download-buttons">
                    <button className="download-pdf" onClick={downloadPDF}>Download as PDF</button>
                </div>
            </div>
        </div>
    );
};

export default ShowUniversityFacSheet;
