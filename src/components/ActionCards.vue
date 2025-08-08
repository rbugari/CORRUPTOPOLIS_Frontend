<template>
  <div class="action-cards-container">
    <div v-if="isLoading">{{ $t('action_cards.loading_actions') }}</div>
    <div v-if="error">{{ error }}</div>
    <transition-group name="card-fade-slide" tag="div" class="cards-grid">
      <div v-for="card in cards" :key="card.title" class="card" @click="selectCard(card)">
        <h4>{{ card.title }}</h4>
        <img v-if="card.image_url" :src="getCardImageUrl(card.image_url)" :alt="card.title" class="card-image" />
        <p>{{ card.description }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'ActionCards',
  props: {
    type: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cards: [],
      isLoading: false,
      error: null,
    };
  },
  watch: {
    type: {
      immediate: true,
      handler(newType) {
        if (newType) {
          this.fetchCards();
        }
      },
    },
  },
  methods: {
    async fetchCards() {
      this.isLoading = true;
      this.error = null;
      try {
        // Añadir verificaciones de nulidad
        if (!this.$parent.gameState || !this.$parent.gameState.levelInfo || !this.$parent.gameState.userInfo) {
          console.warn('ActionCards: gameState o userInfo no disponibles. No se pueden cargar las tarjetas.');
          this.isLoading = false;
          return;
        }

        const response = await api.post('/ai/get-cards', {
          cargo_actual: this.$parent.gameState.levelInfo.title,
          tipo_de_corrupcion_elegido: this.type.name,
          idioma: this.$parent.gameState.userInfo.selected_language || 'es',
        });
        console.log('ActionCards: Raw response data from get-cards:', response.data);
        this.cards = response.data;
        console.log('ActionCards: Cards after assignment:', this.cards);
      } catch (err) {
        console.error('Error fetching cards:', err);
        this.error = this.$t('action_cards.error_loading_actions');
      } finally {
        this.isLoading = false;
      }
    },
    selectCard(card) {
      this.$emit('selectCard', card);
    },
    getCardImageUrl(relativePath) {
      return `${import.meta.env.VITE_API_URL.replace('/api', '')}${relativePath}`;
    },
  },
};
</script>

<style scoped>
.action-cards-container {
  text-align: center;
  padding: 0 20px;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.card {
  background: var(--color-button-background);
  padding: 0;
  border-radius: 12px; /* Más redondeado para parecer carta */
  cursor: pointer;
  border: 2px solid var(--color-button-border);
  box-shadow: 4px 4px 0px var(--color-button-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0;
  margin-bottom: 0;
}

.card h4 {
  font-family: 'Bebas Neue', sans-serif;
  font-weight: normal;
  color: var(--color-text-dark);
  margin: 10px 10px 5px 10px;
  text-align: center; /* Centrar título */
  font-size: 1.5em;
}

.card p {
  font-family: 'Roboto', sans-serif;
  font-weight: normal;
  line-height: 1.6;
  color: var(--noir-retro-pure-black);
  margin: 0 10px 10px 10px;
  text-align: center; /* Centrar descripción */
  flex-grow: 1;
  font-size: 1.2em;
}

/* Mobile Responsive Styles - Diseño tipo carta más grande */
@media (max-width: 768px) {
  .action-cards-container {
    padding: 0 10px;
  }
  
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
    gap: 20px !important;
    justify-content: center;
  }
  
  .card {
    min-height: 320px !important;
    max-width: 240px;
    margin: 0 auto;
    aspect-ratio: 2.5/3.5; /* Proporción de carta real */
    border-radius: 15px !important;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2), 4px 4px 0px var(--color-button-border) !important;
  }
  
  .card-image {
    height: 120px !important;
    width: 120px !important;
    border-radius: 50% !important; /* Imagen circular como avatar */
    object-fit: cover !important;
    margin: 20px auto 15px auto !important;
    display: block !important;
    border: 3px solid var(--color-button-border) !important;
  }
  
  .card h4 {
    font-size: 1.4em !important;
    margin: 8px 12px !important;
    text-align: center !important;
    line-height: 1.2 !important;
    min-height: 2.4em; /* Altura fija para consistencia */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .card p {
    font-size: 1.1em !important;
    line-height: 1.4 !important;
    margin: 8px 12px 20px 12px !important;
    text-align: center !important;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
    gap: 15px !important;
  }
  
  .card {
    min-height: 280px !important;
    max-width: 220px;
    aspect-ratio: 2.5/3.5;
  }
  
  .card-image {
    height: 100px !important;
    width: 100px !important;
    margin: 18px auto 12px auto !important;
  }
  
  .card h4 {
    font-size: 1.3em !important;
    margin: 6px 10px !important;
  }
  
  .card p {
    font-size: 1.1em !important;
    margin: 6px 10px 15px 10px !important;
    -webkit-line-clamp: 3;
  }
}

/* Para pantallas muy pequeñas */
@media (max-width: 360px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
    gap: 12px !important;
  }
  
  .card {
    min-height: 260px !important;
    max-width: 200px;
  }
  
  .card-image {
    height: 90px !important;
    width: 90px !important;
    margin: 15px auto 10px auto !important;
  }
}
.card-fade-slide-enter-active,
.card-fade-slide-leave-active {
  transition: all 0.5s ease;
}

.card-fade-slide-enter-from,
.card-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.card-fade-slide-leave-active {
  position: absolute;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
    gap: 10px !important;
  }
  
  .card {
    padding: 12px !important;
  }
  
  .card h4 {
    font-size: 1.2em !important;
    margin-bottom: 6px !important;
  }
  
  .card p {
    font-size: 1.0em !important;
    line-height: 1.3 !important;
  }
  
  .card img {
    width: 40px !important;
    height: 40px !important;
  }
}

@media (max-width: 480px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
    gap: 8px !important;
  }
  
  .card {
    padding: 8px !important;
  }
  
  .card h4 {
    font-size: 0.9em !important;
    margin-bottom: 4px !important;
  }
  
  .card p {
    font-size: 0.75em !important;
    line-height: 1.2 !important;
  }
  
  .card img {
    width: 30px !important;
    height: 30px !important;
  }
}
</style>