import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change if you're using React 18+
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);