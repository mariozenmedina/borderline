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
      facts: [
        { title: 'Uma frente técnica', text: 'Presente nas decisões.' },
        { title: 'Uma equipe própria', text: 'Estrutura para entregar.' },
        { title: 'A marca é sua', text: 'A parceria é white label.' },
      ],
      next: 'Conheça as possibilidades',
      scene: {
        label: 'A agência à frente dos serviços da Borderline.Dev',
        frontLabel: 'Sua marca na frente', backLabel: 'Nossa estrutura por trás',
        agencyEyebrow: 'Para o seu cliente', agency: 'Sua agência', agencyDetail: 'A identidade de cada entrega.',
        sliderLabel: 'Revele a operação', openingValue: 'de abertura das camadas',
        sliderHelp: 'Arraste para abrir. Ou use as setas do teclado.', closed: 'Sua agência', open: 'A operação completa',
        caption: 'Mário na interlocução. Nossa equipe própria na execução. A agência continua à frente.',
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
      facts: [
        { title: 'One technical lead', text: 'Part of every decision.' },
        { title: 'Our own team', text: 'Built to deliver.' },
        { title: 'Your brand', text: 'A white label partnership.' },
      ],
      next: 'Explore the possibilities',
      scene: {
        label: 'The agency in front of Borderline.Dev services',
        frontLabel: 'Your brand out front', backLabel: 'Our structure behind it',
        agencyEyebrow: 'For your client', agency: 'Your agency', agencyDetail: 'The identity of every delivery.',
        sliderLabel: 'Reveal the operation', openingValue: 'of the layers revealed',
        sliderHelp: 'Drag to open. Or use the arrow keys.', closed: 'Your agency', open: 'The full operation',
        caption: 'Mário leads the conversation. Our own team delivers. Your agency stays out front.',
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
