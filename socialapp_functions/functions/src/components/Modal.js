import React, { Component } from "react";
import { ProductConsumer } from "../context";
import { ButtonStyle } from "./ButtonStyle";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { CartBtnStyle } from '../pages/Details'


export default class Modal extends Component {
  render() {
    return (
      <ProductConsumer>
        {value => {
          const { modalOpen, closeModal } = value;
          const { img, title, price } = value.modalProduct;

          if (!modalOpen) {
            return null;
          } else {
            return (
              <ModalContainer>
                <div className="container">
                  <div className="row">
                    <div id='modal' className="col-8 mx-auto col-md-6 col-lg-4 text-center text-capitalize p-5">
                      <h5>item in cart</h5>
                      <img src={img} className='img-fluid' />
                      <h5 className='text-muted'>{title}</h5>
                      <h5 className='text-muted'>price: $ {price}</h5>
                      <Link to='/'>
                        <ButtonStyle className='cartBtn' style={CartBtnStyle} onClick={()=>closeModal()}>
                          continue shopping
                        </ButtonStyle>
                      </Link>
                      <Link to='/cart'>
                        <ButtonStyle onClick={()=>closeModal()}>
                          go to cart
                        </ButtonStyle>
                      </Link>
                    </div>
                  </div>
                </div>
              </ModalContainer>
            );
          }
        }}
      </ProductConsumer>
    );
  }
}

const ModalContainer = styled.div`
position: fixed;
top: 0;
left: 0;
right: 0;
bottom:0;
background: rgba(0,0,0,0.4);
display: flex;
align-items: center;
justify-content: center;
#modal{
  background: var(--mainWhite);
  pading
}
`;
