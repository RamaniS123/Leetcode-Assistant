# Leetcode Assistant
Leetcode Assistant is an AI-powered Chrome Extension that helps users tackle LeetCode problems more effectively. It enhances the problem-solving experience by offering contextual explanations, hints, and coaching suggestions directly on problem pages. The backend is powered by a Spring Boot REST API deployed on Render, and it uses Google’s Gemini API to generate intelligent responses based on the active problem URL.

# Final UI Design (Figma Prototype): 
Here's the original Figma prototype that guided the UI for the LeetCode Assistant Chrome Extension.

<img width="611" height="727" alt="image" src="https://github.com/user-attachments/assets/fdd0e71a-e570-482b-ad1c-2f3bfad0bfe1" />

# Features
• AI-Driven Assistance – Get real-time explanations, hints, and coaching suggestions for any LeetCode problem via the Gemini API

• Context-Aware Backend – Sends the active problem URL to the backend to generate accurate and relevant responses

• Browser Integration – Works seamlessly as a Chrome Extension right on LeetCode.com problem pages

• Offline Notes – Save and manage personal notes for each problem using Chrome local storage.

• Responsive UI – Clean and minimal interface built with vanilla HTML/CSS and simple JS.

• Serverless Hosting – Java Spring Boot backend is deployed via Docker on Render with API access.

# Demo 
### Explain Problem:

![Explain problem](https://i.imgur.com/QEVjl4r.gif)

### Get a Hint: 

![Get a hint](https://i.imgur.com/o1WN3xs.gif)

### Coach Step by Step: 

![Coach step by step](https://i.imgur.com/CDcko6k.gif)

### Write Custom Notes for Each Problem: 

![Write custom notes](https://i.imgur.com/DMEwzMQ.gif)

### Notes Persist Across Sessions: 
Notes are saved locally per problem and automatically loaded when revisiting.

 ![Notes persistence](https://i.imgur.com/KLKyy5p.gif)

### Clear Note: 

![Clear note](https://i.imgur.com/WkoF4uD.gif)

# What I Learned 
• How to build and deploy a Spring Boot REST API with Docker.

• Connecting Chrome Extensions to external backends using fetch.

• Using Gemini (Google's LLM) to generate useful content from minimal context.

• Working with Chrome Extension APIs like chrome.tabs and chrome.storage.local.

• Managing local state and rendering UI conditionally inside content scripts.

• Debugging and deploying full-stack integrations with Render.

# Prerequisites: 
Before using or testing this extension locally, ensure you have:

• A Chromium-based browser (e.g. Chrome or Edge)
  
• A code editor like VS Code (recommended)

# Installation: 

To test or run the LeetCode Assistant Chrome Extension locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Leetcode-Assistant.git

2. Open Chrome and navigate to `chrome://extensions`

3. Enable Devloper Mode (toggle in top right)

4. Click "Load unpacked" and select the extension's root directory

5. Navigate to any LeetCode problem page (e.g. https://leetcode.com/problems/two-sum) to see the extension in action

   * The extension communicates with the backend hosted at:
     `https://leetcode-assistant-3k7w.onrender.com`
   No local backend setup is required.
    
