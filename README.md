# CogniFlow
live demo-https://cogniflow-client.onrender.com

CogniFlow is a production-ready, full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) that seamlessly integrates **CogniBot**, an intelligent native AI assistant powered by Google Gemini.

This repository contains a React + Vite frontend and a Node.js + Express backend with features for real-time group and individual messaging (Socket.IO), native multimodal AI integration, Cloudinary file uploads, read receipts, and typing indicators.

Quick links
- Backend server: [server/index.js](server/index.js)
- AI Client Configuration: [server/utils/aiClient.js](server/utils/aiClient.js)
- Message Controller (AI Trigger): [server/controllers/Message/sendMessage.js](server/controllers/Message/sendMessage.js)
- Socket Handlers: [server/socket/socketHandler.js](server/socket/socketHandler.js)
- Frontend Chat Container: [client/src/components/chat/ChatContainer.jsx](client/src/components/chat/ChatContainer.jsx)
- Message Model: [server/models/Message.js](server/models/Message.js)

---

## Features

- **Real-time Messaging:** Lightning-fast communication powered by Socket.io.
- **Native AI Assistant (CogniBot):** Chat directly with an intelligent AI. Tag `@cogni` in any group chat to get instant AI assistance.
- **Multimodal AI Vision:** Upload an image or PDF, and CogniBot can "see" and analyze the attachment directly in the chat!
- **Read Receipts:** WhatsApp-style checkmarks (1 for Sent, 2 Gray for Delivered, 2 Blue for Read).
- **Live Typing Indicators:** Real-time animated typing dots when a human or CogniBot is generating a message.
- **File Attachments:** Share images and documents seamlessly (powered by Cloudinary).
- **Group Chats:** Create rooms, add members, and collaborate efficiently.
- **Online Presence:** Real-time status indicators for online users.
- **Beautiful UI/UX:** Built with TailwindCSS, featuring smooth glassmorphic elements, dark mode, responsive design, and React-Markdown for rich text formatting.

---

## Quick start (local)

1. Clone repo:
   ```bash
   git clone <repo-url>
   cd CogniFlow
   ```

2. Backend
   ```bash
   cd server
   npm install
   # Create a .env file and fill in values (see Environment section)
   npm start
   ```

3. Frontend
   ```bash
   cd client
   npm install
   # Create a .env file and set VITE_BACKEND_URL
   npm run dev
   ```

Frontend default: http://localhost:5173  
Backend default: http://localhost:3000

---

## Environment variables

Backend (`server/.env`) — minimal required keys:
- `PORT=3000`
- `MONGODB_URI=...` (Mongo Atlas connection)
- `JWT_SECRET=...`
- `CLOUDINARY_CLOUD_NAME=...`
- `CLOUDINARY_API_KEY=...`
- `CLOUDINARY_API_SECRET=...`
- `GEMINI_API_KEY=...` (Google Generative AI key for CogniBot)

Frontend (`client/.env`):
- `VITE_BACKEND_URL=http://localhost:3000`

---

## AI Integration (Production notes)

This project uses Google's `gemma-4-26b-a4b-it` model via the `@google/generative-ai` SDK.

Checklist:
- Add `GEMINI_API_KEY` to backend `.env`.
- Ensure the AI receives messages dynamically in `server/controllers/Message/sendMessage.js`.
- For image attachments, the AI securely downloads the file via Cloudinary URL, converts it to base64, and passes it via `inlineData` to the model.

Files:
- Initialization & Parsing: [server/utils/aiClient.js](server/utils/aiClient.js)
- Socket Emit: [server/socket/socketHandler.js](server/socket/socketHandler.js)

---

## Common troubleshooting

- AI Error "Must supply api_key": Ensure `dotenv.config()` is initialized *before* importing any SDKs like Cloudinary or Gemini.
- Verification/Cloudinary errors: Ensure your Cloudinary credentials are correct and match your `.env` variables.
- Typing indicator doesn't clear: Ensure socket events `typing` and `stop typing` are correctly matched to room IDs.
- React-Markdown not rendering: Ensure you have run `npm install react-markdown remark-gfm` in the `client` directory.

---

## API reference (high level)

Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Log into an existing account

Users
- `GET /api/users/search` — Search for users to message

Messages & Rooms
- `GET /api/rooms` — Fetch user's chat rooms
- `POST /api/rooms` — Create a new chat or group room
- `GET /api/messages/:roomId` — Fetch messages for a specific room
- `POST /api/messages` — Send a message (Triggers CogniBot if AI is mentioned or in DM)
- `PUT /api/messages/:id` — Edit a message
- `DELETE /api/messages/:id` — Delete a message

Uploads
- `POST /api/upload` — Upload an attachment (returns Cloudinary file URL and Resource Type)

---

## Deploy & share

- Frontend: Vercel/Render/Netlify. Set `VITE_BACKEND_URL` to backend production URL.
- Backend: Render/Heroku/DigitalOcean. Set env vars in the deployment dashboard.
- For public testing from local, use a tunnel (ngrok) and set `VITE_BACKEND_URL` to the public URL.

---

## Project maintenance

- Run server: `cd server && npm start`
- Run client: `cd client && npm run dev`
- Build frontend: `cd client && npm run build`

---

## Contributing

1. Fork → feature branch → PR
2. Add tests for new behavior
3. Include screenshots and step-by-step reproduction if fixing bugs

---

## Contacts & Support

Project emails: shashankmuz3@gmail.com  
For deployment or AI model help, check the Render dashboard logs or Google AI Studio.

---

## License

MIT License

Copyright (c) 2026 @Shashank028R

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
