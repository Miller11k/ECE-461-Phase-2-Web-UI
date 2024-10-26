import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Upload.css'; // Import the CSS file

function Upload() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Upload Package</h1>
      <div>
        <Link to="external-package">
          <button className="button-custom">External Package</button>
        </Link>
        <Link to="internal-package" style={{ marginLeft: '10px' }}>
          <button className="button-custom">Internal Package</button>
        </Link>
      </div>

      <Outlet />
    </div>
  );
}

export default Upload;