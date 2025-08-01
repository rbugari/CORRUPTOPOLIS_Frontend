<template>
  <div class="game-container">
    <!-- Panel de Información del Juego (Rediseñado) -->
    <div v-if="gameState" class="game-info-panel">
      <!-- 50% Izquierda: Info del Personaje -->
      <div class="character-info-container">
        <img
          v-if="gameState.levelInfo && gameState.levelInfo.character_image_url"
          :src="getCharacterImageUrl(gameState.levelInfo.character_image_url)"
          alt="Character Image"
          class="character-image"
        />
        <div class="character-text">
          <h3 class="character-title">{{ gameState.levelInfo ? gameState.levelInfo.title : $t('game.loading') }}</h3>
          <p class="character-description" v-if="gameState.levelInfo">{{ gameState.levelInfo.description_visual }}</p>
        </div>
      </div>

      <!-- 50% Derecha: Recursos -->
      <div class="resources-container">
        <div class="resource-item">
          <div class="resource-label">
            <span class="resource-title">{{ $t('game.pc_title') }}</span>
            <span class="resource-value">{{ Math.round(gameState.pc) }} / {{ gameState.levelInfo?.pc_required_for_ascension ?? 'N/A' }}</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill pc-bar" :style="{ width: (gameState.pc / (gameState.levelInfo?.pc_required_for_ascension ?? 1) * 100) + '%' }"></div>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">
            <span class="resource-title">{{ $t('game.inf_title') }}</span>
            <span class="resource-value">{{ Math.round(gameState.inf) }} / 100</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill inf-bar" :style="{ width: Math.round(gameState.inf) + '%' }"></div>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-label">
            <span class="resource-title">{{ $t('game.be_title') }}</span>
            <span class="resource-value">{{ Math.round(gameState.be) }} / 100</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill be-bar" :class="{ 'be-warning': Math.round(gameState.be) > 50 && Math.round(gameState.be) <= 80, 'be-danger': Math.round(gameState.be) > 80 }" :style="{ width: Math.round(gameState.be) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- El resto del template original -->
    <div v-if="gameState && gameState.be > 85 && !showScandalEvent" class="scandal-area">
      <div class="scandal-alert">{{ $t('game.scandal_alert') }}</div>
      <div class="scandal-actions">
        <input type="number" v-model.number="infToSpend" :placeholder="$t('game.inf_to_spend_placeholder')" min="1" :max="gameState.inf" />
        <button @click="reduceScandal" :disabled="!infToSpend || infToSpend <= 0" class="btn-primary">{{ $t('game.reduce_scandal_button') }}</button>
      </div>
    </div>
    <div class="game-operational-area" v-if="currentScreen === 'game' && gameState">
      <div v-if="corruptionTypes.length > 0 && !selectedCorruptionType">
        <CorruptionWheel :corruptionTypes="corruptionTypes" @type-selected="handleCorruptionTypeSelected" />
      </div>
      <div v-else-if="selectedCorruptionType && !selectedCard">
        <h3 class="selected-type-display">{{ selectedCorruptionType.name }}</h3>
        <ActionCards :type="selectedCorruptionType" @selectCard="handleSelectCard" />
      </div>
    </div>
    <div class="llm-evaluation-area" v-if="currentScreen === 'evaluation' && llmEvaluation">
      <EvaluationView :evaluation="llmEvaluation" @closeEvaluation="closeEvaluation" />
    </div>
    <div class="card-play-area" v-if="currentScreen === 'game' && selectedCard && gameConfig">
      <PlayCardView :card="selectedCard" @playCard="handlePlayCard" @cancel="cancelPlayCard" :gameConfig="gameConfig" :generatedPlan="generatedDevPlan" />
    </div>
    <ScandalEvent v-if="currentScreen === 'scandal' && showScandalEvent" :headline="scandalHeadline" :user-info="gameState.userInfo" @scandal-resolved="handleScandalResolved" />
    <div v-if="currentScreen === 'gameOver' && showGameOver" class="monetization-prompt game-over">
      <h3>{{ $t('game.game_over_title') }}</h3>
      <p>{{ $t('game.game_over_message') }}</p>
      <button @click="$router.push('/login')" class="btn-primary">{{ $t('game.back_to_start_button') }}</button>
    </div>

    <GameWon v-if="currentScreen === 'gameWon'" />

    
    
    

    <div v-if="isDevMode" class="dev-tools">
        <h3>{{ $t('game.dev_tools_title') }}</h3>
        <p><strong>Current Language:</strong> {{ gameState.userInfo.selected_language }}</p>
        
        <!-- Nueva sección para configuración de publicidad -->
        <div v-if="adConfig" class="ad-config-debug">
          <h4>📱 Configuración de Publicidad</h4>
          <p><strong>Proveedor:</strong> {{ adConfig.provider }}</p>
          <p><strong>Modo Test:</strong> {{ adConfig.testMode ? 'Activado' : 'Desactivado' }}</p>
          <p><strong>Anuncios Recompensa:</strong> {{ adConfig.rewardsEnabled ? 'Habilitados' : 'Deshabilitados' }}</p>
          <p><strong>Anuncios Intersticiales:</strong> {{ adConfig.interstitialEnabled ? 'Habilitados' : 'Deshabilitados' }}</p>
        </div>
        
        .ad-config-debug {
          background-color: #2a2a2a;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
          border-left: 4px solid #4CAF50;
        }
        
        .ad-config-debug h4 {
          color: #4CAF50;
          margin: 0 0 10px 0;
          font-size: 1.1em;
        }
        
        .ad-config-debug p {
          margin: 5px 0;
          font-size: 0.9em;
          color: #ccc;
        }
        
        <div class="theme-switcher">
          <button @click="setTheme('ocre')">{{ $t('app.ocre_theme') }}</button>
          <button @click="setTheme('dark')">{{ $t('app.dark_theme') }}</button>
          <button @click="setTheme('noir-retro')">{{ $t('app.noir_retro_theme') }}</button>
        </div>
      <button @click="addPc()" class="btn-dev-tool">{{ $t('game.add_pc_inf_10_button') }}</button>
      <button @click="addInf()" class="btn-dev-tool">{{ $t('game.add_pc_inf_50_button') }}</button>
      <button @click="triggerScandal" class="btn-dev-tool">{{ $t('game.force_scandal_button') }}</button>
      <select v-model="selectedLevel" @change="changeLevel">
        <option disabled value="">{{ $t('game.select_level_placeholder') }}</option>
        <option v-for="n in gameState.maxLevel" :key="n" :value="n">{{ $t('game.level_option', { n: n }) }}</option>
      </select>
      <button @click="resetProgress" class="btn-dev-tool">{{ $t('game.reset_progress_button') }}</button>

      <div v-if="selectedCard">
        <select v-model="devPlanQuality">
          <option value="muy bueno">{{ $t('game.dev_plan_quality_muy_bueno') }}</option>
          <option value="bueno">{{ $t('game.dev_plan_quality_bueno') }}</option>
          <option value="regular">{{ $t('game.dev_plan_quality_regular') }}</option>
          <option value="malo">{{ $t('game.dev_plan_quality_malo') }}</option>
        </select>
        <button @click="generateDevPlan" class="btn-dev-tool">{{ $t('game.generate_dev_plan_button') }}</button>
      </div>

      <div v-if="devCalculationDetails" class="dev-calculation-box">
        <h3>{{ $t('game.dev_calculation_details_title') }}</h3>
        <p><strong>{{ $t('game.llm_score') }}</strong> {{ devCalculationDetails.llm_pc_valor }}</p>
        <p><strong>{{ $t('game.pc_gain_factor') }}</strong> {{ devCalculationDetails.pc_gain_factor }}</p>
        <p><strong>{{ $t('game.current_influence') }}</strong> {{ devCalculationDetails.inf_actual }}</p>
        <p><strong>{{ $t('game.influence_multiplier') }}</strong> {{ devCalculationDetails.influence_multiplier?.toFixed(2) ?? 'N/A' }}</p>
        <p><strong>{{ $t('game.raw_pc_gain') }}</strong> {{ devCalculationDetails.raw_pc_gain?.toFixed(2) ?? 'N/A' }}</p>
        <p><strong>{{ $t('game.final_rounded_pc_gain') }}</strong> {{ devCalculationDetails.final_pc_gain }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ActionCards from '../components/ActionCards.vue';
import EvaluationView from '../components/EvaluationView.vue';
import PlayCardView from '../components/PlayCardView.vue';
import ScandalEvent from '../components/ScandalEvent.vue';
import CorruptionWheel from '../components/CorruptionWheel.vue';
import api from '../api';
import eventBus from '../eventBus';
import GameWon from '../components/GameWon.vue';

export default {
  name: 'Game',
  components: {
    ActionCards,
    EvaluationView,
    PlayCardView,
    ScandalEvent,
    CorruptionWheel,
    GameWon,
  },
  data() {
    return {
      gameState: null,
      corruptionTypes: [],
      selectedCorruptionType: null,
      selectedCard: null,
      llmEvaluation: null,
      isLoadingGameState: false,
      isLoadingCorruptionTypes: false,
      errorGameState: null,
      errorCorruptionTypes: null,
      infToSpend: 1,
      gameConfig: {},
      adConfig: null, // Nueva variable para configuración de publicidad
      showPremiumPrompt: false,
      showScandalRescuePrompt: false,
      showGameOver: false,
      showAdLimitWarning: false,
      showScandalEvent: false,
      scandalHeadline: '',
      currentScreen: 'game',
      isDevMode: false, // Explicitly initialize to false
      selectedLevel: '',
      devPlanQuality: 'bueno',
      generatedDevPlan: '',
      devCalculationDetails: {},
    };
  },
  methods: {
    getCharacterImageUrl(relativePath) {
      return `${import.meta.env.VITE_API_URL.replace('/api', '')}${relativePath}`;
    },
    handleCorruptionTypeSelected(selectedType) {
      this.selectedCorruptionType = selectedType;
    },
    handleSelectCard(card) {
      this.selectedCard = card;
      console.log('Game.vue: selectedCard updated to:', this.selectedCard);
    },
    async handlePlayCard(result) {
      const actionTitle = this.selectedCard ? this.selectedCard.titulo : 'N/A';
      const tags = this.selectedCard ? this.selectedCard.tags_obligatorios : [];
      const narratedPlan = result.narrated_plan_text;
      this.selectedCard = null;

      // The evaluation result is passed directly from the event
      const evaluationResult = result.evaluation;

      // The game state is already updated and saved by the /ai/evaluate-plan endpoint.
      // We just need to update the frontend's state.
      this.gameState = evaluationResult.updated_game_state;

      if (this.gameState.gameWon) {
        this.currentScreen = 'gameWon';
        return;
      }

      if (this.gameState.gameOver) {
        this.showGameOver = true;
        this.gameState = null;
        this.llmEvaluation = null;
        this.showScandalEvent = false;
        this.currentScreen = 'gameOver';
        return;
      }

      if (evaluationResult.scandal_triggered) {
        this.scandalHeadline = evaluationResult.scandal_headline;
        this.showScandalEvent = true;
        this.llmEvaluation = null;
        this.currentScreen = 'scandal';
        return;
      }

      this.llmEvaluation = evaluationResult; // Keep the LLM evaluation for display
      this.devCalculationDetails = evaluationResult.dev_calculation_details;

      // Update i18n locale immediately after gameState is updated
      if (this.gameState.userInfo && this.gameState.userInfo.selected_language) {
        this.$i18n.locale = this.gameState.userInfo.selected_language;
        localStorage.setItem('selectedLanguage', this.gameState.userInfo.selected_language);
      }

      this.currentScreen = 'evaluation';
      if (this.gameState.requiresRescue) {
        this.showScandalRescuePrompt = true;
      } else {
        this.showScandalRescuePrompt = false;
      }

      // History API call can happen in the background
      api.post('/history/add', {
        level: this.gameState.level,
        action_title: actionTitle,
        narrated_plan_text: narratedPlan,
        llm_evaluation_json: evaluationResult.llm_evaluation_json,
        llm_advice_json: evaluationResult.llm_advice_json,
        updated_game_state: this.gameState,
      }).then(historyResponse => {
        eventBus.emit('update-gamestate', this.gameState); // Emit update
      }).catch(historyErr => {
        console.error('Error saving LLM interaction to history:', historyErr);
      });
    },
    cancelPlayCard() {
      this.selectedCard = null;
    },
    closeEvaluation() {
      this.llmEvaluation = null;
      this.selectedCorruptionType = null;
      this.currentScreen = 'game';
      this.generatedDevPlan = ''; // Reset the generated plan
      this.loadCorruptionTypes();
    },
    handleScandalResolved(updatedGameState) {
      this.gameState = updatedGameState;
      this.showScandalEvent = false;
      this.llmEvaluation = null;
      this.selectedCorruptionType = null;
      this.currentScreen = 'game';
      eventBus.emit('update-gamestate', this.gameState); // Emit update
    },
    async loadGameState() {
      this.isLoadingGameState = true;
      this.errorGameState = null;
      try {
        const response = await api.get('/game/progress');
        this.gameState = response.data;
        // Update i18n locale based on user's selected language from backend
        if (this.gameState.userInfo && this.gameState.userInfo.selected_language) {
          this.$i18n.locale = this.gameState.userInfo.selected_language;
          localStorage.setItem('selectedLanguage', this.gameState.userInfo.selected_language);
        }
        eventBus.emit('update-gamestate', this.gameState); // Emit update
        this.isDevMode = this.gameState.debugMode;
        console.log('Game Mode received from backend:', this.gameState.gameMode);
        if (response.data.scandal_triggered) {
          this.scandalHeadline = response.data.scandal_headline;
          this.showScandalEvent = true;
        }
      } catch (error) {
        console.error('Error loading game state:', error);
        this.errorGameState = this.$t('game.error_loading_game_state');
      } finally {
        this.isLoadingGameState = false;
      }
    },
    async loadCorruptionTypes() {
      if (!this.gameState || !this.gameState.levelInfo) return;
      this.isLoadingCorruptionTypes = true;
      this.errorCorruptionTypes = null;
      try {
        const languageToSend = this.gameState.userInfo.selected_language || 'es';
        const response = await api.post('/ai/get-corruption-types', {
          cargo_actual: this.gameState.levelInfo.title,
          idioma: languageToSend,
        });
        console.log('Raw response data for corruption types:', response.data);
        // Assuming response.data is an array of strings, e.g., ["Type1", "Type2"]
        // If it's an object with a key, like { categories: ["Type1", "Type2"] }, you'll need to adjust.
        this.corruptionTypes = response.data.map(name => ({ name }));
        console.log('Mapped corruption types:', this.corruptionTypes);
      } catch (error) {
        console.error('Error loading corruption types:', error);
        this.errorCorruptionTypes = this.$t('game.error_loading_corruption_types');
      } finally {
        this.isLoadingCorruptionTypes = false;
      }
    },
    async reduceScandal() {
      if (this.infToSpend > this.gameState.inf) {
        alert(this.$t('game.not_enough_inf_alert'));
        return;
      }
      try {
        const response = await api.post('/game/reduce-scandal', {
          inf_to_spend: this.infToSpend,
        });
        this.gameState = response.data;
        eventBus.emit('update-gamestate', this.gameState); // Emit update
        this.infToSpend = 1;
        alert(this.$t('game.scandal_reduced_alert_prefix') + ' ' + this.infToSpend + ' ' + this.$t('game.scandal_reduced_alert_suffix'));
      } catch (error) {
        console.error('Error reducing scandal:', error);
        alert(this.$t('game.reduce_scandal_error'));
      }
    },
    async loadAdConfig() {
      try {
        const response = await api.get('/game/ad-config');
        this.adConfig = response.data.config;
        console.log('AD_CONFIG cargada:', this.adConfig);
      } catch (error) {
        console.error('Error cargando configuración de publicidad:', error);
        this.adConfig = {
          provider: 'none',
          testMode: true,
          rewardsEnabled: false,
          interstitialEnabled: false
        };
      }
    },
    async loadGameConfig() {
      try {
        const response = await api.get('/game/config');
        this.gameConfig = response.data;
      } catch (error) {
        console.error(this.$t('game.error_loading_game_config'), error);
      }
    },
    async generateDevPlan() {
      console.log('generateDevPlan called. Quality:', this.devPlanQuality);
      if (!this.selectedCard) {
        console.warn('No card selected for dev plan generation.');
        return;
      }
      try {
        const response = await api.post('/ai/generate-dev-plan', {
          titulo_accion_elegida: this.selectedCard.titulo,
          descripcion_accion_elegida: this.selectedCard.descripcion,
          tags_accion_elegida: this.selectedCard.tags_obligatorios,
          quality_level: this.devPlanQuality,
          idioma: this.gameState.userInfo.selected_language || 'es',
        });
        this.generatedDevPlan = response.data.plan;
        console.log('LLM Generated Dev Plan:', this.generatedDevPlan);
      } catch (error) {
        console.error('Error generating dev plan:', error);
        alert(this.$t('game.error_generating_dev_plan'));
      }
    },
    // Placeholder methods for development tools
    addPc() {
      if (!this.gameState) {
        console.warn('gameState is null. Cannot add PC/INF.');
        return;
      }
      const pcIncrease = Math.round(this.gameState.pc * 0.10);
      const infIncrease = Math.round(this.gameState.inf * 0.10);
      this.gameState.pc += pcIncrease;
      this.gameState.inf += infIncrease;
      console.log(`Added ${pcIncrease} PC and ${infIncrease} INF (10%). New PC: ${this.gameState.pc}, New INF: ${this.gameState.inf}`);
      eventBus.emit('update-gamestate', this.gameState); // Emit update
    },
    addInf() {
      if (!this.gameState) {
        console.warn('gameState is null. Cannot add PC/INF.');
        return;
      }
      const pcIncrease = Math.round(this.gameState.pc * 0.50);
      const infIncrease = Math.round(this.gameState.inf * 0.50);
      this.gameState.pc += pcIncrease;
      this.gameState.inf += infIncrease;
      console.log(`Added ${pcIncrease} PC and ${infIncrease} INF (50%). New PC: ${this.gameState.pc}, New INF: ${this.gameState.inf}`);
      eventBus.emit('update-gamestate', this.gameState); // Emit update
    },
    triggerScandal() {
      if (!this.gameState) {
        console.warn('gameState is null. Cannot trigger scandal.');
        return;
      }
      this.gameState.be = 90; // Set BE to 90% to trigger scandal
      this.scandalHeadline = '¡Escándalo forzado por herramientas de desarrollo!'; // Set a default headline
      this.showScandalEvent = true;
      this.currentScreen = 'scandal';
      console.log('Scandal forced! BE set to:', this.gameState.be);
      eventBus.emit('update-gamestate', this.gameState); // Emit update
    },
    changeLevel() {
      console.log(`changeLevel to ${this.selectedLevel} called. Not yet implemented.`);
      // Implement logic to change the game level
    },
    resetProgress() {
      console.log('resetProgress called. Not yet implemented.');
      // Implement logic to reset game progress
    },
    handleGameStateUpdateFromAd(updatedGameState) {
      this.gameState = updatedGameState;
      eventBus.emit('update-gamestate', this.gameState); // Re-emit to GameLayout
    },
    setTheme(themeName) {
      document.documentElement.className = ''; // Clear existing classes from html
      document.documentElement.classList.add(`theme-${themeName}`);
      localStorage.setItem('theme', themeName);
    }
  },
  async mounted() {
    await this.loadGameState();
    if (!this.errorGameState) {
      this.loadCorruptionTypes();
      await this.loadGameConfig();
      await this.loadAdConfig(); // Nueva línea
    }
    eventBus.on('gamestate-updated-by-ad', this.handleGameStateUpdateFromAd);
  },
  beforeUnmount() {
    eventBus.off('gamestate-updated-by-ad', this.handleGameStateUpdateFromAd);
  }
}
</script>

<style scoped>
@import '../assets/game-responsive.css';
.game-info-panel {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  background-color: var(--noir-retro-panel-background);
  border: 2px solid var(--noir-retro-pure-black);
  border-radius: 8px;
  margin-bottom: 20px;
}

.character-info-container {
  display: flex;
  align-items: center;
  width: 50%;
  gap: 15px;
}

.character-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid var(--noir-retro-pure-black);
}

.character-text {
  display: flex;
  flex-direction: column;
}

.character-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8em;
  color: var(--noir-retro-primary-accent);
  margin: 0;
}

.character-description {
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  color: var(--noir-retro-pure-black);
  margin: 5px 0 0 0;
}

.resources-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  gap: 15px;
}

.resource-item {
  width: 100%;
}

.resource-label {
  display: flex;
  justify-content: space-between;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.resource-title {
  color: #226A6D;
  font-weight: bold;
}

.resource-value {
  color: #298488;
}

.progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  height: 15px;
  border: 1px solid var(--noir-retro-pure-black);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
}

.pc-bar { background-color: var(--noir-retro-secondary-accent); }
.inf-bar { background-color: var(--noir-retro-yellow-ocre); }
.be-bar { background-color: #6c757d; }
.be-warning { background-color: #ffc107; }
.be-danger { background-color: var(--noir-retro-primary-accent); }

@media (max-width: 768px) {
  .game-info-panel {
    flex-direction: column;
  }

  .character-info-container,
  .resources-container {
    width: 100%;
  }
}

/* Estilos adicionales del componente original */
.scandal-area, .monetization-prompt {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
}

.dev-tools {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: black;
}

.selected-type-display {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8em;
  color: var(--noir-retro-primary-accent);
  margin: 0;
  text-align: center;
  margin-bottom: 20px; /* Added margin to separate from cards */
}

.btn-dev-tool {
  background-color: #6c757d; /* Grey background */
  color: white; /* White text */
  border: 1px solid #5a6268;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-dev-tool:hover {
  background-color: #5a6268;
}

.theme-switcher {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.theme-switcher button {
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.theme-switcher button:hover {
  background-color: #45a049;
}
</style>