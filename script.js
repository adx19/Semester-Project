let state = {
  event: {
    title: "",
    date: "",
    time: "",
    description: "",
    venue: null,
    attendees: [],
    itinerary: [],
  },
  venues: [],
  filters: {
    rating: 0,
    maxDistance: 10000, 
    priceLevel: "",
  },
};

document.getElementById("eventTitle").addEventListener("input", (e) => {
  state.event.title = e.target.value;
});

document.getElementById("eventDate").addEventListener("input", (e) => {
  state.event.date = e.target.value;
  searchVenues();
});

document.getElementById("eventTime").addEventListener("input", (e) => {
  state.event.time = e.target.value;
});

document.getElementById("eventDescription").addEventListener("input", (e) => {
  state.event.description = e.target.value;
});


document.getElementById("ratingFilter").addEventListener("change", (e) => {
  state.filters.rating = parseInt(e.target.value);
  searchVenues();
});

document.getElementById("distanceFilter").addEventListener("change", (e) => {
  state.filters.maxDistance = parseInt(e.target.value);
  searchVenues();
});

document.getElementById("priceFilter").addEventListener("change", (e) => {
  state.filters.priceLevel = e.target.value;
  searchVenues();
});


function addAttendee() {
  const nameInput = document.getElementById("attendeeName");
  const emailInput = document.getElementById("attendeeEmail");

  if (nameInput.value && emailInput.value) {
    const newAttendee = {
      id: Math.random().toString(36).substr(2, 9),
      name: nameInput.value,
      email: emailInput.value,
      response: "pending",
    };

    state.event.attendees.push(newAttendee);
    nameInput.value = "";
    emailInput.value = "";
    renderAttendees();
    generateItinerary();
  }
}

function updateAttendeeResponse(id, response) {
  const attendee = state.event.attendees.find((a) => a.id === id);
  if (attendee) {
    attendee.response = response;
    renderAttendees();
    generateItinerary();
  }
}

function removeAttendee(id) {
  state.event.attendees = state.event.attendees.filter((a) => a.id !== id);
  renderAttendees();
  generateItinerary();
}

function renderAttendees() {
  const list = document.getElementById("attendeesList");
  list.innerHTML = state.event.attendees
    .map(
      (attendee) => `
        <div class="attendee-card">
            <div class="attendee-info">
                <h3>${attendee.name}</h3>
                <p>${attendee.email}</p>
                <span class="response-badge ${attendee.response}">${
        attendee.response
      }</span>
            </div>
            <div class="attendee-actions">
                <button 
                    class="action-button ${
                      attendee.response === "confirmed" ? "active" : ""
                    }"
                    onclick="updateAttendeeResponse('${
                      attendee.id
                    }', 'confirmed')"
                    title="Confirm"
                >✓</button>
                <button 
                    class="action-button ${
                      attendee.response === "pending" ? "active" : ""
                    }"
                    onclick="updateAttendeeResponse('${
                      attendee.id
                    }', 'pending')"
                    title="Mark as Pending"
                >?</button>
                <button 
                    class="action-button ${
                      attendee.response === "declined" ? "active" : ""
                    }"
                    onclick="updateAttendeeResponse('${
                      attendee.id
                    }', 'declined')"
                    title="Decline"
                >×</button>
                <button 
                    class="action-button remove"
                    onclick="removeAttendee('${attendee.id}')"
                    title="Remove"
                >🗑</button>
            </div>
        </div>
    `
    )
    .join("");
}


function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  searchVenues();
  renderAttendees();
  generateItinerary();
});
function generateItinerary() {
  const itineraryContainer = document.getElementById("itineraryContainer");
  if (!itineraryContainer) {
    console.error("Itinerary container not found.");
    return;
  }


  const itinerary = [
    { time: "9:00 AM", activity: "Breakfast" },
    { time: "10:00 AM", activity: "Meeting" },
    { time: "12:00 PM", activity: "Lunch" },
  ];


  const itineraryHTML = itinerary
    .map((item) => {
      return `
            <div class="itinerary-item">
                <span class="time">${item.time}</span>: <span class="activity">${item.activity}</span>
            </div>
        `;
    })
    .join("");

  itineraryContainer.innerHTML = itineraryHTML;
}
function handleAuthClick() {
  const authInstance = gapi.auth2.getAuthInstance();

  if (authInstance) {
    authInstance
      .signIn()
      .then(function (googleUser) {
        console.log("User signed in: ", googleUser);
        fetchCalendarEvents();
      })
      .catch(function (error) {
        console.log("Error signing in: ", error);
      });
  } else {
    console.error("Google API client not initialized.");
  }
}

function fetchCalendarEvents() {
  const calendar = gapi.client.calendar.events.list({
    calendarId: "primary", 
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  calendar.execute(function (response) {
    console.log(response);
  });
}


function gapiLoaded() {
  console.log("gapiLoaded called");
  gapi.load("client", initializeGapiClient);
}



function initClient() {
  gapi.client
    .init({
      apiKey: "AIzaSyDMmN5TG0hagBdemDfnlr70QDDjVwgclPI", 
      clientId:
        "854853523589-vji17u3on8aqchmhngd18shnuhjia333.apps.googleusercontent.com", 
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
      scope:
        "https://www.googleapis.com/auth/calendar.readonly",
    })
    .then(function () {
      console.log("Google API client initialized");

      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        console.log("User is already signed in");
      } else {
        console.log("User is not signed in");
      }
    })
    .catch(function (error) {
      console.log("Error initializing Google API client: ", error);
    });
}


function gisLoaded() {
  console.log("Google Identity Services API loaded");
}
const FOURSQUARE_API_KEY = "fsq3iQJuwQqIJYLMqpTXfSl6EFqgNRs/T8ikN3M1pxywXX0="; 
const FOURSQUARE_BASE_URL = "https://api.foursquare.com/v3";


async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) =>
        reject(new Error("Error retrieving location: " + error.message))
    );
  });
}
async function searchVenues() {
  try {
    const { ratingFilter, distanceFilter, priceFilter } = getFilterValues();

    console.log(
      `Rating filter: ${ratingFilter}, Distance filter: ${distanceFilter}, Price filter: ${priceFilter}`
    );

    const position = await getCurrentPosition();
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const maxDistance = distanceFilter;

    const params = new URLSearchParams({
      ll: `${latitude},${longitude}`,
      radius: maxDistance,
      categories: "13003,13065", 
      sort: "RATING",
      limit: 10,
    });

    const response = await fetch(
      `${FOURSQUARE_BASE_URL}/places/search?${params}`,
      {
        headers: {
          Authorization: FOURSQUARE_API_KEY,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error("Invalid API response format.");
    }


    const venueDetailsPromises = data.results.map(async (venue) => {
      try {
        const detailsResponse = await fetch(
          `${FOURSQUARE_BASE_URL}/places/${venue.fsq_id}?fields=rating,price`,
          {
            headers: {
              Authorization: FOURSQUARE_API_KEY,
              Accept: "application/json",
            },
          }
        );

        const details = await detailsResponse.json();

        return {
          ...venue,
          rating: details.rating !== undefined ? details.rating : null,
          price: details.price !== undefined ? details.price : null,
        };
      } catch (error) {
        console.error(
          `Error fetching details for venue ${venue.fsq_id}:`,
          error
        );
        return venue;
      }
    });

    state.venues = await Promise.all(venueDetailsPromises);

    
    console.log("Raw venues data:", state.venues);

    const filteredVenues = state.venues.filter((venue) => {
      const ratingValid = venue.rating >= ratingFilter;
      const priceValid = priceFilter ? venue.price === priceFilter : true;
      const distanceValid = venue.distance <= distanceFilter;

      console.log(
        `Venue ${venue.fsq_id} rating: ${venue.rating}, price: ${venue.price}, distance: ${venue.distance}`
      );
      console.log(
        `Rating valid: ${ratingValid}, Price valid: ${priceValid}, Distance valid: ${distanceValid}`
      );

      return ratingValid && priceValid && distanceValid;
    });

    console.log("Filtered venues:", filteredVenues);

    filteredVenues.sort((a, b) => {
      const ratingA =
        a.rating !== null && a.rating !== undefined ? parseFloat(a.rating) : 0;
      const ratingB =
        b.rating !== null && b.rating !== undefined ? parseFloat(b.rating) : 0;

      console.log(`Sorting ratings: ${ratingA} vs ${ratingB}`); 

      return ratingB - ratingA; 
    });

    console.log("Sorted venues:", filteredVenues);

    renderVenues(filteredVenues);
  } catch (error) {
    console.error("Error searching venues:", error);
    showNotification("Error searching venues. Please try again.", "error");
  }
}

function renderVenues(venues) {
  const list = document.getElementById("venuesList");
  if (!list) return;

  if (venues.length === 0) {
    list.innerHTML = "<p>No venues found matching the filters.</p>";
  } else {
    list.innerHTML = venues
      .map((venue) => {
        const imageUrl = venue.photos?.[0]
          ? `${venue.photos[0].prefix}original${venue.photos[0].suffix}`
          : "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80";

        const rawRating =
          typeof venue.rating === "number" ? venue.rating : null;
        const convertedRating =
          rawRating !== null ? (rawRating / 2).toFixed(1) : "N/A";

        const stars =
          rawRating !== null
            ? "★".repeat(Math.round(rawRating / 2))
            : "No rating";
        const price = venue.price ? "$".repeat(venue.price) : "Unknown";

        return `
              <div class="venue-card ${
                venue.fsq_id === state.event.venue?.fsq_id ? "selected" : ""
              }"
              onclick="selectVenue('${venue.fsq_id}')">

                  <img src="${imageUrl}" alt="${
          venue.name
        }" class="venue-image">
                  <div class="venue-info">
                      <h3 class="venue-name">${venue.name}</h3>
                      <p class="venue-address">${
                        venue.location.formatted_address ||
                        "Address not available"
                      }</p>
                      <div class="venue-rating">
                          <span class="stars">${stars}</span>
                          <span class="rating-number">${convertedRating} / 5</span>
                          <span class="price-level">${price}</span>
                      </div>
                  </div>
              </div>
          `;
      })
      .join("");
  }
}


window.searchVenues = searchVenues;


function gisLoaded() {
  console.log("Google Maps API loaded successfully!");
  searchVenues(); 
}
function getFilterValues() {
  const ratingFilter = parseFloat(
    document.getElementById("ratingFilter").value
  );
  const distanceFilter = parseInt(
    document.getElementById("distanceFilter").value
  );
  const priceFilter =
    parseInt(document.getElementById("priceFilter").value) || null;


  console.log(
    `Rating: ${ratingFilter}, Distance: ${distanceFilter}, Price: ${priceFilter}`
  );

  return {
    ratingFilter,
    distanceFilter,
    priceFilter,
  };
}


function selectVenue(fsqId) {
  const selectedVenue = state.venues.find((venue) => venue.fsq_id === fsqId);
  if (selectedVenue) {
    state.event.venue = selectedVenue;
    renderVenues(state.venues);
  }
}

window.searchVenues = searchVenues;


function gisLoaded() {
  console.log("Google Maps API loaded successfully!");
  searchVenues(); 
}
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) =>
        reject(new Error("Error retrieving location: " + error.message))
    );
  });
}

const GOOGLE_CLIENT_ID =
  "363006308564-u052flq27gjh811qpht9mumvplo6cta3.apps.googleusercontent.com"; 
const GOOGLE_API_KEY = "AIzaSyAXLCmkqgKQQZBRxUJ1C7DWMSENgrykaWc"; 
const GOOGLE_DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const GOOGLE_SCOPES =
  "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events";

let gapiInited = false;
let gisInited = false;
function gapiLoaded() {
  console.log("gapiLoaded called");
  gapi.load("client:auth2", initializeGapiClient);
}

async function initializeGapiClient() {
  try {
    await gapi.client.init({
      apiKey: GOOGLE_API_KEY,  
      clientId: GOOGLE_CLIENT_ID,  
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],  
      scope: "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events",  
    });

    console.log("Google API client initialized");

    await gapi.auth2.init({
      client_id: GOOGLE_CLIENT_ID,  
    });

    console.log("OAuth client initialized");

    maybeEnableButtons();  

  } catch (error) {
    console.error("Error initializing Google API client:", error);
  }
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").disabled = false;
    document.getElementById("create_event_button").disabled = false;
  }
}

async function handleAuthClick() {
  try {
    const tokenResponse = await google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_SCOPES,
      callback: (response) => {
        if (response.access_token) {
          gapi.client.setToken({ access_token: response.access_token }); 
          fetchCalendarEvents(); 
        } else {
          console.error("Failed to get access token.");
        }
      },
    }).requestAccessToken();
    
  } catch (error) {
    console.error("Error signing in:", error);
  }
}

async function createCalendarEvent() {
  const eventTitle = document.getElementById("eventTitle").value;
  const eventDate = document.getElementById("eventDate").value;
  const eventTime = document.getElementById("eventTime").value;
  const eventDescription = document.getElementById("eventDescription").value;

  if (!eventTitle || !eventDate || !eventTime) {
    alert("Please fill in all the fields.");
    return;
  }

  const startTime = `${eventDate}T${eventTime}:00`;
  const endTime = `${eventDate}T${parseInt(eventTime.split(":")[0]) + 1}:${eventTime.split(":")[1]}:00`;

  const event = {
    summary: eventTitle,
    description: eventDescription,
    start: { dateTime: startTime, timeZone: "America/Los_Angeles" },
    end: { dateTime: endTime, timeZone: "America/Los_Angeles" },
  };

  try {
    const response = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    console.log("Event created:", response.result.htmlLink);
    alert("Event successfully created!");
  } catch (error) {
    console.error("Error creating event:", error);
    alert("Error creating event: " + (error.message || "Unknown error"));
  }
}


document
  .getElementById("create_event_button")
  .addEventListener("click", createCalendarEvent);

window.onload = gapiLoaded;
