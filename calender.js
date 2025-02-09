// Google Calendar API Configuration
const GOOGLE_CLIENT_ID = '486635642141-jvn5o191ua23vj8arf16ms6hkjddcit8.apps.googleusercontent.com'; // Replace with actual client ID
const GOOGLE_API_KEY = 'AIzaSyDMmN5TG0hagBdemDfnlr70QDDjVwgclPI'; // Replace with actual API key
const GOOGLE_DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/calendar';

let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    console.log("gapiLoaded called");
    gapi.load('client:auth2', initializeGapiClient);
}

async function initializeGapiClient() {
    try {
        // Initialize the gapi client
        await gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            discoveryDocs: [GOOGLE_DISCOVERY_DOC],
        });
        gapiInited = true;
        console.log('gapi client initialized');

        // Initialize the auth2 client
        await gapi.auth2.init({
            client_id: GOOGLE_CLIENT_ID,
        });

        gisInited = true;
        console.log('OAuth client initialized');
        
        // Enable the "authorize" button once both the client and auth are initialized
        maybeEnableButtons();
    } catch (error) {
        console.error("Error initializing Google API client:", error);
    }
}

// Enable button once both the APIs are loaded
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById("authorize_button").disabled = false;
    }
}

// Handle sign-in and authorization button click
async function handleAuthClick(event) {
    if (gapiInited && gisInited) {
        const authInstance = gapi.auth2.getAuthInstance();

        if (!authInstance) {
            console.error('authInstance is undefined!');
            return;
        }

        if (!authInstance.isSignedIn.get()) {
            try {
                console.log('Not signed in. Signing in...');
                await authInstance.signIn();
                console.log('User signed in.');
                maybeEnableButtons();
            } catch (error) {
                console.error("Error signing in:", error);
                alert('Failed to sign in. Please try again.');
            }
        } else {
            console.log("User already signed in.");
        }
    } else {
        console.error('gapi.auth2 is not initialized or not ready.');
    }
}

// Google Calendar Integration - Create Event
async function createCalendarEvent() {
    if (!gapiInited || !gisInited) {
        console.error("Google API not initialized yet.");
        return;
    }

    const eventTitle = document.getElementById('eventTitle').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventDescription = document.getElementById('eventDescription').value;

    // Ensure the user is authenticated before creating the event
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

    // Create event if signed in
    try {
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

// Example usage of tokenClient initialization
function saveToLocalStorage() {
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventDescription = document.getElementById('eventDescription').value;

    const eventData = {
        title: eventTitle,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
    };

    localStorage.setItem('eventData', JSON.stringify(eventData));
}

// Load values from localStorage (if available)
function loadFromLocalStorage() {
    const eventData = JSON.parse(localStorage.getItem('eventData'));

    if (eventData) {
        document.getElementById('eventTitle').value = eventData.title || '';
        document.getElementById('eventDate').value = eventData.date || '';
        document.getElementById('eventTime').value = eventData.time || '';
        document.getElementById('eventDescription').value = eventData.description || '';
    }
}

// Event listeners for input fields to save data in localStorage
document.getElementById('eventTitle').addEventListener('input', saveToLocalStorage);
document.getElementById('eventDate').addEventListener('input', saveToLocalStorage);
document.getElementById('eventTime').addEventListener('input', saveToLocalStorage);
document.getElementById('eventDescription').addEventListener('input', saveToLocalStorage);
