/**
 * Utility to trigger a direct download of a PDF file
 * @param {string} url - The URL path of the file to download
 * @param {string} filename - The filename to save as
 */
export const downloadPDF = (url, filename) => {
  // Create an invisible anchor element
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = `${import.meta.env.VITE_API_URL}${url}`;
  a.setAttribute('download', filename || 'document.pdf');
  
  // Append to the document and trigger click
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
};

/**
 * Opens a PDF in a new browser tab
 * @param {string} url - The URL path of the file to open
 */
export const openPDFInNewTab = (url) => {
  window.open(`${import.meta.env.VITE_API_URL}${url}`, '_blank');
};

/**
 * Creates a formatted filename for salary PDFs
 * @param {Object} salary - Salary object containing employeeId, month, year
 * @returns {string} Formatted filename
 */
export const formatSalaryFilename = (salary) => {
  if (!salary) return 'salary.pdf';
  
  // Handle potentially missing employeeId
  const employeeName = salary.employeeId && salary.employeeId.name 
    ? salary.employeeId.name.replace(/\s+/g, '_') 
    : 'unknown_employee';
    
  return `Salary_${employeeName}_${salary.month}_${salary.year}.pdf`;
};
