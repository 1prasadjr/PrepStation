import React, { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

const ToDoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-800">
      <h3 className="text-xl font-bold text-white mb-6">My Tasks</h3>
      
      {/* Add new todo */}
      <div className="flex mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-3 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Todo list */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No tasks yet. Add one above!</p>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                todo.completed 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-800 border-gray-700 hover:border-purple-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-500 hover:border-purple-500'
                  }`}
                >
                  {todo.completed && <Check size={16} />}
                </button>
                <span
                  className={`transition-all duration-300 ${
                    todo.completed 
                      ? 'text-gray-400 line-through' 
                      : 'text-white'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-400 hover:text-red-300 transition-colors p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Total: {todos.length}</span>
            <span>Completed: {todos.filter(t => t.completed).length}</span>
            <span>Remaining: {todos.filter(t => !t.completed).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoList;