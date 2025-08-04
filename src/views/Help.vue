<template>
  <div class="help-container">
    <div class="help-header">
      <h2>{{ $t('help_title') }}</h2>
      <p>{{ $t('help_subtitle') }}</p>
    </div>

    <!-- Índice de contenidos -->
    <div class="help-index">
      <h3>Índice</h3>
      <ul>
        <li><a href="#history-concept" @click.prevent="scrollToSection('history-concept')">{{ $t('help_content.history_concept_title') }}</a></li>
        <li><a href="#gameplay-cycle" @click.prevent="scrollToSection('gameplay-cycle')">{{ $t('help_content.gameplay_cycle_title') }}</a></li>
        <li><a href="#key-resources" @click.prevent="scrollToSection('key-resources')">{{ $t('help_content.key_resources_title') }}</a></li>
        <li><a href="#scandal-events" @click.prevent="scrollToSection('scandal-events')">{{ $t('help_content.scandal_events_title') }}</a></li>
        <li><a href="#monetization" @click.prevent="scrollToSection('monetization')">{{ $t('help_content.monetization_title') }}</a></li>
        <li><a href="#interface-guide" @click.prevent="scrollToSection('interface-guide')">{{ $t('help_content.interface_guide_title') }}</a></li>
        <li><a href="#copyright" @click.prevent="scrollToSection('copyright')">{{ $t('help_content.copyright_title') }}</a></li>
      </ul>
    </div>

    <accordion id="history-concept" :title="$t('help_content.history_concept_title')" :start-open="true">
      <p><strong>{{ $t('help_content.premise').split(':')[0] }}:</strong> <span v-html="$t('help_content.premise').split(':')[1]"></span></p>
      <p><strong>{{ $t('help_content.tone').split(':')[0] }}:</strong> <span v-html="$t('help_content.tone').split(':')[1]"></span></p>
      <p><strong>{{ $t('help_content.corrupt_mentor').split(':')[0] }}:</strong> <span v-html="$t('help_content.corrupt_mentor').split(':')[1]"></span></p>
    </accordion>

    <accordion id="gameplay-cycle" :title="$t('help_content.gameplay_cycle_title')">
      <ol>
        <li><strong>{{ $t('help_content.spin_wheel').split(':')[0] }}:</strong> <span v-html="$t('help_content.spin_wheel').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.choose_card').split(':')[0] }}:</strong> <span v-html="$t('help_content.choose_card').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.narrate_plan').split(':')[0] }}:</strong> <span v-html="$t('help_content.narrate_plan').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.evaluation').split(':')[0] }}:</strong> <span v-html="$t('help_content.evaluation').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.ascension').split(':')[0] }}:</strong> <span v-html="$t('help_content.ascension').split(':')[1]"></span></li>
      </ol>
    </accordion>

    <accordion id="key-resources" :title="$t('help_content.key_resources_title')">
      <ul>
        <li><strong>{{ $t('help_content.pc_description').split(':')[0] }}:</strong> <span v-html="$t('help_content.pc_description').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.inf_description').split(':')[0] }}:</strong> <span v-html="$t('help_content.inf_description').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.be_description').split(':')[0] }}:</strong> <span v-html="$t('help_content.be_description').split(':')[1]"></span></li>
      </ul>
    </accordion>

    <accordion id="scandal-events" :title="$t('help_content.scandal_events_title')">
      <p v-html="$t('help_content.scandal_trigger_description')"></p>
      <ul>
        <li><strong>{{ $t('help_content.option_a_title').split(':')[0] }}:</strong> <span v-html="$t('help_content.option_a_title').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.option_b_title').split(':')[0] }}:</strong> <span v-html="$t('help_content.option_b_title').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.option_c_title').split(':')[0] }}:</strong> <span v-html="$t('help_content.option_c_title').split(':')[1]"></span></li>
      </ul>
    </accordion>

    <accordion id="monetization" :title="$t('help_content.monetization_title')">
      <p v-html="$t('help_content.monetization_intro')"></p>
      <ul>
        <li><strong>{{ $t('help_content.premium_pass_description').split(':')[0] }}:</strong> <span v-html="$t('help_content.premium_pass_description').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.scandal_rescue_description').split(':')[0] }}:</strong> <span v-html="$t('help_content.scandal_rescue_description').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.rewarded_ads_description').split(':')[0] }}:</strong> <span v-html="$t('help_content.rewarded_ads_description').split(':')[1]"></span></li>
      </ul>
    </accordion>

    <accordion id="interface-guide" :title="$t('help_content.interface_guide_title')">
      <p v-html="$t('help_content.interface_intro')"></p>
      <ul class="interface-buttons-list">
        <li><strong>{{ $t('help_content.tempt_fate_button').split(':')[0] }}:</strong> <span v-html="$t('help_content.tempt_fate_button').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.record_voice_button').split(':')[0] }}:</strong> <span v-html="$t('help_content.record_voice_button').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.execute_plan_button').split(':')[0] }}:</strong> <span v-html="$t('help_content.execute_plan_button').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.use_wildcard_button').split(':')[0] }}:</strong> <span v-html="$t('help_content.use_wildcard_button').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.edit_profile_button').split(':')[0] }}:</strong> <span v-html="$t('help_content.edit_profile_button').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.history_button').split(':')[0] }}:</strong> <span v-html="$t('help_content.history_button').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.help_button').split(':')[0] }}:</strong> <span v-html="$t('help_content.help_button').split(':')[1]"></span></li>
        <li><strong>{{ $t('help_content.exit_button').split(':')[0] }}:</strong> <span v-html="$t('help_content.exit_button').split(':')[1]"></span></li>
      </ul>
    </accordion>

    <accordion id="copyright" :title="$t('help_content.copyright_title')">
      <p v-html="$t('help_content.copyright_text')"></p>
    </accordion>

    <button @click="goBackToGame" class="back-button">{{ $t('back_to_game') }}</button>
  </div>
</template>

<script>
import Accordion from '../components/Accordion.vue';

export default {
  name: 'Help',
  components: {
    Accordion,
  },
  methods: {
    goBackToGame() {
      this.$router.push('/game');
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Asegurarse de que el acordeón esté abierto
        const accordionComponent = this.$children.find(child => child.$el.id === sectionId);
        if (accordionComponent && !accordionComponent.isOpen) {
          accordionComponent.toggle();
        }
      }
    }
  },
};
</script>

<style scoped>
.help-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  color: var(--noir-retro-pure-black);
  background-color: var(--noir-retro-off-white);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.help-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--noir-retro-primary-accent);
}

.help-header h2 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.8em;
  color: var(--noir-retro-primary-accent);
  margin: 0;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
}

.help-header p {
  font-family: 'Roboto', sans-serif;
  font-size: 1.2em;
  color: var(--noir-retro-dark-grey);
  margin-top: 10px;
}

/* Estilos para el índice de contenidos */
.help-index {
  background-color: var(--noir-retro-panel-background);
  border: 2px solid var(--noir-retro-pure-black);
  border-radius: 8px;
  padding: 15px 20px;
  margin-bottom: 25px;
}

.help-index h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5em;
  color: var(--noir-retro-primary-accent);
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
}

.help-index ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.help-index li {
  margin: 5px;
}

.help-index a {
  display: inline-block;
  padding: 6px 12px; /* Reducido de 8px 15px */
  background-color: var(--noir-retro-secondary-accent);
  color: var(--noir-retro-off-white);
  text-decoration: none;
  border-radius: 5px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 0.9em; /* Añadido para hacer el texto más pequeño */
  transition: all 0.2s ease;
  border: 1px solid var(--noir-retro-pure-black);
}

.help-index a:hover {
  background-color: #226A6D;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Mejoras para los acordeones */
.help-container .accordion-item {
  margin-bottom: 25px;
}

.help-container ol,
.help-container ul {
  padding-left: 20px;
}

.help-container li {
  margin-bottom: 15px;
  line-height: 1.6;
}

.help-container strong {
  color: var(--noir-retro-primary-accent);
}

/* Lista de botones de interfaz */
.interface-buttons-list li {
  padding: 10px;
  border-bottom: 1px dashed var(--noir-retro-dark-grey);
}

.interface-buttons-list li:last-child {
  border-bottom: none;
}

/* Botón de volver */
.back-button {
  display: block;
  width: 50%;
  margin: 40px auto 0 auto;
  padding: 15px 20px;
  font-size: 1.2em;
  background-color: var(--noir-retro-secondary-accent);
  color: var(--noir-retro-off-white);
  border: 2px solid var(--noir-retro-pure-black);
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  font-family: 'Bebas Neue', sans-serif;
  text-transform: uppercase;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 0px var(--noir-retro-pure-black);
}

.back-button:hover {
  background-color: #226A6D;
  transform: translateY(-2px);
  box-shadow: 2px 2px 0px var(--noir-retro-pure-black);
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .help-container {
    padding: 15px;
    margin: 10px;
  }
  
  .help-header h2 {
    font-size: 2.2em;
  }
  
  .help-index ul {
    flex-direction: column;
    align-items: center;
  }
  
  .help-index a {
    width: 100%;
    text-align: center;
  }
  
  .back-button {
    width: 80%;
  }
}
</style>