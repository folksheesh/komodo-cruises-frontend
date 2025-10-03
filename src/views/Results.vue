<template>
  <div class="results-wrap">
    <div class="results-container">
      <div class="results-layout">
        <!-- Main Results Content -->
        <div class="results-main">
          <h2 class="results-title">Your Search Results</h2>
          
          <div class="results-intro">
            <p class="results-note">
              <strong>Your preferred travel dates are available!</strong> We have a team of Singita Journey Designers who are ready to plan your trip.
              Simply select the results that suit your preferences best and submit your enquiry.
            </p>
            <p class="results-note-muted">
              <span class="semibold">Note:</span> These results indicate availability and do not guarantee a booking.
            </p>
          </div>

          <!-- Lodge Results -->
          <div class="lodge-results" v-if="searchResults.length">
            <div class="lodge-card" v-for="lodge in searchResults" :key="lodge.id">
              <!-- Lodge Image Gallery -->
              <div class="lodge-gallery">
                <div class="lodge-image">
                  <img :src="lodge.image" :alt="lodge.name" />
                  <button class="gallery-prev" @click="prevImage(lodge.id)">&lt;</button>
                  <button class="gallery-next" @click="nextImage(lodge.id)">&gt;</button>
                </div>
              </div>

              <!-- Lodge Info -->
              <div class="lodge-info">
                <div class="lodge-header">
                  <h3 class="lodge-name">{{ lodge.name }}</h3>
                  <p class="lodge-location">{{ lodge.location }}</p>
                  <button class="lodge-details-btn">Lodge Details &gt;</button>
                </div>

                <!-- Availability Status -->
                <div v-if="lodge.hasAvailability" class="availability-success">
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
                    <span class="price-from">from {{ lodge.priceFrom }} per adult, per night</span>
                  </div>
                  <p class="availability-count">{{ lodge.availableRooms }} available</p>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-else class="no-results">
            <p>No lodges found matching your criteria.</p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="results-sidebar">
          <div class="sidebar-section">
            <h3>Check Availability</h3>
            
            <div class="filter-group">
              <label class="filter-label">Region</label>
              <select v-model="filters.region" class="filter-select">
                <option value="">Regions: {{ selectedRegions.length || 'All' }}</option>
                <option v-for="region in availableRegions" :key="region" :value="region">
                  {{ region }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Lodges</label>
              <select v-model="filters.lodge" class="filter-select">
                <option value="">Lodges: {{ selectedLodges.length || 'All' }}</option>
                <option v-for="lodge in availableLodges" :key="lodge" :value="lodge">
                  {{ lodge }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Guests</label>
              <select v-model="filters.guests" class="filter-select">
                <option value="2">2 Guests</option>
                <option value="4">4 Guests</option>
                <option value="6">6 Guests</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="filter-label">Dates</label>
              <div class="date-inputs">
                <input type="date" v-model="filters.dateFrom" class="date-input" />
                <span class="date-separator">→</span>
                <input type="date" v-model="filters.dateTo" class="date-input" />
              </div>
            </div>

            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="filters.flexibleDates" />
                My dates are flexible, show alternatives
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import '../styles/pages/results.css'

// Mock data - replace with real API calls
const searchResults = ref([
  {
    id: 1,
    name: 'Ebony',
    location: 'Sabi Sand',
    image: '/src/images/komodo.jpg',
    hasAvailability: false,
    priceFrom: 'ZAR 53,630',
    availableRooms: '1 available',
    description: 'Luxury safari lodge in private game reserve'
  }
])

const filters = ref({
  region: '',
  lodge: '',
  guests: '2',
  dateFrom: '2025-10-15',
  dateTo: '2025-10-17',
  flexibleDates: true
})

// Computed properties for sidebar
const selectedRegions = computed(() => filters.value.region ? [filters.value.region] : [])
const selectedLodges = computed(() => filters.value.lodge ? [filters.value.lodge] : [])

const availableRegions = computed(() => ['Sabi Sand', 'Kruger National Park', 'Waterberg'])
const availableLodges = computed(() => ['Ebony', 'Lebombo Lodge', 'Boulders Lodge'])

// Gallery navigation
function prevImage(lodgeId) {
  console.log('Previous image for lodge:', lodgeId)
}

function nextImage(lodgeId) {
  console.log('Next image for lodge:', lodgeId)
}

onMounted(() => {
  // Load search results based on route params or store
  console.log('Loading search results...')
})
</script>


