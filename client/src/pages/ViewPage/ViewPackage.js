import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import './ViewPackage.css';

const ViewPackage = ({ handleLogout }) => {
  const { id } = useParams(); // Retrieve the package ID from the URL
  const navigate = useNavigate();
  const [packageDetails, setPackageDetails] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [sizeCost, setSizeCost] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const authToken = localStorage.getItem('authToken');
  const apiPort = process.env.REACT_APP_API_PORT || 4010;
  const apiLink = process.env.REACT_APP_API_URL || 'http://localhost';
  const apiUrl = id ? `${apiLink}:${apiPort}/package/${id}` : null;

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setIsLoading(true);

        // Fetch package details
        const detailsResponse = await axios.get(apiUrl, {
          headers: { 'X-Authorization': authToken },
        });
        setPackageDetails(detailsResponse.data);

        // Fetch metrics
        // const metricsResponse = await axios.get(`${apiUrl}/rate`, {
        //   headers: { 'X-Authorization': authToken },
        // });
        // setMetrics(metricsResponse.data);

        // Fetch size cost
        // const sizeCostResponse = await axios.get(`${apiUrl}/cost`, {
        //   headers: { 'X-Authorization': authToken },
        // });
        // setSizeCost(sizeCostResponse.data);

        setError('');
      } catch (err) {
        console.error('Error fetching package details:', err);
        setError('Failed to fetch package details or additional data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authToken) {
      console.error('No authToken found. Redirecting to login.');
      navigate('/');
      return;
    }

    if (!id) {
      console.error('No package ID found. Redirecting to view-database.');
      navigate('/view-database');
      return;
    }

    fetchPackageDetails();
  }, [id, authToken, apiUrl, navigate]);

  const handleDownload = () => {
    if (!packageDetails?.data?.Content) {
      setError('No content available for download.');
      return;
    }
    try {
      const binaryContent = Uint8Array.from(
        atob(packageDetails.data.Content),
        (char) => char.charCodeAt(0)
      );
      const blob = new Blob([binaryContent], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${packageDetails.metadata?.Name || 'package'}.zip`;
      downloadLink.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download the package. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <Header handleLogout={handleLogout} />
      <div className="content">
        {error && <p className="error-message">{error}</p>}
        {isLoading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : (
          packageDetails && (
            <div className="package-details">
              <h1>Package Details</h1>
              <p><strong>Name:</strong> {packageDetails.metadata?.Name}</p>
              <p><strong>Version:</strong> {packageDetails.metadata?.Version}</p>
              <button className="download-button" onClick={handleDownload}>
                Download Package
              </button>

              {/* {metrics && (
                <div className="metrics">
                  <h2>Metrics</h2>
                  <p><strong>Net Score:</strong> {metrics.NetScore}</p>
                  <p><strong>Ramp-Up Score:</strong> {metrics.RampUp}</p>
                  <p><strong>Bus Factor:</strong> {metrics.BusFactor}</p>
                  <p><strong>License Score:</strong> {metrics.LicenseScore}</p>
                </div>
              )} */}

              {/* {sizeCost && (
                <div className="size-cost">
                  <h2>Size Cost</h2>
                  <p><strong>Total Cost:</strong> {sizeCost[id]?.totalCost} MB</p>
                  {sizeCost[id]?.standaloneCost && (
                    <p><strong>Standalone Cost:</strong> {sizeCost[id].standaloneCost} MB</p>
                  )}
                </div>
              )} */}
            </div>
          )
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewPackage;
