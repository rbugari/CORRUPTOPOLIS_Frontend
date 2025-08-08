<template>
  <div class="welcome-overlay">
    <div class="welcome-modal">
      <h2>{{ $t('welcome_modal.title') }}</h2>
      <div class="welcome-content">
        <div class="welcome-section">
          <h3>{{ $t('welcome_modal.how_to_play_title') }}</h3>
          <div class="steps-container">
            <div class="step-card">
              <div class="step-number">1</div>
              <h4>{{ $t('welcome_modal.step_1_title') }}</h4>
              <p>{{ $t('welcome_modal.step_1_description') }}</p>
            </div>
            
            <div class="step-card">
              <div class="step-number">2</div>
              <h4>{{ $t('welcome_modal.step_2_title') }}</h4>
              <p>{{ $t('welcome_modal.step_2_description') }}</p>
            </div>
            
            <div class="step-card">
              <div class="step-number">3</div>
              <h4>{{ $t('welcome_modal.step_3_title') }}</h4>
              <p>{{ $t('welcome_modal.step_3_description') }}</p>
            </div>
            
            <div class="step-card">
              <div class="step-number">4</div>
              <h4>{{ $t('welcome_modal.step_4_title') }}</h4>
              <p>{{ $t('welcome_modal.step_4_description') }}</p>
            </div>
            
            <div class="step-card">
              <div class="step-number">5</div>
              <h4>{{ $t('welcome_modal.step_5_title') }}</h4>
              <p>{{ $t('welcome_modal.step_5_description') }}</p>
            </div>
          </div>
        </div>
        
        <div class="welcome-footer">
          <p class="welcome-tip">{{ $t('welcome_modal.tip') }}</p>
          <button @click="closeModal" class="btn-primary btn-large">{{ $t('welcome_modal.start_playing') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomeModal',
  methods: {
    closeModal() {
      this.$emit('close-welcome');
    },
  },
};
</script>

<style scoped>
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.welcome-modal {
  background-color: var(--noir-retro-off-white);
  padding: 40px;
  border-radius: 8px;
  box-shadow: 10px 10px 0px var(--noir-retro-pure-black);
  text-align: center;
  max-width: 1000px;
  width: 95%;
  color: var(--noir-retro-pure-black);
  border: 5px solid var(--noir-retro-primary-accent);
  max-height: 90vh;
  overflow-y: auto;
}

.welcome-modal h2 {
  color: var(--noir-retro-primary-accent);
  margin-bottom: 30px;
  font-size: 3em;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: normal;
  text-transform: uppercase;
}

.welcome-content {
  text-align: left;
}

.welcome-section h3 {
  color: var(--noir-retro-primary-accent);
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2em;
  margin-bottom: 25px;
  text-align: center;
  text-transform: uppercase;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.step-card {
  background-color: var(--noir-retro-panel-background);
  padding: 25px;
  border-radius: 8px;
  border: 2px solid var(--noir-retro-pure-black);
  position: relative;
  transition: transform 0.2s ease;
}

.step-card:hover {
  transform: translateY(-2px);
  box-shadow: 5px 5px 0px var(--noir-retro-pure-black);
}

.step-number {
  position: absolute;
  top: -15px;
  left: 20px;
  background-color: var(--noir-retro-primary-accent);
  color: var(--noir-retro-off-white);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.2em;
  font-weight: bold;
  border: 2px solid var(--noir-retro-pure-black);
}

.step-card h4 {
  color: var(--noir-retro-primary-accent);
  margin: 15px 0 10px 0;
  font-size: 1.3em;
  font-family: 'Bebas Neue', sans-serif;
  font-weight: normal;
}

.step-card p {
  font-size: 1em;
  line-height: 1.6;
  margin: 0;
  font-family: 'Roboto', sans-serif;
  color: var(--noir-retro-pure-black);
}

.welcome-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid var(--noir-retro-pure-black);
}

.welcome-tip {
  font-size: 1.1em;
  font-style: italic;
  color: var(--noir-retro-secondary-accent);
  margin-bottom: 25px;
  font-family: 'Roboto', sans-serif;
}

.btn-large {
  padding: 15px 40px;
  font-size: 1.3em;
  font-family: 'Bebas Neue', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .welcome-modal {
    padding: 25px;
    width: 98%;
  }
  
  .welcome-modal h2 {
    font-size: 2.2em;
  }
  
  .welcome-section h3 {
    font-size: 1.6em;
  }
  
  .steps-container {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .step-card {
    padding: 20px;
  }
  
  .step-card h4 {
    font-size: 1.2em;
  }
  
  .step-card p {
    font-size: 0.95em;
  }
  
  .btn-large {
    padding: 12px 30px;
    font-size: 1.2em;
  }
}

@media (max-width: 480px) {
  .welcome-modal {
    padding: 20px;
  }
  
  .welcome-modal h2 {
    font-size: 1.8em;
  }
  
  .step-number {
    width: 25px;
    height: 25px;
    font-size: 1em;
  }
  
  .step-card {
    padding: 18px;
  }
}
</style>