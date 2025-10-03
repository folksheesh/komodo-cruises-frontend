<template>
  <section class="plan-wrap plan-page">
    <div class="plan-content">
      <!-- Steps Header -->
      <div class="steps" role="tablist" aria-label="Plan steps">
        <button class="step" :class="{ 'step-active': step===1 }" @click="go(1)">Step 1</button>
        <button class="step" :class="{ 'step-active': step===2 }" @click="go(2)" :disabled="!canGoStep2">Step 2</button>
        <button class="step" :class="{ 'step-active': step===3 }" @click="go(3)" :disabled="!canGoStep3">Step 3</button>
        <button class="step" :class="{ 'step-active': step===4 }" @click="go(4)">Step 4</button>
        <button class="step" :class="{ 'step-active': step===5 }" @click="go(5)">Step 5</button>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="muted" style="margin:1rem 0">Loading data…</div>
      <div v-if="error" class="text-red-600" style="margin:1rem 0">{{ error }}</div>

      <!-- Step 1: Regions -->
      <div v-if="step===1">
        <h3 class="step-title">Regions</h3>
        <p class="results-note">Select the regions you're interested in:</p>

        <div class="list" v-if="regions.length">
          <div class="list-heading">Nusa Tenggara Timur</div>

          <div class="list-row" v-for="r in regions" :key="r">
            <div class="list-text">{{ r }}</div>
            <input
              class="radio"
              type="radio"
              name="region"
              :value="r"
              v-model="region"
              :aria-label="`Region ${r}`"
            />
          </div>
        </div>

        <div v-else class="muted">No regions available.</div>
      </div>

      <!-- Step 2: Cabins -->
      <div v-else-if="step===2">
        <h3 class="step-title">Cabins</h3>
        <p class="results-note">These cabins are available in the region you've selected.</p>
        <p class="results-note">Please select the ones you're interested in:</p>

        <div class="list" v-if="cabinsForRegion.length">
          <div class="list-heading">{{ region }}</div>

          <div class="list-row" v-for="c in cabinsForRegion" :key="c">
            <div class="list-text">{{ c }}</div>
            <input
              class="radio"
              type="checkbox"
              :value="c"
              v-model="selectedCabins"
              :aria-label="`Cabin ${c}`"
            />
          </div>
        </div>

        <div v-else class="muted">
          No cabins found for <span class="semibold">{{ region }}</span>.
        </div>
      </div>

      <!-- Step 3: Dates -->
      <div v-else-if="step===3">
        <h3 class="step-title">Dates</h3>
        <p class="results-note">Select the dates which will suit you:</p>
        <div class="date-inline">
          <input type="date" class="input" v-model="dateFrom"/>
          <span class="date-arrow" aria-hidden="true">→</span>
          <input type="date" class="input" v-model="dateTo"/>
        </div>
        <div class="calendar-box">Calendar will be implemented here</div>
      </div>

      <!-- Step 4: Guests -->
      <div v-else-if="step===4">
        <h3 class="step-title">Guests</h3>
        <p class="results-note">Please indicate how many adults will need to be accommodated.</p>
        <p class="results-note">If your booking includes children, please enquire directly on the next step.</p>
        <p class="results-note">View our child policy for each lodge here.</p>

        <div class="counters">
          <div class="counter-row">
            <div class="counter-text"><div class="semibold">Adults</div><div class="muted text-sm">Ages 17+</div></div>
            <div class="counter-ctrls">
              <button type="button" class="btn-icon" @click="dec('adults')">−</button>
              <span class="count">{{ adults }}</span>
              <button type="button" class="btn-icon" @click="inc('adults')">+</button>
            </div>
          </div>

          <div class="counter-row">
            <div class="counter-text"><div class="semibold">Children</div><div class="muted text-sm">Ages 10 - 16</div></div>
            <div class="counter-ctrls">
              <button type="button" class="btn-icon" @click="dec('children')">−</button>
              <span class="count">{{ children }}</span>
              <button type="button" class="btn-icon" @click="inc('children')">+</button>
            </div>
          </div>

          <div class="counter-row">
            <div class="counter-text"><div class="semibold">Ages 3 - 9</div></div>
            <div class="counter-ctrls">
              <button type="button" class="btn-icon" @click="dec('age3_9')">−</button>
              <span class="count">{{ age3_9 }}</span>
              <button type="button" class="btn-icon" @click="inc('age3_9')">+</button>
            </div>
          </div>

          <div class="counter-row">
            <div class="counter-text"><div class="semibold">Ages 0 - 2</div></div>
            <div class="counter-ctrls">
              <button type="button" class="btn-icon" @click="dec('age0_2')">−</button>
              <span class="count">{{ age0_2 }}</span>
              <button type="button" class="btn-icon" @click="inc('age0_2')">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 5: Actions -->
      <div v-else>
        <h3 class="step-title">Check Availability</h3>
        <p class="results-note">
          To see if we have availability for your preferred criteria, please click the button below.
        </p>
        <div class="mt-4">
          <router-link class="btn-primary" to="/results">Check now</router-link>
        </div>

        <div class="section-divider" style="margin:1.5rem 0"></div>

        <h4 class="section-title">Speak with a Komodo Cruises Travel Advisor</h4>
        <p class="results-note">
          Need some help to plan your trip? Enquire below to contact one of our Komodo Cruises Travel Advisors.
        </p>
        <div class="mt-4">
          <router-link class="btn-primary" to="/results">Enquire now</router-link>
        </div>

        <div class="mt-4" style="text-align:right">
          <router-link to="/" class="nav-link">Back to Search</router-link>
        </div>
      </div>

      <!-- Bottom bar navigation -->
      <div class="bottom-bar">
        <div class="nav-inner" style="display:flex; align-items:center; justify-content:space-between;">
          <button class="link-muted" v-if="step>1" @click="prev">‹ {{ prevLabel }}</button>
          <span v-else></span>
          <button class="btn-primary" @click="next">{{ nextLabel }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import '../styles/pages/plan.css'

/** ===== API config ===== */
const API_BASE =
  import.meta.env.VITE_APPS_SCRIPT_BASE /* e.g. https://script.google.com/macros/s/XXX/exec */
  || 'http://localhost:8787/mock'; // fallback for local mock if you have one

/** ===== State ===== */
const step = ref(1)
const region = ref('')
const selectedCabins = ref([])

const dateFrom = ref('')
const dateTo = ref('')
const adults = ref(2)
const children = ref(0)
const age3_9 = ref(0)
const age0_2 = ref(0)

const loading = ref(false)
const error = ref('')

/** cabinsByOperator: { [operatorName]: string[] } */
const cabinsByOperator = ref({})

/** ===== Derived ===== */
const regions = computed(() => Object.keys(cabinsByOperator.value || {}))
const cabinsForRegion = computed(() => cabinsByOperator.value[region.value] || [])

const labels = ['Regions','Cabins','Dates','Guests','Submit']
const prevLabel = computed(()=> labels[step.value-2] || '')
const nextLabel = computed(()=> step.value<5 ? (labels[step.value-1] + ' ›') : 'Submit ›')

/** Guards untuk step navigation */
const canGoStep2 = computed(() => !!region.value)
const canGoStep3 = computed(() => !!region.value && selectedCabins.value.length > 0)

/** ===== Effects ===== */
onMounted(async () => {
  await fetchCabins()
})

watch(region, () => {
  // reset cabins saat ganti region
  selectedCabins.value = []
})

/** ===== Actions ===== */
function go(n){ step.value = n }

function next(){
  // guard ringan biar UX jelas
  if (step.value === 1 && !region.value) return toast('Please select a region first.')
  if (step.value === 2 && selectedCabins.value.length === 0) return toast('Please select at least one cabin first.')
  if (step.value < 5) step.value++
  else goResults()
}

function prev(){ if(step.value>1) step.value-- }
function goResults(){ window.location.href = '/results' }

function inc(which){
  if(which==='adults') adults.value++
  else if(which==='children') children.value++
  else if(which==='age3_9') age3_9.value++
  else if(which==='age0_2') age0_2.value++
}
function dec(which){
  if(which==='adults' && adults.value>0) adults.value--
  else if(which==='children' && children.value>0) children.value--
  else if(which==='age3_9' && age3_9.value>0) age3_9.value--
  else if(which==='age0_2' && age0_2.value>0) age0_2.value--
}

function toast(msg){
  // sementara pake alert; ganti dengan toaster kamu kalau ada
  alert(msg)
}

/** ===== API call ===== */
async function fetchCabins(){
  loading.value = true
  error.value = ''
  try {
    const url = `${API_BASE}?resource=cabins`
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()

    if (!data.ok) {
      throw new Error(data.error || 'Unknown error from cabins API')
    }

    // Build map: operator -> cabins[]
    const map = {}
    for (const op of data.operators || []) {
      // pastikan array & unique
      const list = Array.isArray(op.cabins) ? [...new Set(op.cabins)] : []
      map[String(op.operator)] = list
    }
    cabinsByOperator.value = map

    // auto-pick region kalau cuma ada satu
    if (!region.value && Object.keys(map).length === 1) {
      region.value = Object.keys(map)[0]
    }
  } catch (e) {
    error.value = `Failed to load cabins: ${e.message || e}`
  } finally {
    loading.value = false
  }
}
</script>
