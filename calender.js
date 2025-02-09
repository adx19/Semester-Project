// Google Calendar API Configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with actual client ID
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with actual API key
const GOOGLE_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar';

// Initialize variables
let gapiInited = false;
let gisInited = false;

// Load the GAPI client and auth2 client when the page is ready
function gapiLoaded() {
    console.log("gapiLoaded called");
    gapi.load('client:auth2', initializeGapiClient);
}

// Initialize the GAPI client
async function initializeGapiClient() {
    try {
        // Initialize the Google API client with the API key and discovery docs
        await gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            discoveryDocs: [GOOGLE_DISCOVERY_DOC],
        });
        gapiInited = true;
        console.log('gapi client initialized');

        // Initialize OAuth2 client for authentication
        await gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
        });

        gisInited = true;
        console.log('OAuth client initialized');
        maybeEnableButtons();
    } catch (error) {
        console.error("Error initializing Google API client:", error);
    }
}

// Function to enable the "Add Event" button once API is ready
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById("authorize_button").disabled = false;
    }
}

// Function to create a Google Calendar event
async function createCalendarEvent() {
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventDescription = document.getElementById('eventDescription').value;

    // Validate inputs
    if (!eventTitle || !eventDate || !eventTime) {
        alert('Please fill in all the fields.');
        return;
    }

    // Ensure user is authenticated before creating an event
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
        try {
            console.log('Not signed in. Signing in...');
            await authInstance.signIn();
            console.log('User signed in.');
        } catch (error) {
            console.error("Error signing in:", error);
            alert('Failed to sign in. Please try again.');
            return;
        }
    }

    // Prepare event data
    const startTime = `${eventDate}T${eventTime}:00`;
    const endTime = `${eventDate}T${parseInt(eventTime.split(':')[0]) + 1}:${eventTime.split(':')[1]}:00`;

    const event = {
        summary: eventTitle,
        description: eventDescription,
        start: {
            dateTime: startTime,
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: endTime,
            timeZone: 'America/Los_Angeles',
        },
    };

    // Insert the event into the Google Calendar
    try {
        const response = await gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        console.log('Event created:', response.result.htmlLink);
        alert('Event successfully created!');
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Error creating event: ' + (error.message || 'Unknown error'));
    }
}

// Event listener to trigger the event creation
document.getElementById("create_event_button").addEventListener("click", createCalendarEvent);

// Initializing the Google API when the page is loaded
window.onload = gapiLoaded;
