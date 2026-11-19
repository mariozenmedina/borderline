import assert from 'node:assert/strict'
import test from 'node:test'
import { getOperationLayout, getScrollOpening, normalizeOpening, SERVICE_IDS } from '../src/hero/operationLayout.mjs'
import { getHeroContent } from '../src/i18n/heroContent.mjs'

test('abertura permanece no intervalo válido, inclusive com entrada inválida', () => {
  for (const [input, expected] of [[-20, 0], [150, 100], ['42', 42], [null, 0], [undefined, 0], ['invalid', 0], [NaN, 0], [Infinity, 0]]) {
    assert.equal(normalizeOpening(input), expected)
  }
})

test('scroll abre ao fixar a cena e reserva o final do percurso para leitura', () => {
  assert.equal(getScrollOpening(500, 96, 800), 0)
  assert.equal(getScrollOpening(96, 96, 800), 0)
  assert.equal(getScrollOpening(-224, 96, 800), 50)
  assert.equal(getScrollOpening(-544, 96, 800), 100)
  assert.equal(getScrollOpening(-704, 96, 800), 100)
  assert.equal(getScrollOpening(-2000, 96, 800), 100)
})

test('scroll reversível deriva da posição atual e se adapta ao tamanho do percurso', () => {
  for (const travel of [480, 640, 960]) {
    const values = Array.from({ length: 101 }, (_, step) => getScrollOpening(96 - travel * step / 100, 96, travel))
    assert.equal(values[0], 0)
    assert.equal(values[40], 50)
    assert.equal(values[100], 100)
    for (let index = 1; index < values.length; index++) assert.ok(values[index] >= values[index - 1])
    assert.equal(getScrollOpening(96, 96, travel), 0)
  }
})

test('sem percurso mensurável a operação permanece legível', () => {
  for (const args of [[0, 96, 0], [0, 96, -1], [NaN, 96, 600], [0, Infinity, 600]]) {
    assert.equal(getScrollOpening(...args), 100)
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
