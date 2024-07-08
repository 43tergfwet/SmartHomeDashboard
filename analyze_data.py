import os
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

DATA_PATH = os.getenv('DATA_PATH', 'data/device_data.csv')

def load_device_data():
    try:
        data = pd.read_csv(DATA_PATH)
        print("Data loaded successfully.")
        return data
    except FileNotFoundError:
        print("File not found. Check the DATA_PATH in your .env file.")
        return None

def analyze_device_usage(data):
    if data is None:
        return "No data available."
    else:
        average_usage = data['usage_time'].mean()
        max_usage = data['usage_time'].max()
        min_usage = data['usage_time'].min()
        return {
            'average_usage': average_usage,
            'max_usage': max_usage,
            'min_usage': min_usage
        }

def generate_usage_report(data):
    if data is None:
        return "No data to generate report."
    else:
        report = analyze_device_usage(data)
        report_date = datetime.now().strftime('%Y-%m-%d')
        report_content = f"Device Usage Report - {report_date}\n"
        report_content += f"Average Usage: {report['average_usage']:.2f} hours\n"
        report_content += f"Max Usage: {report['max_usage']} hours\n"
        report_content += f"Min Usage: {report['min_usage']} hours\n"
        print(report_content)
        return report_content

def insights_on_efficiency(data):
    if data is None:
        return "No data available for insights."
    else:
        efficient_usage_threshold = 4 
        efficient_devices = data[data['usage_time'] <= efficient_usage_threshold]
        inefficient_devices = data[data['usage_time'] > efficient_usage_threshold]
        insights = f"Efficient Devices (<= {efficient_usage_threshold} hrs of usage): {len(efficient_devices)}\n"
        insights += f"Inefficient Devices (> {efficient_usage_threshold} hrs of usage): {len(inefficient_devices)}\n"
        print(insights)
        return insights

if __name__ == "__main__":
    data = load_device_data()
    generate_usage_report(data)
    insights_on_efficiency(data)