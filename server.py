import http.server
import socketserver
import json
import os

PORT = 8081

# 模拟的用户数据 (两个用户信息)
USERS = {
    "user": "123",
    "admin": "admin"
}

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                email = data.get('email')
                password = data.get('password')
                
                print(f"Login attempt: {email}")
                
                if email in USERS and USERS[email] == password:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    # 返回重定向的目标URL
                    response = {
                        'success': True, 
                        'message': 'Login successful', 
                        'redirect': '/home_page/html/index.html'
                    }
                    self.wfile.write(json.dumps(response).encode('utf-8'))
                else:
                    self.send_response(401)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = {'success': False, 'message': '用户名或密码错误'}
                    self.wfile.write(json.dumps(response).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = {'success': False, 'message': f'Bad Request: {str(e)}'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")

    def log_message(self, format, *args):
        # 自定义日志输出，方便调试
        print(f"[{self.log_date_time_string()}] {format % args}")

if __name__ == "__main__":
    # 确保在当前脚本所在目录运行
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    print(f"Starting server at http://localhost:{PORT}")
    print(f"Serving files from: {web_dir}")
    print("Users:", list(USERS.keys()))

    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
