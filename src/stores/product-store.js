import { writable } from 'svelte/store';

const product = writable([]);

const customProductStore = {
  subscribe: product.subscribe,

  setProduct: (productArray) => {
    product.set(productArray);
  },

  addProduct: productData => {
    const newProduct = {
      ...productData
    };
    product.update(items => {
      return [newProduct, ...items];
    });
  },

  updateProduct: (id, productData) => {
    product.update(items => {
      const productIndex = items.findIndex(i => i._id === id);
      const updatedProduct = { ...items[productIndex], ...productData };
      const updatedProducts = [...items];
      updatedProducts[productIndex] = updatedProduct;
      return updatedProducts;
    });
  },

  removeProduct: id => {
    product.update(items => {
      return items.filter(i => i._id !== id);
    });
  },

  toggleFavorite: id => {
    product.update(items => {
      const updatedProduct = { ...items.find(m => m._id === id) };
      updatedProduct.isFavorite = !updatedProduct.isFavorite;
      const productIndex = items.findIndex(m => m._id === id);
      const updatedProducts = [...items];
      updatedProducts[productIndex] = updatedProduct;
      return updatedProducts;
    });
  }

};

export default customProductStore;
