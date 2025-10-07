<template>
  <section class="plan-wrap plan-page">
    <div class="plan-content">
      <!-- Steps Header -->
      <div class="steps" role="tablist" aria-label="Plan steps">
        <button class="step" :class="{ 'step-active': step===1 }" @click="go(1)">Step 1</button>
        <button class="step" :class="{ 'step-active': step===2 }" @click="go(2)" :disabled="!canGoStep2">Step 2</button>
        <button class="step" :class="{ 'step-active': step===3 }" @click="go(3)" :disabled="!canGoStep3">Step 3</button>
        <button class="step" :class="{ 'step-active': step===4 }" @click="go(4)" :disabled="!canGoStep4">Step 4</button>
        <button class="step" :class="{ 'step-active': step===5 }" @click="go(5)" :disabled="!canGoStep4">Step 5</button>
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
              v-model="lodges"
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
        <p class="results-note">Select the start date for your trip:</p>
        <p class="results-note text-sm">Trips start only on Mondays and Fridays.</p>
        
        <div class="date-input-section">
          <label class="date-label">Start Date:</label>
          <input type="date" class="input date-input" v-model="dateFrom" :min="minDate"/>
        </div>
        
        <div class="custom-calendar">
          <div class="calendar-header">
            <button class="calendar-nav" @click="prevMonth" type="button">‹</button>
            <h4 class="calendar-title">{{ currentMonthYear }}</h4>
            <button class="calendar-nav" @click="nextMonth" type="button">›</button>
          </div>
          
          <div class="calendar-grid">
            <div class="calendar-weekdays">
              <div class="weekday">Su</div>
              <div class="weekday">Mo</div>
              <div class="weekday">Tu</div>
              <div class="weekday">We</div>
              <div class="weekday">Th</div>
              <div class="weekday">Fr</div>
              <div class="weekday">Sa</div>
            </div>
            
            <div class="calendar-days">
              <button 
                v-for="day in calendarDays" 
                :key="day.key"
                class="calendar-day"
                :class="{
                  'other-month': !day.isCurrentMonth,
                  'selected': day.isSelected,
                  'disabled': !day.isSelectable,
                  'monday': day.isMonday,
                  'friday': day.isFriday
                }"
                :disabled="!day.isSelectable"
                @click="selectDate(day)"
                type="button"
              >
                {{ day.date }}
              </button>
            </div>
          </div>
        </div>
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
import { getCabins } from '../services/komodoApi'
import '../styles/pages/plan.css'

/** ===== State ===== */
const step = ref(1)
const region = ref('')
const lodges = ref([]) // Multi-select cabins

const dateFrom = ref('')
const dateTo = ref('') // Keep for compatibility but not used in UI
const adults = ref(2)
const children = ref(0)
const age3_9 = ref(0)
const age0_2 = ref(0)

// Calendar state
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const loading = ref(false)
const error = ref('')

/** API Data */
const cabinsData = ref(null)

/** ===== Derived ===== */
const regions = computed(() => 
  cabinsData.value?.operators.map(op => op.operator) || []
)

const cabinsForRegion = computed(() => {
  if (!region.value || !cabinsData.value) return []
  const operator = cabinsData.value.operators.find(op => op.operator === region.value)
  return operator?.cabins || []
})

const labels = ['Regions', 'Cabins', 'Dates', 'Guests', 'Submit']
const prevLabel = computed(() => labels[step.value - 2] || '')
const nextLabel = computed(() => step.value < 5 ? (labels[step.value - 1] + ' ›') : 'Submit ›')

/** Calendar computed properties */
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const currentMonthYear = computed(() => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return `${monthNames[currentMonth.value]} ${currentYear.value}`
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  const today = new Date()
  
  // Start from Sunday of the week containing the 1st
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const days = []
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, 5 = Friday
    const isCurrentMonth = date.getMonth() === currentMonth.value
    const isSelectable = isCurrentMonth && 
                        date >= today && 
                        (dayOfWeek === 1 || dayOfWeek === 5) // Monday or Friday only
    
    const dateString = date.toISOString().split('T')[0]
    
    days.push({
      key: date.getTime(),
      date: date.getDate(),
      fullDate: dateString,
      isCurrentMonth,
      isSelectable,
      isSelected: dateFrom.value === dateString,
      isMonday: dayOfWeek === 1,
      isFriday: dayOfWeek === 5
    })
  }
  
  return days
})

/** Guards untuk step navigation */
const canGoStep2 = computed(() => !!region.value)
const canGoStep3 = computed(() => !!region.value && lodges.value.length > 0)
const canGoStep4 = computed(() => !!region.value && lodges.value.length > 0 && !!dateFrom.value)

/** ===== Effects ===== */
onMounted(async () => {
  await fetchCabins()
})

watch(region, () => {
  // reset cabins saat ganti region
  lodges.value = []
})

/** ===== Actions ===== */
function go(n) { step.value = n }

function next() {
  // guard ringan biar UX jelas
  if (step.value === 1 && !region.value) return toast('Please select a region first.')
  if (step.value === 2 && lodges.value.length === 0) return toast('Please select at least one cabin first.')
  if (step.value === 3 && !dateFrom.value) return toast('Please select a start date first.')
  if (step.value < 5) step.value++
  else goResults()
}

function prev() { if (step.value > 1) step.value-- }

function goResults() { 
  // Save search criteria to localStorage for Results page
  const searchCriteria = {
    region: region.value,
    lodges: lodges.value,
    dateFrom: dateFrom.value,
    dateTo: dateTo.value,
    adults: adults.value,
    children: children.value,
    age3_9: age3_9.value,
    age0_2: age0_2.value,
    totalGuests: adults.value + children.value + age3_9.value + age0_2.value,
    timestamp: Date.now()
  }
  
  localStorage.setItem('komodo_search_criteria', JSON.stringify(searchCriteria))
  window.location.href = '/results' 
}

function inc(which) {
  if (which === 'adults') adults.value++
  else if (which === 'children') children.value++
  else if (which === 'age3_9') age3_9.value++
  else if (which === 'age0_2') age0_2.value++
}

function dec(which) {
  if (which === 'adults' && adults.value > 0) adults.value--
  else if (which === 'children' && children.value > 0) children.value--
  else if (which === 'age3_9' && age3_9.value > 0) age3_9.value--
  else if (which === 'age0_2' && age0_2.value > 0) age0_2.value--
}

function toast(msg) {
  // sementara pake alert; ganti dengan toaster kamu kalau ada
  alert(msg)
}

/** Calendar methods */
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function selectDate(day) {
  if (day.isSelectable) {
    dateFrom.value = day.fullDate
    // For trips, we can automatically set end date (e.g., 3 days later)
    const endDate = new Date(day.fullDate)
    endDate.setDate(endDate.getDate() + 3) // 3-day trip example
    dateTo.value = endDate.toISOString().split('T')[0]
  }
}

/** ===== API call ===== */
async function fetchCabins() {
  loading.value = true
  error.value = ''
  try {
    const data = await getCabins()
    cabinsData.value = data

    // auto-pick region kalau cuma ada satu
    if (!region.value && data.operators.length === 1) {
      region.value = data.operators[0].operator
    }
  } catch (e) {
    error.value = `Failed to load cabins: ${e instanceof Error ? e.message : String(e)}`
  } finally {
    loading.value = false
  }
}
</script>
