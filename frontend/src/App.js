// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUploadComponent from './FileUploadComponent';
import ProcessChartsComponent from './ProcessChartsComponent';
import ViewChartsComponent from './ViewChartsComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUploadComponent />} />
        <Route path="/process-charts" element={<ProcessChartsComponent />} />
        <Route path="/view-charts/:chartName" element={<ViewChartsComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
