// venues.js

// Foursquare API Configuration
const FOURSQUARE_API_KEY = 'fsq3iQJuwQqIJYLMqpTXfSl6EFqgNRs/T8ikN3M1pxywXX0='; // Replace with actual API key
const FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v3';

// Venue search with Foursquare API
async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => reject(new Error("Error retrieving location: " + error.message))
        );
    });
}

// Venue search with Foursquare API
async function searchVenues() {
  try {
      // Get Filter Values from the UI
      const { ratingFilter, distanceFilter, priceFilter } = getFilterValues();
      
      // Log filter values to verify they're set as expected
      console.log(`Rating filter: ${ratingFilter}, Distance filter: ${distanceFilter}, Price filter: ${priceFilter}`);

      // Get User Location
      const position = await getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const maxDistance = distanceFilter;

      const params = new URLSearchParams({
          ll: `${latitude},${longitude}`,
          radius: maxDistance,
          categories: '13003,13065', // Venue, event space categories
          sort: 'RATING',
          limit: 10
      });

      const response = await fetch(`${FOURSQUARE_BASE_URL}/places/search?${params}`, {
          headers: {
              'Authorization': FOURSQUARE_API_KEY,
              'Accept': 'application/json'
          }
      });

      const data = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Invalid API response format.");
      }

      // Fetch Venue Details for Each Venue
      const venueDetailsPromises = data.results.map(async (venue) => {
          try {
              const detailsResponse = await fetch(`${FOURSQUARE_BASE_URL}/places/${venue.fsq_id}?fields=rating,price`, {
                  headers: {
                      'Authorization': FOURSQUARE_API_KEY,
                      'Accept': 'application/json'
                  }
              });

              const details = await detailsResponse.json();
              
              return {
                  ...venue,
                  rating: details.rating !== undefined ? details.rating : null,
                  price: details.price !== undefined ? details.price : null
              };
          } catch (error) {
              console.error(`Error fetching details for venue ${venue.fsq_id}:`, error);
              return venue;
          }
      });

      state.venues = await Promise.all(venueDetailsPromises);

      // Log raw venue data (for debugging)
      console.log("Raw venues data:", state.venues);

      // Apply filters to the venues
      const filteredVenues = state.venues.filter((venue) => {
          const ratingValid = venue.rating >= ratingFilter;
          const priceValid = priceFilter ? venue.price === priceFilter : true;
          const distanceValid = venue.distance <= distanceFilter;

          // Log each venue's filter validation for debugging
          console.log(`Venue ${venue.fsq_id} rating: ${venue.rating}, price: ${venue.price}, distance: ${venue.distance}`);
          console.log(`Rating valid: ${ratingValid}, Price valid: ${priceValid}, Distance valid: ${distanceValid}`);

          return ratingValid && priceValid && distanceValid;
      });

      // Log the filtered venues
      console.log("Filtered venues:", filteredVenues);

      // Simplify the sorting logic first to focus on rating only
      filteredVenues.sort((a, b) => {
          const ratingA = a.rating !== null && a.rating !== undefined ? parseFloat(a.rating) : 0;
          const ratingB = b.rating !== null && b.rating !== undefined ? parseFloat(b.rating) : 0;

          console.log(`Sorting ratings: ${ratingA} vs ${ratingB}`);  // Log the ratings comparison

          return ratingB - ratingA;  // Sort by rating (descending)
      });

      // Log the sorted venues to ensure proper sorting
      console.log("Sorted venues:", filteredVenues);

      // Render the filtered and sorted venues
      renderVenues(filteredVenues);

  } catch (error) {
      console.error('Error searching venues:', error);
      showNotification('Error searching venues. Please try again.', 'error');
  }
}

// Render the venues to the page
// Render the filtered venues to the page
function renderVenues(venues) {
  const list = document.getElementById('venuesList');
  if (!list) return;

  if (venues.length === 0) {
      list.innerHTML = '<p>No venues found matching the filters.</p>';
  } else {
      list.innerHTML = venues.map(venue => {
          const imageUrl = venue.photos?.[0] 
              ? `${venue.photos[0].prefix}original${venue.photos[0].suffix}` 
              : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80';

          const rawRating = typeof venue.rating === 'number' ? venue.rating : null;
          const convertedRating = rawRating !== null ? (rawRating / 2).toFixed(1) : 'N/A';

          const stars = rawRating !== null ? '★'.repeat(Math.round(rawRating / 2)) : 'No rating';
          const price = venue.price ? '$'.repeat(venue.price) : 'Unknown';

          return `
              <div class="venue-card ${venue.fsq_id === state.event.venue?.fsq_id ? 'selected' : ''}"
              onclick="selectVenue('${venue.fsq_id}')">

                  <img src="${imageUrl}" alt="${venue.name}" class="venue-image">
                  <div class="venue-info">
                      <h3 class="venue-name">${venue.name}</h3>
                      <p class="venue-address">${venue.location.formatted_address || 'Address not available'}</p>
                      <div class="venue-rating">
                          <span class="stars">${stars}</span>
                          <span class="rating-number">${convertedRating} / 5</span>
                          <span class="price-level">${price}</span>
                      </div>
                  </div>
              </div>
          `;
      }).join('');
  }
}


// Select a venue from the list
function selectVenue(fsqId) {
    const selectedVenue = state.venues.find(venue => venue.fsq_id === fsqId);
    if (selectedVenue) {
        state.event.venue = selectedVenue;
        renderVenues();
}}

// Make searchVenues globally accessible for external scripts
window.searchVenues = searchVenues;

// Optionally add a gisLoaded callback function for when the Google Maps API loads
function gisLoaded() {
    console.log("Google Maps API loaded successfully!");
    searchVenues(); // Call the searchVenues function once the API is loaded
}
// venues.js

// Function to get selected filter values
// Function to get selected filter values
function getFilterValues() {
  const ratingFilter = parseFloat(document.getElementById('ratingFilter').value);
  const distanceFilter = parseInt(document.getElementById('distanceFilter').value);
  const priceFilter = parseInt(document.getElementById('priceFilter').value) || null;

  // Log the filter values to verify
  console.log(`Rating: ${ratingFilter}, Distance: ${distanceFilter}, Price: ${priceFilter}`);
  
  return {
      ratingFilter,
      distanceFilter,
      priceFilter
  };
}


// Venue search with Foursquare API
async function searchVenues() {
  try {
      // Get Filter Values from the UI
      const { ratingFilter, distanceFilter, priceFilter } = getFilterValues();
      
      // Log filter values to verify they're set as expected
      console.log(`Rating filter: ${ratingFilter}, Distance filter: ${distanceFilter}, Price filter: ${priceFilter}`);

      // Get User Location
      const position = await getCurrentPosition();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const maxDistance = distanceFilter;

      const params = new URLSearchParams({
          ll: `${latitude},${longitude}`,
          radius: maxDistance,
          categories: '13003,13065', // Venue, event space categories
          sort: 'RATING',
          limit: 10
      });

      const response = await fetch(`${FOURSQUARE_BASE_URL}/places/search?${params}`, {
          headers: {
              'Authorization': FOURSQUARE_API_KEY,
              'Accept': 'application/json'
          }
      });

      const data = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
          throw new Error("Invalid API response format.");
      }

      // Fetch Venue Details for Each Venue
      const venueDetailsPromises = data.results.map(async (venue) => {
          try {
              const detailsResponse = await fetch(`${FOURSQUARE_BASE_URL}/places/${venue.fsq_id}?fields=rating,price`, {
                  headers: {
                      'Authorization': FOURSQUARE_API_KEY,
                      'Accept': 'application/json'
                  }
              });

              const details = await detailsResponse.json();
              
              return {
                  ...venue,
                  rating: details.rating !== undefined ? details.rating : null,
                  price: details.price !== undefined ? details.price : null
              };
          } catch (error) {
              console.error(`Error fetching details for venue ${venue.fsq_id}:`, error);
              return venue;
          }
      });

      state.venues = await Promise.all(venueDetailsPromises);

      // Log raw venue data (for debugging)
      console.log("Raw venues data:", state.venues);

      // Apply filters to the venues
      const filteredVenues = state.venues.filter((venue) => {
          const ratingValid = venue.rating >= ratingFilter;
          const priceValid = priceFilter ? venue.price === priceFilter : true;
          const distanceValid = venue.distance <= distanceFilter;

          // Log each venue's filter validation for debugging
          console.log(`Venue ${venue.fsq_id} rating: ${venue.rating}, price: ${venue.price}, distance: ${venue.distance}`);
          console.log(`Rating valid: ${ratingValid}, Price valid: ${priceValid}, Distance valid: ${distanceValid}`);

          return ratingValid && priceValid && distanceValid;
      });

      // Log the filtered venues
      console.log("Filtered venues:", filteredVenues);

      // Simplify the sorting logic first to focus on rating only
      filteredVenues.sort((a, b) => {
          const ratingA = a.rating !== null && a.rating !== undefined ? parseFloat(a.rating) : 0;
          const ratingB = b.rating !== null && b.rating !== undefined ? parseFloat(b.rating) : 0;

          console.log(`Sorting ratings: ${ratingA} vs ${ratingB}`);  // Log the ratings comparison

          return ratingB - ratingA;  // Sort by rating (descending)
      });

      // Log the sorted venues to ensure proper sorting
      console.log("Sorted venues:", filteredVenues);

      // Render the filtered and sorted venues
      renderVenues(filteredVenues);

  } catch (error) {
      console.error('Error searching venues:', error);
      showNotification('Error searching venues. Please try again.', 'error');
  }
}


// Render the venues to the page
// Render the filtered venues to the page
function renderVenues(venues) {
  const list = document.getElementById('venuesList');
  if (!list) return;

  if (venues.length === 0) {
      list.innerHTML = '<p>No venues found matching the filters.</p>';
  } else {
      list.innerHTML = venues.map(venue => {
          const imageUrl = venue.photos?.[0]
              ? `${venue.photos[0].prefix}original${venue.photos[0].suffix}`
              : 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80';

          const rawRating = typeof venue.rating === 'number' ? venue.rating : null;
          const convertedRating = rawRating !== null ? (rawRating / 2).toFixed(1) : 'N/A';

          const stars = rawRating !== null ? '★'.repeat(Math.round(rawRating / 2)) : 'No rating';
          const price = venue.price ? '$'.repeat(venue.price) : 'Unknown';

          return `
              <div class="venue-card ${venue.fsq_id === state.event.venue?.fsq_id ? 'selected' : ''}"
              onclick="selectVenue('${venue.fsq_id}')">

                  <img src="${imageUrl}" alt="${venue.name}" class="venue-image">
                  <div class="venue-info">
                      <h3 class="venue-name">${venue.name}</h3>
                      <p class="venue-address">${venue.location.formatted_address || 'Address not available'}</p>
                      <div class="venue-rating">
                          <span class="stars">${stars}</span>
                          <span class="rating-number">${convertedRating} / 5</span>
                          <span class="price-level">${price}</span>
                      </div>
                  </div>
              </div>
          `;
      }).join('');
  }
}


// Select a venue from the list
function selectVenue(fsqId) {
  const selectedVenue = state.venues.find(venue => venue.fsq_id === fsqId);
  if (selectedVenue) {
      state.event.venue = selectedVenue;
      renderVenues(state.venues);
}
}
// Make searchVenues globally accessible for external scripts
window.searchVenues = searchVenues;

// Optionally add a gisLoaded callback function for when the Google Maps API loads
function gisLoaded() {
  console.log("Google Maps API loaded successfully!");
  searchVenues(); // Call the searchVenues function once the API is loaded
}
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by this browser."));
          return;
      }

      navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(new Error("Error retrieving location: " + error.message))
      );
  });
}
