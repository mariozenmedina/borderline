<template>
  <section class="panel how-we-work-section" data-scene="how-we-work" aria-labelledby="how-we-work-title">
    <div class="how-we-work-copy">
      <p class="section-kicker">Como Trabalhamos</p>
      <h2 id="how-we-work-title" class="section-title">Integrados à sua operação<span>.</span></h2>
    </div>

    <ol class="work-steps" aria-label="Etapas do trabalho">
      <li v-for="step in steps" :key="step.title" class="work-step">
        <span class="work-step-number" aria-hidden="true">{{ step.number }}</span>
        <div class="work-step-content">
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script>
const steps = [
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

export default {
  name: 'HowWeWorkSection',
  data() {
    return {
      steps
    }
  }
}
</script>
