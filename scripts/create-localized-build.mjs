import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getAbsoluteUrl, getLocaleConfig, getSeoForLocale } from '../src/i18n/siteContent.mjs'

const rootDir = dirname(fileURLToPath(import.meta.url))
const distDir = join(rootDir, '..', 'dist')
const englishDir = join(distDir, 'en')

const escapeHtml = (value) => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

const replaceOrFail = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`Could not update ${label} in dist/index.html`)
  }

  pattern.lastIndex = 0
  return html.replace(pattern, replacement)
}

const replaceMeta = (html, attribute, key, content) => {
  return replaceOrFail(
    html,
    new RegExp(`(<meta\\s+${attribute}="${key}"\\s+content=")[^"]*(">)`),
    `$1${escapeHtml(content)}$2`,
    `${attribute}=${key}`
  )
}

const replaceLink = (html, rel, href, hreflang = null) => {
  const hreflangPattern = hreflang ? `\\s+hreflang="${hreflang}"` : ''

  return replaceOrFail(
    html,
    new RegExp(`(<link\\s+rel="${rel}"${hreflangPattern}\\s+href=")[^"]*(">)`),
    `$1${escapeHtml(href)}$2`,
    `${rel}${hreflang ? ` ${hreflang}` : ''}`
  )
}

const serializeJsonLd = (value) => {
  return JSON.stringify(value).replaceAll('<', '\\u003c')
}

const replaceJsonLd = (html, id, data) => {
  return replaceOrFail(
    html,
    new RegExp(`(<script\\s+type="application/ld\\+json"\\s+id="${id}">)[\\s\\S]*?(<\\/script>)`),
    `$1${serializeJsonLd(data)}$2`,
    `json-ld ${id}`
  )
}

const localizeHtml = (html, locale) => {
  const seo = getSeoForLocale(locale)
  const config = getLocaleConfig(locale)

  let localizedHtml = html

  localizedHtml = replaceOrFail(
    localizedHtml,
    /<html\s+lang="[^"]*">/,
    `<html lang="${escapeHtml(seo.lang)}">`,
    'html lang'
  )
  localizedHtml = replaceOrFail(
    localizedHtml,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(seo.title)}</title>`,
    'title'
  )
  localizedHtml = replaceMeta(localizedHtml, 'name', 'description', seo.description)
  localizedHtml = replaceMeta(localizedHtml, 'name', 'keywords', seo.keywordsContent)
  localizedHtml = replaceMeta(localizedHtml, 'itemprop', 'name', seo.title)
  localizedHtml = replaceMeta(localizedHtml, 'itemprop', 'description', seo.description)
  localizedHtml = replaceMeta(localizedHtml, 'itemprop', 'image', seo.imageUrl)
  localizedHtml = replaceMeta(localizedHtml, 'property', 'og:title', seo.title)
  localizedHtml = replaceMeta(localizedHtml, 'property', 'og:description', seo.description)
  localizedHtml = replaceMeta(localizedHtml, 'property', 'og:url', seo.canonicalUrl)
  localizedHtml = replaceMeta(localizedHtml, 'property', 'og:locale', seo.ogLocale)
  localizedHtml = replaceMeta(localizedHtml, 'property', 'og:locale:alternate', seo.alternateOgLocale)
  localizedHtml = replaceMeta(localizedHtml, 'property', 'og:image', seo.imageUrl)
  localizedHtml = replaceMeta(localizedHtml, 'property', 'og:image:secure_url', seo.imageUrl)
  localizedHtml = replaceMeta(localizedHtml, 'property', 'og:image:alt', seo.imageAlt)
  localizedHtml = replaceMeta(localizedHtml, 'name', 'twitter:title', seo.title)
  localizedHtml = replaceMeta(localizedHtml, 'name', 'twitter:description', seo.description)
  localizedHtml = replaceMeta(localizedHtml, 'name', 'twitter:image', seo.imageUrl)
  localizedHtml = replaceMeta(localizedHtml, 'name', 'twitter:image:alt', seo.imageAlt)
  localizedHtml = replaceLink(localizedHtml, 'canonical', seo.canonicalUrl)
  localizedHtml = replaceLink(localizedHtml, 'alternate', getAbsoluteUrl('/'), 'pt-BR')
  localizedHtml = replaceLink(localizedHtml, 'alternate', getAbsoluteUrl('/en/'), 'en')
  localizedHtml = replaceLink(localizedHtml, 'alternate', seo.defaultAlternateUrl, 'x-default')
  localizedHtml = replaceJsonLd(localizedHtml, 'structured-data', seo.structuredData)
  localizedHtml = replaceOrFail(
    localizedHtml,
    /<noscript>\s*<strong>[\s\S]*?<\/strong>\s*<\/noscript>/,
    `<noscript>\n      <strong>${escapeHtml(seo.noScript)}</strong>\n    </noscript>`,
    'noscript'
  )

  if (config.path !== '/') {
    localizedHtml = localizedHtml.replace(/(href|src)="\.\/([^"]+)"/g, '$1="../$2"')
  }

  return localizedHtml
}

const html = await readFile(join(distDir, 'index.html'), 'utf8')
await mkdir(englishDir, { recursive: true })
await writeFile(join(englishDir, 'index.html'), localizeHtml(html, 'en'), 'utf8')

console.log('Created dist/en/index.html')
