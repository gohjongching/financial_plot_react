from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import pandas as pd

# import plotly.express as px
import matplotlib.pyplot as plt

plt.switch_backend("agg")

app = Flask(__name__)
# By default, submission of cookies across domains is disabled due to the security implications
# when you want to enable CORS, you wish to enable it for all use cases on a domain
CORS(app)

PARENT_PATH = os.path.dirname(os.getcwd())
UPLOAD_FOLDER = os.path.join(PARENT_PATH, "uploads")
ALLOWED_EXTENSIONS = {"csv"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


### Helper functions ###
def allowed_file(filename):
    """Check if file in upload folder is a csv.

    Args:
        filename (str): filename in uploads folder.

    Returns:
        bool: True or False
    """
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def process_csv(filename):
    df = pd.read_csv(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    df["Date"] = pd.to_datetime(df["Date"], format="%d/%m/%Y")
    # Aggregate data by month for the first chart
    monthly_expenditure = (
        df.resample("ME", on="Date").sum(numeric_only=True).reset_index()
    )

    # Aggregate data for the average spend by category
    avg_spend_by_category = df.groupby("Category").mean(numeric_only=True).reset_index()

    # Aggregate data for the total spend by category over the 5 years
    total_spend_by_category = (
        df.groupby("Category").sum(numeric_only=True).reset_index()
    )

    return monthly_expenditure, avg_spend_by_category, total_spend_by_category


def generate_chart(monthly_expenditure, avg_spend_by_category, total_spend_by_category):
    # Monthly Expenditure Over Time chart
    plt.figure(figsize=(15, 10))
    plt.plot(
        monthly_expenditure["Date"],
        monthly_expenditure["Amount"],
        marker="o",
        linestyle="-",
    )
    plt.title("Monthly Expenditure Over Time")
    plt.xlabel("Date")
    plt.ylabel("Total Expenditure ($)")
    plt.grid(True)
    plt.savefig(
        os.path.join(PARENT_PATH, "output", "monthly_expenditure_over_time.jpg")
    )
    plt.close()  # Close the figure to free up memory

    # Average Spend by Category chart
    plt.figure(figsize=(15, 10))
    plt.bar(
        avg_spend_by_category["Category"],
        avg_spend_by_category["Amount"],
        color="skyblue",
    )
    plt.title("Average Spend by Category")
    plt.xlabel("Category")
    plt.ylabel("Average Expenditure ($)")
    plt.xticks(rotation=45)  # Rotate category names for better visibility
    plt.grid(axis="y")
    plt.savefig(os.path.join(PARENT_PATH, "output", "average_spend_by_category.jpg"))
    plt.close()

    # Total Spend by Category Over the 5 Years chart
    plt.figure(figsize=(15, 10))
    plt.bar(
        total_spend_by_category["Category"],
        total_spend_by_category["Amount"],
        color="lightgreen",
    )
    plt.title("Total Spend by Category Over the 5 Years")
    plt.xlabel("Category")
    plt.ylabel("Total Expenditure ($)")
    plt.xticks(rotation=45)
    plt.grid(axis="y")
    plt.savefig(
        os.path.join(PARENT_PATH, "output", "total_spend_by_category_over_5_years.jpg")
    )
    plt.close()

    return None


### All end points ###
# Upload endpoint that accept POST requests. Files are uploaded
@app.route("/upload", methods=["POST"])
def upload_file():
    # Checks if the request contains a file part. If not, it returns a JSON response indicating the error, with a 400 Bad Request status code.
    if "file" not in request.files:
        return jsonify(error="No file part"), 400

    # Extracts the file from the request.
    file = request.files["file"]

    # Checks if a file was actually selected for upload. If the filename is empty, it returns an error response.
    if file.filename == "":
        return jsonify(error="No selected file"), 400

    # Checks if the file exists and has an allowed extension.
    if file and allowed_file(file.filename):
        # Secures the filename to prevent directory traversal attacks.
        filename = secure_filename(file.filename)

        # Constructs the full path where the file will be saved.
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        # Saves the file to the specified location on the filesystem.
        file.save(file_path)

        # Returns a JSON response indicating success, with a 200 OK status code.
        return jsonify(message="File uploaded successfully"), 200
    return jsonify(error="File not allowed"), 400


# Display chart endpoint
@app.route("/process-and-chart", methods=["GET"])
def process_and_chart():
    # Check if the "5_years_financial_data.csv" is inside the uploads folder
    csv_file_path = os.path.join(
        app.config["UPLOAD_FOLDER"], "5_years_financial_data.csv"
    )
    if os.path.exists(csv_file_path):
        monthly_expenditure, avg_spend_by_category, total_spend_by_category = (
            process_csv(csv_file_path)
        )

        generate_chart(
            monthly_expenditure, avg_spend_by_category, total_spend_by_category
        )

        return jsonify(message="Graphs are processed and saved")
    else:
        return jsonify(message="CSV file not found"), 404


# View the saved charts
@app.route("/charts/<chart_name>")
def serve_chart(chart_name):
    output_path = os.path.join(PARENT_PATH, "output")
    image_path = os.path.join(PARENT_PATH, "output", chart_name)

    if os.path.exists(image_path):
        return send_from_directory(output_path, chart_name)
    else:
        return jsonify(message="Chart not found"), 404


if __name__ == "__main__":
    app.run(debug=True)
    # print(allowed_file("test.pdf"))
    # upload_file()
