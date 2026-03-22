const __siteCfg = window.__PUBLIC_SITE_CONFIG__ || {};
window.__PUBLIC_NAVBAR__ = {
  branding: {
    logo: (__siteCfg.branding && __siteCfg.branding.navbarLogo) || (window.getPublicAsset ? window.getPublicAsset('navbarLogo', 'logo-colorida.png') : 'logo-colorida.png'),
    alt: 'Conecta — Polo Bauru Centro',
    href: 'index.html'
  },
  links: [
    { href: 'vagas.html', label: 'Vagas' },
    { href: 'sobre.html', label: 'Sobre' },
    { href: 'cadastro-empresa.html', label: 'Para Empresas' },
    { href: 'termos.html', label: 'Termos' }
  ],
  mobile: {
    includeHome: true,
    home: { href: 'index.html', label: 'Início' },
    companyLink: { href: 'cadastro-empresa.html', label: 'Sou empresa → Publicar vaga' }
  },
  actions: {
    loginLabel: 'Entrar',
    profileLabel: 'Criar perfil',
    profileHref: 'cadastro-candidato.html'
  }
};
