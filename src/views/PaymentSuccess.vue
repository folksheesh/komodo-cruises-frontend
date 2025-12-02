<template>
  <div class="payment-success-page">
    <div class="success-container">
      <!-- Success Animation -->
      <div class="success-animation">
        <div class="checkmark-circle">
          <svg class="checkmark" viewBox="0 0 52 52">
            <circle class="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
      </div>

      <!-- Main Content -->
      <div class="success-content">
        <h1 class="success-title">Thank You for Your Purchase!</h1>
        <p class="success-subtitle">Your payment has been successfully processed</p>

        <!-- Booking Summary Card -->
        <div class="booking-card">
          <div class="booking-header">
            <div class="booking-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Booking Confirmed</span>
            </div>
            <div class="booking-id">
              <span class="label">Booking ID</span>
              <span class="value">#{{ bookingData.bookingId }}</span>
            </div>
          </div>

          <div class="booking-details">
            <!-- Customer Info -->
            <div class="detail-section">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Guest Information
              </h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Name</span>
                  <span class="value">{{ bookingData.customerName }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Email</span>
                  <span class="value">{{ bookingData.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Phone</span>
                  <span class="value">{{ bookingData.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Trip Info -->
            <div class="detail-section">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                Trip Details
              </h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="label">Ship</span>
                  <span class="value">{{ bookingData.shipName }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Cabin Type</span>
                  <span class="value">{{ bookingData.cabinName }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Itinerary</span>
                  <span class="value">{{ bookingData.itinerary }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Travel Date</span>
                  <span class="value">{{ bookingData.travelDate }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Guests</span>
                  <span class="value">{{ bookingData.guests }} Person(s)</span>
                </div>
              </div>
            </div>

            <!-- Payment Info -->
            <div class="detail-section payment-section">
              <h3 class="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Payment Summary
              </h3>
              <div class="payment-breakdown">
                <div class="payment-row">
                  <span>{{ bookingData.cabinName }} × {{ bookingData.guests }}</span>
                  <span>{{ formatCurrency(bookingData.pricePerCabin) }} × {{ bookingData.guests }}</span>
                </div>
                <div class="payment-divider"></div>
                <div class="payment-row total">
                  <span>Total Paid</span>
                  <span class="total-amount">{{ formatCurrency(bookingData.totalAmount) }}</span>
                </div>
              </div>
              <div class="payment-status">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>Payment Successful</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Email Notice -->
        <div class="email-notice">
          <div class="email-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div class="email-content">
            <h4>Check Your Email</h4>
            <p>A detailed receipt and booking confirmation has been sent to <strong>{{ bookingData.email }}</strong></p>
            <p class="email-hint">Don't forget to check your spam folder if you don't see it within a few minutes.</p>
          </div>
          <div class="email-status" :class="emailStatus">
            <span v-if="emailStatus === 'sending'">Sending...</span>
            <span v-else-if="emailStatus === 'sent'">✓ Email Sent</span>
            <span v-else-if="emailStatus === 'failed'">⚠ Will retry</span>
          </div>
        </div>

        <!-- What's Next -->
        <div class="whats-next">
          <h3>What Happens Next?</h3>
          <div class="next-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <strong>Email Confirmation</strong>
                <p>Check your inbox for your booking receipt and trip details</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <strong>Journey Designer Contact</strong>
                <p>Our team will reach out within 24 hours to finalize your itinerary</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <strong>Prepare for Adventure</strong>
                <p>Get your travel documents ready and pack for an unforgettable trip!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <router-link to="/" class="btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Back to Home
          </router-link>
          <router-link to="/plan" class="btn-secondary">
            Explore More Trips
          </router-link>
        </div>

        <!-- Support -->
        <div class="support-info">
          <p>Need help? Contact our support team at</p>
          <a href="mailto:support@komodocruises.com">support@komodocruises.com</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const emailStatus = ref('sending')

const bookingData = reactive({
  bookingId: 'KC2025001',
  customerName: 'Guest',
  email: 'guest@email.com',
  phone: '-',
  shipName: 'Komodo Cruise',
  cabinName: '-',
  itinerary: '-',
  travelDate: 'To be confirmed',
  guests: 2,
  pricePerCabin: 0,
  totalAmount: 0
})

const formatCurrency = (amount) => {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const sendConfirmationEmail = async () => {
  try {
    emailStatus.value = 'sending'
    
    const response = await fetch('https://komodo-cruises-production-0c52.up.railway.app/api/send-confirmation-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: bookingData.customerName,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        bookingId: bookingData.bookingId,
        shipName: bookingData.shipName,
        cabinName: bookingData.cabinName,
        itinerary: bookingData.itinerary,
        travelDate: bookingData.travelDate,
        guests: bookingData.guests,
        pricePerCabin: bookingData.pricePerCabin,
        totalAmount: bookingData.totalAmount
      })
    })

    const result = await response.json()
    
    if (result.success) {
      emailStatus.value = 'sent'
    } else {
      emailStatus.value = 'failed'
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    emailStatus.value = 'failed'
  }
}

onMounted(async () => {
  // Load booking data from localStorage
  try {
    const lastEnquiry = localStorage.getItem('komodo_last_enquiry')
    if (lastEnquiry) {
      const data = JSON.parse(lastEnquiry)
      
      if (data.form) {
        bookingData.customerName = `${data.form.title || ''} ${data.form.firstName || ''} ${data.form.lastName || ''}`.trim() || 'Guest'
        bookingData.email = data.form.email || 'guest@email.com'
        bookingData.phone = data.form.phone || '-'
      }
      
      if (data.itinerary && data.itinerary.length > 0) {
        const item = data.itinerary[0]
        bookingData.shipName = item.ship || 'Komodo Cruise'
        bookingData.cabinName = item.cabin || '-'
        bookingData.itinerary = item.itinerary || '-'
        bookingData.travelDate = item.date || 'To be confirmed'
        bookingData.guests = item.guests || 2
        bookingData.pricePerCabin = item.pricePerCabin || 0
      }
      
      bookingData.totalAmount = data.amount || 0
      bookingData.bookingId = data.invoiceId ? `KC${Date.now().toString().slice(-8)}` : 'KC2025001'
    }

    // Clear itinerary after loading data
    localStorage.removeItem('komodo_itinerary')
    
    // Send confirmation email
    if (bookingData.email && bookingData.email !== 'guest@email.com') {
      await sendConfirmationEmail()
    } else {
      emailStatus.value = 'sent' // Skip if no valid email
    }
    
  } catch (error) {
    console.error('Error loading booking data:', error)
    emailStatus.value = 'failed'
  }
})
</script>

<style scoped>
.payment-success-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 40px 20px;
}

.success-container {
  max-width: 700px;
  margin: 0 auto;
}

/* Success Animation */
.success-animation {
  text-align: center;
  margin-bottom: 24px;
}

.checkmark-circle {
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.checkmark {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #10b981;
  stroke-miterlimit: 10;
  animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
}

.checkmark-circle-bg {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #10b981;
  fill: #dcfce7;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: #10b981;
  stroke-width: 3;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% { stroke-dashoffset: 0; }
}

@keyframes scale {
  0%, 100% { transform: none; }
  50% { transform: scale3d(1.1, 1.1, 1); }
}

@keyframes fill {
  100% { box-shadow: inset 0 0 0 100px #dcfce7; }
}

/* Content */
.success-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.success-title {
  font-family: 'Cormorant Garamond', 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 600;
  color: #1a365d;
  text-align: center;
  margin: 0 0 8px;
}

.success-subtitle {
  font-size: 16px;
  color: #64748b;
  text-align: center;
  margin: 0 0 32px;
}

/* Booking Card */
.booking-card {
  background: #f8fafc;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
}

.booking-header {
  background: linear-gradient(135deg, #1a365d 0%, #2d4a6f 100%);
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.booking-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
}

.booking-badge svg {
  width: 18px;
  height: 18px;
}

.booking-id .label {
  display: block;
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 2px;
}

.booking-id .value {
  font-family: monospace;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.booking-details {
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #1a365d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.section-title svg {
  width: 18px;
  height: 18px;
  color: #c99b7b;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item .label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.detail-item .value {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
}

/* Payment Section */
.payment-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 0 -24px -24px;
  border-radius: 0 0 16px 16px;
}

.payment-breakdown {
  margin-top: 12px;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  color: #475569;
}

.payment-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.payment-row.total {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.total-amount {
  color: #10b981;
  font-size: 20px;
}

.payment-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #dcfce7;
  color: #166534;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
  font-weight: 600;
  font-size: 14px;
}

.payment-status svg {
  width: 18px;
  height: 18px;
}

/* Email Notice */
.email-notice {
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #93c5fd;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.email-icon {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.email-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.email-content {
  flex: 1;
}

.email-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #1e40af;
}

.email-content p {
  margin: 0;
  font-size: 14px;
  color: #3b82f6;
  line-height: 1.5;
}

.email-hint {
  margin-top: 8px !important;
  font-size: 13px !important;
  opacity: 0.8;
}

.email-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.email-status.sending {
  background: #fef3c7;
  color: #92400e;
}

.email-status.sent {
  background: #dcfce7;
  color: #166534;
}

.email-status.failed {
  background: #fee2e2;
  color: #991b1b;
}

/* What's Next */
.whats-next {
  margin-bottom: 32px;
}

.whats-next h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  color: #1a365d;
  margin: 0 0 20px;
  text-align: center;
}

.next-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #c99b7b 0%, #b8876a 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.step-content strong {
  display: block;
  font-size: 15px;
  color: #1e293b;
  margin-bottom: 4px;
}

.step-content p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #c99b7b 0%, #b8876a 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(201, 155, 123, 0.4);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-secondary {
  background: white;
  color: #1a365d;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #c99b7b;
  color: #c99b7b;
}

/* Support */
.support-info {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.support-info p {
  margin: 0 0 8px;
  font-size: 14px;
  color: #64748b;
}

.support-info a {
  color: #c99b7b;
  text-decoration: none;
  font-weight: 500;
}

.support-info a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 640px) {
  .success-content {
    padding: 24px;
  }
  
  .success-title {
    font-size: 24px;
  }
  
  .booking-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .email-notice {
    flex-direction: column;
  }
  
  .email-status {
    align-self: flex-start;
  }
}
</style>
