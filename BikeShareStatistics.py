import os
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('home.html')

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    #the host is "localhost" instead of zeros.
    app.run(host='0.0.0.0', port=port)
