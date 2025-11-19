# Registration System

Modern registration form with validation and Selenium automation testing.

## Quick Start

### Run Web Application
Open `src/main/resources/index.html` in your browser

### Run Tests (IntelliJ IDEA)
1. Open project in IntelliJ IDEA
2. Right-click `RegistrationFormTest.java` → Run

## Project Structure
```
├── src/main/resources/
│   ├── index.html          # Registration form
│   ├── styles.css          # Styling
│   └── script.js           # Validation logic
├── src/test/java/
│   └── RegistrationFormTest.java  # Selenium tests
└── pom.xml                 # Maven config
```

## Features
- Real-time form validation
- Password strength meter
- Country/State/City dropdowns
- Selenium automation (3 test flows)
- Screenshot capture