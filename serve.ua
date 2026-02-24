import http.server
import os

os.chdir("/Users/bohdankorzh/Documents/OXGroup_demo")

handler = http.server.SimpleHTTPRequestHandler
with http.server.HTTPServer(("", 3000), handler) as httpd:
    print("Serving on http://localhost:3000")
    httpd.serve_forever()
