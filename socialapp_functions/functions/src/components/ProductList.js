import React, { Component } from 'react'
import Product from './Product'
import TitleStyle from './TitleStyle'
import {ProductConsumer} from '../context'

export default class ProductList extends Component {
  render() {
    return (
      <>
        <div className="py-5">
          <div className="container">
            {/* row for the product */}
            <TitleStyle name="our" title="Inventory" />
            <div className="row">
              {/* {JSON.stringify(storeProducts)} */}
              <ProductConsumer>
                { propVal => {
                  return propVal.products.map( data => {
                    return <Product key={data.id} product={data}/>

                  })
                }}
              </ProductConsumer>
            </div>
          </div>
        </div>
      </>
    );
  }
}
