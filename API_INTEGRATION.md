# Komodo API Client - Complete Integration

This document describes the complete Komodo Cruises API client integration with form-based search and real availability display.

## Flow Overview

1. **Plan Page (Form)** - User fills out search criteria
2. **Data Storage** - Search criteria saved to localStorage  
3. **Results Page** - Real API calls display actual availability
4. **Dynamic Results** - Show different messages based on availability

## 1. Plan.vue - Search Form

The Plan component now works as a complete search form:

### Search Criteria Collected:
- **Region**: Single selection from API operators
- **Lodges**: Multi-select checkboxes (array of cabin names)
- **Dates**: From/To date range
- **Guests**: Adults + Children + Age groups (total count)

### Form Validation:
- Step 2 disabled until region selected
- Step 3 disabled until at least 1 cabin selected
- Form saves complete search criteria to localStorage on submit

### Data Storage Format:
```javascript
{
  region: "Sabi Sand",
  lodges: ["Ebony", "Boulders"],
  dateFrom: "2025-10-15",
  dateTo: "2025-10-17", 
  adults: 2,
  children: 0,
  age3_9: 0,
  age0_2: 0,
  totalGuests: 2,
  timestamp: 1697234567890
}
```

## 2. Results.vue - Real Availability Display

The Results page now displays actual availability based on API responses:

### API Integration:
- Loads search criteria from localStorage
- Calls `getAvailability(date, sheet)` for each date in range
- Filters cabin data to match selected lodges
- Calculates availability vs. guest requirements

### Availability Logic:
```javascript
// For each selected lodge
for (const lodge of searchCriteria.lodges) {
  // Check each date in range
  for (const date of dateRange) {
    // Get availability data for region
    const availability = await getAvailability(date, `${region} (Normalized)`)
    
    // Filter cabins matching lodge name
    const matchingCabins = availability.operators[0].cabins.filter(cabin => {
      const baseName = cabin.split(' (')[0] // Remove " (2)" suffix
      return baseName === lodge
    })
    
    // Sum available slots
    const daySlots = matchingCabins.reduce((sum, cabin) => {
      const slots = cabin.match(/\((\d+)\)/)?.[1] || 0
      return sum + parseInt(slots)
    }, 0)
  }
  
  // Check if availability meets guest requirements
  hasAvailability = avgDailySlots >= totalGuests
}
```

### Display Messages:

#### 1. Full Availability ✅
```
"Great news, we have availability!"
"Select the result that best suits you from the list below..."
```
- Shows when ALL selected lodges have sufficient availability
- Green success styling
- Action buttons: "Room & Rate Details", "Add to itinerary"

#### 2. Partial Availability ⚠️
```
"Alternative options are available"
"Unfortunately, there isn't availability for your selected dates. However, the following alternate options may suit your requirements."
```
- Shows when SOME lodges have availability
- Yellow/orange warning styling
- Mixed results displayed

#### 3. No Availability ❌
```
"Unfortunately, we do not have availability for your dates."
"We have a team of Komodo Cruises Travel Advisors who are ready to assist you with planning your trip..."
```
- Shows when NO lodges meet guest requirements
- Red error styling
- Contact form displayed instead of lodge cards

## 3. API Endpoints Used

### Cabins Data:
```
GET https://script.google.com/macros/s/.../exec?resource=cabins
```

### Availability Data:
```
GET https://script.google.com/macros/s/.../exec?resource=availability&date=2025-10-24&sheet=Sabi%20Sand%20(Normalized)
```

### Response Format:
```javascript
{
  ok: true,
  date: "2025-10-24",
  total: 8,
  operators: [{
    operator: "Sabi Sand",
    total: 8,
    cabins: ["Ebony (4)", "Boulders (2)", "Singita Villa (2)"]
  }]
}
```

## 4. User Experience Flow

1. **User fills Plan form**:
   - Selects region → loads available cabins
   - Multi-selects desired cabins
   - Sets date range and guest count
   - Submits → navigates to Results

2. **Results page loads**:
   - Shows loading state while checking availability
   - Makes API calls for each date in range
   - Processes availability data vs. requirements
   - Displays appropriate message and lodge cards

3. **Different scenarios**:
   - **Perfect match**: Green success, all lodges available
   - **Partial match**: Orange warning, some alternatives
   - **No match**: Red error, contact form displayed

## 5. Error Handling

- **API Errors**: User-friendly error messages
- **Network Issues**: Retry buttons provided
- **Invalid Data**: Graceful fallbacks and validation
- **Missing Criteria**: Redirect to Plan page

## 6. Testing

### Example Test Scenario:
1. Select "Sabi Sand" region
2. Choose "Ebony" cabin (multi-select)
3. Set dates: 2025-10-24 to 2025-10-26  
4. Set guests: 2 adults
5. Submit → Should show real availability from API

### API Test URL:
```
https://script.google.com/macros/s/AKfycbwvfIHPdbGq7cVlbX6g1IPoBdE2xIqYD9fZJclMlq9AYAFGa--e3eGV15HbYfrj2z4vLw/exec?resource=availability&date=2025-10-24
```

## Key Features ✅

- ✅ Form-based search criteria collection
- ✅ Real API integration with Google Apps Script
- ✅ Dynamic availability checking
- ✅ Smart guest vs. capacity logic
- ✅ Three-tier messaging system (success/partial/none)
- ✅ Visual feedback matching provided screenshots
- ✅ Error handling and loading states
- ✅ Responsive design with sidebar summary
- ✅ localStorage integration for data persistence

The system now provides a complete end-to-end search and availability checking experience with real data from your Google Apps Script API!