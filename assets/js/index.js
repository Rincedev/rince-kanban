import modal from './modal.js';
import list from './list.js';
import card from './card.js';
import toast from './toast.js';

const app = {
    
    init() {
        modal.init();
        list.init();
        card.init();
        toast.init();
    },    
};

document.addEventListener("DOMContentLoaded", app.init);