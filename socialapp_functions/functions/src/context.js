import React, { Component } from 'react';

const ProductContext = React.createContext();
//Provider
//Consumer

function ProductProvider(props) {
  return (
    <ProductContext.Provider value='hello from context'>
        {props.children}
    </ProductContext.Provider>

  );
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer};