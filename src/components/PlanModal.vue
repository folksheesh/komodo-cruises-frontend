<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay">
        <div class="modal-container">
        <!-- Modal Header with Close -->
        <div class="modal-header">
          <div class="modal-header-content">
            <h2 class="modal-title">Plan your trip</h2>
            <button class="modal-close" @click="closeModal">Close ✕</button>
          </div>
        </div>

        <!-- Plan Content (same as Plan.vue) -->
        <div class="modal-body">
          <section class="plan-wrap plan-page">
            <div class="plan-content">
              <!-- Steps Header -->
              <div class="steps" role="tablist" aria-label="Plan steps">
                <button class="step" :class="{ 'step-active': step === 1 }" @click="go(1)">Step 1</button>
                <button class="step" :class="{ 'step-active': step === 2 }" @click="go(2)" :disabled="!canGoStep2">Step
                  2</button>
                <button class="step" :class="{ 'step-active': step === 3 }" @click="go(3)" :disabled="!canGoStep3">Step
                  3</button>
                <button class="step" :class="{ 'step-active': step === 4 }" @click="go(4)" :disabled="!canGoStep4">Step
                  4</button>
                <button class="step" :class="{ 'step-active': step === 5 }" @click="go(5)" :disabled="!canGoStep4">Step
                  5</button>
              </div>

              <!-- Step 1: Regions (multi select) -->
              <div v-if="step === 1">
                <h3 class="step-title">Destinations</h3>
                <p class="results-note">Select the destinations you're interested in:</p>

                <div class="list">
                  <div class="list-heading">Nusa Tenggara Timur</div>

                  <div class="list-row" v-for="d in DESTINATIONS" :key="d">
                    <div class="list-text">{{ d }}</div>
                    <input class="check" type="checkbox" :value="d" v-model="selectedDestinations"
                      :aria-label="`Destination ${d}`" />
                  </div>
                </div>
              </div>

              <!-- Step 2: Ships -->
              <div v-else-if="step === 2">
                <h3 class="step-title">Ships</h3>
                <p class="results-note">Please select one or more ships:</p>

                <div class="list">
                  <div class="list-heading">Available Ships</div>

                  <div v-if="shipsLoading" class="muted">Loading ships...</div>
                  <template v-else>
                  <div class="list-row" v-for="s in shipsList" :key="s.id">
                    <div class="list-text">{{ s.label }}</div>
                    <input class="check" type="checkbox" :value="s.id" v-model="selectedShipIds" :aria-label="`Ship ${s.label}`" />
                  </div>
                    <div v-if="shipsList.length === 0" class="muted">No ships found from API.</div>
                  </template>
                </div>
              </div>

              <!-- Step 3: Dates -->
              <div v-else-if="step === 3">
                <h3 class="step-title">Dates</h3>
                <p class="results-note">Select the start date for your trip:</p>
                <p class="results-note text-sm">Trips start only on Mondays and Fridays.</p>

                <div class="date-input-section">
                  <label class="date-label">Start Date:</label>
                  <input type="text" disabled class="input date-input" v-model="dateFrom" :min="minDate" />
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
                      <button v-for="day in calendarDays" :key="day.key" class="calendar-day" :class="{
                        'other-month': !day.isCurrentMonth,
                        'selected': day.isSelected,
                        'disabled': !day.isSelectable,
                        'monday': day.isMonday,
                        'friday': day.isFriday
                      }" :disabled="!day.isSelectable" @click="selectDate(day)" type="button">
                        {{ day.date }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 4: Guests -->
              <div v-else-if="step === 4">
                <h3 class="step-title">Guests</h3>
                <p class="results-note">Please indicate how many adults will need to be accommodated.</p>
                <p class="results-note">If your booking includes children, please enquire directly on the next step.</p>
                <p class="results-note">View our child policy for each lodge here.</p>

                <div class="counters">
                  <div class="counter-row">
                    <div class="counter-text">
                      <div class="semibold">Adults</div>
                      <div class="muted text-sm">Ages 17+</div>
                    </div>
                    <div class="counter-ctrls">
                      <button type="button" class="btn-icon" @click="dec('adults')">−</button>
                      <span class="count">{{ adults }}</span>
                      <button type="button" class="btn-icon" @click="inc('adults')">+</button>
                    </div>
                  </div>

                  <div class="counter-row">
                    <div class="counter-text">
                      <div class="semibold">Children</div>
                      <div class="muted text-sm">Ages 10 - 16</div>
                    </div>
                    <div class="counter-ctrls">
                      <button type="button" class="btn-icon" @click="dec('children')">−</button>
                      <span class="count">{{ children }}</span>
                      <button type="button" class="btn-icon" @click="inc('children')">+</button>
                    </div>
                  </div>

                  <div class="counter-row">
                    <div class="counter-text">
                      <div class="semibold">Ages 3 - 9</div>
                    </div>
                    <div class="counter-ctrls">
                      <button type="button" class="btn-icon" @click="dec('age3_9')">−</button>
                      <span class="count">{{ age3_9 }}</span>
                      <button type="button" class="btn-icon" @click="inc('age3_9')">+</button>
                    </div>
                  </div>

                  <div class="counter-row">
                    <div class="counter-text">
                      <div class="semibold">Ages 0 - 2</div>
                    </div>
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
                  <button class="btn-primary" @click="checkAvailability">Check now</button>
                </div>

                <div class="section-divider" style="margin:1.5rem 0"></div>

                <h4 class="section-title">Speak with a Komodo Cruises Travel Advisor</h4>
                <p class="results-note">
                  Need some help to plan your trip? Enquire below to contact one of our Komodo Cruises Travel Advisors.
                </p>
                <div class="mt-4">
                  <button class="btn-primary" @click="enquireNow">Enquire now</button>
                </div>
              </div>

              <!-- Bottom bar navigation -->
              <div class="bottom-bar">
                <div class="nav-inner" style="display:flex; align-items:center; justify-content:space-between;">
                  <button class="link-muted" v-if="step > 1" @click="prev">‹ {{ prevLabel }}</button>
                  <span v-else></span>
                  <button class="btn-primary" @click="next">{{ nextLabel }}</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import { getOperators } from '../services/komodoApi'
import { formatDateToString, addDaysToDateString, getTodayString } from '../utils/dateUtils'
import '../styles/pages/plan.css'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'navigate-to-results'])

/** ===== State ===== */
const step = ref(1)
// Fixed region label and static options
const REGION_NAME = 'Nusa Tenggara Timur'
const DESTINATIONS = ['Komodo National Park', 'Labuan Bajo']
// Configured ships: display label + sheet name used by API
const SHIPS_CONFIG = [] // Data kapal diambil dari API, bukan hardcoded

// Ships loaded from API sheets (validated list of {label, sheet})
const shipsList = ref([])
const shipsLoading = ref(false)

// Multiple destinations selection
const selectedDestinations = ref([])
// Selected ship sheets (array of sheet names)
const selectedShipIds = ref([])

const dateFrom = ref('')
const dateTo = ref('') // Keep for compatibility but not used in UI
const adults = ref(2)
const children = ref(0)
const age3_9 = ref(0)
const age0_2 = ref(0)

// Calendar state
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const labels = ['Destinations', 'Ships', 'Dates', 'Guests', 'Submit']
const prevLabel = computed(() => labels[step.value - 2] || '')
const nextLabel = computed(() => step.value < 5 ? (labels[step.value - 1] + ' ›') : 'Submit ›')

/** Calendar computed properties */
const minDate = computed(() => getTodayString())

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

    // Use utility function for consistent date formatting
    const dateString = formatDateToString(date)

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
const canGoStep2 = computed(() => selectedDestinations.value.length > 0)
const canGoStep3 = computed(() => selectedDestinations.value.length > 0 && selectedShipIds.value.length > 0)
const canGoStep4 = computed(() => selectedDestinations.value.length > 0 && selectedShipIds.value.length > 0 && !!dateFrom.value)

/** ===== Effects ===== */
watch(selectedDestinations, () => {
  // reset ship saat ganti destinasi
  selectedShipIds.value = []
})

// Watch modal open/close untuk handle body scrollbar
const originalScrollStyles = {
  bodyOverflow: '',
  htmlOverflow: '',
  bodyPadding: '',
  htmlPadding: ''
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    lockPageScroll()
  } else {
    restorePageScroll()
  }
}, { immediate: true })

onMounted(() => {
  loadShips()
})

// Cleanup: pastikan scrollbar kembali saat component unmount
onUnmounted(() => {
  restorePageScroll()
})

/** ===== Actions ===== */
function closeModal() {
  emit('close')
}

function go(n) { step.value = n }

function next() {
  // guard ringan biar UX jelas
  if (step.value === 1 && selectedDestinations.value.length === 0) return toast('Please select at least one destination first.')
  if (step.value === 2 && selectedShipIds.value.length === 0) return toast('Please select at least one ship first.')
  if (step.value === 3 && !dateFrom.value) return toast('Please select a start date first.')
  if (step.value < 5) step.value++
  else goResults()
}

function prev() { if (step.value > 1) step.value-- }

function checkAvailability() {
  goResults()
}

function enquireNow() {
  goResults()
}

function goResults() {
  // Save search criteria to localStorage for Results page
  // Map selected sheets back to labels for display
  const selectedEntries = shipsList.value.filter(s => selectedShipIds.value.includes(s.id))
  const selectedLabels = selectedEntries.map(s => s.label)
  const selectedSheets = selectedEntries.map(s => s.sheet)

  const searchCriteria = {
    region: REGION_NAME,
    destination: selectedDestinations.value[0] || '', // backward-compat single
    destinations: selectedDestinations.value.slice(),
    ships: selectedLabels, // display labels
    shipSheets: selectedSheets,
    // backward-compat
    ship: selectedLabels[0] || '',
    lodges: selectedLabels.slice(),
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
  emit('navigate-to-results')
}

async function loadShips() {
  shipsLoading.value = true
  try {
    const res = await getOperators()
    const normalized = (res.operators || []).map(op => {
      const label = op.operator?.trim() || ''
      const sheet = op.sourceSheet?.trim() || label
      return {
        id: `${label}__${sheet}`,
        label,
        sheet
      }
    }).filter(s => s.label && s.sheet)
    shipsList.value = normalized.length ? normalized : normalizeConfigShips(SHIPS_CONFIG)
  } catch (e) {
    console.warn('Failed to load operators:', e)
    shipsList.value = normalizeConfigShips(SHIPS_CONFIG)
  } finally {
    shipsLoading.value = false
  }
}

function lockPageScroll() {
  const body = document.body
  const html = document.documentElement
  if (!body || !html) return

  const scrollBarWidth = window.innerWidth - html.clientWidth
  originalScrollStyles.bodyOverflow = body.style.overflow
  originalScrollStyles.htmlOverflow = html.style.overflow
  originalScrollStyles.bodyPadding = body.style.paddingRight
  originalScrollStyles.htmlPadding = html.style.paddingRight

  if (scrollBarWidth > 0) {
    const pad = `${scrollBarWidth}px`
    body.style.paddingRight = pad
    html.style.paddingRight = pad
  }
  body.style.overflow = 'hidden'
  html.style.overflow = 'hidden'
}

function restorePageScroll() {
  const body = document.body
  const html = document.documentElement
  if (!body || !html) return

  body.style.overflow = originalScrollStyles.bodyOverflow
  html.style.overflow = originalScrollStyles.htmlOverflow
  body.style.paddingRight = originalScrollStyles.bodyPadding
  html.style.paddingRight = originalScrollStyles.htmlPadding
}

function normalizeConfigShips(list) {
  return Array.isArray(list)
    ? list.map(s => {
        const label = s.label?.trim() || ''
        const sheet = s.sheet?.trim() || label
        return {
          id: s.id || `${label}__${sheet}`,
          label,
          sheet
        }
      }).filter(s => s.label && s.sheet)
    : []
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
    dateTo.value = addDaysToDateString(day.fullDate, 3)
  }
}

/** ===== API call ===== */
// Ships are loaded on mount via getCabins()
</script>

<style scoped>
/* Modal overlay - fullscreen */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 1000;
}

/* Modal container - fullscreen */
.modal-container {
  background: white;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

/* ===== MODAL HEADER/NAV - Independent ===== */
:root {
  /* Satu variabel buat padding horizontal halaman */
  --page-pad: clamp(16px, 5vw, 40px);
}

/* Header */
.modal-header {
  background: #fff;
  border-bottom: 1px solid rgba(34, 63, 98, .15);
  box-shadow: 0 2px 4px rgba(0, 0, 0, .05);
  z-index: 10;
  padding: .75rem 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Konten header dengan padding yang proper */
.modal-header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-left: 150px;
  margin-right: 150px;
}

/* Title fleksibel (biar nggak nabrak tombol) */
.modal-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 400;
  color: var(--ocean-900);
  font-family: var(--font-serif, serif);

  flex: 1;
  /* ambil ruang sisa */
  min-width: 0;
  /* aktifkan ellipsis */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tombol Close tetap di kanan, tanpa trik ms-auto */
.modal-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--ocean-700);
  padding: .5rem .75rem;
  margin-right: 30px;
  border-radius: .25rem;
  text-decoration: none;
  text-underline-offset: 3px;
  transition: color .18s ease, opacity .18s ease;
  opacity: .96; /* subtle base for smoother fade in/out */
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: .5rem;
  white-space: nowrap;
}


.modal-close:hover {
  background: transparent;
  color: var(--ocean-900);
  opacity: .84; /* stronger but still subtle */
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ===== MODAL BODY - Independent ===== */
.modal-body {
  background: white;
  overflow-y: auto;
  padding-bottom: 0;
}

/* Plan content wrapper */
.modal-body .plan-wrap {
  background: white;
  min-height: 100%;
}

.modal-body .plan-content {
  background: white;
  max-width: 750px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  padding-bottom: 4rem;
}

/* ===== MODAL FOOTER/BOTTOM BAR - Independent & Separated ===== */
.modal-body .bottom-bar {
  background: white;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  border-top: 1px solid rgba(34, 63, 98, .08);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  z-index: 20;
  backdrop-filter: blur(6px);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-body .bottom-bar .nav-inner {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* Override plan.css backgrounds for modal */
.modal-body .plan-wrap,
.modal-body .plan-content {
  background: white !important;
}

/* Remove margin-top from bottom-bar in modal */
.modal-body .bottom-bar {
  margin-top: 0 !important;
}
</style>
