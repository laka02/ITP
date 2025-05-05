import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSalaryById, approveSalary, generateSingleSalaryPDF } from "../api/salaryApi.js";
import SalaryDetails from "../components/SalaryDetails.jsx";
import { downloadPDF, openPDFInNewTab, formatSalaryFilename } from "../utils/pdfUtils.js";

const SalaryDetail = () => {
  const { id } = useParams();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        setLoading(true);
        const { data } = await getSalaryById(id);
        setSalary(data);
      } catch (err) {
        setError("Failed to load salary details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [id]);

  const handleApprove = async () => {
    if (window.confirm("Are you sure you want to approve this salary?")) {
      try {
        await approveSalary(id);
        const { data } = await getSalaryById(id);
        setSalary(data);
      } catch (err) {
        setError("Failed to approve salary");
        console.error(err);
      }
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      const { data } = await generateSingleSalaryPDF(id);
      
      // Store the download URL in the salary state
      setSalary(prev => ({
        ...prev,
        downloadUrl: data.downloadUrl
      }));
      
      // Default action: download
      downloadPDF(
        data.downloadUrl, 
        formatSalaryFilename({
          ...salary,
          downloadUrl: data.downloadUrl
        })
      );
      
      alert(`PDF generated successfully and downloaded.`);
    } catch (err) {
      setError("Failed to generate PDF");
      console.error(err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading salary details</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/salaries" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Salaries
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          Salary Details
        </h1>
        <p className="text-gray-600">
          Viewing salary information for {salary?.employeeId?.name}
        </p>
      </div>
      
      <SalaryDetails salary={salary} />
      
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link 
            to={`/edit-salary/${id}`}
            className="inline-flex items-center px-4 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Salary
          </Link>
          
          {salary?.status !== 'Approved' && (
            <button 
              onClick={handleApprove}
              className="inline-flex items-center px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Approve Salary
            </button>
          )}
          
          <button 
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className={`inline-flex items-center px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all ${generatingPDF ? 'opacity-60 cursor-not-allowed' : 'shadow-sm'}`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {generatingPDF ? 'Generating PDF...' : 'Generate PDF'}
          </button>
          
          {salary?.downloadUrl && (
            <>
              <button 
                onClick={() => downloadPDF(
                  salary.downloadUrl, 
                  formatSalaryFilename(salary)
                )}
                className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download PDF
              </button>
              
              <button 
                onClick={() => openPDFInNewTab(salary.downloadUrl)}
                className="inline-flex items-center px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                View in Browser
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryDetail;
