import os
import uuid
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

# Configuration
GENERATED_SITES_DIR = 'generated_sites'

# Ensure the directory for generated sites exists
if not os.path.exists(GENERATED_SITES_DIR):
    os.makedirs(GENERATED_SITES_DIR)

@app.route('/')
def home():
    """Serves the main page with the form."""
    return render_template('index.html')

@app.route('/api/create-site', methods=['POST'])
def create_site():
    """
    API endpoint to receive user data, generate a new HTML file
    from a template, and save it.
    """
    data = request.get_json()

    if not data or 'name' not in data:
        return jsonify({'error': 'Missing required data'}), 400

    # Render the portfolio template with the data received from the frontend
    rendered_html = render_template('portfolio_template.html', data=data)

    # Generate a unique filename to avoid conflicts
    unique_filename = f"{uuid.uuid4()}.html"
    filepath = os.path.join(GENERATED_SITES_DIR, unique_filename)

    # Write the rendered HTML to a new file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(rendered_html)

    # Return a success response with the URL to the new site
    site_url = f"/sites/{unique_filename}"
    return jsonify({'message': 'Website created successfully!', 'url': site_url})

@app.route('/sites/<path:filename>')
def serve_generated_site(filename):
    """Serves the generated static HTML files."""
    return send_from_directory(GENERATED_SITES_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)