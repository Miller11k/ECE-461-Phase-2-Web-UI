import React, { useState } from "react";
import AWS from "aws-sdk";
import './ExternalPackage.css';

function ExternalPackage() {
  const [zipFile, setZipFile] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [packageLink, setPackageLink] = useState('');
  const [version1, setVersion1] = useState('');
  const [version2, setVersion2] = useState('');
  const [version3, setVersion3] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // S3 configuration
  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;
  const REGION = process.env.REACT_APP_AWS_REGION;

  // Configure AWS with credentials and region
  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
    region: REGION,
  });

  const s3 = new AWS.S3();

  // Function to validate GitHub link
  const isValidGithubLink = (url) => {
    const regex = /^https:\/\/github\.com\/.+\/.+/;
    return regex.test(url);
  };

  // Function to upload file to S3
  const uploadFile = async () => {
    if (!zipFile) {
      setError('Please upload a zip file.');
      return;
    }

    if (!packageName.trim()) {
      setError('Please enter a package name.');
      return;
    }

    if (!packageLink.trim()) {
      setError('Please enter a package link.');
      return;
    }

    if (!isValidGithubLink(packageLink.trim())) {
      setError('Please enter a valid GitHub link.');
      return;
    }

    if (!version1 || !version2 || !version3) {
      setError('Please enter a valid version number.');
      return;
    }

    if (
      !Number.isInteger(Number(version1)) ||
      !Number.isInteger(Number(version2)) ||
      !Number.isInteger(Number(version3))
    ) {
      setError('Version numbers must be integers.');
      return;
    }

    // Sanitize packageName to remove invalid S3 key characters
    const sanitizedPackageName = packageName.trim().replace(/[^a-zA-Z0-9\-_.]/g, '_');

    // File parameters
    const params = {
      Bucket: S3_BUCKET,
      Key: `${sanitizedPackageName}/v${version1}.${version2}.${version3}/package.zip`,
      Body: zipFile,
    };

    // Uploading file to S3
    try {
      await s3.putObject(params).promise();
      alert('File uploaded successfully.');
      setZipFile(null);
      setPackageName('');
      setPackageLink('');
      setVersion1('');
      setVersion2('');
      setVersion3('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('File upload failed.');
    }
  };

  // Function to delete file from S3
  const deleteFile = async () => {
    if (!packageName.trim()) {
      setError('Please enter the package name of the file to delete.');
      return;
    }

    if (!version1 || !version2 || !version3) {
      setError('Please enter the version number of the file to delete.');
      return;
    }

    if (
      !Number.isInteger(Number(version1)) ||
      !Number.isInteger(Number(version2)) ||
      !Number.isInteger(Number(version3))
    ) {
      setError('Version numbers must be integers.');
      return;
    }

    // Sanitize packageName to match the one used during upload
    const sanitizedPackageName = packageName.trim().replace(/[^a-zA-Z0-9\-_.]/g, '_');

    const params = {
      Bucket: S3_BUCKET,
      Key: `${sanitizedPackageName}/v${version1}.${version2}.${version3}/package.zip`,
    };

    // Deleting file from S3
    try {
      await s3.deleteObject(params).promise();
      alert('File deleted successfully.');
      setZipFile(null);
      setPackageName('');
      setVersion1('');
      setVersion2('');
      setVersion3('');
      setError('');
    } catch (err) {
      console.error(err);
      setError('File deletion failed.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateFile(file);
  };

  const validateFile = (file) => {
    if (file && file.type === 'application/zip') {
      setZipFile(file);
      setError('');
    } else {
      setError('Please upload a valid zip file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateFile(file);
  };

  return (
    <div className="container">
      <h2>Upload External Package</h2>
      <form onSubmit={(e) => e.preventDefault()} className="form">
        <label
          className={`file-drop ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {zipFile ? zipFile.name : 'Drag and drop a zip file here, or click to select'}
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
        <div className="form-group">
          <label>Package Name:</label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Package Link:</label>
          <input
            type="text"
            value={packageLink}
            onChange={(e) => setPackageLink(e.target.value)}
            required
          />
        </div>
        <div className="form-group version-input">
          <label>Version:</label>
          <div className="version-inputs">
            <input
              type="text"
              value={version1}
              onChange={(e) => setVersion1(e.target.value)}
              required
            />
            <span>.</span>
            <input
              type="text"
              value={version2}
              onChange={(e) => setVersion2(e.target.value)}
              required
            />
            <span>.</span>
            <input
              type="text"
              value={version3}
              onChange={(e) => setVersion3(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="button-group">
          <button onClick={uploadFile} type="button">Submit</button>
          <button onClick={deleteFile} type="button" className="delete-button">Delete</button>
        </div>
      </form>
    </div>
  );
}

export default ExternalPackage;
