"""
Test script to verify all frontend routes and functionality
"""
import requests
import json
import time

def test_frontend_routes():
    base_url = "http://localhost:3000"
    
    # Test if the frontend server is running
    try:
        response = requests.get(base_url)
        if response.status_code == 200:
            print("✓ Frontend server is running")
        else:
            print(f"✗ Frontend server returned status code: {response.status_code}")
            return
    except requests.exceptions.ConnectionError:
        print("✗ Frontend server is not running")
        return
    
    # Test if the backend server is running
    try:
        backend_response = requests.get("http://localhost:8000")
        if backend_response.status_code == 200:
            print("✓ Backend server is running")
        else:
            print(f"✗ Backend server returned status code: {backend_response.status_code}")
    except requests.exceptions.ConnectionError:
        print("✗ Backend server is not running")
        return
    
    # Test backend API endpoints
    print("\n--- Testing Backend API Endpoints ---")
    
    # Test user signup
    signup_data = {
        "name": "Test User",
        "email": f"test_{int(time.time())}@example.com",
        "password": "password123"
    }
    
    try:
        signup_response = requests.post("http://localhost:8000/users/signup", json=signup_data)
        if signup_response.status_code == 201:
            print("✓ User signup endpoint working")
            user_data = signup_response.json()
            user_id = user_data["id"]
        else:
            print(f"✗ User signup failed with status code: {signup_response.status_code}")
            print(f"  Response: {signup_response.text}")
    except Exception as e:
        print(f"✗ User signup failed with error: {e}")
    
    # Test post creation
    post_data = {
        "title": "Test Post",
        "content": "This is a test post content",
        "user_id": user_id,
        "tags": ["test", "demo"]
    }
    
    try:
        post_response = requests.post("http://localhost:8000/posts/", json=post_data)
        if post_response.status_code == 201:
            print("✓ Post creation endpoint working")
            post_data = post_response.json()
            post_id = post_data["id"]
        else:
            print(f"✗ Post creation failed with status code: {post_response.status_code}")
            print(f"  Response: {post_response.text}")
    except Exception as e:
        print(f"✗ Post creation failed with error: {e}")
    
    # Test post retrieval
    try:
        get_post_response = requests.get(f"http://localhost:8000/posts/{post_id}")
        if get_post_response.status_code == 200:
            print("✓ Post retrieval endpoint working")
        else:
            print(f"✗ Post retrieval failed with status code: {get_post_response.status_code}")
    except Exception as e:
        print(f"✗ Post retrieval failed with error: {e}")
    
    # Test post update
    update_data = {
        "title": "Updated Test Post",
        "content": "This is updated test post content"
    }
    
    try:
        update_response = requests.put(f"http://localhost:8000/posts/{post_id}", json=update_data)
        if update_response.status_code == 200:
            print("✓ Post update endpoint working")
        else:
            print(f"✗ Post update failed with status code: {update_response.status_code}")
    except Exception as e:
        print(f"✗ Post update failed with error: {e}")
    
    # Test post deletion
    try:
        delete_response = requests.delete(f"http://localhost:8000/posts/{post_id}")
        if delete_response.status_code == 204:
            print("✓ Post deletion endpoint working")
        else:
            print(f"✗ Post deletion failed with status code: {delete_response.status_code}")
    except Exception as e:
        print(f"✗ Post deletion failed with error: {e}")
    
    # Test user deletion
    try:
        delete_user_response = requests.delete(f"http://localhost:8000/users/{user_id}")
        if delete_user_response.status_code == 200:
            print("✓ User deletion endpoint working")
        else:
            print(f"✗ User deletion failed with status code: {delete_user_response.status_code}")
    except Exception as e:
        print(f"✗ User deletion failed with error: {e}")
    
    print("\n--- Frontend Routes Check ---")
    print("Please manually verify these routes in your browser:")
    print("1. http://localhost:3000/ - Home page with latest posts")
    print("2. http://localhost:3000/login - Login page")
    print("3. http://localhost:3000/signup - Signup page")
    print("4. http://localhost:3000/dashboard - Dashboard (requires login)")
    print("5. http://localhost:3000/profile - User profile (requires login)")
    print("6. http://localhost:3000/create-post - Create post (requires login)")
    print("7. http://localhost:3000/edit-post/:id - Edit post (requires login)")
    print("8. http://localhost:3000/post/:id - Post detail page")

if __name__ == "__main__":
    test_frontend_routes()