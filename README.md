
# Design Assistant

A Next.js application that uses AI to help users create beautiful designs and find appropriate templates for their design needs.

## Overview

Design Assistant is an AI-powered web application that helps users with their design needs. Users can describe what they're looking for, and the assistant will provide recommendations, design advice, and suggest relevant templates from the template library.

## Features

- **AI-Powered Chat Interface**: Communicate with the design assistant using natural language
- **Template Recommendations**: Get personalized template suggestions based on your requirements
- **Design Advice**: Receive professional design guidance for logos, websites, posters, and more
- **User Authentication**: Save your design history and preferences
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Choose between light and dark themes

## Technical Architecture

The application is built with:

- **Next.js**: React framework with App Router for the frontend and API routes
- **AI SDK**: Integration with OpenAI and DeepSeek for AI capabilities
- **Tailwind CSS**: For styling and responsive design
- **shadcn/ui**: Component library for UI elements
- **TypeScript**: For type safety and better developer experience

### Key Components

- **Chat Interface**: Real-time communication with the AI assistant
- **Template Gallery**: Browse and search design templates
- **Design History**: View past design requests and responses
- **Authentication System**: User registration and login

## Setup Instructions

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenAI API key (optional, app works in mock mode without it)
- DeepSeek API key (optional, for fallback)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/design-assistant.git
   cd design-assistant
