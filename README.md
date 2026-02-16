# Real-Time Poll Rooms

A production-ready MERN stack application for creating and sharing real-time polls with fairness controls.

## Features

- **Authentication**: JWT-based login and signup.
- **User Dashboard**: Create polls and manage shared polls.
- **Real-Time Results**: Live animated result bars using Socket.IO.
- **Public Poll Page**: Anyone with a link can vote once.
- **Fairness Mechanisms**:
  - **IP-based Restriction**: Prevents multiple votes from the same IP address.
  - **Browser-based Lock**: Uses a unique browser ID stored in localStorage to block repeat votes from the same browser.
- **Responsive Design**: Modern, sleek UI that works on all devices.

## Tech Stack

- **Frontend**: React (Vite) + Framer Motion + Lucide Icons
- **Backend**: Node.js + Express + Socket.IO
- **Database**: MongoDB (Mongoose)
- **Auth**: JSON Web Tokens (JWT)

## Fairness Mechanisms Explained

1. **IP-based restriction**: The backend captures the user's IP address and stores it in the `votes` collection alongside the `pollId`. Before a vote is recorded, the server checks if a vote with the same `pollId + ipAddress` already exists.
2. **Browser-based lock**: Upon the first visit, a unique UUID is generated and stored in the user's `localStorage` as `poll_browser_id`. When voting, this ID is sent to the backend. The backend validates if this `browserId` has already voted for the specific poll.

## Edge Cases Handled

- **Duplicate Voting**: Validated on both frontend (UI disable) and backend (DB constraint check).
- **Invalid Polls**: "Poll not found" state for deleted or non-existent poll IDs.
- **Validation**: Minimum of 2 options required, prevents empty questions/options.
- **Concurrency**: Socket.IO ensures all clients see the same state simultaneously without page refreshes.

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account or local MongoDB instance

### Backend Setup
1. Navigate to the `server` folder.
2. Run `npm install`.
3. Create a `.env` file (copy from `.env.example` if provided):
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ```
4. Run `npm run dev`.

### Frontend Setup
1. Navigate to the `client` folder.
2. Run `npm install`.
3. Create a `.env` file:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```
4. Run `npm run dev`.

## Known Limitations & Future Improvements

- **Scalability**: For very high traffic, Redis could be used as a Socket.IO adapter.
- **Analytics**: Adding more detailed vote analytics (e.g., location, time of day).
- **Social Sharing**: Direct integration with Twitter/Facebook APIs for sharing.
- **Customization**: Allow users to set poll expiration dates or private polls.
