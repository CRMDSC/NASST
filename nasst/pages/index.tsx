import React, { Component, useEffect } from 'react';
import LoginPage from "../src/views/LoginIn/login"
import  store from "../src/store/rootStore"


function App() {
  useEffect(() => {
    (window as any).root = store;
}, []);
  return (
    
    <LoginPage />
  );
}

export default App;
