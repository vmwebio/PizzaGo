import {hideLoader, showLoader} from "./loader.js";

export const getData = async (url) => {
    showLoader();

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка');
        }

        return await response.json()

    } catch (error) {
        console.log(`Вы получили ошибку, поскольку мы не можем получить данные о продукте для пиццы. ${error}`);
        return [];
    }   finally {
        hideLoader()
    }
};