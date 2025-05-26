from flask import Flask, jsonify
from flask_cors import CORS
import csv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/strategy-results')
def get_strategy_results():
    results = []

    # Adjust the file path if needed
    with open('strategy_results.csv', 'r') as csvfile:
        # Skip the first 3 rows (headers/metadata)
        for _ in range(3):
            next(csvfile)

        # Define fieldnames explicitly to match your CSV columns
        fieldnames = [
            "Date", "Price", "Close", "High", "Low", "Open", "Volume",
            "Return", "MA10", "MA50", "Signal", "Position",
            "Strategy_Return", "Equity_Curve", "Market_Curve"
        ]
        reader = csv.DictReader(csvfile, fieldnames=fieldnames)

        for row in reader:
            # Optional: Convert numeric fields to float where possible
            for key in fieldnames[1:]:  # skip "Date" since it's a string
                try:
                    row[key] = float(row[key]) if row[key] else None
                except ValueError:
                    row[key] = None
            results.append(row)

    return jsonify({"results": {"equity_curve": results}})

if __name__ == '__main__':
    app.run(debug=True)
