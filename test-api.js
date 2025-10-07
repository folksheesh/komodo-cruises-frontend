// Test file for Komodo API
import { getCabins, getAvailability } from './services/komodoApi.js'

async function testApi() {
  try {
    console.log('Testing getCabins...')
    const cabins = await getCabins()
    console.log('Cabins response:', cabins)
    console.log('Available regions:', cabins.operators.map(op => op.operator))

    console.log('\nTesting getAvailability...')
    const availability = await getAvailability('2025-10-15')
    console.log('Availability response:', availability)
    console.log('Total available:', availability.total)
    
  } catch (error) {
    console.error('API test failed:', error)
  }
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  testApi()
}

export { testApi }