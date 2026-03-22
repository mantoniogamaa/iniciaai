(function(){
  async function loadPortalMediaSlot(slot, targetId, options = {}) {
    const target = document.getElementById(targetId);
    if (!target || !window.sb) return;

    try {
      const { data, error } = await window.sb
        .from('portal_midia_slots')
        .select('slot, public_url, alt_text, overlay_opacity, is_active')
        .eq('slot', slot)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data || !data.public_url) return;

      const alt = data.alt_text || '';
      const overlay = Number(data.overlay_opacity ?? 0.35);
      const mode = options.mode || target.dataset.mediaMode || 'cover';

      if (mode === 'background') {
        target.classList.add('portal-slot-ready');
        target.style.setProperty('--slot-overlay', overlay);
        target.innerHTML = '<img src="' + data.public_url + '" alt="' + alt.replace(/"/g,'&quot;') + '">';
      } else {
        target.classList.add('portal-slot-inline');
        target.innerHTML = '<img src="' + data.public_url + '" alt="' + alt.replace(/"/g,'&quot;') + '">';
      }
    } catch (e) {
      console.warn('Portal media slot error:', slot, e?.message || e);
    }
  }

  window.loadPortalMediaSlot = loadPortalMediaSlot;

  async function loadGlobalBackground(slot = 'global_background') {
    const siteCfg = window.__PUBLIC_SITE_CONFIG__ || {};
    const customBg = siteCfg.branding && siteCfg.branding.backgroundImage;
    if (customBg) {
      document.documentElement.classList.add('portal-has-custom-bg');
      document.body.classList.add('portal-has-custom-bg');
      document.documentElement.style.setProperty('--portal-global-bg', `url('${customBg}')`);
      document.body.style.setProperty('--portal-global-bg', `url('${customBg}')`);
      return;
    }
    if (!window.sb) return;
    try {
      const { data, error } = await window.sb
        .from('portal_midia_slots')
        .select('public_url, is_active')
        .eq('slot', slot)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !data || !data.public_url) return;

      document.documentElement.classList.add('portal-has-custom-bg');
      document.body.classList.add('portal-has-custom-bg');
      document.documentElement.style.setProperty('--portal-global-bg', `url('${data.public_url}')`);
      document.body.style.setProperty('--portal-global-bg', `url('${data.public_url}')`);
    } catch (e) {
      console.warn('Portal background error:', e?.message || e);
    }
  }

  window.loadGlobalBackground = loadGlobalBackground;
})();