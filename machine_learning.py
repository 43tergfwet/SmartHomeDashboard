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
        except FileNotFoundError as e:
            print(f"Error: {e}. \nThe file {file_path} was not found.")
            return None
        except Exception as e:
            print(f"An unexpected error occurred while loading data: {e}")
            return None

    def preprocess_data(self, data):
        try:
            data.fillna(data.mean(), inplace=True)
            return data
        except Exception as e:
            print(f"An error occurred during preprocessing: {e}")
            return None

    def split_data(self, data, target_name):
        try:
            X = data.drop(columns=[target_name])
            y = data[target_name]
            return train_test_split(X, y, test_size=0.2, random_state=42)
        except KeyError:
            print(f"Error: The specified target name {target_name} does not exist in data.")
            return None, None, None, None
        except Exception as e:
            print(f"An unexpected error occurred while splitting data: {e}")
            return None, None, None, None

    def train_model(self, X_train, y_train):
        try:
            self.model = RandomForestClassifier(n_estimators=100)
            self.model.fit(X_train, y_train)
            return self.model
        except Exception as e:
            print(f"An error occurred during model training: {e}")
            return None

    def feature_importance(self):
        try:
            feature_importances = pd.Series(self.model.feature_importances_).sort_values(ascending=False)
            self.plot_feature_importances(feature_importances)
        except AttributeError:
            print("Model has not been trained yet. Please train the model before viewing feature importance.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

    def plot_feature_importances(self, feature_importances):
        plt.figure(figsize=(12,8))
        feature_importances.plot(kind='bar', title='Feature Importance')
        plt.ylabel('Feature Importance Score')
        plt.show()

    def evaluate_model(self, X_test, y_test):
        try:
            predictions = self.model.predict(X_test)
            self.display_model_evaluation(y_test, predictions)
        except Exception as e:
            print(f"An error occurred during model evaluation: {e}")

    def display_model_evaluation(self, y_test, predictions):
        accuracy = accuracy_score(y_test, predictions)
        conf_matrix = confusion_matrix(y_test, predictions)
        print(f"Accuracy: {accuracy}")
        print(f"Confusion Matrix:\n{conf_matrix}")

    def save_model(self, model, file_name):
        try:
            joblib.dump(model, os.path.join(MODEL_SAVE_PATH, file_name))
        except Exception as e:
            print(f"An error occurred when saving the model: {e}")

    def load_model(self, file_name):
        try:
            self.model = joblib.load(os.path.join(MODEL_SAVE_PATH, file_name))
            return self.model
        except FileNotFoundError as e:
            print(f"Error: {e}.\nThe model file {file_name} was not found.")
            return None
        except Exception as e:
            print(f"An unexpected error occurred while loading the model: {e}")
            return None

    def make_prediction(self, input_data):
        try:
            if self.model is not None:
                return self.process_prediction(input_data)
            else:
                raise Exception("Model not loaded. Please load a model before making predictions.")
        except ValueError as e:
            print(f"Error: {e}")
            return None
        except Exception as e:
            print(f"An unexpected error occurred during prediction: {e}")
            return None

    def process_prediction(self, input_data):
        if isinstance(input_data, (list, np.ndarray)):
            prediction = self.model.predict([input_data])
            return prediction[0]
        else:
            raise ValueError("Invalid input data. Expected a list or numpy array.")

if __name__ == '__main__':
    dashboard_ml = SmartHomeDashboardML()
    data = dashboard_ml.load_data(DEVICE_DATA_PATH)
    if data is not None:
        processed_data = dashboard_ml.preprocess_data(data)
        X_train, X_test, y_train, y_test = dashboard_ml.split_data(processed_data, 'device_status')

        model = dashboard_ml.train_model(X_train, y_train)
        if model:
            dashboard_ml.feature_importance()
            dashboard_ml.evaluate_model(X_test, y_test)
            dashboard_ml.save_model(model, 'smart_home_model.pkl')

            loaded_model = dashboard_ml.load_model('smart_home_model.pkl')
            if loaded_model:
                input_data = X_test.iloc[0].values
                prediction = dashboard_ml.make_prediction(input_data)
                print(f"Prediction for the first test sample: {prediction}")