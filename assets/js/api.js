const api = {
    
    baseUrl: "https://rince-kanban-api-production.up.railway.app",

    /**
     * Appelle l'API de récupération des listes : GET /lists
     * @returns {Promise<Array>} La liste des listes
     */
    async getLists() {
        try {
            const response = await fetch(api.baseUrl + "/lists");
            
            if (!response.ok) {
                console.error(response);
                return null;
            }

            return await response.json();
        } catch (error) {            
            console.error(error);
            return null;
        }
    },

    /**
     * Appelle l'API de création d'une liste : POST /lists
     * @param {Object} data Les données du formulaire à envoyer à l'API POST /lists
     * @returns {Promise<Object>} La liste nouvellement créée
     */
    async createList(data) {
        try {
            const response = await fetch(api.baseUrl + '/lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            
            if (!response.ok) {                

                console.error(response);
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    /**
     * Appelle l'API de modification d'une liste : PUT /lists/:id
     * @param {string} listId L'id de la liste à modifier
     * @param {Object} data Les données du formulaire à envoyer à l'API PUT /lists/:id
     * @returns {Promise<Object>} La liste modifiée
     */
    async updateList(listId, data) {
        try {
            const response = await fetch(api.baseUrl + '/lists/' + listId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                console.error(response);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    /**
     * Appelle l'API de suppression d'une liste : DELETE /lists/:id
     * @param {string} listId L'id de la liste à supprimer
     * @returns {Promise<void>}
     */
    async deleteList(listId) {
        try {
            const response = await fetch(api.baseUrl + '/lists/' + listId, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error(response);
                return null;
            }
            return;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    /**
     * Appelle l'API de création d'une carte : POST /cards
     * @param {Object} data Les données du formulaire à envoyer à l'API POST /cards
     * @returns {Promise<Object>} La carte nouvellement créée
     */
    async createCard(data) {
        try {
            const response = await fetch(api.baseUrl + '/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                console.error(response);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    /**
     * Appelle l'API de modification d'une carte : PATCH /cards/:id
     * @param {string} cardId L'id de la carte à modifier
     * @param {Object} data Les données du formulaire à envoyer à l'API PATCH /cards/:id
     * @returns {Promise<Object>} La carte modifiée
     */
    async updateCard(cardId, data) {
        console.log(data);
        try {
            const response = await fetch(api.baseUrl + '/cards/' + cardId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                console.error(response);
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    /**
     * Appelle l'API de suppression d'une carte : DELETE /cards/:id
     * @param {string} cardId L'id de la carte à supprimer
     * @returns {Promise<void>}
     */
    async deleteCard(cardId) {
        try {
            const response = await fetch(api.baseUrl + '/cards/' + cardId, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error(response);
                return null;
            }
            return;
        } catch (error) {
            console.error(error);
            return null;
        }
    }   
};

export default api;
