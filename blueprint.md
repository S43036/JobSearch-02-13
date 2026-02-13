# Project Blueprint: AI-Powered Job Matching App

## Overview

An interactive web application to help PMET job seekers in Singapore find relevant job opportunities based on their resumes. The application will analyze an uploaded resume, match it against a list of job openings, and provide a percentage match score. It will also offer links to the job portals for application.

## Implemented Features (v1.0)

This is the initial version of the application. The following features are planned for the first iteration.

### Core Functionality

*   **Resume Upload:** Users can upload their resume as a plain text file.
*   **Job Matching:** The application will parse the resume for keywords and match them against a predefined list of job opportunities.
*   **Job Listings:** Matched jobs will be displayed with details, including title, company, a short description, and a matching score.
*   **Apply Link:** Each job listing will have a link to an external job portal for the user to apply.

### Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **UI Library:** Material-UI (MUI) for a clean and modern user interface.
*   **Styling:** CSS-in-JS with Emotion (comes with MUI).
*   **State Management:** React Hooks (`useState`, `useContext`).

### Design & Aesthetics

*   **Layout:** A clean, single-page layout with clear sections for resume upload and job listings.
*   **Color Scheme:** A professional and modern color palette.
*   **Typography:** Clear and readable fonts.
*   **Iconography:** Icons from MUI's library to enhance user experience.

## Current Plan: Initial Setup and UI

1.  **Acknowledge Contradiction:** Address the user's "no React" request and explain the decision to proceed with the existing React environment.
2.  **Project Cleanup:** Remove the default boilerplate code and styles.
3.  **Install Dependencies:** Add Material-UI to the project.
4.  **Create Component Structure:**
    *   `src/App.tsx`: Main application component.
    *   `src/components/Header.tsx`: Header component.
    *   `src/components/ResumeUpload.tsx`: Component for handling file uploads.
    *   `src/components/JobList.tsx`: Component to display job listings.
    *   `src/components/JobCard.tsx`: Component for a single job item.
5.  **Create Mock Job Data:** Create a `jobs.json` file with sample job data for Singapore PMET roles.
6.  **Implement Basic UI:** Build the static UI for the application using MUI components without any logic first.
