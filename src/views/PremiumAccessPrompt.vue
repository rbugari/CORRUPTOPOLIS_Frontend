<template>
  <div class="premium-access-container">
    <div class="premium-access-card">
      <h2>¡Desbloquea la Experiencia Completa!</h2>
      <p>Obtén el Pase Premium para disfrutar de Corruptopolis sin interrupciones.</p>
      <ul>
        <li>Elimina toda la publicidad intrusiva.</li>
        <li>Accede a todos los niveles de la carrera política sin restricciones.</li>
        <li>Apoya el desarrollo de nuevas funcionalidades.</li>
      </ul>
      <button @click="purchasePremium">Adquirir Pase Premium (2€)</button>
      <p class="small-text">Serás redirigido a Stripe para completar el pago de forma segura.</p>
    </div>
  </div>
</template>

<script>
import { monetizationApi } from '../api';
import { loadStripe } from '@stripe/stripe-js';

export default {
  name: 'PremiumAccessPrompt',
  methods: {
    async purchasePremium() {
      try {
        const response = await monetizationApi.createPremiumCheckoutSession();
        const sessionId = response.data.sessionId;

        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error('Error al redirigir a Stripe:', error);
          alert('No se pudo iniciar el proceso de pago. Por favor, inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al crear la sesión de checkout:', error);
        alert(`Error al iniciar la compra: ${error.response ? error.response.data.message : error.message}`);
      }
    },
  },
};
</script>

<style scoped>
.premium-access-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #f3f3f3;
}

.premium-access-card {
  background-color: #212529;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
  text-align: center;
  max-width: 600px;
  width: 90%;
  border: 2px solid var(--primary-color);
}

.premium-access-card h2 {
  color: var(--primary-color);
  margin-bottom: 20px;
  font-size: 2.2em;
}

.premium-access-card p {
  margin-bottom: 15px;
  font-size: 1.1em;
  line-height: 1.6;
}

.premium-access-card ul {
  text-align: left;
  margin: 20px auto;
  max-width: 80%;
  list-style-type: '\2713\0020'; /* Checkmark symbol */
}

.premium-access-card li {
  margin-bottom: 10px;
}

.premium-access-card button {
  background-color: var(--primary-color);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.premium-access-card button:hover {
  background-color: #4a1da8;
}

.premium-access-card .small-text {
  font-size: 0.8em;
  color: #aaa;
  margin-top: 15px;
}
</style>
