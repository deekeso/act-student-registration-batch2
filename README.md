# Regiplus: Student Registration System

A Vue.js application for managing student registrations. This project demonstrates various Vue.js features including data binding, components, routing, state management with Pinia, and more.

## Features

- **Student Registration Form**: Collect and validate student information
- **Student Management**: View, edit, and delete student records
- **Responsive Design**: Works on all device sizes
- **Local Storage**: Persists data using Pinia with localStorage
- **Component Communication**: Uses props and events for component interaction

## Technical Implementation

This project demonstrates the following concepts:

- **Data Binding**: Two-way binding with `v-model`
- **Conditionals**: `v-if`/`v-else` for conditional rendering
- **Iterations**: `v-for` to display lists of data
- **Methods**: Form validation and submission handling
- **Computed Properties**: Derived state (ex. filtered students)
- **Watch Properties**: Monitors changes to reactive data
- **Components**: Modular UI components with props
- **Props**: Component communication
- **Routing**: Page navigation with `vue-router`
- **Emit Events**: Component communication
- **Local Storage**: Data persistence with Pinia

## Project Structure

```
regiplus/
├── src/
│   ├── assets/          # Static assets and global CSS
│   ├── components/      # Reusable Vue components
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores for state management
│   ├── views/           # Page components
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```

## Components

- **StudentCard**: Displays student information in a card layout
   - **StudentForm**: Form used for drawer
- **StudentDrawer**: Slide-in panel for adding/editing students
- **ConfirmationModal**: Reusable confirmation dialog

## Student Data Structure

```javascript
{
  id: Number,
  firstName: String,
  middleInitial: String,
  lastName: String,
  birthDate: String,
  age: Number,
  address: String,
  course: String,
  createdAt: String,
  updatedAt: String
}
```

## Available Courses

- Bachelor of Science in Information Technology
- Bachelor of Science in Computer Science
- Bachelor of Science in Tourism
- Bachelor of Science in Hotel and Restaurant Management
- Bachelor of Science in Nursing

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Build for production:
   ```
   npm run build
   ```
5. Termination can be done in the terminal through `CTRL + C`.