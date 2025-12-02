<template>
  <div class="payment-result-page">
    <div class="payment-result-container">
      <div class="result-icon failed">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      
      <h1 class="result-title">Payment Failed</h1>
      
      <p class="result-message">
        We're sorry, but your payment could not be processed.
      </p>
      
      <div class="result-details">
        <p>This could be due to:</p>
        <ul>
          <li>Insufficient funds</li>
          <li>Card declined by issuer</li>
          <li>Payment session expired</li>
          <li>Technical issues</li>
        </ul>
        <p>Please try again or contact our support team for assistance.</p>
      </div>
      
      <div class="result-actions">
        <router-link to="/results" class="btn-secondary">Try Again</router-link>
        <router-link to="/" class="btn-primary">Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.payment-result-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f4f1ec 0%, #e8e4df 100%);
  padding: 2rem;
}

.payment-result-container {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.result-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.result-icon.failed {
  background: #fee2e2;
  color: #dc2626;
}

.result-title {
  font-family: var(--font-serif, 'Playfair Display', serif);
  font-size: 2rem;
  font-weight: 500;
  color: #dc2626;
  margin: 0 0 1rem;
}

.result-message {
  font-size: 1.1rem;
  color: #374151;
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.result-details {
  background: #fef2f2;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  text-align: left;
}

.result-details p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

.result-details ul {
  margin: 0.75rem 0;
  padding-left: 1.5rem;
}

.result-details li {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.btn-primary {
  background: #c99b7b;
  color: white;
}

.btn-primary:hover {
  background: #b8876a;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .payment-result-page {
    padding: 1rem;
  }
  
  .payment-result-container {
    padding: 1.5rem;
    border-radius: 12px;
  }
  
  .result-icon {
    width: 80px;
    height: 80px;
  }
  
  .result-icon svg {
    width: 48px;
    height: 48px;
  }
  
  .result-title {
    font-size: 1.5rem;
  }
  
  .result-message {
    font-size: 1rem;
  }
  
  .result-details {
    padding: 1rem;
  }
  
  .result-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    text-align: center;
    padding: 0.75rem 1rem;
  }
}
</style>
