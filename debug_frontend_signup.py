import requests
import json

def debug_frontend_signup():
    """
    This test simulates what the frontend is doing to help debug the issue
    """
    url = "http://localhost:8000/users/signup"
    headers = {
        "Content-Type": "application/json",
        # Simulate what axios might send
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    # Test 1: Try with a new email
    print("=== Test 1: New Email ===")
    data1 = {
        "name": "Debug Test User",
        "email": f"debug_test_{__import__('time').time()}@example.com",  # Unique email
        "password": "password123"
    }
    
    try:
        response1 = requests.post(url, headers=headers, data=json.dumps(data1))
        print(f"Status Code: {response1.status_code}")
        print(f"Response: {response1.text}")
        
        if response1.status_code == 201:
            print("✓ New email signup successful")
            user_data = response1.json()
            user_id = user_data['id']
        else:
            print("✗ New email signup failed")
            if response1.status_code == 400:
                error_data = response1.json()
                print(f"Error detail: {error_data.get('detail', 'No detail provided')}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    # Test 2: Try with the same email again (should fail)
    print("\n=== Test 2: Duplicate Email ===")
    try:
        response2 = requests.post(url, headers=headers, data=json.dumps(data1))  # Same data
        print(f"Status Code: {response2.status_code}")
        print(f"Response: {response2.text}")
        
        if response2.status_code == 400:
            print("✓ Duplicate email correctly rejected")
            error_data = response2.json()
            print(f"Error detail: {error_data.get('detail', 'No detail provided')}")
        else:
            print("✗ Duplicate email handling issue")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    debug_frontend_signup()