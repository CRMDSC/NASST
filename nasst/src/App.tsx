import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ThemeProvider as MaterialUIProvider } from "@mui/material/styles";
import { muiTheme } from './theme';
import { Button } from '@mui/material';
import LoginPage from "../src/views/LoginIn/login"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "mobx-react";
import  store from "./store/rootStore"
import RegisterPage from './views/Register/Register';
import AdminDashboard from './views/AdminDashboard/adminDashboard';
import Teams from './views/Teams/TeamPage';
import Players from "./views/Players/PlayersPage";
import SportsTypes from "./views/SportTypes/sportTypesPage";


function App() {
  return (
    <Provider root={store} user={store.user} token={store.token}>
    <MaterialUIProvider theme={muiTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/SignUp" element={<RegisterPage />} />
          <Route path="/adminDashboard" element={<AdminDashboard user={store.user}/>} />
          <Route path="/adminDashboard/teams" element={<Teams/>} />
          <Route path="/adminDashboard/players" element={<Players/>} />
          <Route path="/adminDashboard/sportsTypes" element={<SportsTypes/>} />
        </Routes>
      </Router>
    </MaterialUIProvider>
    </Provider>
  );
}

export default App;
