import {capitalLetter, createLabel, createRadionInput} from "./helpers.js";
import {cartControll} from "./cartControll.js";

export const renderModalPizza = ({id, images, name, price, toppings}) => {
    const modalPizzaMain = document.querySelector('.modal-pizza__main');
    modalPizzaMain.textContent = ''; // сброс данных прежней модалки

    // Размер пиццы по умолчанию, 1-й элемент - 25см
    let size = Object.keys(price)[0]

    // Элемент изображения webp
    const picture = document.createElement('picture');
    const source = document.createElement('source');
    source.srcset = images[1]
    source.type = 'image/webp';
    // Элемент изображения оригинал
    const img = document.createElement('img');
    img.classList.add('modal-pizza__img');
    img.src = images[0];
    img.alt = name.ru;
    picture.append(source, img);

    // Элемент H2 название товара
    const title = document.createElement('h2');
    title.classList.add('modal-pizza__title');
    title.textContent = capitalLetter(name.ru);

    // Элемент параграф, топпинги товара
    const topping = document.createElement('p');
    topping.classList.add('modal-pizza__toppings');
    topping.textContent = capitalLetter(toppings.ru);

    // Элемент параграф, блока инфо
    const info = document.createElement('p');
    info.classList.add('modal-pizza__info');

    // Элемент span для цены
    const priceElem = document.createElement('span');
    priceElem.classList.add('modal-pizza__toppings');

    // Элемент span для слеша
    const slashElem = document.createElement('span');
    slashElem.textContent = '/';

    // Элемент span размера
    const sizeElem = document.createElement('span');
    sizeElem.classList.add('modal-pizza__toppings');

    // Цена и размеры при выборе checked
    const  updatePrice = () => {
        const selectedSizeInput = formElem.querySelector('input[name="size"]:checked');
        size = selectedSizeInput.value;
        priceElem.textContent = `${price[size]} ₽`;
        sizeElem.textContent = `${parseInt(size)} см`;
    };

    info.append(priceElem, slashElem, sizeElem);

    // Форма с элементами выбора формы пиццы
    const formElem = document.createElement('form');
    formElem.id = id;
    formElem.classList.add('modal__pizza-form');
    // Элемент div
    const divElem = document.createElement('div');
    divElem.classList.add('modal-pizza__group-fieldset');

    // Элемент fieldset Crust (Тесто)
    const fieldsetCrust = document.createElement('fieldset');
    fieldsetCrust.classList.add('modal-pizza__fieldset');
    // Элемент fieldset Size (Размер)
    const fieldsetSize = document.createElement('fieldset');
    fieldsetSize.classList.add('modal-pizza__fieldset');

    // Элемент radio для 'Пышное тесто'
    const thickInput = createRadionInput('modal-pizza__radio', 'thick', 'crust', 'thick'); // className, id, name, value
    thickInput.checked = true;
    // Элемент label для 'Пышное тесто'
    const thickLabel = createLabel('modal-pizza__label', 'thick', 'Пышное тесто'); // className, forId, labelText

    // Элемент radio для 'Тонкое тесто'
    const thinInput = createRadionInput('modal-pizza__radio', 'thin', 'crust', 'thin');
    // Элемент label для 'Тонкое тесто'
    const thinLabel = createLabel('modal-pizza__label', 'thin', 'Тонкое тесто');

    // Элементы radio input для размеров
    const sizeInputs = Object.keys(price).map(size => createRadionInput('modal-pizza__radio', size, 'size', size)); // className, id, name, value
    sizeInputs[0].checked = true;
    // Элементы label для размеров
    sizeInputs.forEach(input => {
        const label = createLabel('modal-pizza__label', input.id, `${parseInt(input.value)} см`);
        input.addEventListener('change', updatePrice);
        // Элементы всех размеров
        fieldsetSize.append(input, label);
    });


    // Элемент кнопка 'Добавить в корзину'
    const addCartButton = document.createElement('button');
    addCartButton.classList.add('modal-pizza__add-cart');
    addCartButton.type = 'submit';
    addCartButton.textContent = 'Добавить в корзину';

    // Объединяем элементы - форма пиццы, цена и размеры в модалке заказа
    formElem.append(divElem);
    divElem.append(fieldsetCrust, fieldsetSize, addCartButton);
    // Элементы - Пышное и Тонкое тесто
    fieldsetCrust.append(thickInput, thickLabel, thinInput, thinLabel);

    // Элемент кнопка 'Закрыть'
    const closeButton = document.createElement('button');
    closeButton.classList.add('modal__close');
    closeButton.innerHTML= `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14.8333" y="4" width="0.851136" height="15.3204" transform="rotate(45 14.8333 4)" fill="#C1AB91"/>
            <rect x="4" y="4.60181" width="0.851136" height="15.3204" transform="rotate(-45 4 4.60181)" fill="#C1AB91"/>
        </svg>
    `;

    // Формируем все элементы в модалке
    modalPizzaMain.append(picture, title, topping, info, formElem, closeButton);

    updatePrice();

    let timerId = -1;

    // console.log(formElem)

    // Добавить товар в корзину и разблокировать кнопку через 3 секунды
    formElem.addEventListener('submit', (e) => {
        e.preventDefault();

        const  formData = new FormData(formElem);

        const  product = {
            cartId: crypto.randomUUID(),
            id,
            crust: formData.get('crust'),
            size: formData.get('size'),
        };

        // console.log(product);
        cartControll.addCart(product); // Добавляем товар в localStorage

        addCartButton.disabled = true;
        addCartButton.textContent = 'Добавлено!';

        timerId = setTimeout(() => {
            addCartButton.disabled = false;
            addCartButton.textContent = 'Добавить в корзину';
        }, 3000);
    });

    // Изменение параметров товара также разблокируют кнопку
    formElem.addEventListener('change', () => {
        clearTimeout(timerId);
        addCartButton.disabled = false;
        addCartButton.textContent = 'Добавить в корзину';
    });
};