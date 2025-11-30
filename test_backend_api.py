import requests
import json

def test_signup():
    url = "http://localhost:8000/users/signup"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "name": "API Test User",
        "email": "api_test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(data))
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("Signup successful!")
            # Clean up the test user
            # We would need to implement user deletion for cleanup
        elif response.status_code == 400:
            print("Signup failed with 400 error")
            try:
                error_data = response.json()
                print(f"Error detail: {error_data.get('detail', 'No detail provided')}")
            except:
                print("Could not parse error response")
        else:
            print(f"Unexpected status code: {response.status_code}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_signup()