import React, { Component } from 'react'
import Product from './Product'
import TitleStyle from './TitleStyle'
import {ProductConsumer} from '../context'
import {storeProducts} from '../data'

export default class ProductList extends Component {
  state ={
    produts: storeProducts
  }


  render() {
    return (
      <>
        <div className="py-5">
          <div className="container">
            {/* row for the product */}
            <TitleStyle name="our" title="product" />
            <div className="row">
              {/* {JSON.stringify(storeProducts)} */}
              <ProductConsumer>
                {valProp => {
                  return <h1>{valProp}</h1>;
                }}
              </ProductConsumer>
            </div>
          </div>
        </div>
      </>
      // <Product />
    );
  }
}
