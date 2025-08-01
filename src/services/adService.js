import { gameApi } from '../api';

// Configuración de publicidad cargada dinámicamente
let adConfig = null;

/**
 * Carga la configuración de publicidad desde el backend
 */
async function loadAdConfig() {
  try {
    const response = await gameApi.getAdConfig();
    adConfig = response.data.config; // Cambiar de adConfig a config
    console.log('AD_SERVICE: Configuración cargada:', adConfig);
    return adConfig;
  } catch (error) {
    console.error('AD_SERVICE: Error cargando configuración:', error);
    // Configuración por defecto en caso de error
    adConfig = {
      provider: 'none',
      testMode: true,
      rewardsEnabled: false,
      interstitialEnabled: false,
      providerConfig: {}
    };
    return adConfig;
  }
}

/**
 * Inicializa el SDK del proveedor de publicidad activo
 */
async function initializeAdProvider() {
  if (!adConfig) {
    await loadAdConfig();
  }

  switch (adConfig.provider) {
    case 'adsense':
      return initializeAdSense();
    case 'applovin':
      return initializeAppLovin();
    case 'unity':
      return initializeUnityAds();
    case 'ironsource':
      return initializeIronSource();
    case 'none':
    default:
      console.log('AD_SERVICE: Sin proveedor de publicidad configurado');
      return true;
  }
}

/**
 * Muestra un anuncio recompensado según el proveedor configurado
 */
export async function showRewardedAd() {
  if (!adConfig) {
    await loadAdConfig();
  }

  if (!adConfig.rewardsEnabled) {
    console.log('AD_SERVICE: Anuncios recompensados deshabilitados');
    return { adWatched: false };
  }

  if (adConfig.testMode || adConfig.provider === 'none') {
    return showMockRewardedAd();
  }

  switch (adConfig.provider) {
    case 'adsense':
      return showAdSenseRewardedAd();
    case 'applovin':
      return showAppLovinRewardedAd();
    case 'unity':
      return showUnityRewardedAd();
    case 'ironsource':
      return showIronSourceRewardedAd();
    default:
      return showMockRewardedAd();
  }
}

/**
 * Muestra un anuncio intersticial según el proveedor configurado
 */
export async function showInterstitialAd() {
  if (!adConfig) {
    await loadAdConfig();
  }

  if (!adConfig.interstitialEnabled) {
    console.log('AD_SERVICE: Anuncios intersticiales deshabilitados');
    return { adWatched: false };
  }

  if (adConfig.testMode || adConfig.provider === 'none') {
    return showMockInterstitialAd();
  }

  switch (adConfig.provider) {
    case 'adsense':
      return showAdSenseInterstitialAd();
    case 'applovin':
      return showAppLovinInterstitialAd();
    case 'unity':
      return showUnityInterstitialAd();
    case 'ironsource':
      return showIronSourceInterstitialAd();
    default:
      return showMockInterstitialAd();
  }
}

// Implementaciones específicas por proveedor
function showMockRewardedAd() {
  console.log("AD_SERVICE (MOCK): Mostrando anuncio simulado.");
  return new Promise((resolve) => {
    if (confirm("Modo de prueba activado.\n\n¿Simular que has visto un anuncio recompensado?")) {
      setTimeout(() => {
        console.log("AD_SERVICE (MOCK): Anuncio 'visto'. Recompensa otorgada.");
        resolve({ adWatched: true });
      }, 1500);
    } else {
      console.log("AD_SERVICE (MOCK): Anuncio 'cerrado'. Sin recompensa.");
      resolve({ adWatched: false });
    }
  });
}

// Funciones de inicialización por proveedor
function initializeAdSense() {
  return new Promise((resolve) => {
    if (window.adsbygoogle) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adConfig.providerConfig.client_id}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function initializeAppLovin() {
  return new Promise((resolve) => {
    if (window.applovin) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://assets.applovin.com/web/applovin-web-sdk.js';
    script.onload = () => {
      window.applovin.initialize({
        sdkKey: adConfig.providerConfig.sdk_key,
        testMode: adConfig.testMode
      }).then(() => resolve(true)).catch(() => resolve(false));
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function initializeUnityAds() {
  return new Promise((resolve) => {
    if (window.UnityAds) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://unityads.unity3d.com/webview/2.0/UnityAds.js';
    script.onload = () => {
      window.UnityAds.initialize({
        gameId: adConfig.providerConfig.game_id,
        testMode: adConfig.testMode
      }).then(() => resolve(true)).catch(() => resolve(false));
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function initializeIronSource() {
  return new Promise((resolve) => {
    if (window.IronSource) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://platform.ironsrc.com/partners/sdk/mediation.js';
    script.onload = () => {
      window.IronSource.init({
        appKey: adConfig.providerConfig.app_key,
        testMode: adConfig.testMode
      }).then(() => resolve(true)).catch(() => resolve(false));
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// Implementaciones específicas de anuncios recompensados
function showAdSenseRewardedAd() {
  // Implementación específica de AdSense
  console.log('AD_SERVICE: Mostrando anuncio recompensado de AdSense');
  // ... código específico de AdSense ...
}

function showAppLovinRewardedAd() {
  // Implementación específica de AppLovin
  console.log('AD_SERVICE: Mostrando anuncio recompensado de AppLovin');
  // ... código específico de AppLovin ...
}

function showUnityRewardedAd() {
  // Implementación específica de Unity Ads
  console.log('AD_SERVICE: Mostrando anuncio recompensado de Unity');
  // ... código específico de Unity ...
}

function showIronSourceRewardedAd() {
  // Implementación específica de IronSource
  console.log('AD_SERVICE: Mostrando anuncio recompensado de IronSource');
  // ... código específico de IronSource ...
}

// Funciones similares para anuncios intersticiales...
function showMockInterstitialAd() {
  console.log("AD_SERVICE (MOCK): Mostrando anuncio intersticial simulado.");
  return Promise.resolve({ adWatched: true });
}

// Exportar función de inicialización
export { initializeAdProvider, loadAdConfig };

