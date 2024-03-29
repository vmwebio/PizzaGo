import {getData} from "./getData.js";
import {renderPizzas} from "./renderPizzas.js";
import {capitalLetter} from "./helpers.js";

export const renderTopping = async () => {
    const { en: enTopping, ru: ruTopping } = await getData('https://go-go-pizza-api-7abw.onrender.com/api/toppings');
    const toppingList = document.querySelector('.topping__list');
    toppingList.textContent = '';

    const items = enTopping.map((enName, index) => {
        const item = document.createElement('li');
        item.classList.add('topping__item');
        item.innerHTML = `
            <input 
                class="topping__checkbox" 
                type="checkbox" 
                name="topping" 
                value="${enName}" 
                id="${enName}"
            >
            <label class="topping__label" for="${enName}">         
                ${capitalLetter(ruTopping[index])}
            </label>
        `;

        return item;
    });

    toppingList.append(...items);

    // Кнопка "Сбросить" в топпинг фильтре
    const itemReset = document.createElement('li');
    itemReset.classList.add('topping__item');
    const btnReset = document.createElement('button');
    btnReset.classList.add('topping__reset');
    btnReset.textContent = 'Сбросить';
    btnReset.type = 'reset';
    itemReset.append(btnReset);

    // Топпинг фильтр
    const toppingForm = document.querySelector('.topping__form');
    toppingForm.addEventListener('change', (event) => {
        const formData = new FormData(toppingForm);
        const checkedTopping = [];

        for (const [, value] of formData.entries()) {
            checkedTopping.push(value)
        }

        renderPizzas(checkedTopping);

        // Reset Button - Show/Hide
        if (checkedTopping.length) {
            toppingList.append(itemReset)
        } else {
            itemReset.remove(); // удалить кнопку "Сбросить" когда все топпинги отключены (unchecked)
        }
    });

    btnReset.addEventListener('click', () => {
        itemReset.remove(); // удалить, когда форма сброшена
        toppingForm.reset();
        renderPizzas();
    })
};