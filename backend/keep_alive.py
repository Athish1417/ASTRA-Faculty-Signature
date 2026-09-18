import urllib.request

URL = "https://astra-faculty-signature.onrender.com/health"

try:
    response = urllib.request.urlopen(URL, timeout=30)
    print(f"Backend ping successful: HTTP {response.status}")
except Exception as e:
    print(f"Backend ping failed: {e}")
    raise