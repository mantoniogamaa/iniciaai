window.__PUBLIC_ASSETS__ = Object.freeze({
  navbarLogo: 'logo-colorida.png',
  footerLogo: 'logo-conecta-white.png',
  footerLogoLegacy: 'logo-branca.png',
  footerLogoAlt: 'logo-branca.png',
  watermarkLogo: 'logo-watermark.png',
  brandSymbolGreen: 'symbol-am-green.png',
  brandSymbolWhite: 'symbol-am-white.png'
});

window.getPublicAsset = function(key, fallback){
  const map = window.__PUBLIC_ASSETS__ || {};
  return map[key] || fallback || '';
};
