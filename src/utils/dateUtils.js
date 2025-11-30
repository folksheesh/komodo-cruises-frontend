/**
 * Utility functions for handling dates to avoid timezone issues
 */

/**
 * Format Date object to YYYY-MM-DD string avoiding timezone issues
 * @param {Date} date 
 * @returns {string} Date in YYYY-MM-DD format
 */
export function formatDateToString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Parse date string to Date object avoiding timezone issues
 * @param {string} dateString Date in YYYY-MM-DD format
 * @returns {Date} Local date object
 */
export function parseDateString(dateString) {
  return new Date(dateString + 'T00:00:00')
}

/**
 * Add days to a date string safely
 * @param {string} dateString Date in YYYY-MM-DD format
 * @param {number} days Number of days to add
 * @returns {string} New date in YYYY-MM-DD format
 */
export function addDaysToDateString(dateString, days) {
  const date = parseDateString(dateString)
  date.setDate(date.getDate() + days)
  return formatDateToString(date)
}

/**
 * Generate array of date strings between two dates
 * @param {string} startDate Start date in YYYY-MM-DD format
 * @param {string} endDate End date in YYYY-MM-DD format
 * @returns {string[]} Array of date strings
 */
export function generateDateRange(startDate, endDate) {
  const start = parseDateString(startDate)
  const end = parseDateString(endDate)
  const dates = []
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(formatDateToString(d))
  }
  
  return dates
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export function getTodayString() {
  return formatDateToString(new Date())
}