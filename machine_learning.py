import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import matplotlib.pyplot as plt

DEVICE_DATA_PATH = os.getenv('DEVICE_DATA_PATH', 'default_device_data_path.csv')
MODEL_SAVE_PATH = os.getenv('MODEL_SAVE_PATH', '.') 

class SmartHomeDashboardML:
    def __init__(self):
        self.model = None

    def load_data(self, file_path):
        try:
            return pd.read_csv(file_path)
        except FileNotFoundError:
            print(f"The file {file_path} was not found.")
            return None

    def preprocess_data(self, data):
        data.fillna(data.mean(), inplace=True)
        return data

    def split_data(self, data, target_name):
        X = data.drop(columns=[target_name])
        y = data[target_name]
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def train_model(self, X_train, y_train):
        self.model = RandomForestClassifier(n_estimators=100)
        self.model.fit(X_train, y_train)
        return self.model

    def feature_importance(self):
        feature_importances = pd.Series(self.model.feature_importances_).sort_values(ascending=False)
        plt.figure(figsize=(12,8))
        feature_importances.plot(kind='bar', title='Feature Importance')
        plt.ylabel('Feature Importance Score')
        plt.show()

    def evaluate_model(self, X_test, y_test):
        predictions = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        conf_matrix = confusion_matrix(y_test, predictions)
        print(f"Accuracy: {accuracy}")
        print(f"Confusion Matrix:\n{conf_matrix}")

    def save_model(self, model, file_name):
        joblib.dump(model, os.path.join(MODEL_SAVE_PATH, file_name))

    def load_model(self, file_name):
        try:
            self.model = joblib.load(os.path.join(MODEL_SAVE_PATH, file_name))
            return self.model
        except FileNotFoundError:
            print(f"The model file {file_name} was not found.")
            return None

    def make_prediction(self, input_data):
        if self.model is not None:
            prediction = self.model.predict([input_data])
            return prediction[0]
        else:
            raise Exception("Model not loaded. Call load_model() before making predictions.")

if __name__ == '__main__':
    dashboard_ml = SmartHomeDashboardML()
    data = dashboard_ml.load_data(DEVICE_DATA_PATH)
    if data is not None:
        processed_data = dashboard_ml.preprocess_data(data)
        X_train, X_test, y_train, y_test = dashboard_ml.split_data(processed_data, 'device_status')

        model = dashboard_ml.train_model(X_train, y_train)
        if model:
            dashboard_ml.feature_importance()
            dashboard_detail.evaluate_model(X_test, y_test)
            dashboard_ml.save_model(model, 'smart_home_model.pkl')

            loaded_model = dashboard_ml.load_model('smart_home_model.pkl')
            if loaded_model:
                input_data = X_test.iloc[0].values
                prediction = dashboard_ml.make_prediction(input_data)
                print(f"Prediction for the first test sample: {prediction}")