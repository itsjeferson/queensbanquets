import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AdminApp from './admin/AdminApp.jsx';
import { LandingContentProvider } from './content/LandingContentContext.jsx';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import '@fontsource/open-sans/latin-400.css';
import '@fontsource/open-sans/latin-500.css';
import '@fontsource/playfair-display/latin-400.css';
import '@fontsource/playfair-display/latin-500.css';
import './styles/global.css';

function Root() {
  const isAdminRoute = window.location.pathname.replace(/\/$/, '') === '/admin';

  return isAdminRoute ? <AdminApp /> : <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LandingContentProvider>
        <Root />
      </LandingContentProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
