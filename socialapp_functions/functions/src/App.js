import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductList from './components/ProductList'
import Details from './pages/Details'
import Cart from './pages/Cart'
import Default from './pages/Default'
import Modal from './components/Modal'


 class App extends Component {
  render() {
    return (
      <>

      <Navbar></Navbar>
      <Switch>
        <Route exact path='/' component={Home}></Route>
        <Route exact path='/products' component={ProductList}></Route>
        <Route path='/details' component={Details}></Route>
        <Route path='/cart' component={Cart}></Route>
        <Route  component={Default}></Route>
      </Switch>
      <Modal />
      </>
    )
  }
}

export default App;
