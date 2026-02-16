# Real-Time Poll Rooms

A production-ready MERN stack application for creating and sharing real-time polls with fairness controls.

## 🚀 Live Demo

- **Backend (API & Realtime Server)**  
  https://real-time-poll-rooms-p8ws.onrender.com/

- **Frontend (Web App)**  
  https://real-time-poll-rooms-sigma.vercel.app/

# First open backend then open frontend.
---

## Features

- **Authentication**: JWT-based login and signup.  
- **User Dashboard**: Create polls and manage shared polls.  
- **Real-Time Results**: Live animated result bars using Socket.IO.  
- **Public Poll Page**: Anyone with a link can vote once.  
- **Fairness Mechanisms**:
  - **IP-based Restriction**: Prevents multiple votes from the same IP address.  
  - **Browser-based Lock**: Uses a unique browser ID stored in localStorage to block repeat votes from the same browser.  
- **Responsive Design**: Modern, sleek UI that works on all devices.

---

## Tech Stack

- **Frontend**: React (Vite) + Framer Motion + Lucide Icons  
- **Backend**: Node.js + Express + Socket.IO  
- **Database**: MongoDB (Mongoose)  
- **Auth**: JSON Web Tokens (JWT)

---

## Fairness Mechanisms Explained

1. **IP-based restriction**  
   The backend captures the user's IP address and stores it in the `votes` collection alongside the `pollId`. Before a vote is recorded, the server checks if a vote with the same `pollId + ipAddress` already exists.

2. **Browser-based lock**  
   Upon the first visit, a unique UUID is generated and stored in the user's `localStorage` as `poll_browser_id`. When voting, this ID is sent to the backend. The backend validates if this `browserId` has already voted for the specific poll.

---

## Edge Cases Handled

- **Duplicate Voting**: Validated on both frontend (UI disable) and backend (DB constraint check).  
- **Invalid Polls**: "Poll not found" state for deleted or non-existent poll IDs.  
- **Validation**: Minimum of 2 options required, prevents empty questions/options.  
- **Concurrency**: Socket.IO ensures all clients see the same state simultaneously without page refreshes.

---

## Installation & Setup

### Prerequisites
- Node.js installed  
- MongoDB Atlas account or local MongoDB instance  

### Backend Setup
1. Navigate to the `server` folder.  
2. Run `npm install`.  
3. Create a `.env` file:
