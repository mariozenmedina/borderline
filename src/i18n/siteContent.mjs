export const SITE_URL = 'https://borderline.dev.br/'
export const DEFAULT_LOCALE = 'pt'

export const LOCALES = [
  {
    code: 'pt',
    label: 'PT',
    name: 'Português',
    lang: 'pt-BR',
    hreflang: 'pt-BR',
    path: '/'
  },
  {
    code: 'en',
    label: 'EN',
    name: 'English',
    lang: 'en',
    hreflang: 'en',
    path: '/en/'
  }
]

export const siteContent = {
  pt: {
    seo: {
      title: 'Borderline.Dev | Desenvolvimento premium para agências',
      description: 'Time técnico integrado para agências: websites, landing pages, experiências interativas, sistemas, infraestrutura e suporte B2B com alto padrão e discrição.',
      ogLocale: 'pt_BR',
      alternateOgLocale: 'en_US',
      noScript: 'Borderline.Dev precisa de JavaScript habilitado para funcionar corretamente.'
    },
    ui: {
      languageSwitcherLabel: 'Selecionar idioma'
    },
    hero: {
      subtitle: 'integrado ao seu time.'
    },
    about: {
      kicker: 'Sobre a Borderline',
      title: 'Desenvolvimento premium para agências',
      text: 'Atuamos como um time técnico integrado à sua operação, otimizando processos internos e assumindo projetos aprovados, manutenções mensais e entregas B2B com alto padrão, discrição e fôlego para cronogramas apertados.'
    },
    service01: {
      kicker: 'Websites & Landing Pages',
      title: 'Websites que respeitam o design',
      text: 'Desenvolvimento pixel-perfect para sites institucionais, landing pages e campanhas digitais. Responsividade, usabilidade, performance e acessibilidade em cada projeto.'
    },
    service02: {
      kicker: 'Experiências Interativas',
      title: 'Jogos, dados e animações',
      text: 'Interfaces interativas, visualizações de dados com gráficos dinâmicos, animações avançadas, jogos e experiências tridimensionais para garantir destaque.'
    },
    service03: {
      kicker: 'Plataformas & Integração',
      title: 'Sistemas conectados à operação',
      text: 'Painéis de gestão, integrações com APIs, automações e aplicações web sob medida. Camadas de serviços que mantêm projetos funcionando depois do lançamento.'
    },
    service04: {
      kicker: 'Infraestrutura & Escala',
      title: 'Com backup, publicado e online',
      text: 'Redes corporativas, backup, servidores, containers, cloud services e monitoramento. Planejamos e gerenciamos a infraestrutura de empresas, sites e sistemas, garantindo segurança, disponibilidade, desempenho e autonomia operacional.'
    },
    howWeWork: {
      kicker: 'Como trabalhamos',
      title: 'Integrados à sua operação',
      stepsLabel: 'Etapas do trabalho',
      steps: [
        {
          number: '01',
          title: 'Entramos pelo briefing',
          text: 'Participamos das conversas, reuniões, arquitetura da solução e direcionamento criativo via agência, inclusive com e-mail e canais da agência quando fizer sentido para a operação.'
        },
        {
          number: '02',
          title: 'Fechamos as definições técnicas',
          text: 'Traduzimos o escopo em stack, cronograma e orçamento para a agência, contemplando nossa parte de desenvolvimento e alinhando tudo com o time de design.'
        },
        {
          number: '03',
          title: 'Desenvolvemos e publicamos',
          text: 'Construímos, testamos e fazemos o deploy em nome da agência, com atenção a performance, responsividade, acessibilidade, segurança e qualidade de acabamento.'
        },
        {
          number: '04',
          title: 'Seguimos junto no pós-lançamento',
          text: 'Quando o projeto pede continuidade, assumimos suporte e manutenção mensal, com garantia de funcionamento, ajustes evolutivos e estabilidade no dia a dia.'
        }
      ]
    },
    contact: {
      kicker: 'Contato B2B',
      title: 'Vamos falar de parceria',
      text: 'Se a sua agência precisa de um parceiro técnico para assumir projetos digitais com maturidade, discrição e padrão premium, o melhor ponto de partida é o LinkedIn.',
      followup: 'Por lá, a conversa começa com contexto: você conhece meu perfil, entende minha trajetória e abre um canal mais profissional para avaliarmos como trabalhar juntos.',
      linkLabel: 'Conectar no LinkedIn',
      linkAriaLabel: 'Conectar com Mario Medina no LinkedIn',
      reasonsLabel: 'Motivos para conversar pelo LinkedIn',
      reasons: [
        'Perfil aberto para decisores validarem quem está por trás da entrega.',
        'Canal adequado para discutir parceria, escopo, recorrência e oportunidade.',
        'Primeiro contato mais pessoal que e-mail e mais profissional que WhatsApp.'
      ]
    },
    end: {
      line: 'estes não são os droids que você procura'
    }
  },
  en: {
    seo: {
      title: 'Borderline.Dev | Premium development for agencies',
      description: 'An embedded technical partner for agencies: websites, landing pages, interactive experiences, systems, infrastructure, and B2B support delivered with high standards and discretion.',
      ogLocale: 'en_US',
      alternateOgLocale: 'pt_BR',
      noScript: 'Borderline.Dev needs JavaScript enabled to work properly.'
    },
    ui: {
      languageSwitcherLabel: 'Select language'
    },
    hero: {
      subtitle: 'integrated with your team.'
    },
    about: {
      kicker: 'About Borderline',
      title: 'Premium development for agencies',
      text: 'We work as a technical team embedded in your operation, improving internal workflows and taking on approved projects, monthly maintenance, and B2B delivery with high standards, discretion, and stamina for tight timelines.'
    },
    service01: {
      kicker: 'Websites & Landing Pages',
      title: 'Websites that respect the design',
      text: 'Pixel-perfect development for institutional websites, landing pages, and digital campaigns. Responsiveness, usability, performance, and accessibility in every project.'
    },
    service02: {
      kicker: 'Interactive Experiences',
      title: 'Games, data and animation',
      text: 'Interactive interfaces, data visualizations with dynamic charts, advanced animation, games, and 3D experiences built to stand out.'
    },
    service03: {
      kicker: 'Platforms & Integration',
      title: 'Systems connected to operations',
      text: 'Management dashboards, API integrations, automation, and custom web applications. Service layers that keep projects running after launch.'
    },
    service04: {
      kicker: 'Infrastructure & Scale',
      title: 'Backed up, deployed and online',
      text: 'Corporate networks, backups, servers, containers, cloud services, and monitoring. We plan and manage infrastructure for companies, websites, and systems, ensuring security, availability, performance, and operational autonomy.'
    },
    howWeWork: {
      kicker: 'How we work',
      title: 'Embedded in your operation',
      stepsLabel: 'Work stages',
      steps: [
        {
          number: '01',
          title: 'We join at the briefing',
          text: 'We take part in conversations, meetings, solution architecture, and creative direction through the agency, including agency e-mail and channels when that fits the operation.'
        },
        {
          number: '02',
          title: 'We lock the technical plan',
          text: 'We translate scope into stack, timeline, and budget for the agency, covering our development work and aligning everything with the design team.'
        },
        {
          number: '03',
          title: 'We build and publish',
          text: 'We build, test, and deploy on behalf of the agency, with attention to performance, responsiveness, accessibility, security, and finish quality.'
        },
        {
          number: '04',
          title: 'We stay after launch',
          text: 'When a project needs continuity, we handle monthly support and maintenance, with uptime care, ongoing improvements, and day-to-day stability.'
        }
      ]
    },
    contact: {
      kicker: 'B2B Contact',
      title: 'Let’s talk partnership',
      text: 'If your agency needs a technical partner to take on digital projects with maturity, discretion, and premium execution, LinkedIn is the best place to start.',
      followup: 'There, the conversation starts with context: you can review my profile, understand my background, and open a more professional channel to assess how we can work together.',
      linkLabel: 'Connect on LinkedIn',
      linkAriaLabel: 'Connect with Mario Medina on LinkedIn',
      reasonsLabel: 'Reasons to talk through LinkedIn',
      reasons: [
        'An open profile so decision-makers can validate who is behind the delivery.',
        'The right channel to discuss partnership, scope, retainer work, and opportunity.',
        'A first contact that is more personal than e-mail and more professional than WhatsApp.'
      ]
    },
    end: {
      line: 'not the droids you’re looking for'
    }
  }
}

const getSiteBaseUrl = () => new URL(SITE_URL)

export const getLocaleConfig = (locale) => {
  return LOCALES.find((entry) => entry.code === locale) || LOCALES[0]
}

export const isSupportedLocale = (locale) => {
  return LOCALES.some((entry) => entry.code === locale)
}

export const getLocaleFromPath = (pathname = '/') => {
  const normalizedPath = pathname.toLowerCase()

  if (normalizedPath === '/en' || normalizedPath.startsWith('/en/')) {
    return 'en'
  }

  return DEFAULT_LOCALE
}

export const getLocalePath = (locale) => {
  return getLocaleConfig(locale).path
}

export const getMessages = (locale) => {
  return siteContent[isSupportedLocale(locale) ? locale : DEFAULT_LOCALE]
}

export const getAbsoluteUrl = (path) => {
  return new URL(path, getSiteBaseUrl()).href
}

export const getSeoForLocale = (locale) => {
  const localeConfig = getLocaleConfig(locale)
  const messages = getMessages(locale)

  return {
    ...messages.seo,
    lang: localeConfig.lang,
    canonicalUrl: getAbsoluteUrl(localeConfig.path),
    alternates: LOCALES.map((entry) => ({
      hreflang: entry.hreflang,
      href: getAbsoluteUrl(entry.path)
    })),
    defaultAlternateUrl: getAbsoluteUrl(getLocaleConfig(DEFAULT_LOCALE).path)
  }
}

const upsertMeta = ({ attribute = 'name', key, content }) => {
  if (!content || typeof document === 'undefined') {
    return
  }

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

const upsertLink = ({ rel, href, hreflang }) => {
  if (!href || typeof document === 'undefined') {
    return
  }

  const hreflangSelector = hreflang ? `[hreflang="${hreflang}"]` : ':not([hreflang])'
  let element = document.head.querySelector(`link[rel="${rel}"]${hreflangSelector}`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)

  if (hreflang) {
    element.setAttribute('hreflang', hreflang)
  }
}

export const updateDocumentSeo = (locale) => {
  if (typeof document === 'undefined') {
    return
  }

  const seo = getSeoForLocale(locale)

  document.documentElement.lang = seo.lang
  document.title = seo.title

  upsertMeta({ key: 'description', content: seo.description })
  upsertMeta({ key: 'robots', content: 'index, follow' })
  upsertMeta({ key: 'theme-color', content: '#010911' })
  upsertMeta({ attribute: 'property', key: 'og:type', content: 'website' })
  upsertMeta({ attribute: 'property', key: 'og:site_name', content: 'Borderline.Dev' })
  upsertMeta({ attribute: 'property', key: 'og:title', content: seo.title })
  upsertMeta({ attribute: 'property', key: 'og:description', content: seo.description })
  upsertMeta({ attribute: 'property', key: 'og:url', content: seo.canonicalUrl })
  upsertMeta({ attribute: 'property', key: 'og:locale', content: seo.ogLocale })
  upsertMeta({ attribute: 'property', key: 'og:locale:alternate', content: seo.alternateOgLocale })
  upsertMeta({ key: 'twitter:card', content: 'summary' })
  upsertMeta({ key: 'twitter:title', content: seo.title })
  upsertMeta({ key: 'twitter:description', content: seo.description })

  upsertLink({ rel: 'canonical', href: seo.canonicalUrl })
  seo.alternates.forEach((alternate) => {
    upsertLink({ rel: 'alternate', href: alternate.href, hreflang: alternate.hreflang })
  })
  upsertLink({ rel: 'alternate', href: seo.defaultAlternateUrl, hreflang: 'x-default' })
}
