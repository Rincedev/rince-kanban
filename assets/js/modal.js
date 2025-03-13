const modal = {
    init() {

      document.querySelectorAll(".close").forEach(element => {
        element.addEventListener("click", modal.close);
    });        
    },

    open(selector) {
        document.querySelector(selector).showModal();
    },

    close() {
        document.querySelector("dialog[open]").close();
    },
};

export default modal;
