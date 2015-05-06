import React from 'react'
import { RouteHandler } from "react-router"
import Header from '../Header/Header'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />        
        <RouteHandler />
      </div>
    );
  }
};