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
              <!-- Success when selected ships have cabins on the chosen start date -->
              <div v-if="allStartDateCabins.length" class="success-message">
                <p><strong>Your preferred travel dates are available!</strong></p>
                <p>We have a team of Singita Journey Designers who are ready to plan your trip. Simply select the results that suit your preferences best and submit your enquiry.</p>
                <p class="results-note-muted"><span class="semibold">Note:</span> These results indicate availability and do not guarantee a booking.</p>
              </div>

              <!-- Unavailable note when no start-date cabins and alternatives not requested -->
              <div v-else-if="!flexibleAlt" class="no-availability">
                <p><strong>Your preferred dates are unfortunately not available, but there is availability at other Singita lodges or on alternate dates.</strong></p>
                <p>We have a team of Singita Journey Designers who are ready to plan your trip. Simply select the results that suit your preferences best and submit your enquiry.</p>
                <p class="results-note-muted"><span class="semibold">Note:</span> These results indicate availability and do not guarantee a booking.</p>
              </div>
            </div>

            <!-- Start-date cabins limited to selected ships only -->
            <div v-if="allStartDateCabins.length" class="lodge-results">
              <div class="cabin-card" v-for="item in allStartDateCabins" :key="item.key">
                <!-- Image Section -->
                <div class="cabin-image">
                  <img
                    :src="item.image"
                    :alt="item.cabinName"
                    referrerpolicy="no-referrer"
                    decoding="async"
                    loading="lazy"
                    @error="onImgError($event, item.image)"
                  />
                  <button class="gallery-nav gallery-prev" @click="prevImage(item.cabinName)" aria-label="Previous image">&lsaquo;</button>
                  <button class="gallery-nav gallery-next" @click="nextImage(item.cabinName)" aria-label="Next image">&rsaquo;</button>
                </div>

                <!-- Content Section -->
                <div class="cabin-content">
                  <!-- Header with name and details button -->
                  <div class="cabin-header">
                    <div class="cabin-title-group">
                      <h3 class="cabin-name">{{ item.cabinName }}</h3>
                      <div class="cabin-location-row">
                        <p class="cabin-location">{{ formatShipName(item.operatorLabel) }}</p>
                        <button class="cabin-details-btn" @click="viewCabinDetails(item)">
                          Cabin details <span class="arrow-icon">&rsaquo;</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="cabin-divider"></div>

                  <!-- Availability Box -->
                  <div class="availability-box">
                    <h4 class="availability-title">Great news, we have availability!</h4>
                    <p class="availability-text">Select the result that best suits you from the list below and it will be added to the itinerary summary on the right.</p>
                  </div>

                  <!-- Cabin Info Section - 2 Column Layout -->
                  <div class="cabin-info-section">
                    <div class="cabin-info-left">
                      <p class="suite-type">Suite</p>
                      <p class="suite-price">from {{ item.price || 'Rp3,650,000' }} per adult, per night</p>
                      <p class="suite-availability">{{ item.available || 1 }} available</p>
                    </div>
                    <div class="cabin-info-right">
                      <button 
                        class="btn-add-to-itinerary" 
                        @click="toggleItinerary(item)"
                        :class="{ 'in-itinerary': isInItinerary(item) }"
                      >
                        <span class="btn-text">{{ isInItinerary(item) ? 'Remove' : 'Add to itinerary' }}</span>
                        <span class="btn-icon">
                          <span v-if="isInItinerary(item)" class="icon-x">✕</span>
                          <span v-else class="icon-circle"></span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- If selected ships have no start-date cabins but others do, show note only when alternatives requested -->
            <div v-else-if="flexibleAlt && hasAltStartDateCabins" class="availability-alternative" style="margin-bottom:1rem;">
              <h4>Alternative options are available</h4>
              <p>There are cabins available on other ships for your selected date. Adjust your ship selection to view them.</p>
            </div>

            <!-- Cabin Results (primary) shown only if flexible alternatives are requested -->
            <div class="lodge-results" v-else-if="flexibleAlt && cabinCards.length">
              <div class="lodge-card" v-for="item in cabinCards" :key="item.ship + ':' + item.cabinName">
                <!-- Image -->
                <div class="lodge-gallery">
                  <div class="lodge-image">
                    <img
                      :src="item.image"
                      :alt="item.cabinName"
                      referrerpolicy="no-referrer"
                      decoding="async"
                      loading="lazy"
                      @error="onImgError($event, item.image)"
                    />
                    <button class="gallery-prev" @click="prevImage(item.cabinName)">&lt;</button>
                    <button class="gallery-next" @click="nextImage(item.cabinName)">&gt;</button>
                  </div>
                </div>

                <!-- Info -->
                <div class="lodge-info">
                  <div class="lodge-header" style="display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;">
                    <div>
                      <h3 class="lodge-name" style="margin:0;">{{ item.cabinName }}</h3>
                      <p class="lodge-location" style="margin:.25rem 0 0;">{{ displayDestinations }}</p>
                    </div>
                    <button class="lodge-details-btn">Cabin details &gt;</button>
                  </div>

                  <div class="availability-success">
                    <h4>Great news, we have availability!</h4>
                    <p>Select the result that best suits you from the list below and it will be added to the itinerary summary on the right.</p>
                  </div>

                  <div class="suites-info">
                    <div class="suites-header" style="display:flex; align-items:center; justify-content:space-between;">
                      <h5 style="margin:0;">Suite</h5>
                      <span class="price-from">1 available</span>
                    </div>
                    <p class="availability-count" style="margin:.25rem 0 1rem;">Date: {{ formatDate(item.date) }}</p>
                    <div class="action-buttons" style="display:flex; gap:.5rem; align-items:center;">
                      <button class="btn-details">Room & Rate Details &gt;</button>
                      <button class="btn-add-itinerary">Add to itinerary</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lodge Results (fallback) shown only if flexible alternatives are requested -->
            <div class="lodge-results" v-else-if="flexibleAlt && availabilityResults.length">
              <div class="lodge-card" v-for="result in availabilityResults" :key="result.lodge">
                <!-- Image -->
                <div class="lodge-gallery">
                  <div class="lodge-image">
                    <img
                      :src="result.image"
                      :alt="result.lodge"
                      referrerpolicy="no-referrer"
                      decoding="async"
                      loading="lazy"
                      @error="onImgError($event, result.image)"
                    />
                    <button class="gallery-prev" @click="prevImage(result.lodge)">&lt;</button>
                    <button class="gallery-next" @click="nextImage(result.lodge)">&gt;</button>
                  </div>
                </div>

                <!-- Info -->
                <div class="lodge-info">
                  <div class="lodge-header" style="display:flex; align-items:flex-start; justify-content:space-between; gap:1rem;">
                    <div>
                      <h3 class="lodge-name" style="margin:0;">{{ result.lodge }}</h3>
                      <p class="lodge-location" style="margin:.25rem 0 0;">{{ displayDestinations }}</p>
                    </div>
                    <button class="lodge-details-btn">Cabin details &gt;</button>
                  </div>

                  <div v-if="result.hasAvailability" class="availability-success">
                    <h4>Great news, we have availability!</h4>
                    <p>Select the result that best suits you from the list below and it will be added to the itinerary summary on the right.</p>
                  </div>
                  <div v-else class="availability-alternative">
                    <h4>Alternative options are available</h4>
                    <p>Unfortunately, there isn't availability for your selected dates. However, the following alternate options may suit your requirements.</p>
                  </div>

                  <div class="suites-info">
                    <div class="suites-header" style="display:flex; align-items:center; justify-content:space-between;">
                      <h5 style="margin:0;">Suite</h5>
                      <span class="price-from">{{ result.availableCabinsCount }} available</span>
                    </div>
                    <p class="availability-count" style="margin:.25rem 0 1rem;">Date: {{ formatDate(result.dateFrom) }}</p>
                    <div class="action-buttons" style="display:flex; gap:.5rem; align-items:center;">
                      <button class="btn-details">Room & Rate Details &gt;</button>
                      <button class="btn-add-itinerary">Add to itinerary</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results (when alternatives requested but none found) -->
            <div v-else-if="flexibleAlt" class="no-results">
              <p>No alternative options found for your criteria.</p>
              <button @click="applyFilters" class="btn-primary">Search Again</button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="sidebar-container">
          <!-- Check Availability Section -->
          <div class="sidebar-section check-availability-section">
            <h3 class="section-title-sidebar">Check Availability</h3>

            <!-- Region removed as per request -->

            <!-- Destinations dropdown -->
            <div class="list dropdown" ref="destDropdown">
              <div class="list-heading">Destinations</div>
              <button
                type="button"
                :class="['select-summary', (openRegions || hoverRegions) ? 'is-filled' : '']"
                @mouseenter="hoverRegions = true"
                @mouseleave="hoverRegions = false"
                @click.stop="toggleDropdown('regions')"
                :aria-expanded="openRegions ? 'true' : 'false'"
              >
                <span>Destinations: {{ formDestinations.length }}</span>
                <span class="caret">{{ openRegions ? '▴' : '▾' }}</span>
              </button>
              <div v-if="openRegions" class="dropdown-panel" @click.stop>
                <div class="dropdown-group-title">{{ REGION_NAME }}</div>
                <div class="list-row" v-for="d in DESTINATIONS" :key="d" @click="toggleDestination(d)">
                  <div class="list-text">{{ d }}</div>
                  <input class="check" type="checkbox" :value="d" v-model="formDestinations" @click.stop />
                </div>
                <div class="dropdown-footer" @click="nextDropdown('regions')">
                  <span>Next</span>
                  <span style="font-size:1.1rem;">&rsaquo;</span>
                </div>
              </div>
            </div>

            <!-- Ships dropdown -->
            <div class="list dropdown" ref="shipsDropdown">
              <div class="list-heading">Ships</div>
              <button
                type="button"
                :class="['select-summary', (openShips || hoverShips) ? 'is-filled' : '']"
                @mouseenter="hoverShips = true"
                @mouseleave="hoverShips = false"
                @click.stop="toggleDropdown('ships')"
                :aria-expanded="openShips ? 'true' : 'false'"
              >
                <span>Ships: {{ formShipIds.length }}</span>
                <span class="caret">{{ openShips ? '▴' : '▾' }}</span>
              </button>
              <div v-if="openShips" class="dropdown-panel" @click.stop>
                <div class="dropdown-group-title">{{ shipsGroupTitle }}</div>
                <div v-if="shipsLoading" class="muted">Loading ships...</div>
                <template v-else>
                  <div class="list-row" v-for="s in shipsList" :key="s.id" @click="toggleShip(s.id)">
                    <div class="list-text">{{ s.label }}</div>
                    <input class="check" type="checkbox" :value="s.id" v-model="formShipIds" @click.stop />
                  </div>
                  <div v-if="shipsList.length === 0" class="muted">No ships found from API.</div>
                </template>
                <div class="dropdown-footer" @click="nextDropdown('ships')">
                  <span>Next</span>
                  <span style="font-size:1.1rem;">&rsaquo;</span>
                </div>
              </div>
            </div>

            <!-- Guests dropdown -->
            <div class="list dropdown" ref="guestsDropdown">
              <div class="list-heading">Guests</div>
              <button
                type="button"
                :class="['select-summary', (openGuests || hoverGuests) ? 'is-filled' : '']"
                @mouseenter="hoverGuests = true"
                @mouseleave="hoverGuests = false"
                @click.stop="toggleDropdown('guests')"
                :aria-expanded="openGuests ? 'true' : 'false'"
              >
                <span>{{ guestsTotal }} Guests</span>
                <span class="caret">{{ openGuests ? '▴' : '▾' }}</span>
              </button>
              <div v-if="openGuests" class="dropdown-panel" @click.stop>
                <div class="dropdown-group-title">Guests</div>
                <div class="simple-guests">
                  <div class="simple-guests-label">Guests</div>
                  <div class="simple-guests-ctrls">
                    <button type="button" class="btn-icon" @click="decGuests">−</button>
                    <span class="count">{{ guestsTotal }}</span>
                    <button type="button" class="btn-icon" @click="incGuests">+</button>
                  </div>
                </div>
                <div class="dropdown-footer" @click="nextDropdown('guests')">
                  <span>Next</span>
                  <span style="font-size:1.1rem;">&rsaquo;</span>
                </div>
              </div>
            </div>

            <!-- Dates dropdown with custom calendar -->
            <div class="list dropdown" ref="datesDropdown">
              <div class="list-heading">Dates</div>
              <button
                type="button"
                :class="['select-summary', (openDates || hoverDates) ? 'is-filled' : '']"
                @mouseenter="hoverDates = true"
                @mouseleave="hoverDates = false"
                @click.stop="toggleDropdown('dates')"
                :aria-expanded="openDates ? 'true' : 'false'"
              >
                <span>{{ formDateFrom ? `${formDateFrom} → ${getEndDate(formDateFrom)}` : 'Select date' }}</span>
                <span class="caret">{{ openDates ? '▴' : '▾' }}</span>
              </button>
              <div v-if="openDates" class="dropdown-panel" @click.stop>
                <div class="dropdown-group-title">Dates</div>
                <div class="date-input-section">
                  <label class="date-label">Date Range:</label>
                  <input type="text" disabled class="input date-input" :value="formDateFrom ? `${formatDate(formDateFrom)} → ${formatDate(getEndDate(formDateFrom))}` : ''" />
                </div>
                <div class="custom-calendar">
                  <div class="calendar-header">
                    <button class="calendar-nav" @click="prevMonth" type="button">&lsaquo;</button>
                    <h4 class="calendar-title">{{ currentMonthYear }}</h4>
                    <button class="calendar-nav" @click="nextMonth" type="button">&rsaquo;</button>
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
                      }" :disabled="!day.isSelectable" @click="selectDateSidebar(day)" type="button">
                        {{ day.date }}
                      </button>
                    </div>
                  </div>
                </div>
                <div class="dropdown-footer" @click="nextDropdown('dates')">
                  <span>Next</span>
                  <span style="font-size:1.1rem;">&rsaquo;</span>
                </div>
              </div>
            </div>

            <!-- Alternatives toggle -->
            <div class="sidebar-alt" style="display:flex; align-items:center; justify-content:space-between; gap:.75rem; margin-top:.75rem;">
              <div class="muted" style="font-size:.9rem;">My dates are flexible, show alternatives</div>
              <button
                :aria-pressed="flexibleAlt ? 'true' : 'false'"
                @click="toggleFlexible"
                title="toggle alternatives"
                :style="{
                  width: '32px', height: '32px', borderRadius: '9999px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: flexibleAlt ? '#efcab6' : '#e5e7eb', color: flexibleAlt ? '#7a3e2d' : '#374151'
                }"
              >
                {{ flexibleAlt ? '✓' : '•' }}
              </button>
            </div>

            <div class="sidebar-actions">
              <button class="btn-primary" @click="applySidebarChanges">Apply</button>
            </div>
          </div>

          <!-- Itinerary Section -->
          <div class="itinerary-sidebar">
            <h3 class="itinerary-title">Your Itinerary</h3>
            <p class="itinerary-description">This is a summary of the accommodation you have selected. After submitting your booking request, a Singita Journey Designer will make contact to book and confirm your trip.</p>
            
            <div class="itinerary-divider"></div>
            
            <div v-if="itineraryItems.length === 0" class="itinerary-empty">
              You haven't selected any options yet.
            </div>
            
            <ul v-else class="itinerary-list">
              <li v-for="(it, idx) in itineraryItems" :key="it.addedAt" class="itinerary-item">
                <div class="itinerary-item-header">
                  <h4 class="itinerary-lodge-name">{{ it.ship }}</h4>
                  <button class="itinerary-remove-btn" @click="removeItemByIndex(idx)" aria-label="Remove item">
                    <span class="remove-icon">✕</span>
                  </button>
                </div>
                <div class="itinerary-cabin-name">{{ it.cabin }}</div>
                <div class="itinerary-guests">{{ it.guests || 2 }} Guest{{ (it.guests || 2) > 1 ? 's' : '' }}</div>
                <div class="itinerary-price">from {{ it.price || 'ZAR 49 205' }} per adult, per night</div>
                <div class="itinerary-dates">{{ formatDate(it.date) }} → {{ formatDate(getEndDate(it.date)) }}</div>
              </li>
            </ul>
            
            <div v-if="itineraryTotals.hasPrice" class="itinerary-total">
              <div class="itinerary-total-row">
                <span class="itinerary-total-label">Estimated total (per night)</span>
                <span class="itinerary-total-amount">{{ itineraryTotals.formattedTotal }}</span>
              </div>
              <p class="itinerary-total-note">
                Includes {{ itineraryTotals.pricedCount }} of {{ itineraryItems.length }} selections. Final amounts are confirmed by our Journey Designers.
              </p>
              <p v-if="itineraryTotals.missingCount" class="itinerary-total-note">
                {{ itineraryTotals.missingCount }} selection{{ itineraryTotals.missingCount > 1 ? 's' : '' }} doesn't have live pricing and is excluded from this estimate.
              </p>
            </div>
            <p v-else-if="itineraryItems.length" class="itinerary-total-note">
              Pricing for the selected cabins will be confirmed by our Journey Designers.
            </p>
            <button v-if="itineraryItems.length" class="btn-send-enquiry" @click="openEnquiryModal">Send Availability Enquiry</button>
            
            <a href="#" class="link-speak-with-us">Speak with us &rsaquo;</a>
          </div>
        </div>

      </div>
    </div>

    <!-- Cabin details Modal -->
    <div v-if="showCabinModal && selectedCabin" class="modal-overlay" @click="closeCabinModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeCabinModal">✕</button>
        
        <div class="modal-header">
          <span class="modal-title">Room Information</span>
        </div>
        
        <div class="modal-body">
          <!-- Image Gallery -->
          <div class="modal-image-section">
            <img 
              :src="selectedCabin.image" 
              :alt="selectedCabin.cabinName"
              referrerpolicy="no-referrer"
              class="modal-cabin-image"
            />
            <button class="modal-gallery-nav modal-gallery-prev" aria-label="Previous">&lsaquo;</button>
            <button class="modal-gallery-nav modal-gallery-next" aria-label="Next">&rsaquo;</button>
          </div>
          
          <!-- Cabin Info -->
          <div class="modal-info-section">
            <h2 class="modal-cabin-name">{{ selectedCabin.cabinName }}</h2>
            
            <div class="modal-cabin-meta">
              <span class="modal-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Sleeps 3
              </span>
              <span class="modal-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                1 King
              </span>
              <span class="modal-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                24 m²
              </span>
            </div>
            
            <div class="modal-description">
              <p>If you're desperate for a vacation, then this cottage will be the lifesaver you need. Bring your friends or family and step away from it all. Let the tides set the schedule and dive into relaxation. Book more friends into Tamarama next door and enjoy the uninterrupted views together.</p>
            </div>
            
            <!-- Amenities -->
            <div class="modal-amenities">
              <div class="amenity-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                  <line x1="12" y1="20" x2="12.01" y2="20"></line>
                </svg>
                <span>Free Wifi</span>
              </div>
              <div class="amenity-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
                <span>Complimentary BBQ</span>
              </div>
              <div class="amenity-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Laundry Facilities</span>
              </div>
              <div class="amenity-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6"></path>
                  <path d="m4.2 4.2 4.2 4.2m5.6 5.6 4.2 4.2"></path>
                  <path d="M1 12h6m6 0h6"></path>
                  <path d="m4.2 19.8 4.2-4.2m5.6-5.6 4.2-4.2"></path>
                </svg>
                <span>Playground</span>
              </div>
              <div class="amenity-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                <span>Bike/Ski Storage</span>
              </div>
            </div>
            
            <!-- Direct Rate -->
            <div class="modal-rate-section">
              <h3 class="modal-rate-title">Direct Rate</h3>
              <p class="modal-rate-description">Beat those winter blues with a 2 night stay and enjoy 10% off accommodation.</p>
              
              <div class="modal-rate-details">
                <div class="modal-rate-info">
                  <div class="cabin-quantity-selector">
                    <label class="quantity-label">Number of Cabins</label>
                    <div class="quantity-controls">
                      <button class="quantity-btn" @click="decrementCabinQuantity" :disabled="cabinQuantity <= 1">−</button>
                      <span class="quantity-value">{{ cabinQuantity }}</span>
                      <button class="quantity-btn" @click="incrementCabinQuantity" :disabled="cabinQuantity >= (selectedCabin?.available || 1)">+</button>
                    </div>
                    <span class="quantity-available">{{ selectedCabin?.available || 0 }} available</span>
                  </div>
                </div>
                
                <div class="modal-price">
                  <span class="price-amount">A$380</span>
                  <span class="price-label">/Night</span>
                  <span class="price-note">Excluding taxes and fees.</span>
                </div>
              </div>
              
              <div class="modal-actions">
                <button class="modal-link-btn">Read more &rsaquo;</button>
                <button class="modal-link-btn">View price breakdown &rsaquo;</button>
              </div>
              
              <button class="modal-book-btn" @click="toggleItinerary(selectedCabin); closeCabinModal()">
                {{ isInItinerary(selectedCabin) ? 'Remove from itinerary' : 'Book Now' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Guest Selection Modal -->
    <div v-if="showGuestModal" class="guest-modal-overlay" @click="closeGuestModal">
      <div class="guest-modal-content" @click.stop>
        <button class="guest-modal-close" @click="closeGuestModal">✕</button>
        
        <div class="guest-modal-header">
          <h3 class="guest-modal-title">Number of Guests</h3>
        </div>
        
        <div class="guest-modal-body">
          <p class="guest-modal-description">Please indicate how many guests will be accommodated:</p>
          
          <div class="guest-counter-section">
            <div class="guest-counter-row">
              <div class="guest-counter-label">Number of Cabins</div>
              <div class="guest-counter-controls">
                <button type="button" class="guest-counter-btn" @click="decrementModalGuests" :disabled="modalGuests <= 1">−</button>
                <span class="guest-counter-value">{{ modalGuests }}</span>
                <button type="button" class="guest-counter-btn" @click="incrementModalGuests" :disabled="modalGuests >= maxGuestsForPendingItem">+</button>
              </div>
            </div>
            <div class="guest-available-note">
              {{ pendingItineraryItem?.availableText || '1 available' }}
              <span v-if="pendingItineraryItem?.capacityText"> • Max {{ maxGuestsForPendingItem }} guests</span>
            </div>
          </div>
          
          <div class="guest-modal-actions">
            <button class="btn-cancel-guest" @click="closeGuestModal">Cancel</button>
            <button class="btn-submit-guest" @click="submitGuestSelection">Add to Itinerary</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enquiry Form Modal -->
    <div v-if="showEnquiryModal" class="enquiry-modal-overlay">
      <div class="enquiry-modal-content">
        <div class="enquiry-modal-header">
          <h2 class="enquiry-modal-title">Plan your Trip</h2>
          <button class="enquiry-modal-close" @click="closeEnquiryModal">Close ✕</button>
        </div>
        
        <div class="enquiry-modal-body">
          <!-- Left Column: Form -->
          <div class="enquiry-form-section">
            <p class="enquiry-intro">Please complete the form below and one of our Journey Designers will contact you shortly to plan your trip.</p>
            
            <form class="enquiry-form" @submit.prevent="submitEnquiry">
              <div class="form-row">
                <div class="form-group form-group-small">
                  <label class="form-label">Title</label>
                  <select class="form-control">
                    <option value="">Select</option>
                    <option value="mr">Mr</option>
                    <option value="mrs">Mrs</option>
                    <option value="ms">Ms</option>
                    <option value="dr">Dr</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-control" required />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" required />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Contact Number</label>
                  <div class="phone-input">
                    <select class="phone-country">
                      <option value="+1">ðŸ‡ºðŸ‡¸ +1</option>
                      <option value="+62">ðŸ‡®ðŸ‡© +62</option>
                      <option value="+44">ðŸ‡¬ðŸ‡§ +44</option>
                    </select>
                    <input type="tel" class="form-control" placeholder="+1" />
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Country</label>
                  <select class="form-control">
                    <option value="">Select Country</option>
                    <option value="us">United States</option>
                    <option value="id">Indonesia</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" required />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Confirm Email Address</label>
                  <input type="email" class="form-control" required />
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">I am a:</label>
                <select class="form-control">
                  <option value="">Select</option>
                  <option value="guest">Guest</option>
                  <option value="agent">Travel Agent</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Is there anything else you'd like to let us know?</label>
                <textarea class="form-control form-textarea" rows="4"></textarea>
              </div>
              
              <div class="form-checkboxes">
                <label class="checkbox-label">
                  <input type="checkbox" />
                  <span>Sign up to receive news and blog posts from Singita</span>
                </label>
                
                <label class="checkbox-label">
                  <input type="checkbox" required />
                  <span>I consent to my submitted data being collected and stored</span>
                </label>
              </div>
              
              <p class="form-note">
                <strong>PLEASE NOTE:</strong> These results indicate availability and do not guarantee a booking. One of our Journey Designers will contact you shortly to plan your trip.
              </p>
              
              <button type="submit" class="btn-submit-enquiry">SEND ENQUIRY</button>
              
              <p class="form-recaptcha">This form is protected by reCAPTCHA Enterprise and the Google Privacy Policy and Terms of Service apply.</p>
            </form>
          </div>
          
          <!-- Right Column: Itinerary Summary -->
          <div class="enquiry-summary-section">
            <h3 class="summary-title">Your Itinerary</h3>
            <p class="summary-description">This is a summary of the accommodation you've selected. One of our Singita Journey Designers will contact you shortly to plan your trip.</p>
            
            <div class="summary-items">
              <div v-for="(item, index) in itineraryItems" :key="index" class="summary-item">
                <div class="summary-item-header">
                  <h4 class="summary-lodge-name">{{ item.ship }}</h4>
                </div>
                <div class="summary-item-details">
                  <p class="summary-cabin">{{ item.cabin }}</p>
                  <p class="summary-guests">{{ item.guests || 2 }} Guest{{ (item.guests || 2) > 1 ? 's' : '' }}</p>
                  <p class="summary-price">{{ item.price }}</p>
                  <p class="summary-dates">{{ formatDate(item.date) }} → {{ formatDate(getEndDate(item.date)) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getAvailability, getCabins, getOperators } from '../services/komodoApi'
import { generateDateRange, addDaysToDateString, getTodayString, formatDateToString } from '../utils/dateUtils'
import '../styles/pages/results.css'
import '../styles/pages/plan.css'

// State
const loading = ref(false)
const error = ref('')
const searchCriteria = ref(null)
// Per-ship availability map: { [displayLabel: string]: DayAvailability[] }
const shipAvailability = ref({})
// Flat array for any legacy use
const availabilityData = ref([])
// Global availability for the selected start date (all operators)
const globalStartAvailability = ref(null)
// Itinerary
const itineraryItems = ref([])
const DEFAULT_CURRENCY = 'Rp'
// Alternatives toggle
const flexibleAlt = ref(false)
// Cabin details modal
const showCabinModal = ref(false)
const selectedCabin = ref(null)
const cabinQuantity = ref(1)
// Enquiry modal
const showEnquiryModal = ref(false)
// Guest selection modal
const showGuestModal = ref(false)
const pendingItineraryItem = ref(null)
const modalGuests = ref(2)

// Sidebar form state (mirrors Plan modal)
const REGION_NAME = 'Nusa Tenggara Timur'
const DESTINATIONS = ['Komodo National Park', 'Labuan Bajo']
const SHIPS_CONFIG = [] // Data kapal diambil dari API, bukan hardcoded

const shipsList = ref([])
const shipsLoading = ref(false)
const formDestinations = ref([])
const formShipIds = ref([])
const savedShipPairs = ref([])
const formDateFrom = ref('')
const adults = ref(2)
const children = ref(0)
const age3_9 = ref(0)
const age0_2 = ref(0)
const guestsTotal = ref(2)

// Collapsible states
const openRegions = ref(false)
const openShips = ref(false)
const openGuests = ref(false)
const openDates = ref(false)
const hoverShips = ref(false)
const hoverRegions = ref(false)
const hoverGuests = ref(false)
const hoverDates = ref(false)
// dropdown refs for outside-click detection
const destDropdown = ref(null)
const shipsDropdown = ref(null)
const guestsDropdown = ref(null)
const datesDropdown = ref(null)

function closeAllDropdowns() {
  openRegions.value = false
  openShips.value = false
  openGuests.value = false
  openDates.value = false
}

function toggleDropdown(which) {
  if (which === 'regions') { openRegions.value = !openRegions.value; openShips.value = openGuests.value = openDates.value = false }
  else if (which === 'ships') { openShips.value = !openShips.value; openRegions.value = openGuests.value = openDates.value = false }
  else if (which === 'guests') { openGuests.value = !openGuests.value; openRegions.value = openShips.value = openDates.value = false }
  else if (which === 'dates') { openDates.value = !openDates.value; openRegions.value = openShips.value = openGuests.value = false }
}

function nextDropdown(from) {
  if (from === 'regions') {
    openRegions.value = false; openShips.value = true; openGuests.value = openDates.value = false
  } else if (from === 'ships') {
    openShips.value = false; openGuests.value = true; openRegions.value = openDates.value = false
  } else if (from === 'guests') {
    openGuests.value = false; openDates.value = true; openRegions.value = openShips.value = false
  } else if (from === 'dates') {
    closeAllDropdowns()
  }
}

// Calendar sidebar state
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
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
  startDate.setDate(startDate.getDate() - startDate.getDay())
  const days = []
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay()
    const isCurrentMonth = date.getMonth() === currentMonth.value
    const isSelectable = isCurrentMonth && date >= today && (dayOfWeek === 1 || dayOfWeek === 5)
    const dateString = formatDateToString(date)
    days.push({
      key: date.getTime(),
      date: date.getDate(),
      fullDate: dateString,
      isCurrentMonth,
      isSelectable,
      isSelected: formDateFrom.value === dateString,
      isMonday: dayOfWeek === 1,
      isFriday: dayOfWeek === 5
    })
  }
  return days
})

// Calendar navigation
function changeMonth(delta) {
  let m = currentMonth.value + delta
  let y = currentYear.value
  if (m > 11) { m = 0; y += 1 }
  if (m < 0) { m = 11; y -= 1 }
  currentMonth.value = m
  currentYear.value = y
}
function nextMonth() { changeMonth(1) }
function prevMonth() { changeMonth(-1) }

const shipsGroupTitle = computed(() => {
  if (formDestinations.value.length) return formDestinations.value[0]
  const sc = searchCriteria.value
  if (Array.isArray(sc?.destinations) && sc.destinations.length) return sc.destinations[0]
  return REGION_NAME
})

// Build result cards per selected ship (labels)
const availabilityResults = computed(() => {
  const sc = searchCriteria.value
  if (!sc) return []
  const labels = (sc.ships && sc.ships.length) ? sc.ships : (sc.lodges || [])
  const results = []
  for (const label of labels) {
    const perDay = shipAvailability.value[label] || []
    let totalAvailable = 0
    let totalSlots = 0
    for (const day of perDay) {
      const allCabins = day?.operators?.flatMap(op => op.cabins || []) || []
      const daySlots = allCabins.reduce((sum, cabin) => {
        const m = String(cabin).match(/\((\d+)\)/)
        return sum + (m ? parseInt(m[1]) : 0)
      }, 0)
      totalAvailable += daySlots
      totalSlots += daySlots
    }
    const daysCount = perDay.length
    const avg = daysCount > 0 ? totalAvailable / daysCount : 0
    const hasAvailability = avg >= (sc.totalGuests || 0)
    // Start-date cabins count that meet min capacity
    const minCap = Math.max(1, sc.totalGuests || ((sc.adults||0)+(sc.children||0)))
    const startDay = perDay.find(d => d?.date === sc.dateFrom) || perDay[0]
    const startCabinsAll = startDay?.operators?.[0]?.cabins || []
    const startCabinsCount = startCabinsAll.reduce((cnt, c) => {
      const m = String(c).match(/\((\d+)\)/)
      const cap = m ? parseInt(m[1]) : 0
      return cnt + (cap >= minCap ? 1 : 0)
    }, 0)
    results.push({
      lodge: label,
      hasAvailability,
      availableSlots: Math.floor(avg),
      totalSlots: daysCount > 0 ? Math.floor(totalSlots / daysCount) : 0,
      image: '/src/images/komodo.jpg',
      availableCabinsCount: startCabinsCount,
      dateFrom: sc.dateFrom
    })
  }
  return results
})

// Map cabinResults into cards for the UI (ensure cabin names from objects are parsed correctly)
const cabinCards = computed(() => {
  return cabinResults.value.map(r => ({
    cabinName: r.cabinName,
    ship: r.ship,
    date: r.date,
    capacity: r.capacity,
    image: r.image || '/src/images/komodo.jpg'
  }))
})

// Extract numeric capacity from various formats
function extractCapacityNumber(item) {
  // Returns a number or null (when unknown)
  if (typeof item === 'string') {
    // Expect patterns like "Cabin Name (4)" or "Cabin Name (2-3)"
    const m = item.match(/\(([^)]+)\)$/)
    if (m && m[1]) {
      const nums = (m[1].match(/\d+/g) || []).map(n => parseInt(n))
      if (nums.length) return Math.max(...nums)
    }
    return null
  }
  // Object case: capacity fields could be like "4 Person" or "2-3 Person"
  const capStr = (item.capacity || item.capacity_lock || '').toString()
  if (capStr) {
    const nums = (capStr.match(/\d+/g) || []).map(n => parseInt(n))
    if (nums.length) return Math.max(...nums)
  }
  return null
}

// Cabin-level flattened results for the start date (deduped and with proper name parsing)
const cabinResults = computed(() => {
  const sc = searchCriteria.value
  if (!sc) return []
  const labels = (sc.ships && sc.ships.length) ? sc.ships : (sc.lodges || [])
  const date = sc.dateFrom
  const minCap = Math.max(1, sc.totalGuests || ((sc.adults||0)+(sc.children||0)))
  const items = []
  const seen = new Set()
  for (const label of labels) {
    const perDay = shipAvailability.value[label] || []
    const day = perDay.find(d => d?.date === date) || perDay[0]
    const cabins = (day?.operators || []).flatMap(op => op.cabins || [])
    for (const c of cabins) {
      const baseName = getCabinBaseName(c)
      const cap = extractCapacityNumber(c)
      const img = typeof c === 'string' ? '' : getCabinImage(c)
      // Filter by capacity if known; if unknown, include it
      if (cap == null || cap >= minCap) {
        const id = (typeof c !== 'string' && c?.id) ? String(c.id).trim().toLowerCase() : null
        const key = id || `${normalizeName(label)}|${normalizeCabinName(baseName)}`
        if (seen.has(key)) continue
        seen.add(key)
        items.push({ ship: label, cabinName: baseName, capacity: cap, date, image: img })
      }
    }
  }
  return items
})

const minCapacity = computed(() => {
  const sc = searchCriteria.value
  if (!sc) return 1
  return Math.max(1, sc.totalGuests || ((sc.adults||0)+(sc.children||0)))
})

const hasFullAvailability = computed(() => 
  availabilityResults.value.length > 0 && 
  availabilityResults.value.every(r => r.hasAvailability)
)
const hasPartialAvailability = computed(() => 
  availabilityResults.value.length > 0 && 
  availabilityResults.value.some(r => r.hasAvailability) && !hasFullAvailability.value
)
const hasAnyAvailability = computed(() => availabilityResults.value.some(r => r.hasAvailability))

// Display destinations string from criteria (supports multi-select)
const displayDestinations = computed(() => {
  const sc = searchCriteria.value
  if (!sc) return ''
  if (Array.isArray(sc.destinations) && sc.destinations.length) return sc.destinations.join(', ')
  return sc.destination || ''
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function getEndDate(startDateString) {
  if (!startDateString) return ''
  // Add 2 days to start date
  return addDaysToDateString(startDateString, 2)
}

function formatShipName(shipName) {
  if (!shipName) return ''
  // Get first word only and capitalize properly
  const firstWord = shipName.trim().split(/[\s(]+/)[0]
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase()
}

function prevImage(lodgeId) { console.log('Previous image for lodge:', lodgeId) }
function nextImage(lodgeId) { console.log('Next image for lodge:', lodgeId) }

// Sidebar helpers
function toggleDestination(d) {
  const i = formDestinations.value.indexOf(d)
  if (i >= 0) formDestinations.value.splice(i, 1)
  else formDestinations.value.push(d)
}
function toggleShip(id) {
  const i = formShipIds.value.indexOf(id)
  if (i >= 0) formShipIds.value.splice(i, 1)
  else formShipIds.value.push(id)
}

async function loadShipsList() {
  shipsLoading.value = true
  try {
    const res = await getOperators()
    shipsList.value = (res.operators || []).map(op => {
      const label = op.operator?.trim() || ''
      const sheet = op.sourceSheet?.trim() || label
      return {
        id: `${label}__${sheet}`,
        label,
        sheet
      }
    }).filter(s => s.label && s.sheet)

    if (!formShipIds.value.length && savedShipPairs.value.length) {
      const ids = []
      for (const pair of savedShipPairs.value) {
        const match = shipsList.value.find(s =>
          s.label === pair.label && s.sheet === (pair.sheet || s.sheet)
        )
        if (match) ids.push(match.id)
      }
      formShipIds.value = ids
    }
  } catch (e) {
    console.warn('Failed to load operators:', e)
    shipsList.value = SHIPS_CONFIG.map(s => ({
      id: s.id || `${s.label || ''}__${s.sheet || ''}`,
      label: s.label,
      sheet: s.sheet || s.label
    }))
  } finally {
    shipsLoading.value = false
  }
}
function selectDateSidebar(day) {
  if (day.isSelectable) {
    formDateFrom.value = day.fullDate
  }
}

// Helper to normalize operator/label names for matching
function normalizeName(name) {
  if (!name) return ''
  // remove things in parentheses and non-alphanumeric, lowercase, collapse spaces
  const withoutParen = String(name).replace(/\([^)]*\)/g, ' ')
  return withoutParen.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ')
}

// Helper to normalize cabin names: drop ship prefixes and counts
function normalizeCabinName(name) {
  if (!name) return ''
  let s = String(name)
  // Remove trailing count e.g., " (2)" or " (2+1)"
  s = s.replace(/\([^)]*\)$/, '').trim()
  // If it contains a dash, take the last segment (to drop prefixes like "Dinara - Master Cabin")
  const parts = s.split(/[-–—]/)
  s = parts[parts.length - 1]
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ')
}

async function checkAvailability() {
  if (!searchCriteria.value) return
  loading.value = true
  error.value = ''
  shipAvailability.value = {}
  availabilityData.value = []
  globalStartAvailability.value = null
  try {
    const sc = searchCriteria.value
    const dates = generateDateRange(sc.dateFrom, sc.dateTo)
    const labels = (sc.ships && sc.ships.length) ? sc.ships : (sc.lodges || [])
    const sheets = (sc.shipSheets && sc.shipSheets.length) ? sc.shipSheets : labels

    if (import.meta?.env?.DEV) {
      console.debug('[Results] criteria', { labels, sheets, dateFrom: sc.dateFrom, dateTo: sc.dateTo })
    }

    // Helper to fetch global cabins once (memoized promise)
    let globalCabinsPromise = null
    const getGlobalCabinsOnce = () => {
      if (!globalCabinsPromise) {
        globalCabinsPromise = getCabins('Cruise Schedule - Normalized').catch(() => null)
      }
      return globalCabinsPromise
    }

    // Preload allowed cabin base names per ship in parallel
    const allowedBySheet = {}
    await Promise.all(sheets.map(async (sheet, i) => {
      const label = labels[i] || sheet
      let allowed = []
      try {
        const cab = await getCabins(sheet)
        if (Array.isArray(cab?.allCabins)) {
          allowed = cab.allCabins.map(c => String(c).split(' (')[0].trim())
        }
      } catch {}
      if (allowed.length === 0) {
        try {
          const globalCab = await getGlobalCabinsOnce()
          if (globalCab) {
            const target = normalizeName(label)
            const op = (globalCab.operators || []).find(o => normalizeName(o.operator) === target)
            if (op && Array.isArray(op.cabins)) {
              allowed = op.cabins.map(c => String(c).split(' (')[0].trim())
            }
          }
        } catch {}
      }
      allowedBySheet[sheet] = Array.from(new Set(allowed.map(normalizeCabinName)))
    }))

    // Fetch availability per ship over all dates in parallel with two-phase fallback to normalized sheet
    const perShipEntries = await Promise.all(sheets.map(async (sheet, i) => {
      const label = labels[i] || sheet
      const allowed = allowedBySheet[sheet] || []
      // Phase 1: primary sheet requests
      const primaryPromises = dates.map(date => getAvailability(date, sheet).catch(() => null))
      const primaryDays = await Promise.all(primaryPromises)
      // Identify which need fallback
      const needFallbackIdx = primaryDays
        .map((day, idx) => (!day || !day.operators || day.operators.length === 0) ? idx : -1)
        .filter(idx => idx >= 0)
      let fallbackDays = []
      if (needFallbackIdx.length) {
        const fbPromises = needFallbackIdx.map(idx => getAvailability(dates[idx], 'Cruise Schedule - Normalized').catch(() => null))
        const fbResults = await Promise.all(fbPromises)
        fallbackDays = fbResults
      }
      const perShipResults = []
      for (let idx = 0; idx < dates.length; idx++) {
        const day = (primaryDays[idx] && primaryDays[idx].operators && primaryDays[idx].operators.length)
          ? primaryDays[idx]
          : (needFallbackIdx.includes(idx) ? fallbackDays[needFallbackIdx.indexOf(idx)] : null)
        if (day) {
          const allCabins = day.operators?.flatMap(op => op.cabins || []) || []
          const filtered = allowed.length
            ? allCabins.filter(c => allowed.includes(normalizeCabinName(c)))
            : allCabins
          perShipResults.push({
            ...day,
            operators: [{ operator: label, total: filtered.length, cabins: filtered }]
          })
        } else if (import.meta?.env?.DEV) {
          console.debug(`[Results] No data for sheet=${sheet} date=${dates[idx]}`)
        }
      }
      return [label, perShipResults]
    }))

    const perShip = {}
    for (const [label, results] of perShipEntries) {
      perShip[label] = results
    }
    shipAvailability.value = perShip
    availabilityData.value = Object.values(perShip).flat()
    // Also fetch global availability for the selected start date to list all available cabins
    if (sc?.dateFrom) {
      try {
        let global = await getAvailability(sc.dateFrom).catch(() => null)
        if (!global || !global.operators || global.operators.length === 0) {
          global = await getAvailability(sc.dateFrom, 'Cruise Schedule - Normalized').catch(() => null)
        }
        globalStartAvailability.value = global || null
      } catch (e) {
        if (import.meta?.env?.DEV) console.debug('[Results] global start availability error', e)
      }
    }
    if (availabilityData.value.length === 0) {
      error.value = 'No availability data found for the selected dates and ships.'
    }
  } catch (err) {
    error.value = `Failed to check availability: ${err.message}`
    console.error('Availability check error:', err)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => checkAvailability()
const loadResults = () => checkAvailability()
const toggleFlexible = () => { flexibleAlt.value = !flexibleAlt.value }

function applySidebarChanges() {
  try {
    const selectedEntries = shipsList.value.filter(s => formShipIds.value.includes(s.id))
    const labels = selectedEntries.map(s => s.label)
    const sheets = selectedEntries.map(s => s.sheet)
    const sc = {
      region: REGION_NAME,
      destination: formDestinations.value[0] || '',
      destinations: formDestinations.value.slice(),
      ships: labels,
      shipSheets: sheets,
      ship: labels[0] || '',
      lodges: labels.slice(),
      dateFrom: formDateFrom.value,
      dateTo: formDateFrom.value ? addDaysToDateString(formDateFrom.value, 3) : '',
      adults: guestsTotal.value,
      children: 0,
      age3_9: 0,
      age0_2: 0,
      totalGuests: guestsTotal.value,
      timestamp: Date.now()
    }
    savedShipPairs.value = selectedEntries.map(s => ({ label: s.label, sheet: s.sheet }))
    localStorage.setItem('komodo_search_criteria', JSON.stringify(sc))
    searchCriteria.value = sc
    // Update calendar month/year to selected date if any
    if (formDateFrom.value) {
      const d = new Date(formDateFrom.value)
      currentMonth.value = d.getMonth()
      currentYear.value = d.getFullYear()
    }
    checkAvailability()
  } catch (e) {
    console.error('Failed to apply sidebar changes', e)
    alert('Failed to apply changes')
  }
}

onMounted(async () => {
  try {
    const saved = localStorage.getItem('komodo_search_criteria')
    if (saved) {
      searchCriteria.value = JSON.parse(saved)
      // Seed sidebar form from saved criteria
      const sc = searchCriteria.value || {}
      formDestinations.value = Array.isArray(sc.destinations) ? sc.destinations.slice() : (sc.destination ? [sc.destination] : [])
      const savedLabels = Array.isArray(sc.ships) ? sc.ships : []
      const savedSheets = Array.isArray(sc.shipSheets) ? sc.shipSheets : []
      savedShipPairs.value = savedLabels.map((label, idx) => ({
        label,
        sheet: savedSheets[idx] || ''
      }))
      formDateFrom.value = sc.dateFrom || ''
      adults.value = sc.adults ?? adults.value
      children.value = sc.children ?? children.value
      age3_9.value = sc.age3_9 ?? age3_9.value
      age0_2.value = sc.age0_2 ?? age0_2.value
      guestsTotal.value = sc.totalGuests ?? (adults.value + children.value + age3_9.value + age0_2.value)
      if (formDateFrom.value) {
        const d = new Date(formDateFrom.value)
        currentMonth.value = d.getMonth()
        currentYear.value = d.getFullYear()
      }
      await checkAvailability()
    }
  } catch (err) {
    console.error('Failed to load search criteria:', err)
    error.value = 'Failed to load search criteria'
  }
  await loadShipsList()
})

// Close dropdowns when clicking outside
function isClickInsideAny(target) {
  const els = [destDropdown.value, shipsDropdown.value, guestsDropdown.value, datesDropdown.value]
  return els.some(el => el && (el === target || el.contains(target)))
}
function handleOutsideClick(e) {
  if (!isClickInsideAny(e.target)) closeAllDropdowns()
}
onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))

// ===== Helpers & new computed for global cabins list =====
function getCabinBaseName(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj.split(' (')[0].trim()
  const raw = (obj.name || obj['cabin name'] || '').toString()
  return raw.split(' (')[0].trim()
}
function getCabinAvailable(obj) {
  if (!obj) return null
  // For string items we don't have per-cabin availability reliably; skip filtering by available
  if (typeof obj === 'string') {
    return null
  }
  if (typeof obj.available === 'number') return obj.available
  // Some data has capacity but not availability; treat as 1 available if present
  return null
}
function getCabinCapacityText(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') {
    const m = obj.match(/\(([^)]+)\)$/)
    return m ? m[1] : ''
  }
  return obj.capacity || obj.capacity_lock || ''
}
function getCabinPrice(obj) {
  if (!obj || typeof obj === 'string') return ''
  return obj.price_lock || obj.price || ''
}
function getShipName(obj, operatorLabel) {
  if (obj && typeof obj !== 'string' && obj.shipname) return obj.shipname
  // Derive from operator label by stripping parentheses content
  const s = (operatorLabel || '').replace(/\([^)]*\)/g, '').trim()
  return s
}

// Normalize Google Drive file links to direct image URLs
function normalizeDriveUrl(url) {
  if (!url) return ''
  try {
    const u = String(url)
    const id = extractDriveId(u)
    if (id) {
      // Prefer lh3 direct image CDN for reliability, falls back in onImgError
      return `https://lh3.googleusercontent.com/d/${id}=w1600`
    }
    return u
  } catch { return url }
}

function extractDriveId(u) {
  if (!u) return ''
  const m1 = String(u).match(/\/d\/([^/?#]+)/) // /file/d/ID/
  const m2 = String(u).match(/[?&]id=([^&]+)/)
  return (m1 && m1[1]) || (m2 && m2[1]) || ''
}

function buildDriveCandidates(original) {
  const out = []
  const u = String(original || '')
  const id = extractDriveId(u)
  // Keep original first if present
  if (u) out.push(u)
  if (id) {
    out.push(`https://lh3.googleusercontent.com/d/${id}=w1600`)
    out.push(`https://drive.google.com/uc?export=view&id=${id}`)
    out.push(`https://drive.google.com/uc?export=download&id=${id}`)
    out.push(`https://drive.google.com/thumbnail?id=${id}&sz=w1600`)
  }
  // Deduplicate while preserving order
  return Array.from(new Set(out))
}

function onImgError(evt, original) {
  const img = evt?.target
  if (!img) return
  const tried = parseInt(img.getAttribute('data-try') || '0', 10)
  const candidates = buildDriveCandidates(original)
  if (tried < candidates.length - 1) {
    img.setAttribute('data-try', String(tried + 1))
    img.src = candidates[tried + 1]
  } else {
    img.src = '/src/images/komodo.jpg'
  }
}

// Pick first available image from cabin object and normalize it
function getCabinImage(obj) {
  if (!obj || typeof obj === 'string') return ''
  const candidates = []
  if (obj.image_main) candidates.push(obj.image_main)
  if (Array.isArray(obj.images)) candidates.push(...obj.images)
  for (let i = 1; i <= 10; i++) {
    const key = `image_${i}`
    if (obj[key]) candidates.push(obj[key])
  }
  const first = candidates.find(u => !!u && String(u).trim().length > 0) || ''
  return first ? normalizeDriveUrl(first) : ''
}

const allStartDateCabins = computed(() => {
  const sc = searchCriteria.value
  const g = globalStartAvailability.value
  if (!sc || !g || !Array.isArray(g.operators)) return []
  const selectedMatchers = selectedShipMatchers.value
  const map = new Map()
  for (const op of g.operators) {
    const operatorLabel = op.operator
    const cabins = op.cabins || []
    for (const cb of cabins) {
      const available = getCabinAvailable(cb)
      // If available is explicitly provided, require > 0; if not provided, include item
      if (available != null && available <= 0) continue
      const name = getCabinBaseName(cb)
      const capacityText = getCabinCapacityText(cb)
      const price = getCabinPrice(cb)
  const shipName = getShipName(cb, operatorLabel)
  // Only include items that match the user's selected ships (flexible matching)
  if (selectedMatchers.length && !matchesSelectedShip(shipName, selectedMatchers)) continue
      // Build robust dedupe key: prefer cabin id, else ship+cabin, else operator+cabin
      const id = (typeof cb !== 'string' && cb?.id) ? String(cb.id).trim().toLowerCase() : null
  const opKey = normalizeName(operatorLabel)
      const cabinKey = normalizeCabinName(name)
  const key = id || `${normalizeName(shipName)}|${cabinKey}` || `${opKey}|${cabinKey}`

      const existing = map.get(key)
      const value = {
        key,
        operatorLabel,
        shipName,
        cabinName: name,
        available,
        availableText: available != null ? `${available} available` : 'Available',
        price,
        capacityText,
        date: sc.dateFrom,
        image: getCabinImage(cb) || '/src/images/komodo.jpg',
        raw: cb,
      }
      if (!existing) {
        map.set(key, value)
      } else {
        // Merge: prefer entry with explicit availability/price/capacity
        const merged = { ...existing }
        if (merged.available == null && available != null) merged.available = available
        if (!merged.price && price) merged.price = price
        if (!merged.capacityText && capacityText) merged.capacityText = capacityText
        merged.availableText = merged.available != null ? `${merged.available} available` : 'Available'
        map.set(key, merged)
      }
    }
  }
  // Sort by operator then cabinName
  const items = Array.from(map.values())
  items.sort((a, b) => (a.operatorLabel || '').localeCompare(b.operatorLabel || '') || (a.cabinName || '').localeCompare(b.cabinName || ''))
  return items
})

// Build flexible matchers for selected ships (labels and sheet names)
const selectedShipMatchers = computed(() => {
  const sc = searchCriteria.value
  if (!sc) return []
  const labels = (sc.ships && sc.ships.length) ? sc.ships : (sc.lodges || [])
  const sheets = (sc.shipSheets && sc.shipSheets.length) ? sc.shipSheets : []
  const set = new Set()
  const addVariants = (s) => {
    const n = normalizeName(String(s).replace(/normalized/gi, '').replace(/cruise schedule/gi, ''))
    if (!n) return
    set.add(n)
    const first = n.split(' ')[0]
    if (first) set.add(first)
  }
  labels.forEach(addVariants)
  sheets.forEach(addVariants)
  return Array.from(set)
})

function matchesSelectedShip(shipName, matchers) {
  const key = normalizeName(shipName)
  return matchers.some(tok => key.includes(tok) || tok.includes(key))
}

// Simple guests controls
function incGuests() {
  guestsTotal.value = Math.min(16, (guestsTotal.value || 0) + 1)
}
function decGuests() {
  guestsTotal.value = Math.max(1, (guestsTotal.value || 1) - 1)
}

// Detect if there are start-date cabins on non-selected ships
const hasAltStartDateCabins = computed(() => {
  const sc = searchCriteria.value
  const g = globalStartAvailability.value
  if (!sc || !g || !Array.isArray(g.operators)) return false
  const selectedMatchers = selectedShipMatchers.value
  if (selectedMatchers.length === 0) return false
  for (const op of g.operators) {
    const operatorLabel = op.operator
    const cabins = op.cabins || []
    for (const cb of cabins) {
      const available = getCabinAvailable(cb)
      if (available != null && available <= 0) continue
      const shipName = getShipName(cb, operatorLabel)
      if (!matchesSelectedShip(shipName, selectedMatchers)) return true
    }
  }
  return false
})

// Extract maximum capacity from capacity text (e.g., "2-3 Person" returns 3, "4 Person" returns 4)
const getMaxCapacityFromText = (capacityText) => {
  if (!capacityText) return null
  const text = String(capacityText)
  // Match patterns like "2-3", "2-3 Person", "4", "4 Person", etc.
  const matches = text.match(/\d+/g)
  if (!matches || matches.length === 0) return null
  // Return the highest number found
  const numbers = matches.map(n => parseInt(n))
  return Math.max(...numbers)
}

const maxGuestsForPendingItem = computed(() => {
  const item = pendingItineraryItem.value
 
  
  // First, try to get capacity from capacityText
  const capacityFromText = getMaxCapacityFromText(item.capacityText)
  if (capacityFromText) return capacityFromText
  
  // Fallback to available count if no capacity info
  if (item.available && item.available > 0) return item.available * 4 // Assume max 4 per cabin
  
  // Default fallback
  return 16
})

function parsePriceValue(raw, fallbackCurrency = DEFAULT_CURRENCY) {
  if (raw == null) return null
  if (typeof raw === 'number' && !Number.isNaN(raw)) {
    return { amount: raw, currency: fallbackCurrency }
  }
  const text = String(raw).trim()
  if (!text) return null
  const match = text.match(/([^\d]*)([\d.,\s]+)/)
  if (!match) return null
  let currency = match[1]?.replace(/from/gi, '').trim() || fallbackCurrency
  let numeric = match[2]?.trim()
  if (!numeric) return null
  numeric = numeric.replace(/[\s,]/g, '')
  const dotCount = (numeric.match(/\./g) || []).length
  if (dotCount > 1) {
    numeric = numeric.replace(/\./g, '')
  }
  const amount = parseFloat(numeric)
  if (Number.isNaN(amount)) return null
  return { amount, currency }
}

function formatTotalAmount(amount, currency = DEFAULT_CURRENCY) {
  if (!Number.isFinite(amount)) return ''
  const label = currency || DEFAULT_CURRENCY
  return `${label} ${Math.round(amount).toLocaleString('en-US')}`
}

const itineraryTotals = computed(() => {
  const items = itineraryItems.value || []
  if (!items.length) {
    return { hasPrice: false, total: 0, formattedTotal: '', pricedCount: 0, missingCount: 0 }
  }
  let detectedCurrency = ''
  let total = 0
  let pricedCount = 0
  let skipped = 0
  for (const item of items) {
    const parsed = parsePriceValue(item?.price, detectedCurrency || DEFAULT_CURRENCY)
    if (!parsed) {
      skipped++
      continue
    }
    if (!detectedCurrency) {
      detectedCurrency = parsed.currency
    }
    if (detectedCurrency && parsed.currency && detectedCurrency !== parsed.currency) {
      skipped++
      continue
    }
    total += parsed.amount
    pricedCount++
  }
  const hasPrice = pricedCount > 0
  return {
    hasPrice,
    total,
    formattedTotal: hasPrice ? formatTotalAmount(total, detectedCurrency || DEFAULT_CURRENCY) : '',
    pricedCount,
    missingCount: items.length - pricedCount
  }
})

function viewCabinDetails(item) {
  selectedCabin.value = item
  showCabinModal.value = true
  lockPageScroll()
}

function closeCabinModal() {
  showCabinModal.value = false
  selectedCabin.value = null
  cabinQuantity.value = 1 // Reset quantity
  restorePageScroll()
}

function incrementCabinQuantity() {
  const maxAvailable = selectedCabin.value?.available || 1
  if (cabinQuantity.value < maxAvailable) {
    cabinQuantity.value++
  }
}

function decrementCabinQuantity() {
  if (cabinQuantity.value > 1) {
    cabinQuantity.value--
  }
}

function openEnquiryModal() {
  showEnquiryModal.value = true
  lockPageScroll()
}

function closeEnquiryModal() {
  showEnquiryModal.value = false
  restorePageScroll()
}

function closeGuestModal() {
  showGuestModal.value = false
  pendingItineraryItem.value = null
  modalGuests.value = 2
  restorePageScroll()
}

function incrementModalGuests() {
  const maxCapacity = maxGuestsForPendingItem.value
  modalGuests.value = Math.min(maxCapacity, modalGuests.value + 1)
}

function decrementModalGuests() {
  modalGuests.value = Math.max(1, modalGuests.value - 1)
}

function submitGuestSelection() {
  if (pendingItineraryItem.value) {
    addToItinerary(pendingItineraryItem.value, modalGuests.value)
    closeGuestModal()
  }
}

function isInItinerary(item) {
  return itineraryItems.value.some(it => 
    it.cabin === item.cabinName && 
    it.ship === item.shipName && 
    it.date === item.date
  )
}

function toggleItinerary(item) {
  if (isInItinerary(item)) {
    removeFromItinerary(item)
  } else {
    // Show guest modal before adding to itinerary
    pendingItineraryItem.value = item
    modalGuests.value = searchCriteria.value?.totalGuests || 2
    showGuestModal.value = true
    lockPageScroll()
  }
}

function addToItinerary(item, guests = 2) {
  try {
    const key = 'komodo_itinerary'
    const current = JSON.parse(localStorage.getItem(key) || '[]')
    
    // Check if already exists to prevent duplicates
    const exists = current.some(it => 
      it.cabin === item.cabinName && 
      it.ship === item.shipName && 
      it.date === item.date
    )
    
    if (exists) {
      return
    }
    
    const entry = {
      operator: item.operatorLabel,
      ship: item.shipName,
      cabin: item.cabinName,
      date: item.date,
      price: item.price || null,
      capacity: item.capacityText || null,
      guests: guests,
      qty: 1,
      addedAt: Date.now()
    }
    current.push(entry)
    localStorage.setItem(key, JSON.stringify(current))
    loadItinerary()
  } catch (e) {
    console.error('Failed to add to itinerary', e)
  }
}

function removeFromItinerary(item) {
  try {
    const key = 'komodo_itinerary'
    const current = JSON.parse(localStorage.getItem(key) || '[]')
    
    const filtered = current.filter(it => 
      !(it.cabin === item.cabinName && 
        it.ship === item.shipName && 
        it.date === item.date)
    )
    
    localStorage.setItem(key, JSON.stringify(filtered))
    loadItinerary()
  } catch (e) {
    console.error('Failed to remove from itinerary', e)
  }
}

function loadItinerary() {
  try {
    const key = 'komodo_itinerary'
    const current = JSON.parse(localStorage.getItem(key) || '[]')
    itineraryItems.value = Array.isArray(current) ? current : []
  } catch {
    itineraryItems.value = []
  }
}

function removeItemByIndex(index) {
  try {
    const key = 'komodo_itinerary'
    const current = JSON.parse(localStorage.getItem(key) || '[]')
    current.splice(index, 1)
    localStorage.setItem(key, JSON.stringify(current))
    loadItinerary()
  } catch (e) {
    console.error('Failed to remove item', e)
  }
}

function clearItinerary() {
  localStorage.removeItem('komodo_itinerary')
  itineraryItems.value = []
}

const scrollLockState = {
  count: 0,
  bodyOverflow: '',
  htmlOverflow: '',
  bodyPadding: '',
  htmlPadding: ''
}

function lockPageScroll() {
  const body = document.body
  const html = document.documentElement
  if (!body || !html) return

  if (scrollLockState.count === 0) {
    const scrollBarWidth = window.innerWidth - html.clientWidth
    scrollLockState.bodyOverflow = body.style.overflow
    scrollLockState.htmlOverflow = html.style.overflow
    scrollLockState.bodyPadding = body.style.paddingRight
    scrollLockState.htmlPadding = html.style.paddingRight

    if (scrollBarWidth > 0) {
      const pad = `${scrollBarWidth}px`
      body.style.paddingRight = pad
      html.style.paddingRight = pad
    }
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
  }

  scrollLockState.count++
}

function restorePageScroll() {
  const body = document.body
  const html = document.documentElement
  if (!body || !html) return

  if (scrollLockState.count === 0) return
  scrollLockState.count--
  if (scrollLockState.count > 0) return

  body.style.overflow = scrollLockState.bodyOverflow
  html.style.overflow = scrollLockState.htmlOverflow
  body.style.paddingRight = scrollLockState.bodyPadding
  html.style.paddingRight = scrollLockState.htmlPadding
}

// initial load
loadItinerary()
</script>



