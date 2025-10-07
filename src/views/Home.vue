<template>
  <section class="hero-section">
    <div>
      <h1 class="hero-title">Shores of Wonder</h1>
      <p class="hero-sub">Embark on an exclusive voyage through the Komodo Islands.</p>
      <button class="hero-cta" @click="openPlanModal">Plan your trip</button>
    </div>
  </section>

  <!-- Plan Modal -->
  <PlanModal 
    :isOpen="isPlanModalOpen" 
    @close="closePlanModal"
    @navigate-to-results="navigateToResults"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PlanModal from '../components/PlanModal.vue'
import '../styles/pages/home.css'

const router = useRouter()
const isPlanModalOpen = ref(false)

function openPlanModal() {
  isPlanModalOpen.value = true
}

function closePlanModal() {
  isPlanModalOpen.value = false
}

function navigateToResults() {
  isPlanModalOpen.value = false
  router.push('/results')
}
</script>
