import React, { Component } from "react";
import { storeProducts, detailProduct } from "./productData/data";

const ProductContext = React.createContext();
//Provider
//Consumer

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct,
    cart : [],
    modalOpen: false,
    modalProduct: detailProduct,
  };

  // life cycle methods to render products
  componentDidMount() {
    this.setProducts();
  }

  // setting up and empty array for products to avoid obj reference issue
  setProducts = () => {
    let tempProducts = [];
    storeProducts.forEach(item => {
      //item = obj
      const singleItem = { ...item }; // coping the obj properties not referencing
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    });
  };
  // method that fetches product based on Id
  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };

  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { detailProduct: product };
    });
  };
  addToCart = id => {
    let tempProducts = [...this.state.products] //acess to all products in state;
    
    const index = tempProducts.indexOf(this.getItem(id)); // product index
    const product = tempProducts[index]; //specific product by index
    product.inCart = true;
    product.count = 1;
    //chaning the total from data.js
    const price = product.price;
    product.total = price;

    this.setState( () =>{
      return {product: tempProducts, cart: [...this.state.cart, product]}
    }, () => {
      console.log(this.state)
    })

  };

  openModal = id => {
    const product = this.getItem(id);
    this.setState( () => {
      return {modalProduct: product, modalOpen: true}
    })
  };

  closeModal = () => {
    this.setState( () => {
      return {modalOpen: false}
    })
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
