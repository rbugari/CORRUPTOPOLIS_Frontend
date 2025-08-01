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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}
.card {
  background: var(--color-button-background);
  padding: 0;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid var(--color-button-border);
  box-shadow: 4px 4px 0px var(--color-button-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* Added transition */
}
.card:hover {
  transform: translateY(-10px) scale(1.05); /* Move up and scale */
  box-shadow: 8px 8px 15px rgba(0,0,0,0.3); /* Enhance shadow */
}
.card-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 0;
  margin-bottom: 0;
}
.card h4 {
  font-family: 'Bebas Neue', sans-serif;
  font-weight: normal;
  color: var(--color-text-dark);
  margin: 10px 10px 5px 10px;
}
.card p {
  font-family: 'Roboto', sans-serif;
  font-weight: normal;
  line-height: 1.6;
  color: var(--noir-retro-pure-black);
  margin: 0 10px 10px 10px;
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
    font-size: 1em !important;
    margin-bottom: 6px !important;
  }
  
  .card p {
    font-size: 0.85em !important;
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