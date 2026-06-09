# CogniFlow

CogniFlow is a modern, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) that seamlessly integrates **CogniBot**, an intelligent native AI assistant powered by Google Gemini. 

It goes beyond standard messaging apps by letting you interact with an advanced AI directly within your individual and group chats—whether you need questions answered, documents analyzed, or images described.

## ✨ Key Features

* **Real-time Messaging:** Lightning-fast communication powered by Socket.io.
* **Native AI Assistant (CogniBot):** Chat directly with an intelligent AI. Tag `@cogni` in any group chat to get instant AI assistance.
* **Multimodal AI Vision:** Upload an image or PDF, and CogniBot can "see" and analyze the attachment directly in the chat!
* **Read Receipts:** WhatsApp-style checkmarks (1 for Sent, 2 Gray for Delivered, 2 Blue for Read).
* **Live Typing Indicators:** Real-time animated typing dots when a human or CogniBot is generating a message.
* **File Attachments:** Share images and documents seamlessly (powered by Cloudinary).
* **Group Chats:** Create rooms, add members, and collaborate efficiently.
* **Online Presence:** Real-time status indicators for online users.
* **Beautiful UI/UX:** Built with TailwindCSS, featuring smooth glassmorphic elements, dark mode, and responsive design.

## 🛠️ Technology Stack

* **Frontend:** React (Vite), TailwindCSS, Lucide Icons, Socket.io-client, React-Markdown.
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.io.
* **AI Integration:** `@google/generative-ai` (using `gemma-4-26b-a4b-it` model).
* **Storage:** Cloudinary (for profile pictures and attachments).

## 🚀 Running Locally

Follow these instructions to set up the project on your local machine.

### Prerequisites
* Node.js installed
* MongoDB connection URI
* Cloudinary API keys
* Google Gemini API key

### 1. Clone the repository
\`\`\`bash
git clone <your-repository-url>
cd CogniFlow
\`\`\`

### 2. Backend Setup
Navigate to the server directory, install dependencies, and configure environment variables.
\`\`\`bash
cd server
npm install
\`\`\`

Create a `.env` file in the `server` directory and add the following keys:
\`\`\`env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
\`\`\`

Start the backend development server:
\`\`\`bash
npm start
\`\`\`

### 3. Frontend Setup
Open a new terminal window, navigate to the client directory, install dependencies, and configure environment variables.
\`\`\`bash
cd client
npm install
\`\`\`

Create a `.env` file in the `client` directory and add the following:
\`\`\`env
VITE_BACKEND_URL=http://localhost:3000
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

### 4. Access the App
Open your browser and navigate to `http://localhost:5173`. Create an account, log in, and start chatting with your friends and CogniBot!

---

*Note: This project is meant for demonstration and educational purposes. Ensure your API keys are kept secure and never pushed to public repositories.*
