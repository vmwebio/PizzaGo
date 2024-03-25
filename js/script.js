import {toppingToogle} from "./modules/toppingToogle.js";
import {renderTopping} from "./modules/renderTopping.js";
import {renderPizzas} from "./modules/renderPizzas.js";

const init = () => {
    toppingToogle();
    renderTopping();
    renderPizzas();
};

init();