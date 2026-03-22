(function(){
  const footer = document.querySelector('.public-footer');
  if(!footer) return;

  const config = window.__PUBLIC_FOOTER__ && typeof window.__PUBLIC_FOOTER__ === 'object'
    ? window.__PUBLIC_FOOTER__
    : {};

  const logo = footer.querySelector('.public-footer-logo');
  const nav = footer.querySelector('.public-footer-nav');
  const copy = footer.querySelector('.public-footer-copy');
  const wrap = footer.querySelector('#footer-contact');
  const items = footer.querySelector('#footer-contact-items');

  const defaults = {
    telefone: '',
    whatsapp: '',
    email: '',
    endereco: ''
  };

  function parseMaybeJson(value){
    if(!value) return null;
    if(typeof value === 'object') return value;
    try { return JSON.parse(value); } catch(_) { return null; }
  }

  function readLocalConfig(){
    const candidates = [
      'portalContactConfig',
      'configuracoesContatoPortal',
      'conecta_footer_contact',
      'portal_footer_contact'
    ];
    for(const key of candidates){
      const parsed = parseMaybeJson(localStorage.getItem(key));
      if(parsed && typeof parsed === 'object') return parsed;
    }
    return null;
  }

  function normalizeContact(cfg){
    const source = Object.assign({}, defaults, cfg || {});
    return {
      telefone: source.telefone || source.phone || '',
      whatsapp: source.whatsapp || source.whatsApp || '',
      email: source.email || '',
      endereco: source.endereco || source.address || ''
    };
  }

  function cleanPhone(v){
    return String(v || '').replace(/\D+/g, '');
  }

  function renderContact(cfg){
    if(!wrap || !items) return;
    const data = normalizeContact(cfg);
    const parts = [];
    if(data.telefone) parts.push(`<span>Telefone: ${data.telefone}</span>`);
    if(data.whatsapp){
      const phone = cleanPhone(data.whatsapp);
      const href = phone ? `https://wa.me/${phone}` : '#';
      parts.push(`<a href="${href}" target="_blank" rel="noopener">WhatsApp: ${data.whatsapp}</a>`);
    }
    if(data.email) parts.push(`<a href="mailto:${data.email}">${data.email}</a>`);
    if(data.endereco) parts.push(`<span>${data.endereco}</span>`);

    items.innerHTML = parts.join('');
    wrap.classList.toggle('show', parts.length > 0);
  }

  function renderLogo(){
    if(!logo) return;
    const logoCfg = config.logo || {};
    if(logoCfg.src) logo.setAttribute('src', logoCfg.src);
    if(logoCfg.alt) logo.setAttribute('alt', logoCfg.alt);
  }

  function normalizePath(path){
    return String(path || '')
      .split('#')[0]
      .split('?')[0]
      .replace(/^\.\//, '')
      .replace(/^\//, '')
      .toLowerCase();
  }

  function renderNav(){
    if(!nav || !Array.isArray(config.links) || !config.links.length) return;
    nav.innerHTML = config.links
      .map(link => `<a href="${link.href}">${link.label}</a>`)
      .join('');

    const current = normalizePath((location.pathname || '').split('/').pop() || 'index.html') || 'index.html';
    nav.querySelectorAll('a').forEach(a => {
      const href = normalizePath(a.getAttribute('href'));
      if(href === current){
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  function renderCopy(){
    if(copy && config.copy) copy.textContent = config.copy;
  }

  renderLogo();
  renderNav();
  renderCopy();
  renderContact(Object.assign({}, config.contact || {}, readLocalConfig() || {}));

  if(window.__PUBLIC_FOOTER_CONTACT__ && typeof window.__PUBLIC_FOOTER_CONTACT__ === 'object'){
    renderContact(Object.assign({}, config.contact || {}, window.__PUBLIC_FOOTER_CONTACT__));
  }
})();
