<template>
  <div class="slot-machine-wrapper">
    <div class="reel-container">
      <div class="reel-highlight"></div>
      <div class="reel" :style="reelStyle">
        <!-- Duplicating items for seamless looping effect -->
        <div v-for="(type, i) in extendedCorruptionTypes" :key="'A-' + i" class="reel-item" :class="{ 'selected': isSelected(i) }">
          {{ type.name }}
        </div>
      </div>
      <!-- Efectos visuales adicionales -->
      <div class="slot-glow" :class="{ 'active': isSpinning }"></div>
      <div class="slot-sparks" :class="{ 'active': isHighlighting }"></div>
    </div>
    <button @click="startSpin" :disabled="isSpinning" class="spin-button" :class="{ 'spinning': isSpinning, 'clicked': buttonClicked }">
      <!-- Ondas de impacto al hacer click -->
      <div class="click-ripple" :class="{ 'active': buttonClicked }"></div>
      <div class="click-ripple-2" :class="{ 'active': buttonClicked }"></div>
      <div class="click-ripple-3" :class="{ 'active': buttonClicked }"></div>
      
      <!-- Partículas que salen del botón -->
      <div class="button-particles" :class="{ 'active': buttonClicked }">
        <div class="particle" v-for="n in 8" :key="n" :style="{ '--delay': n * 0.1 + 's', '--angle': n * 45 + 'deg' }"></div>
      </div>
      
      <!-- Texto del botón -->
      <span v-if="!isSpinning" class="button-text">{{ $t('corruption_wheel.spin_button') }}</span>
      <span v-else class="spinning-text">¡GIRANDO!</span>
      
      <!-- Efecto de brillo interno -->
      <div class="button-shine" :class="{ 'active': buttonClicked }"></div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'CorruptionWheel',
  props: {
    corruptionTypes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isSpinning: false,
      isHighlighting: false,
      finalIndex: -1,
      reelStyle: { transform: 'translateY(0px)', transition: 'none' },
      spinPhase: 0, // 0: idle, 1: fast spin, 2: slow down, 3: final
      buttonClicked: false,
    };
  },
  computed: {
    extendedCorruptionTypes() {
      // We need enough items for a smooth looping animation. Let's ensure at least 30 items.
      if (!this.corruptionTypes || this.corruptionTypes.length === 0) return [];
      const baseList = this.corruptionTypes;
      let extendedList = [];
      while (extendedList.length < 30) {
        extendedList.push(...baseList);
      }
      return extendedList;
    },
  },
  methods: {
    startSpin() {
      if (this.isSpinning || this.extendedCorruptionTypes.length === 0) return;

      // Activar efecto de click CON GIRO DEL BOTÓN
      this.buttonClicked = true;
      setTimeout(() => {
        this.buttonClicked = false;
      }, 1500); // Reducido a 1.5 segundos para que sea más dinámico

      this.isSpinning = true;
      this.isHighlighting = false;
      this.finalIndex = -1;
      this.spinPhase = 1;

      const itemHeight = 60;
      const containerHeight = 150;
      
      // Seleccionar el elemento ganador ANTES de empezar
      const originalIndex = Math.floor(Math.random() * this.corruptionTypes.length);
      this.finalIndex = this.findClosestIndex(originalIndex);
      
      // Calcular la posición final CORRECTA desde el inicio
      const centerOffset = (containerHeight / 2) - (itemHeight / 2);
      const targetPosition = (this.finalIndex * itemHeight) - centerOffset;
      
      // Fase 1: Giro rápido inicial
      const fastSpinDistance = itemHeight * 15;
      this.reelStyle = { 
        transform: `translateY(-${fastSpinDistance}px)`, 
        transition: 'transform 1s ease-out' 
      };

      setTimeout(() => {
        this.spinPhase = 2;
        // Fase 2: Giro medio
        const mediumSpinDistance = fastSpinDistance + (itemHeight * 20);
        this.reelStyle = { 
          transform: `translateY(-${mediumSpinDistance}px)`, 
          transition: 'transform 2s cubic-bezier(0.4, 0.0, 0.6, 1)' 
        };

        setTimeout(() => {
          this.spinPhase = 3;
          // Fase 3: Posición final exacta - ACTIVAR HIGHLIGHTING INMEDIATAMENTE
          this.isHighlighting = true;
          
          this.reelStyle = { 
            transform: `translateY(-${targetPosition}px)`, 
            transition: 'transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
          };

          // Final: Solo confirmar estado, SIN delays
          setTimeout(() => {
            this.isSpinning = false;
            this.spinPhase = 0;
            
            // Emitir inmediatamente
            this.$emit('type-selected', this.extendedCorruptionTypes[this.finalIndex]);
            
            // Pequeño efecto de rebote MANTENIENDO el highlighting
            setTimeout(() => {
              this.reelStyle = { 
                transform: `translateY(-${targetPosition - 3}px)`, 
                transition: 'transform 0.15s ease-out' 
              };
              
              setTimeout(() => {
                this.reelStyle = { 
                  transform: `translateY(-${targetPosition}px)`, 
                  transition: 'transform 0.15s ease-in' 
                };
              }, 150);
            }, 100);

            // Mantener el highlight visible por más tiempo
            setTimeout(() => {
              this.isHighlighting = false;
            }, 4000);
          }, 2500);
        }, 2000);
      }, 1000);
    },
    findClosestIndex(originalIndex) {
      // Buscar en un rango más amplio y seguro
      const safeStart = 10;
      const safeEnd = this.extendedCorruptionTypes.length - 10;
      
      // Buscar el elemento exacto en el rango seguro
      for (let i = safeStart; i < safeEnd; i++) {
        if (this.extendedCorruptionTypes[i].name === this.corruptionTypes[originalIndex].name) {
          return i;
        }
      }
      
      // Si no encuentra, usar un índice seguro en el centro
      const centerIndex = Math.floor((safeStart + safeEnd) / 2);
      return centerIndex;
    },
    isSelected(index) {
      return this.isHighlighting && index === this.finalIndex;
    },
  },
};
</script>

<style scoped>
.slot-machine-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  width: 100%;
  max-width: 700px;
  margin: 20px auto;
}

.reel-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 150px;
  overflow: hidden;
  background: rgba(0,0,0,0.3);
  border: 6px double #1a2023;
  border-radius: 10px;
  box-shadow: inset 0 0 15px rgba(0,0,0,0.7), 0 0 20px rgba(0,0,0,0.5);
}

.reel-highlight {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 60px;
  transform: translateY(-50%);
  background: rgba(255, 255, 0, 0.1);
  border-top: 2px solid var(--noir-retro-yellow-ocre);
  border-bottom: 2px solid var(--noir-retro-yellow-ocre);
  z-index: 1;
  transition: all 0.3s ease;
}

/* Efecto de brillo durante el giro */
.slot-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255,215,0,0.3), transparent);
  opacity: 0;
  z-index: 2;
  transition: opacity 0.3s ease;
}

.slot-glow.active {
  opacity: 1;
  animation: glow-sweep 0.8s ease-in-out infinite;
}

/* Efecto de chispas al ganar */
.slot-sparks {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

.slot-sparks.active {
  opacity: 1;
  animation: sparks 2s ease-out;
}

.reel {
  width: 100%;
}

.reel-item {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8em;
  color: #f5f5f5;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
  transition: all 0.3s ease;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%);
}

.reel-item.selected {
  color: var(--noir-retro-yellow-ocre) !important;
  transform: scale(1.4) !important;
  text-shadow: 0 0 15px var(--noir-retro-yellow-ocre), 0 0 30px var(--noir-retro-yellow-ocre), 2px 2px 4px rgba(0,0,0,0.9) !important;
  background: radial-gradient(ellipse at center, rgba(233,196,106,0.5) 0%, rgba(233,196,106,0.3) 50%, transparent 70%) !important;
  font-weight: bold !important;
  animation: winner-pulse 1.2s ease-in-out infinite alternate !important;
  border: 3px solid var(--noir-retro-yellow-ocre) !important;
  border-radius: 8px !important;
  z-index: 10 !important;
  position: relative !important;
  box-shadow: 0 0 25px rgba(233,196,106,0.7) !important;
}

@keyframes winner-pulse {
  0% { 
    transform: scale(1.4);
    box-shadow: 0 0 25px rgba(233,196,106,0.7);
  }
  100% { 
    transform: scale(1.45);
    box-shadow: 0 0 35px rgba(233,196,106,0.9);
  }
}

.spin-button {
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(145deg, #e74c3c, #c0392b);
  color: white;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8em;
  text-transform: uppercase;
  border: 5px solid #a02d22;
  cursor: pointer;
  box-shadow: 0 8px 0 #a02d22, 0 15px 20px rgba(0,0,0,0.3);
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: visible; /* Cambiado para permitir efectos externos */
}

.spin-button::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 10%;
  right: 10%;
  bottom: 10%;
  border-radius: 50%;
  background: linear-gradient(145deg, rgba(255,255,255,0.3), transparent);
  pointer-events: none;
  z-index: 1;
}

/* Efectos de click en el botón */
.click-ripple,
.click-ripple-2,
.click-ripple-3 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 3px solid #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
}

/* Efectos de click reducidos a la mitad (2.75 segundos) */
.click-ripple.active {
  animation: ripple-effect-medium 2.75s ease-out;
}

.click-ripple-2.active {
  animation: ripple-effect-medium 2.75s ease-out 0.1s;
}

.click-ripple-3.active {
  animation: ripple-effect-medium 2.75s ease-out 0.2s;
}

.button-particles.active .particle {
  animation: particle-burst-medium 2.75s ease-out var(--delay);
}

.button-shine.active {
  animation: shine-pulse-medium 2.75s ease-out;
}

/* Animaciones de duración media */
@keyframes ripple-effect-medium {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  20% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0.8;
  }
  80% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(3.5);
    opacity: 0;
  }
}

@keyframes particle-burst-medium {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
    opacity: 1;
  }
  30% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(40px) scale(0.8);
    opacity: 0.8;
  }
  70% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(60px) scale(0.4);
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(80px) scale(0);
    opacity: 0;
  }
}

@keyframes shine-pulse-medium {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  25% {
    opacity: 1;
    transform: scale(1.1);
  }
  75% {
    opacity: 0.6;
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

/* Responsive layout for mobile */
@media (max-width: 768px) {
  .slot-machine-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .spin-button {
    width: 120px;
    height: 120px;
    font-size: 1.5em;
  }

  .reel-item {
    font-size: 1.5em;
  }
  
  .reel-container {
    height: 120px;
  }
  
  .reel-item.selected {
    font-size: 1.6em;
  }
  
  /* Ajustar efectos para móvil */
  .particle {
    width: 4px;
    height: 4px;
  }
  
  @keyframes particle-burst {
    100% {
      transform: translate(-50%, -50%) rotate(var(--angle)) translateX(60px) scale(0);
    }
  }
}

/* Efectos adicionales para móvil */
@media (max-width: 480px) {
  .reel-item {
    font-size: 1.3em;
  }
  
  .reel-item.selected {
    font-size: 1.4em;
  }
  
  .spin-button {
    font-size: 1.3em;
  }
  
  .particle {
    width: 3px;
    height: 3px;
  }
  
  @keyframes particle-burst {
    100% {
      transform: translate(-50%, -50%) rotate(var(--angle)) translateX(40px) scale(0);
    }
  }
}

/* Efectos de click reducidos pero con giro del botón */
.click-ripple.active {
  animation: ripple-effect-short 1.5s ease-out;
}

.click-ripple-2.active {
  animation: ripple-effect-short 1.5s ease-out 0.1s;
}

.click-ripple-3.active {
  animation: ripple-effect-short 1.5s ease-out 0.2s;
}

.button-particles.active .particle {
  animation: particle-burst-short 1.5s ease-out var(--delay);
}

.button-shine.active {
  animation: shine-pulse-short 1.5s ease-out;
}

/* NUEVO: Efecto de giro del botón */
.spin-button.clicked {
  animation: button-spin-short 1.5s ease-out;
}

/* Animaciones cortas y dinámicas */
@keyframes ripple-effect-short {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  30% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(3.5);
    opacity: 0;
  }
}

@keyframes particle-burst-short {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(50px) scale(0.6);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(80px) scale(0);
    opacity: 0;
  }
}

@keyframes shine-pulse-short {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

/* ¡EL EFECTO DE GIRO QUE TE GUSTABA! */
@keyframes button-spin-short {
  0% {
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(180deg) scale(1.05);
  }
  50% {
    transform: rotate(360deg) scale(1.1);
  }
  75% {
    transform: rotate(540deg) scale(1.05);
  }
  100% {
    transform: rotate(720deg) scale(1);
  }
}
</style>