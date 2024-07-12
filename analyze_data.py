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

def get_average_usage(data):
    return data['usage_time'].mean()

def get_max_usage(data):
    return data['usage_time'].max()

def get_min_usage(data):
    return data['usage_time'].min()

def analyze_device_usage(data):
    if data is None:
        return "No data available."
    
    average_usage = get_average_usage(data)
    max_usage = get_max_usage(data)
    min_usage = get_min_usage(data)
    
    return {
        'average_usage': average_usage,
        'max_usage': max_usage,
        'min_usage': min_usage
    }

def format_usage_report(report, report_date):
    report_content = f"Device Usage Report - {report_date}\n"
    report_content += f"Average Usage: {report['average_usage']:.2f} hours\n"
    report_content += f"Max Usage: {report['max_usage']} hours\n"
    report_content += f"Min Usage: {report['min_usage']} hours\n"
    
    return report_content

def generate_usage_report(data):
    if data is None:
        print("No data to generate report.")
        return "No data to generate report."
    
    report = analyze_device_usage(data)
    report_date = datetime.now().strftime('%Y-%m-%d')
    formatted_report = format_usage_report(report, report_date)
    
    print(formatted_report)
    insights_on_efficiency(data)

def insights_on_efficiency(data):
    if data is None:
        print("No data available for insights.")
        return "No data available for insights."
    
    efficient_usage_threshold = 4
    insights = generate_efficiency_insights(data, efficient_usage_threshold)
    
    print(insights)
    return insights

def generate_efficiency_insights(data, threshold):
    efficient_devices = data[data['usage_time'] <= threshold]
    inefficient_devices = data[data['usage_time'] > threshold]

    insights = f"Efficient Devices (<= {threshold} hrs of usage): {len(efficient_devices)}\n"
    insights += f"Inefficient Devices (> {threshold} hrs of usage): {led(infficient_devices)}\n"
    
    return insights

if __name__ == "__main__":
    data = load_device_data()
    generate_usage_report(data)