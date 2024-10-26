import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Upload from './Upload';
import ViewDatabase from './ViewDatabase';
import DownloadPackage from './DownloadPackage';
import ExternalPackage from './package-types/ExternalPackage';
import InternalPackage from './package-types/InternalPackage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/view-database" element={<ViewDatabase />} />
        <Route path="/download-package" element={<DownloadPackage />} />
        {/* Define the parent route with a wildcard */}
        <Route path="/upload-package/*" element={<Upload />}>
          {/* Define child routes relative to the parent */}
          <Route path="external-package" element={<ExternalPackage />} />
          <Route path="internal-package" element={<InternalPackage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;