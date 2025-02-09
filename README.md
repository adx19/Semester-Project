Event Planner Web App
This is a simple Event Planner Web App that allows users to create and manage events. It integrates with Google Calendar, allowing users to add events to their calendar directly from the web app.

Features
Create Events: Users can input event details such as title, date, time, and description.
Google Calendar Integration: Allows users to create events in their Google Calendar.
Local Storage: Event data can be saved in local storage for persistence between sessions (on the same browser).
Requirements
Google Developer API Key: You will need to set up the Google Calendar API and generate a Client ID and API key for the app to interact with Google services.
Local Server: You must run the app using a local server, as Google APIs require an HTTPS connection or local server for development.
Setting Up Google API
To set up the Google Calendar API for your app, follow these steps:

Create a Project in Google Cloud Console:

Visit the Google Cloud Console.
Create a new project and enable the Google Calendar API.
Create OAuth 2.0 Credentials:

Navigate to APIs & Services > Credentials.
Create OAuth 2.0 Client ID for a Web Application.
Add http://127.0.0.1:5500 (or your local server URL) to Authorized JavaScript Origins.
Copy the Client ID and API Key.
Configure the App:

Replace GOOGLE_CLIENT_ID and GOOGLE_API_KEY in the calendar.js file with your credentials.
How to Run
Clone the repository to your local machine.
Open the folder and start a local server (using tools like Live Server in Visual Studio Code or another local server).
Open the browser and go to http://127.0.0.1:5500/index.html.
The user can fill out the event details (title, date, time, and description) and add it to their Google Calendar.
Files
index.html
The main HTML file that contains the event creation form.

calendar.js
Handles the creation of Google Calendar events and stores event data locally. The app uses Google Calendar API for event creation.

Notes:
Google Sign-In Feature: The app does not include a sign-in feature for Google accounts. Instead, it uses a pre-configured API key to create events directly into the user’s Google Calendar without authentication.
Event Creation: Users can create events by entering the event details, which are sent to their Google Calendar. If the event is successfully created, a confirmation will be displayed.
