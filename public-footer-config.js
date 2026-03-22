const __siteCfg = window.__PUBLIC_SITE_CONFIG__ || {};
window.__PUBLIC_FOOTER__ = {
  logo: {
    src: (__siteCfg.branding && __siteCfg.branding.footerLogo) || (window.getPublicAsset ? window.getPublicAsset('footerLogo', 'logo-conecta-white.png') : 'logo-conecta-white.png'),
    alt: 'Conecta — Anhembi Morumbi — Polo Bauru Centro'
  },
  links: [
    { href: 'index.html', label: 'Início' },
    { href: 'vagas.html', label: 'Vagas' },
    { href: 'sobre.html', label: 'Sobre' },
    { href: 'cadastro-empresa.html', label: 'Para Empresas' },
    { href: 'termos.html', label: 'Termos & Privacidade' }
  ],
  copy: '© 2025 Universidade Anhembi Morumbi — Polo Bauru Centro. Todos os direitos reservados.',
  contact: {
    telefone: (__siteCfg.footer && __siteCfg.footer.telefone) || '',
    whatsapp: (__siteCfg.footer && __siteCfg.footer.whatsapp) || '',
    email: (__siteCfg.footer && __siteCfg.footer.email) || '',
    endereco: (__siteCfg.footer && __siteCfg.footer.endereco) || ''
  }
};
