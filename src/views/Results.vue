<template>
  <div class="results-wrap">
    <div class="results-container">
      <div class="results-layout">
        <!-- Main Results Content -->
        <div class="results-main">
          <h2 class="results-title">Your Search Results</h2>
          
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <p>Loading availability data...</p>
          </div>
          
          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <p class="error-message">{{ error }}</p>
            <button @click="loadResults" class="btn-primary">Try Again</button>
          </div>
          
          <!-- Results Content -->
          <div v-else>
            <div class="results-intro">
              <div v-if="hasFullAvailability" class="success-message">
                <p><strong>Great news, we have availability!</strong></p>
                <p>Select the result that best suits you from the list below and it will be added to the itinerary summary on the right.</p>
              </div>

              <div v-else-if="hasPartialAvailability" class="partial-message">
                <p><strong>Alternative options are available</strong></p>
                <p>Unfortunately, there isn't availability for your selected dates. However, the following alternate options may suit your requirements.</p>
              </div>

              <div v-else class="no-availability">
                <p><strong>Unfortunately, we do not have availability for your dates.</strong></p>
                <p>We have a team of Komodo Cruises Travel Advisors who are ready to assist you with planning your trip. Simply select your preferences and submit your enquiry below, alternatively, please try new dates.</p>
              </div>

              <p class="results-note-muted">
                <span class="semibold">Note:</span> These results indicate availability and do not guarantee a booking.
              </p>
            </div>

          <!-- Lodge Results -->
          <div class="lodge-results" v-if="availabilityResults.length">
            <div class="lodge-card" v-for="result in availabilityResults" :key="result.lodge">
              <!-- Lodge Image Gallery -->
              <div class="lodge-gallery">
                <div class="lodge-image">
                  <img :src="result.image" :alt="result.lodge" />
                  <button class="gallery-prev" @click="prevImage(result.lodge)">&lt;</button>
                  <button class="gallery-next" @click="nextImage(result.lodge)">&gt;</button>
                </div>
              </div>

              <!-- Lodge Info -->
              <div class="lodge-info">
                <div class="lodge-header">
                  <h3 class="lodge-name">{{ result.lodge }}</h3>
                  <p class="lodge-location">{{ searchCriteria?.region }}</p>
                  <button class="lodge-details-btn">Lodge Details &gt;</button>
                </div>

                <!-- Availability Status -->
                <div v-if="result.hasAvailability" class="availability-success">
                  <h4>Your dates are available</h4>
                  <p>We're delighted to confirm availability for your selected dates.</p>
                </div>

                <div v-else class="availability-alternative">
                  <h4>Alternative options are available</h4>
                  <p>Unfortunately, there isn't availability for your selected dates. However, the following alternate options may suit your requirements.</p>
                </div>

                <!-- Suites Info -->
                <div class="suites-info">
                  <div class="suites-header">
                    <h5>Suites</h5>
                    <span class="price-from">{{ result.availableSlots }} slots available</span>
                  </div>
                  <p class="availability-count">Available: {{ result.availableSlots }} / {{ result.totalSlots }} guests</p>
                  
                  <!-- Action Buttons -->
                  <div v-if="result.hasAvailability" class="action-buttons">
                    <button class="btn-details">Room & Rate Details &gt;</button>
                    <button class="btn-add-itinerary">Add to itinerary</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-else class="no-results">
            <p>No lodges found matching your criteria. Please try different search parameters.</p>
            <button @click="applyFilters" class="btn-primary">Search Again</button>
          </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="results-sidebar">
          <div class="sidebar-section">
            <h3>Check Availability</h3>
            
            <div v-if="searchCriteria" class="search-summary">
              <div class="filter-group">
                <label class="filter-label">Region</label>
                <div class="filter-value">{{ searchCriteria.region }}</div>
              </div>

              <div class="filter-group">
                <label class="filter-label">Lodges</label>
                <div class="filter-value">{{ searchCriteria.lodges.join(', ') }}</div>
              </div>

              <div class="filter-group">
                <label class="filter-label">Guests</label>
                <div class="filter-value">{{ searchCriteria.totalGuests }} Guests</div>
              </div>

              <div class="filter-group">
                <label class="filter-label">Dates</label>
                <div class="date-display">
                  <span>{{ formatDate(searchCriteria.dateFrom) }}</span>
                  <span class="date-separator">→</span>
                  <span>{{ formatDate(searchCriteria.dateTo) }}</span>
                </div>
              </div>

              <div class="sidebar-actions">
                <router-link to="/plan" class="btn-secondary">Modify Search</router-link>
                <button @click="checkAvailability" class="btn-primary">Refresh</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAvailability } from '../services/komodoApi'
import '../styles/pages/results.css'

// State
const loading = ref(false)
const error = ref('')
const searchCriteria = ref(null)
const availabilityData = ref([])

// Computed properties
const availabilityResults = computed(() => {
  if (!searchCriteria.value || !availabilityData.value.length) return []
  
  const results = []
  
  // Process each selected lodge
  for (const selectedLodge of searchCriteria.value.lodges) {
    // Find availability data for this lodge
    let totalAvailableSlots = 0
    let totalSlots = 0
    let hasAvailability = false
    
    // Check each date in the range
    for (const dayData of availabilityData.value) {
      if (dayData?.operators?.length > 0) {
        const operator = dayData.operators[0]
        
        // Find cabins that match our selected lodge
        const matchingCabins = operator.cabins.filter(cabin => {
          const cabinBaseName = cabin.split(' (')[0]
          return cabinBaseName === selectedLodge
        })
        
        // Sum up available slots for this lodge on this day
        const daySlots = matchingCabins.reduce((sum, cabin) => {
          const match = cabin.match(/\((\d+)\)/)
          return sum + (match ? parseInt(match[1]) : 0)
        }, 0)
        
        totalAvailableSlots += daySlots
        totalSlots += daySlots
      }
    }
    
    // Calculate average daily availability
    const avgDailyAvailability = availabilityData.value.length > 0 
      ? totalAvailableSlots / availabilityData.value.length 
      : 0
    
    // Check if we have enough availability for the requested guests
    hasAvailability = avgDailyAvailability >= searchCriteria.value.totalGuests
    
    results.push({
      lodge: selectedLodge,
      hasAvailability,
      availableSlots: Math.floor(avgDailyAvailability),
      totalSlots: Math.floor(totalSlots / availabilityData.value.length),
      image: '/src/images/komodo.jpg' // Default image
    })
  }
  
  return results
})

const hasFullAvailability = computed(() => 
  availabilityResults.value.length > 0 && 
  availabilityResults.value.every(result => result.hasAvailability)
)

const hasPartialAvailability = computed(() => 
  availabilityResults.value.length > 0 && 
  availabilityResults.value.some(result => result.hasAvailability) &&
  !hasFullAvailability.value
)

const hasAnyAvailability = computed(() => 
  availabilityResults.value.some(result => result.hasAvailability)
)

// Methods
function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

function prevImage(lodgeId) {
  console.log('Previous image for lodge:', lodgeId)
}

function nextImage(lodgeId) {
  console.log('Next image for lodge:', lodgeId)
}

async function checkAvailability() {
  if (!searchCriteria.value) return
  
  loading.value = true
  error.value = ''
  availabilityData.value = []
  
  try {
    const { region, dateFrom, dateTo } = searchCriteria.value
    
    // Generate date range
    const startDate = new Date(dateFrom)
    const endDate = new Date(dateTo)
    const dates = []
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0])
    }
    
    // Check availability for each date
    const sheet = `${region} (Normalized)`
    const promises = dates.map(date => 
      getAvailability(date, sheet).catch(err => {
        console.warn(`Failed to get availability for ${date}:`, err)
        return null
      })
    )
    
    const results = await Promise.all(promises)
    availabilityData.value = results.filter(result => result !== null)
    
    if (availabilityData.value.length === 0) {
      error.value = 'No availability data found for the selected dates and region.'
    }
    
  } catch (err) {
    error.value = `Failed to check availability: ${err.message}`
    console.error('Availability check error:', err)
  } finally {
    loading.value = false
  }
}

// Load search criteria and check availability on mount
onMounted(async () => {
  try {
    const saved = localStorage.getItem('komodo_search_criteria')
    if (saved) {
      searchCriteria.value = JSON.parse(saved)
      await checkAvailability()
    }
  } catch (err) {
    console.error('Failed to load search criteria:', err)
    error.value = 'Failed to load search criteria'
  }
})
</script>


