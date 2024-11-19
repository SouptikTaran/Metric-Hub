import requests
import concurrent.futures

# Configuration
URL = "http://localhost:8000/slow"  # Change to your desired endpoint
NUM_REQUESTS = 1000  # Total number of requests to send
CONCURRENT_REQUESTS = 50  # Number of concurrent requests

def send_request():
    try:
        response = requests.get(URL)
        print(f"Status Code: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENT_REQUESTS) as executor:
        futures = [executor.submit(send_request) for _ in range(NUM_REQUESTS)]
        concurrent.futures.wait(futures)

if __name__ == "__main__":
    main()
