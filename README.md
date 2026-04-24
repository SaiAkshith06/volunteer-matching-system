# Smart Resource Allocation Dashboard

**Status:** Production-ready prototype

## Problem Statement
In crisis management and community volunteering, matching the right skills to urgent needs is often a slow, manual, and error-prone process. Organizations rely on spreadsheets, resulting in low coverage, misallocated resources, and delays in critical emergency response.

## Solution Overview
This Smart Resource Allocation dashboard automates and optimizes volunteer coordination using an intelligent, multi-factor matching engine. It replaces time-consuming manual workflows with real-time, data-driven decisions that prioritize urgency, skills, location, availability, workload, and historical reliability.

## Key Features
- **Real-time Match Generation:** Instantly ranks and pairs volunteers with needs under 5 seconds.
- **Dynamic Filtering & Sorting:** Quickly find top matches by score, high urgency, or required skills.
- **Interactive Map Visualization:** Google Maps integration with intelligent marker clustering to visualize the physical spread of resources and assignments.
- **Smart Assignment & Feedback Loop:** Auto-assign the best volunteers while tracking outcomes and updating reliability scores.
- **Data Imports & Exports:** Bulk import volunteer and need data via CSV and export assignment reports for on-the-ground action.

## Algorithm Explanation
Our intelligent matching algorithm evaluates pairs across six key dimensions:
1. **Skills Match:** Does the volunteer have the exact skills required, and what is their proficiency level?
2. **Location Proximity:** Calculates actual distance using coordinates to prioritize nearby volunteers.
3. **Availability Overlap:** Ensures the volunteer's time window matches the required timeframe.
4. **Urgency & Deadline:** Prioritizes high-stakes needs and boosts the score as deadlines approach.
5. **Workload Limits:** Avoids burning out volunteers by capping their active task count.
6. **Reliability Score:** Rewards volunteers with a proven track record of successful assignments.

The engine normalizes and combines these factors using a weighted scoring system (e.g., Emergency Mode prioritizes Urgency and Skills) to output a single confidence score from 0 to 100.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Mapping:** `@react-google-maps/api`
- **Data Handling:** `papaparse` for CSV parsing
- **Icons:** `lucide-react`

## Setup Instructions

1. Clone the repository and navigate into it:
   ```bash
   git clone <repo_url>
   cd volunteer-matching-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Google Maps API Key:
   - Create a `.env` file in the root directory.
   - Add your API key:
     ```env
     VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Scenarios
The dashboard comes with pre-loaded, realistic data sets to test the system without manual input:
- **Flood Relief Scenario:** High-urgency logistics and medical tasks focused around riverbank and highway zones.
- **Education Scenario:** Tutoring and IT setup requirements across university campuses and suburban areas.
- **Medical Emergency Scenario:** Critical first-aid and hospital support needs spanning city clinics.

## Screenshots / GIF
*(Include screenshots or GIFs of the interactive map, the matching cards, and CSV upload features here)*
