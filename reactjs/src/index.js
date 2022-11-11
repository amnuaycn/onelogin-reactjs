import React, {Route} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from 'oidc-react';
const oidcConfig = {
  authority: 'https://xxxx.onelogin.com/oidc/2/',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: 'http://localhost:3000'
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider {...oidcConfig}>
  <App />
  </AuthProvider>
);

