const messages = {
  pt: {
    nav: {
      label: 'Navegação principal', home: 'Borderline.Dev — início', skip: 'Ir para o conteúdo',
      capabilities: 'O que fazemos', partnership: 'Como trabalhamos', contact: 'Vamos conversar',
      open: 'Abrir menu', close: 'Fechar menu', language: 'Selecionar idioma',
      light: 'Ativar tema claro', dark: 'Ativar tema escuro',
    },
    hero: {
      eyebrow: 'Sua operação técnica white label',
      headline: 'Sua agência à frente.', emphasis: 'Nossa operação por trás',
      description: 'Mário conduz as reuniões e as decisões técnicas como parte da sua agência. Nossa equipe de desenvolvimento e TI sustenta as entregas nos bastidores. Tudo sob a sua marca.',
      primary: 'Explore os serviços', secondary: 'Vamos conversar',
      scene: {
        label: 'A agência à frente dos serviços da Borderline.Dev',
        agencyEyebrow: 'Para o seu cliente', agency: 'Sua agência', agencyDetail: 'A identidade de cada entrega.',
        services: [
          { id: 'dev', name: 'Desenvolvimento', detail: 'Websites e aplicações.' },
          { id: 'infra', name: 'Infraestrutura', detail: 'Cloud, redes e suporte.' },
          { id: 'game', name: 'Games', detail: 'Jogos para campanhas.' },
          { id: 'data', name: 'Data visualization', detail: 'Dados que se conectam.' },
          { id: 'product', name: 'Experiências 3D', detail: 'Produtos e interações.' },
          { id: 'systems', name: 'Integrações', detail: 'Sistemas que conversam.' },
        ],
      },
    },
  },
  en: {
    nav: {
      label: 'Main navigation', home: 'Borderline.Dev — home', skip: 'Skip to content',
      capabilities: 'What we do', partnership: 'How we work', contact: 'Let’s talk',
      open: 'Open menu', close: 'Close menu', language: 'Select language',
      light: 'Switch to light theme', dark: 'Switch to dark theme',
    },
    hero: {
      eyebrow: 'Your white label technical operation',
      headline: 'Your agency out front.', emphasis: 'Our operation behind it',
      description: 'Mário leads meetings and technical decisions as part of your agency. Our own development and IT team supports delivery behind the scenes. All under your brand.',
      primary: 'Explore our services', secondary: 'Let’s talk',
      scene: {
        label: 'The agency in front of Borderline.Dev services',
        agencyEyebrow: 'For your client', agency: 'Your agency', agencyDetail: 'The identity of every delivery.',
        services: [
          { id: 'dev', name: 'Development', detail: 'Websites and applications.' },
          { id: 'infra', name: 'Infrastructure', detail: 'Cloud, networks and support.' },
          { id: 'game', name: 'Games', detail: 'Games for campaigns.' },
          { id: 'data', name: 'Data visualization', detail: 'Connected data.' },
          { id: 'product', name: '3D experiences', detail: 'Products and interactions.' },
          { id: 'systems', name: 'Integrations', detail: 'Systems working together.' },
        ],
      },
    },
  },
}

export const getHeroContent = (locale) => messages[locale] || messages.pt
