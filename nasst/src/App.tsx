import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ThemeProvider as MaterialUIProvider } from "@mui/material/styles";
import { muiTheme } from './theme';
import { Button } from '@mui/material';
import LoginPage from "../src/views/LoginIn/login"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";


function App() {
  return (
    <MaterialUIProvider theme={muiTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </MaterialUIProvider>
  );
}

export default App;
