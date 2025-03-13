import modal from './modal.js';
import api from './api.js';
import card from './card.js';
import toast from './toast.js';

const list = {
    init() {
        this.bind();
        this.load();
        this.initListSortable();
    },

    bind() {

      document.getElementById("add-list-button").addEventListener("click", () => modal.open("#add-list-modal"));
      
      
      document.querySelector("#add-list-modal form").addEventListener('submit', this.handleAddList);

      document.querySelector("#modify-list-modal form").addEventListener('submit', this.handleModifyList);

      document.querySelector("#confirm-delete-list-modal form").addEventListener('submit', this.handleDeleteList);
  },

  async handleDeleteList(event) {
    event.preventDefault();
    const listId = document.querySelector('#confirm-delete-list-modal').dataset.listId;
    const deletedList = await api.deleteList(listId);

    if (deletedList === null) {
      toast.error('Impossible de supprimer la liste !');
      return;
    }

    const listElement = document.querySelector(`[data-type="list"][data-id="${listId}"]`);
    listElement.remove();

    modal.close();   

    toast.success('Liste supprimée avec succès !');
    
  },

  async handleModifyList(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    console.log(data);

    const listId = document.querySelector('#modify-list-modal').dataset.listId;
    
    const modifiedList = await api.updateList(listId, data);

    if (modifiedList === null) {
      toast.error('Impossible de modifier la liste !');
      return;
    }

    toast.success('Liste modifiée avec succès !');

    const listElement = document.querySelector(`[data-id="${listId}"]`);
    listElement.querySelector('[slot="list-title"]').textContent = modifiedList.title;
         
    form.reset();
    modal.close();

  },

  async handleAddList(event) {
      
      event.preventDefault();
     
      const form = event.currentTarget;
      
      const data = Object.fromEntries(new FormData(form));

      if (!data.position) {
          data.position = document.querySelectorAll('[data-type="list"]').length + 1;
      }
     
      console.log(data);
     
      const createdList = await api.createList(data);

      if (createdList === null) {
          toast.error("Impossible de créer la liste !");
          return; 
      }

      toast.success('Liste créée avec succès !');
    
      list.addToDOM(createdList);

      
      modal.close();

      
      form.reset();
  },

  async load() {
      
      const lists = await api.getLists();
      console.log(lists);

      if (lists === null) {
          toast.error("Impossible de charger les listes !");
          return;
      } 
      
      lists.forEach(loadedList => list.addToDOM(loadedList));
  },

  
  addToDOM(list) {
      
      const template = document.getElementById('list-template');

      
      const clone = template.content.cloneNode(true);
// On met à jour les trous du template : titre de la liste
      clone.querySelector('[slot="list-title"]').textContent = list.title;
      clone.querySelector('[data-id]').dataset.id = list.id;
      
      const modifyListButton = clone.querySelector('#modify-list-button');
      const deleteListButton = clone.querySelector('#delete-list-button');
      const addCardButton = clone.querySelector('#add-card-button');
      
      modifyListButton.addEventListener('click', () => {
        document.querySelector('#modify-list-modal').dataset.listId = list.id;
        modal.open("#modify-list-modal");
      });

      deleteListButton.addEventListener('click', () => {  
        document.querySelector('#confirm-delete-list-modal').dataset.listId = list.id;        
        modal.open("#confirm-delete-list-modal");        
      });

      addCardButton.addEventListener('click', () => {
        document.querySelector('#add-card-modal').dataset.listId = list.id;
        modal.open("#add-card-modal");
      });
      
      const cardsList = clone.querySelector('.message-body');
      cardsList.dataset.listId = list.id;

      if (list.cards) {
        list.cards.forEach(listsCard => {
          card.addToList(listsCard, cardsList);
        });
      }
      
        const sortable = new Sortable(cardsList, {
          animation: 150,
          group: "cards",
          
          onEnd: async function (evt) {
            try {
              
              const newListId = evt.to.dataset.listId;
              
              
              const cardsInList = evt.to.querySelectorAll('[data-type="card"]');              
              
              const newOrder = Array.from(cardsInList).map((card, index) => ({
                id: card.dataset.id,
                position: index + 1,
                list_id: newListId
              }));

              await card.updateCardPositions(newOrder);
            } catch (error) {
              console.error('Erreur lors de la mise à jour des positions', error);
            }
          }
        });
      
      document.getElementById("lists-container").append(clone);

      
  },

  initListSortable() {
    const listContainer = document.getElementById("lists-container");
    const sortable = new Sortable(listContainer, {
      animation: 150,
      group: "lists",
      sort: true,
      handle: '.message-header',
      draggable: '.message.is-info',
      onEnd: async function (evt) {
        const listElements = listContainer.querySelectorAll('[data-type="list"]');
        const newOrder = Array.from(listElements).map((el, index) => ({
            id: el.dataset.id,
            position: index + 1
        }));

        await list.updateListPositions(newOrder);
      }
    });

  },

  async updateListPositions(newOrder) {
    try {
        
        for (const list of newOrder) {
            const response = await api.updateList(list.id, { position: list.position });

            if (response === null) {
                console.error(`Erreur lors de la mise à jour de la position pour la liste avec l'ID ${list.id}`);
                continue;
            }

            console.log(`Position mise à jour pour la liste avec l'ID ${list.id}`);
        }
    } catch (error) {
        console.error('Erreur réseau lors de la mise à jour des positions', error);
    }
},
    
};

export default list;

