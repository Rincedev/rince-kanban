import api from './api.js';
import modal from './modal.js';
import toast from './toast.js';

const card = {
    init() {
        this.bind();
    },

    bind() {
        document.querySelector('#add-card-modal form').addEventListener('submit', this.handleAddCard);
        document.querySelector('#modify-card-modal form').addEventListener('submit', this.handleModifyCard);
        document.querySelector('#confirm-delete-card-modal form').addEventListener('submit', this.handleDeleteCard);
    },

    async handleAddCard(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        
        if (!data.position) {
            data.position = document.querySelectorAll('[data-type="card"]').length + 1;
        }
        data.list_id = document.querySelector('#add-card-modal').dataset.listId;
        console.log(data);

        const createdCard = await api.createCard(data);

        if (createdCard === null) {
            alert('Impossible de créer la carte !');
            return;
        }
        
        const cardsList = document.querySelector(`[data-type="list"][data-id="${createdCard.list_id}"] .message-body`);

        card.addToList(createdCard, cardsList);
        modal.close();
        form.reset();       
        
    },

    async handleModifyCard(event) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        
        const cardId = document.querySelector('#modify-card-modal').dataset.cardId;        
        const modifiedCard = await api.updateCard(cardId, data);

        if (modifiedCard === null) {
            toast.error('Impossible de modifier la carte !');
            return;
        }

        toast.success('Carte modifiée avec succès !');

        const cardElement = document.querySelector(`[data-type="card"][data-id="${cardId}"]`);
        cardElement.querySelector('[slot="card-content"]').textContent = modifiedCard.content;

        form.reset();
        modal.close();
    },

    async handleDeleteCard(event) {
        event.preventDefault();
        const cardId = document.querySelector('#confirm-delete-card-modal').dataset.cardId;
        const deletedCard = await api.deleteCard(cardId);

        if (deletedCard === null) {
            toast.error('Impossible de supprimer la carte !');
            return;
        }

        const cardElement = document.querySelector(`[data-type="card"][data-id="${cardId}"]`);
        cardElement.remove();
        modal.close();
        toast.success('Carte supprimée avec succès !');
        
    },

    addToList(card, cardsList) {
        const cardTemplate = document.getElementById('card-template');
        const cardClone = cardTemplate.content.cloneNode(true);
        cardClone.querySelector('[slot="card-content"]').textContent = card.content;

        cardClone.querySelector('#modify-card-button').addEventListener('click', () => {
            document.querySelector('#modify-card-modal').dataset.cardId = card.id;            
            modal.open('#modify-card-modal');
        });

        cardClone.querySelector('#delete-card-button').addEventListener('click', () => {
            document.querySelector('#confirm-delete-card-modal').dataset.cardId = card.id;
            modal.open('#confirm-delete-card-modal');
        });
        cardClone.querySelector("[data-id]").dataset.id = card.id;
        

        cardsList.append(cardClone);
    },

    async updateCardPositions(newOrder) {
      try {
        console.log(newOrder);
        for (const card of newOrder) {
          const response = await api.updateCard(card.id, { position: card.position, list_id: card.list_id });
          
          if (response === null) {
            console.error(`Erreur lors de la mise à jour de la position pour la carte avec l'ID ${card.id}`);
            continue;
          }

          console.log(`Position mise à jour pour la carte avec l'ID ${card.id}`);
        }
      } catch (error) {
        console.error('Erreur réseau lors de la mise à jour des positions', error);
      }
    },
    

    
    
    
}

export default card;
