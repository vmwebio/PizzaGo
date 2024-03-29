export const modalCartController = {
    // Данные корзины в localStorage с именем cart
    cartData: JSON.parse(localStorage.getItem('cart') || '[]'),
    // Добавляем товар в localStorage
    addCart(product) {
        this.cartData.push(product);
        localStorage.setItem('cart', JSON.stringify(this.cartData)); // массив в json
    },
    removeCart(cartId) {
        this.cartData = this.cartData.filter(item => item.cartId !== cartId)
        localStorage.setItem('cart', JSON.stringify(this.cartData));
    },
    clearCart() {
        this.cartData = [];
        localStorage.setItem('cart', JSON.stringify(this.cartData));
    }
}