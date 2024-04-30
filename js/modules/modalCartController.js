import {cartControll} from "./cartControll.js";
import {getData} from "./getData.js";
import {capitalLetter} from "./helpers.js";

const cartListElem = document.querySelector('.modal-cart__list');
const cartPriceElem = document.querySelectorAll('.modal-cart__price');
const cartButtons = document.querySelectorAll('.modal-cart__btn');
const cartButtonNext = document.querySelector('.modal-cart__continue');
const cartButtonPrev = document.querySelector('.modal-cart__prev');
const cartInputs = document.querySelector('.modal-cart__fieldset');
const cartSubmit = document.querySelector('.modal-cart__send-order');
const cartBlockElem = document.querySelector('.modal-cart__block');
const cartDeliveryElem = document.querySelector('.modal-cart__delivery');
const cartForm = document.querySelector('.modal-cart__form');
const deliveryInfo = document.querySelector('.modal-cart__delivery-info');
const headerCartButton = document.querySelector('.header__cart');
const heroOrderButton = document.querySelector('.hero__order');

const renderCartList = async () => {
    let totalPrice = 0;

    if (cartControll.cartData.length) {
        cartListElem.textContent = '';
        cartButtonNext.disabled = false;

        // Получаем все товары в корзине
        const cardsData = await  Promise.all(
            cartControll.cartData.map(
                async (item) =>
                    await getData(
                        `https://festive-inconclusive-jupiter.glitch.me/api/products/${item.id}`,
                    ),
            ),
        );

        // Формируем карточку товара в корзине
        const cardsCart = cardsData.map ((data, index) => {
            const  item = cartControll.cartData[index];

            const cardCart = document.createElement('li');
            cardCart.classList.add('modal-cart__item');

            cardCart.innerHTML = `
                    <picture>
                        <source srcset="${data.images[1]}" type="image/webp">
                        <img class="modal-cart__image" src="${data.images[0]}" width="63" height="63" alt="${capitalLetter(data.name['ru'])}">
                    </picture>

                    <div class="modal-cart__content">
                        <h3 class="modal-cart__title-pizza">${capitalLetter(data.name['ru'])}</h3>
                        <p class="modal-cart__info-pizza">
                            <span class="modal-cart__price-pizza">${data.price[item.size]}&nbsp;₽</span>
                            <span>/</span>
                            <span class="modal-cart__weight-pizza">${parseInt(item.size)} см</span>
                        </p>
                    </div>
                    <button class="modal-cart__delete-button" data-id="${item.cartId}">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.4549 4.01401C11.3985 4.00992 11.3805 4.01242 11.3579 3.99904L11.3522 3.43064C11.2979 3.41032 11.2015 3.42189 11.1407 3.42189L8.70136 3.42086V4.01348L7.73452 4.01392L7.73349 3.00582C7.73333 2.72455 7.65345 2.33685 8.03552 2.29858L11.7298 2.30315C12.0624 2.30324 12.3344 2.23977 12.3353 2.69883L12.3345 4.01423L11.4549 4.01401Z" fill="#C1AB91"></path>
                            <path d="M15.3507 16.174C15.2392 16.6674 14.9551 17.2592 14.3936 17.3414C14.2455 17.363 14.0776 17.3491 13.9275 17.3492L6.00015 17.3485C5.65702 17.3475 5.40171 17.3159 5.14284 17.0553C4.5339 16.4421 4.61993 15.4641 4.61956 14.6723L4.61746 6.06336C4.59609 6.03136 4.48624 6.05367 4.44859 6.05367L3.77281 6.05352C3.38871 6.05317 3.35065 6.03086 3.34968 5.60977C3.34937 5.46586 3.30965 5.12292 3.37262 5.00142L3.39212 4.96339C3.43021 4.89298 3.48177 4.85839 3.55674 4.8362L16.0585 4.83686C16.2029 4.83683 16.3554 4.82702 16.4991 4.83989C16.7356 4.86105 16.7032 5.09483 16.7041 5.24905L16.7068 5.78127C16.7066 6.08752 16.4049 6.05405 16.1876 6.0542L15.4515 6.05336C15.4305 6.06827 15.4378 6.29108 15.4377 6.32805L15.4364 15.1909C15.4362 15.5305 15.4155 15.8385 15.3507 16.174ZM12.5871 8.00598L12.5891 14.863L13.9216 14.8637L13.9259 8.00652L12.9954 8.00552C12.8661 8.00536 12.7147 7.98989 12.5871 8.00598ZM6.12246 8.00611L6.12071 14.8636L7.45806 14.8637L7.45331 8.00689L6.12246 8.00611ZM9.34309 8.00598L9.34699 14.6687C9.34709 14.7314 9.34087 14.8014 9.35162 14.8628L10.6999 14.8599L10.7015 8.01195C10.6744 7.99998 10.6332 8.00592 10.6035 8.00592L9.34309 8.00598Z" fill="#C1AB91"></path>
                        </svg>
                    </button>
                `;

            totalPrice += data.price[item.size];

            return cardCart;
        });
        // Формируем список товаров в корзине
        cartListElem.append(...cardsCart);

    } else {
        cartListElem.innerHTML = '<li>Корзина пуста</li>';
        cartButtonNext.disabled = true;
    }

    // Общая сумма товаров в корзине
    cartPriceElem.forEach(elem => elem.textContent = `${totalPrice} ₽`);
};

// Удаление товара из корзины
const delCartItem = (e) => {
    {
        const deleteButton = e.target.closest('.modal-cart__delete-button');

        if (deleteButton) {
            const cartId = deleteButton.dataset.id;
            cartControll.removeCart(cartId);
            renderCartList();
        }
    }
};

// Переход из окна корзины в доставку и обратно
const changeNextBlock = () => {
    cartBlockElem.style.display = 'none';
    cartDeliveryElem.style.display = 'block';
};
const changePrevBlock = () => {
    cartBlockElem.style.display = 'block';
    cartDeliveryElem.style.display = 'none';
};

// Вывод списка товаров в корзине
const submitOrder = ( async (e) => {
    e.preventDefault();
    const formData = new FormData(cartForm);
    const data = Object.fromEntries(formData);
    data.pizzas = cartControll.cartData;

    try {
        const  response = await fetch('https://festive-inconclusive-jupiter.glitch.me/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Отправка заказа не удалась');
        }

        const order = await response.json();

        cartControll.clearCart();

        deliveryInfo.innerHTML = `
                <h3>Заказ оформлен, номер заказа ${order.orderId}</h3>                
            `;

        // Блокировка формы заказа после отправки
        [cartButtonNext, cartButtonPrev, cartInputs, cartSubmit].forEach((btn) => btn.disabled = true);


    } catch (err) {
        console.log(`Ошибка при отправке заказа: ${err}`);
    }
});


export const modalCartController = () => {

    // События модального окна корзины для повторного заказа
    const openModalHandler = () => {
        // Сброс текущего шага обработки заказа и возврат к начальному шагу
        cartBlockElem.style.display = 'block';
        cartDeliveryElem.style.display = 'none';

        // Очистка прежнего сообщения о номере заказа
        deliveryInfo.innerHTML = '';

        // Очистка формы прежнего заказа
        cartForm.reset();

        // Разблокировка формы
        [cartButtonPrev, cartInputs, cartSubmit].forEach((btn) => btn.disabled = false);

    };

    // Обработчики события на открытия модального окна корзины по классу header__cart и hero__order
    headerCartButton.addEventListener('click', openModalHandler);
    heroOrderButton.addEventListener('click', openModalHandler);

    renderCartList();

    // Событие удаления товара из корзины
    cartListElem.addEventListener('click', delCartItem);

    // События перехода из окна корзины в доставку и обратно
    cartButtonNext.addEventListener('click', changeNextBlock);
    cartButtonPrev.addEventListener('click', changePrevBlock);

    // Отправить заказ
    cartForm.addEventListener('submit', submitOrder);

}
