#!/usr/bin/env python3
"""
Simple Flask web application example
"""
from flask import Flask, jsonify, request
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Sample data
todos = [
    {"id": 1, "title": "Learn Python", "completed": True},
    {"id": 2, "title": "Build REST API", "completed": False},
    {"id": 3, "title": "Document Code", "completed": False}
]

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Return all todos"""
    logger.info("Fetching all todos")
    return jsonify(todos)

@app.route('/api/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    """Return a specific todo by ID"""
    todo = next((item for item in todos if item["id"] == todo_id), None)
    if todo:
        return jsonify(todo)
    return jsonify({"error": "Todo not found"}), 404

@app.route('/api/todos', methods=['POST'])
def create_todo():
    """Create a new todo"""
    if not request.json or 'title' not in request.json:
        return jsonify({"error": "Invalid data"}), 400
    
    new_id = max(todo["id"] for todo in todos) + 1
    new_todo = {
        "id": new_id,
        "title": request.json["title"],
        "completed": request.json.get("completed", False)
    }
    todos.append(new_todo)
    return jsonify(new_todo), 201

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
