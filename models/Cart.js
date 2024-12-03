class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  addItem(product) {
    this.totalPrice += product.price;
    this.totalQuantity++;

    for (let item of this.items) {
      if (item.product._id === product._id.toString()) {
        item.quantity++;
        item.totalPrice += product.price;
        return;
      }
    }

    this.items.push({
      product,
      quantity: 1,
      totalPrice: product.price,
    });
  }

  deleteCartItem(product) {
    const itemIndex = this.items.findIndex(
      (item) => item.product._id === product._id.toString()
    );

    if (itemIndex !== -1) {
      const item = this.items[itemIndex];
      this.totalQuantity -= item.quantity;
      this.totalPrice -= item.totalPrice;
      this.items.splice(itemIndex, 1); // Remove item from array
    }
  }

  updateCartItem(product, newQuantity) {
    if (newQuantity <= 0) {
      this.deleteCartItem(product);
      return { updatedPrice: 0 };
    }

    for (let item of this.items) {
      if (item.product._id === product._id.toString()) {
        const quantityChange = newQuantity - item.quantity;
        item.quantity = newQuantity;
        item.totalPrice = newQuantity * product.price;
        this.totalQuantity += quantityChange;
        this.totalPrice += quantityChange * product.price;
        return { updatedPrice: item.totalPrice };
      }
    }
  }
}

module.exports = Cart;