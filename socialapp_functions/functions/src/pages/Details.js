import React, { Component } from "react";
import { ProductConsumer } from "../context";
import { Link } from "react-router-dom";
import { ButtonStyle } from "../components/ButtonStyle";

export default class Details extends Component {
  render() {
    return (
      <ProductConsumer>
        {value => {
          const {
            id,
            company,
            img,
            info,
            price,
            title,
            inCart
          } = value.detailProduct;
          return (
            <div className="container py-5">
              {/* title section */}
              <div className="row">
                <div className="col-10 mx-auto text-center text-slanted text-blue my-5">
                  <h1>{title}</h1>
                </div>
              </div>
              {/* product info section */}
              <div className="row">
                <div className="col-10 mx-auto col-md-6 my-3">
                  <img src={img} className="img-fluid" alt="productImg" />
                </div>
                {/* product info txt */}
                <div className="col-10 mx-auto col-md-6 my-3 text-capitalize">
                  <h2>Dessert Type: {title}</h2>
                  <h4 className="text-title text-uppercase text-muted mt-3 mb-2">
                    made by: <span className="text-uppercase ">{company}</span>
                  </h4>
                  <h4 className="text-blue">
                    <strong>
                      price: <span>${price}</span>
                    </strong>
                  </h4>
                  <p className="text-capitalize font-weight-bold mt-3 mb-0">
                    product despcription
                  </p>
                  <p className="text-muted lead">{info}</p>
                  {/* buttons section */}
                  <Link to="/" className="ml-auto">
                    <ButtonStyle>
                      Back to Product
                    </ButtonStyle>
                  </Link>
                  <ButtonStyle
                  className='cartBtn'
                  style={CartBtnStyle}
                  disabled = {inCart ? true : false}
                  onClick = {() => {
                    value.addToCart(id);
                    value.openModal(id);
                  }}
                  >
                    {inCart ? 'inCart' : 'add to cart'}
                  </ButtonStyle>
                </div>
              </div>
            </div>
          );
        }}
      </ProductConsumer>
    );
  }
}
export const CartBtnStyle = {
  borderColor: 'var(--mainYellow)',
  color: 'var(--mainYellow)',
  hover:{
    background: "var(--mainYellow)"
  }
}

