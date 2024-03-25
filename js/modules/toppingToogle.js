// Topping Show/Hide
export const toppingToogle = () => {
    const toppingButton = document.querySelector('.topping__button');
    const toppingList = document.querySelector('.topping__list');

    toppingButton.addEventListener('click', () => {
        if (!toppingList.classList.contains('topping__list_show')) {
            toppingList.classList.add('topping__list_show');
            toppingButton.classList.add('topping__button_active');
            // open animation
            toppingList.style.maxHeight = toppingList.scrollHeight + "px"
        } else {
            toppingButton.classList.remove('topping__button_active');
            // reset open animation
            toppingList.style.maxHeight = null;
            setTimeout(() => {
                toppingList.classList.remove('topping__list_show');
            }, 300)
        }
    });
};