const messages = {
  pt: {
    nav: {
      label: 'Navegação principal', home: 'Borderline.Dev — início', skip: 'Ir para o conteúdo',
      capabilities: 'O que fazemos', partnership: 'Como trabalhamos', contact: 'Vamos conversar',
      open: 'Abrir menu', close: 'Fechar menu', language: 'Selecionar idioma',
      light: 'Ativar tema claro', dark: 'Ativar tema escuro'
    },
    hero: {
      eyebrow: 'Tecnologia integrada à sua agência',
      headline: ['Sua agência', 'à frente.'], emphasis: ['Nossa operação', 'por trás.'],
      description: 'Uma liderança técnica nas suas reuniões. Uma equipe própria de desenvolvimento e TI nos bastidores. Tudo sob a sua marca.',
      primary: 'Conheça nossa operação', secondary: 'Vamos falar de parceria',
      facts: [
        { title: 'Uma frente técnica', text: 'Presente nas decisões.' },
        { title: 'Uma equipe própria', text: 'Estrutura para entregar.' },
        { title: 'A marca é sua', text: 'A parceria é white label.' }
      ],
      next: 'Da ideia à operação.', nextDetail: 'Explore o que podemos construir juntos.',
      scene: {
        label: 'Uma entrega digital e a operação que a sustenta', controls: 'Explorar as camadas da entrega',
        delivery: 'A entrega', operation: 'A operação',
        deliveryCaption: 'Sua agência assina cada entrega.',
        operationCaption: 'Liderança, desenvolvimento e TI. Uma operação conectada.',
        example: 'Projeto ilustrativo', badge: 'Sob a sua marca',
        website: 'Experiência digital', collection: 'Coleção', about: 'O estúdio',
        objectTitle: ['Luz para', 'novas ideias.'], objectSubtitle: 'Forma, matéria e possibilidades.',
        objectCta: 'Conheça a coleção', edition: 'ESTUDO Nº 01 / FORMA',
        development: 'Desenvolvimento', developmentDetail: 'Do conceito à experiência.',
        steps: ['Interface', 'Interação', 'Integração'],
        infrastructure: 'Infraestrutura & TI', infrastructureDetail: 'A base de cada entrega.',
        services: ['Publicação', 'Monitoramento', 'Continuidade'],
        lead: 'Mário Medina', leadRole: 'Sua liderança técnica'
      }
    }
  },
  en: {
    nav: {
      label: 'Main navigation', home: 'Borderline.Dev — home', skip: 'Skip to content',
      capabilities: 'What we do', partnership: 'How we work', contact: 'Let’s talk',
      open: 'Open menu', close: 'Close menu', language: 'Select language',
      light: 'Switch to light theme', dark: 'Switch to dark theme'
    },
    hero: {
      eyebrow: 'Technology embedded in your agency',
      headline: ['Your agency', 'up front.'], emphasis: ['Our operation', 'behind it.'],
      description: 'A technical lead in your meetings. Our own development and IT team behind the scenes. All under your brand.',
      primary: 'Explore our capabilities', secondary: 'Let’s talk partnership',
      facts: [
        { title: 'One technical lead', text: 'Part of every decision.' },
        { title: 'Our own team', text: 'Built to deliver.' },
        { title: 'Your brand', text: 'A white-label partnership.' }
      ],
      next: 'From idea to operation.', nextDetail: 'Explore what we can build together.',
      scene: {
        label: 'A digital experience and the operation behind it', controls: 'Explore the delivery layers',
        delivery: 'The delivery', operation: 'The operation',
        deliveryCaption: 'Your agency’s name on every delivery.',
        operationCaption: 'Leadership, development and IT. One connected operation.',
        example: 'Illustrative project', badge: 'Under your brand',
        website: 'Digital experience', collection: 'Collection', about: 'The studio',
        objectTitle: ['Light for', 'new ideas.'], objectSubtitle: 'Form, material and possibility.',
        objectCta: 'Explore the collection', edition: 'STUDY NO. 01 / FORMA',
        development: 'Development', developmentDetail: 'From concept to experience.',
        steps: ['Interface', 'Interaction', 'Integration'],
        infrastructure: 'Infrastructure & IT', infrastructureDetail: 'The foundation of every delivery.',
        services: ['Deployment', 'Monitoring', 'Continuity'],
        lead: 'Mário Medina', leadRole: 'Your technical lead'
      }
    }
  }
}

export const getHeroContent = (locale) => messages[locale] || messages.pt
