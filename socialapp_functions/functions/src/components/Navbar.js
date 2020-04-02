import React, { Component } from "react";
import {Link} from "react-router-dom";
import Navlogo from '../logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import {ButtonStyle} from "./ButtonStyle"


export default class Navbar extends Component {
  render() {
    return (
      <>
        <nav
          style={NavStyle}
          className="navbar navbar-expand-sm  navbar-dark px-sm-5"
        >
          <Link to="/">
            <img className="navbar-brand" src={Navlogo} alt="store" />
          </Link>
          <ul className="navbar-nav align-items-center">
            <li className="nav-item ml-5">
              <Link to="/products" className="nav-link">
                Baked Goods
              </Link>
            </li>
          </ul>
          <Link to="/cart" className="ml-auto">
            <ButtonStyle >
              <i className="fas fa-shopping-cart mr-2" />
              my cart
            </ButtonStyle>
          </Link>
        </nav>
      </>
    );
  }
}


  

const NavStyle = {
  background: 'var(--mainBlue)',
}

