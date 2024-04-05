# WebApp Architecture
```
CVPD_interview/
│
├── backend/
│   └── src/ 
│       └── app.py # Contains all backend flask endpoints
│   └── uploads/ # uploaded csv file will be stored here
│   └── output/ # generated graphs will be stored here 
│   └── requirement.txt
│
├── frontend/
│   └── src/
│       └── app.js # Main js entry point for the React application
│       └── FileUploadComponent.js # This component provides an interface for users to upload CSV files
│       └── ViewChartsComponent.js # This component is responsible for visualizing the charts
│       ...
│   └── public/ 
│   └── node_modules/ 
│   └── package.json/ 
│   └── package-lock.json/
└── readme.md
```

# Setting up
## Backend set up
```
# in powershell
cd .\backend\

pip install -r requirement.txt
```

## Frontend set up
```
# in powershell
cd .\frontend\

npm install react-router-dom
npm install axios
```
# How to run web application
```
# run backend
cd ./backend/src/

python app.py

```
Flask app is running on local host `http://127.0.0.1:5000`.

```
# run frontend
npm start
```
React web application is running on local host `http://localhost:3000`. Ensure that the Flask app is running together with react application.

# Code walk through
# 1. Backend (app.py)

This Flask web application serves several purposes: 
- it allows users to upload CSV files 
- processes these files to generate visual charts (graphs), 
- and then serves these charts back to the user. 
The application is structured to handle file uploads securely, validate the structure of the uploaded CSV, generate charts based on the CSV data, and finally, allow the retrieval of these charts.

## Initial Setup

- **Flask, CORS, Werkzeug, os, csv, pandas, matplotlib**: These are the imported libraries. Flask is used for the web server, CORS for cross-origin requests, Werkzeug for securing filenames, os for operating system interactions, csv for CSV file reading, pandas for data manipulation, and matplotlib for chart generation.
- **plt.switch_backend("agg")**: This changes Matplotlib's backend to 'agg', which is a non-GUI backend suitable for script and server environments.
- **Flask app and CORS setup**: Initializes the Flask app and applies Cross-Origin Resource Sharing (CORS) policies to allow requests from different origins.

## Configuration

- **PARENT_PATH, UPLOAD_FOLDER**: Defines paths used to store uploaded files and generated charts. `PARENT_PATH` is the parent directory of the current working directory, and `UPLOAD_FOLDER` is a subdirectory for uploads.
- **ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES**: Sets the allowed file extensions and MIME types for the uploads, focusing on CSV files.

## Helper Functions

- **allowed_file(filename)**: Validates if the uploaded file has an allowed extension.
- **validate_csv_structure(row)**: Checks if the uploaded CSV file contains the expected columns.
- **process_csv(filename, chart_name)**: Reads the uploaded CSV, processes the data according to the specified chart type, and returns a DataFrame suitable for chart generation.
- **generate_chart(processed_data, chart_name)**: Takes the processed DataFrame and generates a chart, saving it to the 'output' folder as a JPEG image.

## Flask Routes

- **@app.route("/upload", methods=["POST"])**: Handles file uploads. It performs checks to ensure a file is included in the request, validates the file type, and saves the file. It then opens the CSV to check its structure.
- **@app.route("/process-and-chart/<chart_name>", methods=["POST"])**: Triggers the processing of the uploaded CSV file into a specified chart type. It looks for a specific CSV file, processes the data, generates a chart, and saves the chart image.
- **@app.route("/charts/<chart_name>", methods=["GET"])**: Serves the generated chart images. It checks if the requested chart image exists and returns it, or returns an error if not found.

## Main Functionality

- **CSV Upload and Validation**: Users can upload CSV files, which are then validated for structure and content.
- **Data Processing and Chart Generation**: The application processes uploaded CSV files based on predefined chart types ('monthly_expenditure_over_time.jpg', 'average_spend_by_category.jpg', and 'total_spend_by_category_over_5_years.jpg'), generating corresponding charts using matplotlib.
- **Chart Retrieval**: Users can retrieve and view the generated charts by accessing a specific URL endpoint for each chart.

## Security and Error Handling

- The application includes basic security measures like MIME type validation and filename sanitization to protect against common vulnerabilities such as malicious file uploads.
- Error handling is incorporated to provide feedback on failed operations, such as unsupported file types, incorrect CSV structures, or when requested charts are not found.

# 2. Frondend (React)
# 2.1 App.js

# 2.2 FileUploadComponent.js

# 2.3 ViewChartsComponent.js