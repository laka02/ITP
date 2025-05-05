import React, { useState, useEffect } from "react";
import { checkApiConnection } from "../api/employeeApi.js";

const ApiStatus = () => {
  const [status, setStatus] = useState({ checking: true, connected: false });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkApiConnection();
        setStatus({ checking: false, connected: result.connected, details: result });
      } catch (error) {
        setStatus({ checking: false, connected: false, error });
      }
    };

    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (status.checking) {
    return <div className="text-gray-500">Checking server connection...</div>;
  }

  return status.connected ? (
    <div className="text-green-600 flex items-center">
      <div className="h-2 w-2 rounded-full bg-green-600 mr-2"></div>
      Server connected
    </div>
  ) : (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-2">
      <strong>Server not connected!</strong> 
      <div>Please make sure the server is running at {import.meta.env.VITE_API_URL || "http://localhost:5000"}.</div>
      <div className="mt-2 text-xs">
        <strong>To start the server:</strong>
        <ol className="list-decimal ml-5">
          <li>Open a terminal in the server directory</li>
          <li>Run: <code className="bg-gray-200 px-1">npm run dev</code> or <code className="bg-gray-200 px-1">npm start</code></li>
        </ol>
      </div>
    </div>
  );
};

export default ApiStatus;
