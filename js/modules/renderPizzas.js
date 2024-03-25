import {getData} from "./getData.js";

// Кнопка - "Сбросить фильтр", когда нет подходящик товаров
const btnReset = document.createElement('button');
btnReset.classList.add('pizza__reset-toppings');
btnReset.textContent = 'Сбросить фильтр';
btnReset.type = 'reset';
btnReset.setAttribute('form', 'toppings');

// Создать карточку товара
const createCard = (data) => {
    const card = document.createElement('article');
    card.classList.add('card', 'pizza__card');

    card.innerHTML = `
        <picture>
            <source src="${data.images[1]}" type="image/webp">
            <img class="card__image" src="${data.images[0]}" alt="${data.name.ru}">
        </picture>
        <div class="card__content">
            <h3 class="card__title">
                ${data.name['ru'][0].toUpperCase()}${data.name['ru'].slice(1).toLowerCase()}
            </h3>
            <p class="card__info">
                <span class="card__price">${data.price['25cm']}&nbsp;₽</span>
                <span>/</span>
                <span class="card__weight">25 см</span>
            </p>
            <button class="card__button" data-id="${data.id}">Выбрать</button>
        </div>                        
    `;

    return card;
};

// Запрос и рендер списка товаров и топпинг фильтра
export const renderPizzas = async (toppings) => {
    const pizzas = await getData(
        `https://go-go-pizza-api-7abw.onrender.com/api/products${
            toppings ? `?toppings=${toppings}` : ''
        }`,
    );
    const pizzaTitle = document.querySelector('.pizza__title');
    const pizzaList = document.querySelector('.pizza__list');
    pizzaList.textContent = '';

        if (pizzas.length) {
            pizzaTitle.textContent = 'Пицца';
            btnReset.remove();

            // Карточка товара
            const items = pizzas.map((data) => {
                const item = document.createElement('li');
                item.classList.add('pizza__item');
                const card = createCard(data);
                item.append(card);
                return item;
            });

            pizzaList.append(...items);
        } else {
            pizzaTitle.textContent = 'Такой пиццы у нас нет :('
            pizzaTitle.after(btnReset);
        }
};

// По клику кнопки сбросить все фильтры и показать все товары
btnReset.addEventListener('click', () => {
    renderPizzas();
    // document.querySelector('.topping__reset').remove();
});
