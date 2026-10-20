// Keeps only the fields we need when a product is saved or added to the cart.
export function toProductItem(product = {}) {
  return {
    id: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    category: product.category,
    stock: product.stock,
  };
}
