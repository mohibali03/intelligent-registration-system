# Registration System

Modern registration form with real-time validation and comprehensive Selenium automation testing.

## Prerequisites

- **Java 11** or higher
- **Maven 3.6+** for dependency management
- **Chrome Browser** (latest version recommended)
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code)

## Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd registration-system
mvn clean install
```

### 2. Run Web Application
**Option A: Direct Browser**
- Open `src/main/resources/index.html` in your browser
- Or use Live Server extension in VS Code

**Option B: Local Server**
```bash
# Using Python (if installed)
python -m http.server 8000
# Then open http://localhost:8000/src/main/resources/
```

### 3. Run Automation Tests

**IntelliJ IDEA:**
1. Open project in IntelliJ IDEA
2. Right-click `RegistrationFormTest.java` → Run
3. Or right-click `testng.xml` → Run

**Command Line:**
```bash
# Run all tests
mvn test

# Run with TestNG suite
mvn test -Dsurefire.suiteXmlFiles=src/test/resources/testng.xml

# Run specific test class
mvn test -Dtest=RegistrationFormTest
```

**Eclipse:**
1. Import as Maven project
2. Right-click project → Run As → TestNG Test

## Project Structure
```
registration-system/
├── src/
│   ├── main/resources/
│   │   ├── index.html          # Registration form UI
│   │   ├── styles.css          # CSS styling
│   │   └── script.js           # Client-side validation
│   └── test/
│       ├── java/
│       │   └── RegistrationFormTest.java  # Selenium test automation
│       └── resources/
│           └── testng.xml      # TestNG configuration
├── screenshots/                # Test execution screenshots
│   ├── error-state.png
│   └── success-state.png
├── target/                     # Maven build output
├── pom.xml                     # Maven dependencies & plugins
└── README.md                   # This file
```

## Features

### Web Application
- **Real-time Validation**: Instant feedback on form fields
- **Password Strength Meter**: Visual password complexity indicator
- **Dynamic Dropdowns**: Country → State → City cascading selection
- **Responsive Design**: Mobile-friendly interface
- **Input Sanitization**: Client-side security measures

### Test Automation
- **3 Test Scenarios**: Valid registration, invalid data, edge cases
- **Screenshot Capture**: Automatic screenshots on test completion
- **Cross-browser Support**: Chrome WebDriver with WebDriverManager
- **TestNG Framework**: Structured test execution and reporting
- **Page Object Model**: Maintainable test architecture

## Test Scenarios

1. **Valid Registration Flow**
   - Fill all required fields with valid data
   - Verify successful form submission

2. **Invalid Data Handling**
   - Test email format validation
   - Test password strength requirements
   - Test required field validation

3. **Edge Cases**
   - Special characters in name fields
   - Boundary value testing
   - Form reset functionality

## Dependencies

- **Selenium WebDriver 4.15.0**: Browser automation
- **TestNG 7.8.0**: Test framework
- **WebDriverManager 5.6.2**: Automatic driver management
- **Apache Commons IO 2.11.0**: File operations

## Configuration

### Browser Settings
Tests run on Chrome by default. To change browser:
```java
// In RegistrationFormTest.java
WebDriverManager.firefoxdriver().setup();
driver = new FirefoxDriver();
```

### Test Configuration
Modify `src/test/resources/testng.xml` for:
- Test suite name
- Parallel execution
- Test groups
- Listeners

## Troubleshooting

**Common Issues:**

1. **ChromeDriver not found**
   - WebDriverManager handles this automatically
   - Ensure Chrome browser is installed

2. **Tests fail to start**
   - Check Java version: `java -version`
   - Verify Maven installation: `mvn -version`

3. **Form not loading**
   - Check file paths are correct
   - Ensure no popup blockers are active

4. **Screenshots not generated**
   - Verify `screenshots/` directory exists
   - Check file permissions

## Development

### Adding New Tests
1. Create test methods in `RegistrationFormTest.java`
2. Use `@Test` annotation
3. Follow existing naming conventions

### Modifying Form
1. Update `index.html` for structure changes
2. Modify `styles.css` for styling
3. Update `script.js` for validation logic
4. Adjust test selectors accordingly

## Reports

Test reports are generated in:
- `target/surefire-reports/` - Maven Surefire reports
- `test-output/` - TestNG HTML reports
- `screenshots/` - Visual test evidence
