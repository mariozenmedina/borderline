import assert from 'node:assert/strict'
import test from 'node:test'
import { getOperationLayout, normalizeOpening, SERVICE_IDS } from '../src/hero/operationLayout.mjs'
import { getHeroContent } from '../src/i18n/heroContent.mjs'

test('abertura permanece no intervalo do slider, inclusive com entrada inválida', () => {
  for (const [input, expected] of [[-20, 0], [150, 100], ['42', 42], [null, 0], [undefined, 0], ['invalid', 0], [NaN, 0], [Infinity, 0]]) {
    assert.equal(normalizeOpening(input), expected)
  }
})

test('todo o percurso conserva seis serviços, dimensões positivas e coordenadas finitas', () => {
  for (let opening = 0; opening <= 100; opening++) {
    const layout = getOperationLayout(opening)
    assert.deepEqual(layout.services.map(card => card.id), SERVICE_IDS)
    for (const card of [layout.agency, ...layout.services]) {
      for (const key of ['left', 'top', 'width', 'height', 'angle']) assert.ok(Number.isFinite(card[key]))
      assert.ok(card.width > 0 && card.height > 0)
      assert.ok(card.left >= 0 && card.top >= 0)
      assert.ok(card.left + card.width <= 100 && card.top + card.height <= 100)
    }
  }
})

test('abertura total separa todos os serviços e preserva a agência dentro da cena', () => {
  const layout = getOperationLayout(100)
  const cards = [layout.agency, ...layout.services]
  for (let a = 0; a < cards.length; a++) {
    assert.equal(cards[a].angle, 0)
    for (let b = a + 1; b < cards.length; b++) {
      const first = cards[a], second = cards[b]
      const overlapX = first.left < second.left + second.width && second.left < first.left + first.width
      const overlapY = first.top < second.top + second.height && second.top < first.top + first.height
      assert.ok(!(overlapX && overlapY), `cards ${a} e ${b} se sobrepõem`)
    }
  }
})

test('percurso intermediário é contínuo e reversível, sem acumular deslocamento', () => {
  const start = getOperationLayout(0), middle = getOperationLayout(50), end = getOperationLayout(100)
  for (let index = 0; index < SERVICE_IDS.length; index++) {
    for (const key of ['left', 'top', 'width', 'height', 'angle']) {
      assert.ok(Math.abs(middle.services[index][key] - (start.services[index][key] + end.services[index][key]) / 2) < 1e-9)
    }
  }
  getOperationLayout(100)
  assert.deepEqual(getOperationLayout(0), start)
})

test('PT e EN usam os mesmos serviços e estrutura de conteúdo', () => {
  const shape = value => Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)])) : typeof value
  assert.deepEqual(shape(getHeroContent('pt')), shape(getHeroContent('en')))
  for (const locale of ['pt', 'en']) assert.deepEqual(getHeroContent(locale).hero.scene.services.map(service => service.id), SERVICE_IDS)
})
