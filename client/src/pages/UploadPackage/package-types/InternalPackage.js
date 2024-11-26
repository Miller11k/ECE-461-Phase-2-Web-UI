import React, { useState } from "react";
import AWS from "aws-sdk";
import './InternalPackage.css';

function InternalPackage() {
  const [zipFile, setZipFile] = useState(null);
  const [packageName, setPackageName] = useState('');
  const [version1, setVersion1] = useState('');
  const [version2, setVersion2] = useState('');
  const [version3, setVersion3] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [isDragging, setIsDragging] = useState(false);

  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET_NAME;
  const REGION = process.env.REACT_APP_AWS_REGION;

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_IAM_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_IAM_SECRET_KEY,
    region: REGION,
  });

  const s3 = new AWS.S3();

  const uploadFile = async () => {
    if (!zipFile) {
      setError('Please upload a zip file.');
      setSuccess('');
      return;
    }

    if (!packageName.trim()) {
      setError('Please enter a package name.');
      setSuccess('');
      return;
    }

    if (!version1 || !version2 || !version3) {
      setError('Please enter a valid version number.');
      setSuccess('');
      return;
    }

    if (
      !Number.isInteger(Number(version1)) ||
      !Number.isInteger(Number(version2)) ||
      !Number.isInteger(Number(version3))
    ) {
      setError('Version numbers must be integers.');
      setSuccess('');
      return;
    }

    const sanitizedPackageName = packageName.trim().replace(/[^a-zA-Z0-9\-_.]/g, '_');

    const params = {
      Bucket: S3_BUCKET,
      Key: `${sanitizedPackageName}/v${version1}.${version2}.${version3}/package.zip`,
      Body: zipFile,
    };

    setIsLoading(true); // Start loading
    setError('');
    setSuccess('');

    try {
      await s3.putObject(params).promise();
      setSuccess('File uploaded successfully.');
      setZipFile(null);
      setPackageName('');
      setVersion1('');
      setVersion2('');
      setVersion3('');
    } catch (err) {
      console.error(err);
      setError('File upload failed.');
    } finally {
      setIsLoading(false); // End loading
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
      setSuccess('');
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
      <h2>Upload Internal Package</h2>
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
        {success && <p className="success">{success}</p>}
        {isLoading && <p>Uploading...</p>} {/* Show loading message */}
        <div className="button-group">
          <button onClick={uploadFile} type="button" disabled={isLoading}>
            {'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InternalPackage;
