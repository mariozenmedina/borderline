export const SITE_URL = 'https://borderline.dev.br/'
export const SITE_NAME = 'Borderline.Dev'
export const DEFAULT_LOCALE = 'pt'
export const THEME_COLOR = '#010911'
export const BRAND_COLOR = '#e50914'
export const SOCIAL_IMAGE_WIDTH = 1200
export const SOCIAL_IMAGE_HEIGHT = 630

const LINKEDIN_URL = 'https://www.linkedin.com/in/mariovmedina/'
const ROBOTS_DIRECTIVES = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

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
      keywords: [
        'desenvolvimento web para agências',
        'landing pages premium',
        'experiências interativas',
        'sistemas web sob medida',
        'infraestrutura cloud',
        'suporte B2B',
        'Vue',
        'Three.js'
      ],
      image: '/og-image-pt.png',
      imageAlt: 'Arte social da Borderline.Dev com símbolo geométrico vermelho sobre uma malha escura.',
      serviceName: 'Desenvolvimento premium para agências',
      offerCatalogName: 'Serviços digitais Borderline.Dev',
      services: [
        'Websites e landing pages premium',
        'Experiências interativas e 3D',
        'Sistemas web e integrações',
        'Infraestrutura, deploy e suporte B2B'
      ],
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
      keywords: [
        'web development for agencies',
        'premium landing pages',
        'interactive experiences',
        'custom web systems',
        'cloud infrastructure',
        'B2B support',
        'Vue',
        'Three.js'
      ],
      image: '/og-image-en.png',
      imageAlt: 'Borderline.Dev social artwork with a red geometric symbol over a dark mesh.',
      serviceName: 'Premium development for agencies',
      offerCatalogName: 'Borderline.Dev digital services',
      services: [
        'Premium websites and landing pages',
        'Interactive and 3D experiences',
        'Web systems and integrations',
        'Infrastructure, deployment and B2B support'
      ],
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
  const canonicalUrl = getAbsoluteUrl(localeConfig.path)
  const imageUrl = getAbsoluteUrl(messages.seo.image)
  const organizationId = getAbsoluteUrl('#organization')
  const websiteId = getAbsoluteUrl('#website')

  return {
    ...messages.seo,
    siteName: SITE_NAME,
    lang: localeConfig.lang,
    canonicalUrl,
    imageUrl,
    imageWidth: SOCIAL_IMAGE_WIDTH,
    imageHeight: SOCIAL_IMAGE_HEIGHT,
    imageType: 'image/png',
    robots: ROBOTS_DIRECTIVES,
    themeColor: THEME_COLOR,
    brandColor: BRAND_COLOR,
    author: SITE_NAME,
    keywordsContent: messages.seo.keywords.join(', '),
    alternates: LOCALES.map((entry) => ({
      hreflang: entry.hreflang,
      href: getAbsoluteUrl(entry.path)
    })),
    defaultAlternateUrl: getAbsoluteUrl(getLocaleConfig(DEFAULT_LOCALE).path),
    structuredData: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': organizationId,
          name: SITE_NAME,
          url: getAbsoluteUrl('/'),
          logo: getAbsoluteUrl('/android-chrome-512x512.png'),
          image: imageUrl,
          description: messages.seo.description,
          sameAs: [LINKEDIN_URL],
          founder: {
            '@type': 'Person',
            name: 'Mario Medina',
            sameAs: LINKEDIN_URL
          }
        },
        {
          '@type': 'WebSite',
          '@id': websiteId,
          name: SITE_NAME,
          url: getAbsoluteUrl('/'),
          description: messages.seo.description,
          inLanguage: localeConfig.lang,
          publisher: {
            '@id': organizationId
          }
        },
        {
          '@type': 'Service',
          '@id': `${canonicalUrl}#services`,
          name: messages.seo.serviceName,
          description: messages.seo.description,
          url: canonicalUrl,
          provider: {
            '@id': organizationId
          },
          areaServed: ['Brazil', 'Worldwide'],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: messages.seo.offerCatalogName,
            itemListElement: messages.seo.services.map((service) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: service
              }
            }))
          }
        }
      ]
    }
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

const upsertLink = ({ rel, href, hreflang, sizes, type, color, media }) => {
  if (!href || typeof document === 'undefined') {
    return
  }

  const selectorParts = [`link[rel="${rel}"]`]

  if (hreflang) {
    selectorParts.push(`[hreflang="${hreflang}"]`)
  } else {
    selectorParts.push(':not([hreflang])')
  }

  if (sizes) {
    selectorParts.push(`[sizes="${sizes}"]`)
  }

  if (type) {
    selectorParts.push(`[type="${type}"]`)
  }

  if (color) {
    selectorParts.push(`[color="${color}"]`)
  }

  if (media) {
    selectorParts.push(`[media="${media}"]`)
  } else {
    selectorParts.push(':not([media])')
  }

  let element = document.head.querySelector(selectorParts.join(''))

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)

  if (hreflang) {
    element.setAttribute('hreflang', hreflang)
  }

  if (sizes) {
    element.setAttribute('sizes', sizes)
  }

  if (type) {
    element.setAttribute('type', type)
  }

  if (color) {
    element.setAttribute('color', color)
  }

  if (media) {
    element.setAttribute('media', media)
  }
}

const upsertJsonLd = ({ id, data }) => {
  if (!data || typeof document === 'undefined') {
    return
  }

  let element = document.head.querySelector(`script[type="application/ld+json"]#${id}`)

  if (!element) {
    element = document.createElement('script')
    element.setAttribute('type', 'application/ld+json')
    element.setAttribute('id', id)
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(data)
}

export const updateDocumentSeo = (locale) => {
  if (typeof document === 'undefined') {
    return
  }

  const seo = getSeoForLocale(locale)

  document.documentElement.lang = seo.lang
  document.title = seo.title

  upsertMeta({ key: 'description', content: seo.description })
  upsertMeta({ key: 'keywords', content: seo.keywordsContent })
  upsertMeta({ key: 'author', content: seo.author })
  upsertMeta({ key: 'creator', content: seo.author })
  upsertMeta({ key: 'publisher', content: seo.author })
  upsertMeta({ key: 'robots', content: seo.robots })
  upsertMeta({ key: 'googlebot', content: seo.robots })
  upsertMeta({ key: 'referrer', content: 'strict-origin-when-cross-origin' })
  upsertMeta({ key: 'color-scheme', content: 'dark' })
  upsertMeta({ key: 'format-detection', content: 'telephone=no' })
  upsertMeta({ key: 'theme-color', content: seo.themeColor })
  upsertMeta({ key: 'application-name', content: seo.siteName })
  upsertMeta({ key: 'apple-mobile-web-app-title', content: seo.siteName })
  upsertMeta({ key: 'apple-mobile-web-app-capable', content: 'yes' })
  upsertMeta({ key: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' })
  upsertMeta({ key: 'mobile-web-app-capable', content: 'yes' })
  upsertMeta({ key: 'msapplication-TileColor', content: seo.themeColor })
  upsertMeta({ key: 'msapplication-TileImage', content: '/mstile-150x150.png' })
  upsertMeta({ key: 'msapplication-config', content: '/browserconfig.xml' })
  upsertMeta({ attribute: 'itemprop', key: 'name', content: seo.title })
  upsertMeta({ attribute: 'itemprop', key: 'description', content: seo.description })
  upsertMeta({ attribute: 'itemprop', key: 'image', content: seo.imageUrl })
  upsertMeta({ attribute: 'property', key: 'og:type', content: 'website' })
  upsertMeta({ attribute: 'property', key: 'og:site_name', content: seo.siteName })
  upsertMeta({ attribute: 'property', key: 'og:title', content: seo.title })
  upsertMeta({ attribute: 'property', key: 'og:description', content: seo.description })
  upsertMeta({ attribute: 'property', key: 'og:url', content: seo.canonicalUrl })
  upsertMeta({ attribute: 'property', key: 'og:locale', content: seo.ogLocale })
  upsertMeta({ attribute: 'property', key: 'og:locale:alternate', content: seo.alternateOgLocale })
  upsertMeta({ attribute: 'property', key: 'og:image', content: seo.imageUrl })
  upsertMeta({ attribute: 'property', key: 'og:image:secure_url', content: seo.imageUrl })
  upsertMeta({ attribute: 'property', key: 'og:image:type', content: seo.imageType })
  upsertMeta({ attribute: 'property', key: 'og:image:width', content: seo.imageWidth })
  upsertMeta({ attribute: 'property', key: 'og:image:height', content: seo.imageHeight })
  upsertMeta({ attribute: 'property', key: 'og:image:alt', content: seo.imageAlt })
  upsertMeta({ key: 'twitter:card', content: 'summary_large_image' })
  upsertMeta({ key: 'twitter:title', content: seo.title })
  upsertMeta({ key: 'twitter:description', content: seo.description })
  upsertMeta({ key: 'twitter:image', content: seo.imageUrl })
  upsertMeta({ key: 'twitter:image:alt', content: seo.imageAlt })

  upsertLink({ rel: 'canonical', href: seo.canonicalUrl })
  seo.alternates.forEach((alternate) => {
    upsertLink({ rel: 'alternate', href: alternate.href, hreflang: alternate.hreflang })
  })
  upsertLink({ rel: 'alternate', href: seo.defaultAlternateUrl, hreflang: 'x-default' })
  upsertLink({ rel: 'icon', href: '/favicon.ico', sizes: 'any' })
  upsertLink({ rel: 'icon', href: '/favicon-dark.ico', sizes: 'any', media: '(prefers-color-scheme: dark)' })
  upsertLink({ rel: 'icon', href: '/favicon-light.ico', sizes: 'any', media: '(prefers-color-scheme: light)' })
  upsertLink({ rel: 'icon', href: '/favicon-dark-16x16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: dark)' })
  upsertLink({ rel: 'icon', href: '/favicon-light-16x16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: light)' })
  upsertLink({ rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' })
  upsertLink({ rel: 'icon', href: '/favicon-dark-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' })
  upsertLink({ rel: 'icon', href: '/favicon-light-32x32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' })
  upsertLink({ rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' })
  upsertLink({ rel: 'icon', href: '/favicon-dark-48x48.png', sizes: '48x48', type: 'image/png', media: '(prefers-color-scheme: dark)' })
  upsertLink({ rel: 'icon', href: '/favicon-light-48x48.png', sizes: '48x48', type: 'image/png', media: '(prefers-color-scheme: light)' })
  upsertLink({ rel: 'icon', href: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' })
  upsertLink({ rel: 'apple-touch-icon', href: '/apple-touch-icon-dark.png', sizes: '180x180', media: '(prefers-color-scheme: dark)' })
  upsertLink({ rel: 'apple-touch-icon', href: '/apple-touch-icon-light.png', sizes: '180x180', media: '(prefers-color-scheme: light)' })
  upsertLink({ rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' })
  upsertLink({ rel: 'manifest', href: '/site.webmanifest' })
  upsertJsonLd({ id: 'structured-data', data: seo.structuredData })
}
