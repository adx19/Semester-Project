// Main app.js file

// State management
let state = {
    event: {
      title: '',
      date: '',
      time: '',
      description: '',
      venue: null,
      attendees: [],
      itinerary: []
    },
    venues: [],
    filters: {
      rating: 0,
      maxDistance: 10000, // 10km
      priceLevel: ''
    }
  };
  
  // Event listeners
  document.getElementById('eventTitle').addEventListener('input', (e) => {
    state.event.title = e.target.value;
  });
  
  document.getElementById('eventDate').addEventListener('input', (e) => {
    state.event.date = e.target.value;
    searchVenues();
  });
  
  document.getElementById('eventTime').addEventListener('input', (e) => {
    state.event.time = e.target.value;
  });
  
  document.getElementById('eventDescription').addEventListener('input', (e) => {
    state.event.description = e.target.value;
  });
  
  // Filter handlers
  document.getElementById('ratingFilter').addEventListener('change', (e) => {
    state.filters.rating = parseInt(e.target.value);
    searchVenues();
  });
  
  document.getElementById('distanceFilter').addEventListener('change', (e) => {
    state.filters.maxDistance = parseInt(e.target.value);
    searchVenues();
  });
  
  document.getElementById('priceFilter').addEventListener('change', (e) => {
    state.filters.priceLevel = e.target.value;
    searchVenues();
  });
  
  // Attendee management
  function addAttendee() {
    const nameInput = document.getElementById('attendeeName');
    const emailInput = document.getElementById('attendeeEmail');
    
    if (nameInput.value && emailInput.value) {
        const newAttendee = {
            id: Math.random().toString(36).substr(2, 9),
            name: nameInput.value,
            email: emailInput.value,
            response: 'pending'
        };
        
        state.event.attendees.push(newAttendee);
        nameInput.value = '';
        emailInput.value = '';
        renderAttendees();
        generateItinerary();
    }
  }
  
  function updateAttendeeResponse(id, response) {
    const attendee = state.event.attendees.find(a => a.id === id);
    if (attendee) {
        attendee.response = response;
        renderAttendees();
        generateItinerary();
    }
  }
  
  function removeAttendee(id) {
    state.event.attendees = state.event.attendees.filter(a => a.id !== id);
    renderAttendees();
    generateItinerary();
  }
  
  function renderAttendees() {
    const list = document.getElementById('attendeesList');
    list.innerHTML = state.event.attendees.map(attendee => `
        <div class="attendee-card">
            <div class="attendee-info">
                <h3>${attendee.name}</h3>
                <p>${attendee.email}</p>
                <span class="response-badge ${attendee.response}">${attendee.response}</span>
            </div>
            <div class="attendee-actions">
                <button 
                    class="action-button ${attendee.response === 'confirmed' ? 'active' : ''}"
                    onclick="updateAttendeeResponse('${attendee.id}', 'confirmed')"
                    title="Confirm"
                >✓</button>
                <button 
                    class="action-button ${attendee.response === 'pending' ? 'active' : ''}"
                    onclick="updateAttendeeResponse('${attendee.id}', 'pending')"
                    title="Mark as Pending"
                >?</button>
                <button 
                    class="action-button ${attendee.response === 'declined' ? 'active' : ''}"
                    onclick="updateAttendeeResponse('${attendee.id}', 'declined')"
                    title="Decline"
                >×</button>
                <button 
                    class="action-button remove"
                    onclick="removeAttendee('${attendee.id}')"
                    title="Remove"
                >🗑</button>
            </div>
        </div>
    `).join('');
  }
  
  // Utility functions
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    searchVenues();
    renderAttendees();
    generateItinerary();
  });
  function generateItinerary() {
    const itineraryContainer = document.getElementById('itineraryContainer');
    if (!itineraryContainer) {
        console.error("Itinerary container not found.");
        return;
    }

    // Example: Populate the itinerary with some data
    const itinerary = [
        { time: "9:00 AM", activity: "Breakfast" },
        { time: "10:00 AM", activity: "Meeting" },
        { time: "12:00 PM", activity: "Lunch" }
    ];

    // Create HTML for the itinerary
    const itineraryHTML = itinerary.map(item => {
        return `
            <div class="itinerary-item">
                <span class="time">${item.time}</span>: <span class="activity">${item.activity}</span>
            </div>
        `;
    }).join('');

    itineraryContainer.innerHTML = itineraryHTML;
}
