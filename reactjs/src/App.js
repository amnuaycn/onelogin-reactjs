import logo from './logo.svg';
import './App.css';
import { useAuth } from "oidc-react";
import React from "react";
import CallApi from './CallApi';
function App() {
  const auth = useAuth();


  if (auth.isLoading) {
      return <div className="App">Loading...</div>;
  }

  if (auth.error) {
      return <div className="App">Oops... {auth.error.message}</div>;
  }

  if (auth && auth.userData) {
      const callapi = CallApi();
      return (
      <div className="App">
          access_token: {auth.userData.access_token}
          <br/>
          id_token: {auth.userData.id_token}
          <br/>
          refresh_token: {auth.userData.refresh_token}
          <br/>
          <button onClick={() => auth.signOut()}>Log out!</button>
          <br/>
          { callapi}
      </div>
    
      );
  
  }
  return (<div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>OIDC React</p>
          <button onClick={() => void auth.signIn()}>Log in</button>
        </header>
 </div>
  );
  
  
}

export default App;

