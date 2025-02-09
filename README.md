# Event Planner Web App

This Event Planner Web App is a simple web application that helps users plan their events by integrating with the Google Calendar API. The app allows users to manage their events, view their calendar, and create new events. Users can sign in with their Google account to access their Google Calendar data securely.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Get Google API Credentials](#2-get-google-api-credentials)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Open the Application](#4-open-the-application)
- [How It Works](#how-it-works)
- [Code Structure](#code-structure)
- [JavaScript Functions](#javascript-functions)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Google Sign-In Integration**: Users can sign in to the app using their Google account to authenticate and access Google Calendar.
- **View Google Calendar Events**: Once signed in, users can view a list of events from their Google Calendar.
- **Create Events in Google Calendar**: Users can add new events directly to their Google Calendar.
- **Responsive Design**: The app's interface is designed to be mobile-friendly and responsive.
- **Animated UI**: Smooth transitions and animations are used to improve user experience.

## Technologies Used

- **HTML5**: For the structure of the web app.
- **CSS3**: For styling and animations.
- **JavaScript**: For handling authentication, API requests, and dynamic behavior.
- **Google API Client Library**: To interact with Google Calendar and authenticate users.
- **Google OAuth 2.0**: For user authentication and authorization.

## Prerequisites

Before running the project, ensure that you have:

- A **Google Cloud Platform (GCP)** account.
- A **Google Cloud project** with the **Google Calendar API** enabled.
- A **Google OAuth 2.0 client ID** and **API key** generated for your project in the Google Developer Console.

### Steps to Set Up Google API Credentials

1. Go to the **Google Developer Console**: [https://console.developers.google.com/](https://console.developers.google.com/).
2. Create a new project or use an existing project.
3. Enable the **Google Calendar API** under the "Library" section.
4. In the **Credentials** section, create an OAuth 2.0 Client ID for **Web Application** and configure the **redirect URIs**.
5. Obtain your **API Key** and **OAuth 2.0 Client ID**. You'll need these to interact with the Google Calendar API and authenticate users.

## Setup

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/event-planner-web-app.git
cd event-planner-web-app
