(function(){
  const STORAGE_KEY = 'portal_config_local';
  const REST_URL = 'https://hnhxxchhwhdlpuiceirz.supabase.co/rest/v1';
  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuaHh4Y2hod2hkbHB1aWNlaXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjY4MDMsImV4cCI6MjA4OTAwMjgwM30._N9DBrCq7lXW6tpfpcXHHcaH21AqEAcinPPIE-_-Ik8';

  const BRAND_PRIMARY = '#006C5B';
  const BRAND_ACCENT = '#00A499';
  const BRAND_NEUTRAL = '#63666A';
  const BRAND_ALLOWED = [BRAND_PRIMARY, BRAND_ACCENT, BRAND_NEUTRAL];

  function normalizeBrandColor(hex){
    const value = String(hex || '').trim().toUpperCase();
    return BRAND_ALLOWED.includes(value) ? value : BRAND_ACCENT;
  }

  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer') || document.getElementById('mobile-drawer') || document.getElementById('mob-drawer') || document.querySelector('.mobile-drawer');
  const overlay = document.getElementById('drawer-overlay') || document.querySelector('.drawer-overlay');


  function getNavbarConfig(){
    const cfg = window.__PUBLIC_NAVBAR__ || {};
    const branding = cfg.branding || {};
    const mobile = cfg.mobile || {};
    const actions = cfg.actions || {};
    return {
      branding: {
        logo: branding.logo || (window.getPublicAsset ? window.getPublicAsset('navbarLogo', 'logo-colorida.png') : 'logo-colorida.png'),
        alt: branding.alt || 'Conecta',
        href: branding.href || 'index.html'
      },
      links: Array.isArray(cfg.links) && cfg.links.length ? cfg.links : [
        { href: 'vagas.html', label: 'Vagas' },
        { href: 'sobre.html', label: 'Sobre' },
        { href: 'cadastro-empresa.html', label: 'Para Empresas' },
        { href: 'termos.html', label: 'Termos' }
      ],
      mobile: {
        includeHome: mobile.includeHome !== false,
        home: mobile.home || { href: 'index.html', label: 'Início' },
        companyLink: mobile.companyLink || { href: 'cadastro-empresa.html', label: 'Sou empresa → Publicar vaga' }
      },
      actions: {
        loginLabel: actions.loginLabel || 'Entrar',
        profileLabel: actions.profileLabel || 'Criar perfil',
        profileHref: actions.profileHref || 'cadastro-candidato.html'
      }
    };
  }

  function renderDesktopLinks(cfg){
    const host = document.querySelector('.nav-links');
    if(!host) return;
    host.innerHTML = cfg.links.map(function(item){
      return '<a href="' + item.href + '">' + item.label + '</a>';
    }).join('');
  }

  function renderMobileDrawer(cfg){
    const mobileDrawer = document.getElementById('mobile-drawer') || document.querySelector('.mobile-drawer');
    if(!mobileDrawer) return;
    const mobileLinks = [];
    if(cfg.mobile.includeHome && cfg.mobile.home){
      mobileLinks.push('<a href="' + cfg.mobile.home.href + '" onclick="closeMobileMenu()">' + cfg.mobile.home.label + '</a>');
    }
    cfg.links.forEach(function(item){
      mobileLinks.push('<a href="' + item.href + '" onclick="closeMobileMenu()">' + item.label + '</a>');
    });
    mobileDrawer.innerHTML = '' +
      '<div class="mobile-nav-links">' + mobileLinks.join('') + '</div>' +
      '<div class="mobile-divider"></div>' +
      '<div class="mobile-access-title">Acesso rápido</div>' +
      '<div class="mobile-cta">' +
        '<a class="cta-secondary" href="javascript:void(0)" onclick="closeMobileMenu();openLoginModal(\'candidato\')">' + cfg.actions.loginLabel + '</a>' +
        '<a class="cta-primary" href="' + cfg.actions.profileHref + '" onclick="closeMobileMenu()">' + cfg.actions.profileLabel + '</a>' +
      '</div>' +
      '<a class="mobile-company-link" href="' + cfg.mobile.companyLink.href + '" onclick="closeMobileMenu()">' + cfg.mobile.companyLink.label + '</a>';
  }

  function applyNavbarConfig(){
    const cfg = getNavbarConfig();
    document.querySelectorAll('nav > .logo, nav .logo').forEach(function(el){
      el.setAttribute('aria-label', cfg.branding.alt);
      el.setAttribute('title', cfg.branding.alt);
      el.setAttribute('href', cfg.branding.href);
      el.style.setProperty('--logo-url', "url('" + cfg.branding.logo + "')");
    });
    renderDesktopLinks(cfg);
    renderMobileDrawer(cfg);

    const loginBtn = document.querySelector('#nav-access-wrap .btn-nav-outline');
    if(loginBtn) loginBtn.textContent = cfg.actions.loginLabel;
    const profileBtn = document.querySelector('#nav-access-wrap .btn-nav-cta');
    if(profileBtn){
      profileBtn.textContent = cfg.actions.profileLabel;
      profileBtn.setAttribute('href', cfg.actions.profileHref);
    }
  }

  function readLocalConfig(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      const data = JSON.parse(raw);
      return data && typeof data === 'object' ? data : null;
    } catch(e){ return null; }
  }

  function saveLocalConfig(cfg){
    try {
      const current = readLocalConfig() || {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign({}, current, cfg || {})));
    } catch(e){}
  }

  function clamp(v){ return Math.max(0, Math.min(255, v)); }
  function adjustHex(hex, delta){
    if(!/^#[0-9a-fA-F]{6}$/.test(hex || '')) return hex;
    const n = parseInt(hex.slice(1), 16);
    const r = clamp((n >> 16) + delta);
    const g = clamp(((n >> 8) & 255) + delta);
    const b = clamp((n & 255) + delta);
    return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
  }
  function mixWithWhite(hex, amount){
    if(!/^#[0-9a-fA-F]{6}$/.test(hex || '')) return hex;
    const n = parseInt(hex.slice(1), 16);
    const r = clamp(Math.round((n >> 16) * (1-amount) + 255 * amount));
    const g = clamp(Math.round(((n >> 8) & 255) * (1-amount) + 255 * amount));
    const b = clamp(Math.round((n & 255) * (1-amount) + 255 * amount));
    return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
  }

  function setMenu(open){
    if(!hamburger || !drawer) return;
    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    overlay && overlay.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function markActiveLinks(){
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav-links a, .mobile-nav-link, .mobile-nav-links a, .mobile-drawer a').forEach(function(link){
      const href = (link.getAttribute('href') || '').toLowerCase();
      if(!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      if(href === path || (path === '' && href === 'index.html')) link.classList.add('active');
    });
  }

  function applyIdentity(cfg){
    if(!cfg || typeof cfg !== 'object') return;
    saveLocalConfig(cfg);
    const root = document.documentElement;
    const cor = normalizeBrandColor(cfg.cor_primary);
    const nome = cfg.nome_portal || 'Conecta';
    const logoUrl = cfg.logo_url;
    applyFooterContact(cfg);

    if(/^#[0-9a-fA-F]{6}$/.test(cor || '')){
      const dark = adjustHex(cor, -24);
      root.style.setProperty('--primary', cor);
      root.style.setProperty('--accent', cor === BRAND_NEUTRAL ? BRAND_PRIMARY : cor);
      root.style.setProperty('--primary-dark', dark);
      root.style.setProperty('--accent-dark', dark);
      root.style.setProperty('--accent-light', mixWithWhite(cor, 0.88));
      root.style.setProperty('--violet', BRAND_PRIMARY);
      root.style.setProperty('--coral', dark);
      const themeMeta = document.querySelector('meta[name="theme-color"]');
      if(themeMeta) themeMeta.setAttribute('content', cor);
    }

    document.querySelectorAll('.logo').forEach(function(el){
      el.setAttribute('aria-label', nome);
      el.setAttribute('title', nome);
      if(logoUrl){
        el.innerHTML = '';
        el.style.setProperty('--logo-url', `url('${logoUrl}')`);
      }
    });

    document.querySelectorAll('.public-footer-logo').forEach(function(img){
      const footerLogoUrl = cfg.footer_logo_url || cfg.logo_footer_url || '';
      const defaultFooterLogo = window.getPublicAsset ? window.getPublicAsset('footerLogo', 'logo-conecta-white.png') : 'logo-conecta-white.png';
      img.src = footerLogoUrl || defaultFooterLogo;
      img.style.filter = 'none';
      img.style.opacity = '1';
    });

    const prevText = document.getElementById('logo-preview-text');
    const prevImg = document.getElementById('logo-preview-img');
    if(prevText && prevImg && logoUrl){
      prevText.style.display = 'none';
      prevImg.style.display = 'block';
      prevImg.src = logoUrl;
    }
  }

  function normalizePhoneLink(value){
    const digits = String(value || '').replace(/\D/g, '');
    if(!digits) return '';
    return digits.startsWith('55') ? digits : '55' + digits;
  }

  function applyFooterContact(cfg){
    if(!cfg || typeof cfg !== 'object') return;
    const email = String(cfg.contato_email || '').trim();
    const telefone = String(cfg.contato_telefone || '').trim();
    const whatsapp = String(cfg.contato_whatsapp || '').trim();

    document.querySelectorAll('.public-footer').forEach(function(footer){
      let block = footer.querySelector('.public-footer-contact');
      if(!email && !telefone && !whatsapp){
        if(block) block.remove();
        return;
      }
      if(!block){
        block = document.createElement('div');
        block.className = 'public-footer-contact';
        const copy = footer.querySelector('.public-footer-copy');
        if(copy) copy.parentNode.insertBefore(block, copy);
        else footer.appendChild(block);
      }

      const items = [];
      if(email) items.push('<a href="mailto:' + email + '"><strong>E-mail:</strong> ' + email + '</a>');
      if(telefone) items.push('<a href="tel:' + telefone.replace(/\D/g,'') + '"><strong>Telefone:</strong> ' + telefone + '</a>');
      if(whatsapp){
        const wa = normalizePhoneLink(whatsapp);
        const href = wa ? 'https://wa.me/' + wa : '#';
        items.push('<a href="' + href + '" target="_blank" rel="noopener"><strong>WhatsApp:</strong> ' + whatsapp + '</a>');
      }
      block.innerHTML = '<div class="public-footer-contact-title">Fale com o portal</div><div class="public-footer-contact-items">' + items.join('') + '</div>';
    });
  }

  function getSession(key){
    try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch(e){ return null; }
  }

  function checkNavSessions(){
    const cand = getSession('candidato');
    const emp = getSession('empresa');
    const accessWrap = document.getElementById('nav-access-wrap');
    const candWrap = document.getElementById('nav-logado-cand');
    const empWrap = document.getElementById('nav-logado-emp');
    const avatar = document.getElementById('nav-avatar-cand');
    const nameEl = document.getElementById('nav-user-name');
    if(!accessWrap && !candWrap && !empWrap) return;

    if(cand){
      if(accessWrap) accessWrap.style.display = 'none';
      if(candWrap) candWrap.style.display = 'block';
      if(empWrap) empWrap.style.display = 'none';
      if(avatar) avatar.textContent = cand.nome?.charAt(0)?.toUpperCase() || '?';
      if(nameEl){
        if(window.innerWidth > 768){ nameEl.textContent = cand.nome?.split(' ')[0] || 'Perfil'; nameEl.style.display = 'block'; }
        else nameEl.style.display = 'none';
      }
    } else if(emp){
      if(accessWrap) accessWrap.style.display = 'none';
      if(candWrap) candWrap.style.display = 'none';
      if(empWrap) empWrap.style.display = 'block';
    } else {
      if(accessWrap) accessWrap.style.display = '';
      if(candWrap) candWrap.style.display = 'none';
      if(empWrap) empWrap.style.display = 'none';
    }
  }

  function toggleAccessDropdown(){
    const btn = document.getElementById('btn-access');
    const dd = document.getElementById('access-dropdown');
    if(btn) btn.classList.toggle('open');
    if(dd) dd.classList.toggle('open');
  }

  function closeAccessDropdown(){
    document.getElementById('btn-access')?.classList.remove('open');
    document.getElementById('access-dropdown')?.classList.remove('open');
  }

  function switchLoginTab(tab){
    ['candidato','empresa'].forEach(function(t){
      document.getElementById('lms-' + t)?.classList.toggle('show', t === tab);
      document.getElementById('lmt-' + t)?.classList.toggle('active', t === tab);
    });
  }

  function openLoginModal(tab){
    closeAccessDropdown();
    switchLoginTab(tab);
    document.getElementById('login-modal-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){
      document.getElementById(tab === 'candidato' ? 'lm-c-email' : 'lm-e-email')?.focus();
    }, 180);
  }

  function closeLoginModal(){
    document.getElementById('login-modal-overlay')?.classList.remove('open');
    if(!drawer || !drawer.classList.contains('open')) document.body.style.overflow = '';
  }

  function showLmMsg(el, txt, type){
    if(!el) return;
    el.textContent = txt;
    el.className = 'lm-msg ' + type;
  }

  async function loginModal(tipo){
    const isC = tipo === 'candidato';
    const emailEl = document.getElementById(isC ? 'lm-c-email' : 'lm-e-email');
    const passEl = document.getElementById(isC ? 'lm-c-senha' : 'lm-e-senha');
    const btn = document.getElementById(isC ? 'lm-btn-cand' : 'lm-btn-emp');
    const msg = document.getElementById(isC ? 'lm-msg-cand' : 'lm-msg-emp');
    if(!emailEl || !passEl || !btn || !msg) return;

    const email = emailEl.value.trim();
    const senha = passEl.value;
    if(!email || !senha){ showLmMsg(msg, 'Preencha e-mail e senha.', 'error'); return; }

    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Entrando...';

    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(senha));
      const hash = Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
      const table = isC ? 'candidatos' : 'empresas';
      let data = null;
      if(window.sb && typeof window.sb.from === 'function'){
        const res = await window.sb.from(table).select('*').eq('email', email).eq('senha_hash', hash).maybeSingle();
        data = res.data;
      } else {
        const url = `${REST_URL}/${table}?email=eq.${encodeURIComponent(email)}&senha_hash=eq.${hash}&select=*`;
        const res = await fetch(url, { headers: { apikey: API_KEY, Authorization: 'Bearer ' + API_KEY } });
        const json = await res.json();
        data = Array.isArray(json) ? json[0] : null;
      }
      if(!data){ showLmMsg(msg, 'E-mail ou senha incorretos.', 'error'); return; }
      sessionStorage.setItem(isC ? 'candidato' : 'empresa', JSON.stringify(data));
      showLmMsg(msg, 'Login realizado! Redirecionando...', 'success');
      checkNavSessions();
      setTimeout(function(){ location.href = isC ? 'cadastro-candidato.html' : 'painel-empresa.html'; }, 800);
    } catch(e){
      showLmMsg(msg, 'Não foi possível concluir o login agora.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  }

  async function loadIdentity(){
    const localCfg = readLocalConfig();
    if(localCfg) applyIdentity(localCfg);
    try {
      let data = null;
      if(window.sb && typeof window.sb.from === 'function'){
        const res = await window.sb.from('configuracoes').select('chave,valor');
        data = res.data;
      } else {
        const res = await fetch(`${REST_URL}/configuracoes?select=chave,valor`, { headers: { apikey: API_KEY, Authorization: 'Bearer ' + API_KEY } });
        data = res.ok ? await res.json() : null;
      }
      if(Array.isArray(data)) applyIdentity(Object.fromEntries(data.map(function(r){ return [r.chave, r.valor]; })));
    } catch(e){}
  }

  window.toggleMobileMenu = function(){ if(hamburger && drawer) setMenu(!drawer.classList.contains('open')); };
  window.closeMobileMenu = function(){ setMenu(false); };
  window.toggleAccessDropdown = toggleAccessDropdown;
  window.openLoginModal = openLoginModal;
  window.closeLoginModal = closeLoginModal;
  window.switchLoginTab = switchLoginTab;
  window.loginModal = loginModal;
  window.checkNavSessions = checkNavSessions;

  if(hamburger){
    hamburger.setAttribute('type','button');
    hamburger.setAttribute('aria-expanded','false');
    hamburger.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); window.toggleMobileMenu(); }
      if(e.key === 'Escape'){ setMenu(false); }
    });
  }

  overlay?.addEventListener('click', function(){ setMenu(false); });
  function bindDrawerAutoClose(){
    const currentDrawer = document.getElementById('mobile-drawer') || document.querySelector('.mobile-drawer');
    currentDrawer?.querySelectorAll('a, button').forEach(function(item){
      item.addEventListener('click', function(){ setMenu(false); });
    });
  }
  bindDrawerAutoClose();
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ setMenu(false); closeLoginModal(); closeAccessDropdown(); } });
  document.addEventListener('click', function(e){ if(!e.target.closest('.nav-access')) closeAccessDropdown(); });
  window.addEventListener('resize', function(){ if(window.innerWidth > 900) setMenu(false); checkNavSessions(); });

  if(new URLSearchParams(location.search).get('logout') === '1'){
    sessionStorage.removeItem('candidato');
    sessionStorage.removeItem('empresa');
    history.replaceState({}, '', location.pathname);
  }

  applyNavbarConfig();
  bindDrawerAutoClose();
  markActiveLinks();
  checkNavSessions();
  loadIdentity();
})();
