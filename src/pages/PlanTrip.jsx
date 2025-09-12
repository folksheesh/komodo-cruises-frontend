import React, { useState } from "react";
import "../styles/plan-trip.css";

const regionsData = [
  {
    country: "South Africa",
    regions: ["Kruger National Park", "Sabi Sand"],
  },
  {
    country: "Rwanda",
    regions: ["Volcanoes National Park"],
  },
  {
    country: "Zimbabwe",
    regions: ["Maliangwe"],
  },
  {
    country: "Tanzania",
    regions: [],
  },
];

const lodgesData = {
  "Kruger National Park": [
    "Sweni Lodge",
    "Lebombo Lodge"
  ],
  "Sabi Sand": [
    "Ebony Lodge", 
    "Boulders Lodge",
    "Castleton"
  ],
  "Volcanoes National Park": [
    "Kwitonda Lodge"
  ]
};

export default function PlanTrip({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedLodges, setSelectedLodges] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [guests, setGuests] = useState({
    adults: 2,
    children10to16: 0,
    children3to9: 0,
    children0to2: 0
  });

  const handleRegionChange = (region) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleLodgeChange = (lodge) => {
    setSelectedLodges(prev => 
      prev.includes(lodge) 
        ? prev.filter(l => l !== lodge)
        : [...prev, lodge]
    );
  };

  const handleGuestChange = (type, delta) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(5, prev + 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };
  return (
    <div className="plantrip-root">
      <header className="plantrip-header">
        <div className="plantrip-title">Plan your trip</div>
        <button className="plantrip-close" aria-label="Close" onClick={onClose}>
          Close <span aria-hidden>✕</span>
        </button>
      </header>

      <nav className="plantrip-steps" aria-label="Steps">
        <span className={`step ${currentStep === 1 ? 'step-active' : ''}`}>Step 1</span>
        <span className={`step ${currentStep === 2 ? 'step-active' : ''}`}>Step 2</span>
        <span className={`step ${currentStep === 3 ? 'step-active' : ''}`}>Step 3</span>
        <span className={`step ${currentStep === 4 ? 'step-active' : ''}`}>Step 4</span>
        <span className={`step ${currentStep === 5 ? 'step-active' : ''}`}>Step 5</span>
      </nav>

      <main className="plantrip-content">
        {currentStep === 1 && (
          <section className="regions">
            <h1 className="regions-title">Regions</h1>
            <p className="regions-subtitle">
              Select the regions you're interested in:
            </p>

            {regionsData.map((group, gi) => (
              <div key={group.country} className="region-group">
                <div className="country">{group.country}</div>

                {group.regions.length > 0 ? (
                  group.regions.map((r, ri) => {
                    const id = `region-${gi}-${ri}`;
                    return (
                      <label key={id} className="region-row" htmlFor={id}>
                        <span className="region-name">{r}</span>
                        <input 
                          type="checkbox" 
                          id={id} 
                          className="visually-hidden"
                          checked={selectedRegions.includes(r)}
                          onChange={() => handleRegionChange(r)}
                        />
                        <span className="custom-check" aria-hidden />
                      </label>
                    );
                  })
                ) : (
                  <div className="region-row region-row--empty">
                    <span className="region-name region-name--muted">—</span>
                  </div>
                )}

                <div className="divider" />
              </div>
            ))}
          </section>
        )}

        {currentStep === 2 && (
          <section className="lodges">
            <h1 className="lodges-title">Lodges</h1>
            <p className="lodges-subtitle">
              These lodges are available in the regions you've selected.
            </p>
            <p className="lodges-subtitle">
              Please select the ones you're interested in:
            </p>

            {selectedRegions.map(region => (
              <div key={region} className="region-group">
                <div className="country">{region}</div>
                
                {lodgesData[region] && lodgesData[region].map((lodge, index) => {
                  const id = `lodge-${region}-${index}`;
                  return (
                    <label key={id} className="region-row" htmlFor={id}>
                      <span className="region-name">{lodge}</span>
                      <input 
                        type="checkbox" 
                        id={id} 
                        className="visually-hidden"
                        checked={selectedLodges.includes(lodge)}
                        onChange={() => handleLodgeChange(lodge)}
                      />
                      <span className="custom-check" aria-hidden />
                    </label>
                  );
                })}
                
                <div className="divider" />
              </div>
            ))}
          </section>
        )}

        {currentStep === 3 && (
          <section className="dates">
            <h1 className="dates-title">Dates</h1>
            <p className="dates-subtitle">
              Select the dates which will suit you:
            </p>
            
            <div className="date-range-input">
              <input 
                type="date" 
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({...prev, startDate: e.target.value}))}
              />
              <span className="arrow">→</span>
              <input 
                type="date" 
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({...prev, endDate: e.target.value}))}
              />
            </div>

            <div className="calendar-container">
              <p>Calendar will be implemented here</p>
            </div>
          </section>
        )}

        {currentStep === 4 && (
          <section className="guests">
            <h1 className="guests-title">Guests</h1>
            <p className="guests-subtitle">
              Please indicate how many adults will need to be accommodated.
            </p>
            <p className="guests-subtitle">
              If your booking includes children, please enquire directly on the next step.
            </p>
            <p className="guests-subtitle">
              View our child policy for each lodge here.
            </p>

            <div className="guest-counter">
              <div className="guest-type">
                <span className="guest-label">Adults</span>
                <span className="guest-sublabel">Ages 17+</span>
              </div>
              <div className="counter-controls">
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestChange('adults', -1)}
                  disabled={guests.adults <= 1}
                >
                  −
                </button>
                <span className="counter-value">{guests.adults}</span>
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestChange('adults', 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="guest-counter">
              <div className="guest-type">
                <span className="guest-label">Children</span>
                <span className="guest-sublabel">Ages 10 - 16</span>
              </div>
              <div className="counter-controls">
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestChange('children10to16', -1)}
                >
                  −
                </button>
                <span className="counter-value">{guests.children10to16}</span>
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestChange('children10to16', 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="guest-counter">
              <div className="guest-type">
                <span className="guest-label">Ages 3 - 9</span>
              </div>
              <div className="counter-controls">
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestChange('children3to9', -1)}
                >
                  −
                </button>
                <span className="counter-value">{guests.children3to9}</span>
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestChange('children3to9', 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="guest-counter">
              <div className="guest-type">
                <span className="guest-label">Ages 0 - 2</span>
              </div>
              <div className="counter-controls">
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestChange('children0to2', -1)}
                >
                  −
                </button>
                <span className="counter-value">{guests.children0to2}</span>
                <button 
                  className="counter-btn"
                  onClick={() => handleGuestChange('children0to2', 1)}
                >
                  +
                </button>
              </div>
            </div>
          </section>
        )}

        {currentStep === 5 && (
          <section className="availability">
            <h1 className="availability-title">Check Availability</h1>
            <p className="availability-subtitle">
              To see if we have availability for your preferred criteria, please click the button below.
            </p>
            
            <button className="check-availability-btn">
              Check now <span className="arrow">›</span>
            </button>

            <div className="contact-section">
              <h2 className="contact-title">Speak with a Singita Travel Advisor</h2>
              <p className="contact-subtitle">
                Need some help to plan your trip? Enquire below to contact one of our Singita Travel Advisors.
              </p>
              
              <button className="enquire-btn">
                Enquire now <span className="arrow">›</span>
              </button>
            </div>
          </section>
        )}
      </main>

      <div className="plantrip-footer">
        {currentStep > 1 && (
          <button className="nav-btn prev-btn" onClick={prevStep}>
            ‹ {currentStep === 2 ? 'Regions' : 
               currentStep === 3 ? 'Lodges' : 
               currentStep === 4 ? 'Dates' : 
               currentStep === 5 ? 'Guests' : ''}
          </button>
        )}
        {currentStep < 5 && (
          <button 
            className="cta"
            style={{ marginLeft: 'auto' }}
            onClick={nextStep}
            disabled={currentStep === 1 && selectedRegions.length === 0}
          >
            {currentStep === 1 ? 'Lodges' : 
             currentStep === 2 ? 'Dates' : 
             currentStep === 3 ? 'Guests' : 
             currentStep === 4 ? 'Submit' : ''}
            <span className="arrow" aria-hidden>›</span>
          </button>
        )}
        {currentStep === 5 && (
          <button className="back-to-search" style={{ marginLeft: 'auto' }} onClick={() => setCurrentStep(1)}>
            Back to Search
          </button>
        )}
      </div>
    </div>
  );
}
