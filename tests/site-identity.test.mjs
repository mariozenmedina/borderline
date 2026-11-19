import assert from 'node:assert/strict'
import test from 'node:test'
import { getMessages, getSeoForLocale, SITE_NAME } from '../src/i18n/siteContent.mjs'
import { getHeroContent } from '../src/i18n/heroContent.mjs'
import { getMediakitContent } from '../src/i18n/mediakitContent.mjs'

test('PT e EN identificam a organização sem fixar uma pessoa como fundadora ou interlocutora', () => {
  assert.equal(SITE_NAME, 'borderline.dev.br')
  for (const locale of ['pt', 'en']) {
    const seo = getSeoForLocale(locale)
    assert.ok(seo.title.startsWith(SITE_NAME))
    const organization = seo.structuredData['@graph'].find(item => item['@type'] === 'Organization')
    assert.equal(organization.name, SITE_NAME)
    assert.equal(organization.founder, undefined)
    assert.ok(seo.structuredData['@graph'].every(item => item['@type'] !== 'Person'))
  }
})

test('conteúdo público e metadados não vinculam a operação ao proprietário ou perfil pessoal', () => {
  for (const locale of ['pt', 'en']) {
    const content = JSON.stringify([getMessages(locale), getHeroContent(locale), getMediakitContent(locale), getSeoForLocale(locale)])
    assert.doesNotMatch(content, /m[aá]rio|medina|mariovmedina/i)
  }
})
