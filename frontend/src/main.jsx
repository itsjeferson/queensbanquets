import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';
import { LandingContentProvider } from './content/LandingContentContext.jsx';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import './styles/global.css';

function Root() {
  const isAdminRoute = window.location.pathname.replace(/\/$/, '') === '/admin';

  return isAdminRoute ? <AdminApp /> : <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LandingContentProvider>
      <Root />
    </LandingContentProvider>
  </React.StrictMode>,
);
