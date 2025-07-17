import React, { useState } from 'react';

const AdminUploadPage = () => {
  const [form, setForm] = useState({
    title: '',
    stream: '',
    branch: '',
    year: '',
    file: null
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    const res = await fetch('/api/papers/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setMessage(data.message || 'Upload complete!');
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-8 rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Upload Question Paper</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" onChange={handleChange} required className="w-full p-2 rounded" />
        <input name="stream" placeholder="Stream" onChange={handleChange} required className="w-full p-2 rounded" />
        <input name="branch" placeholder="Branch" onChange={handleChange} required className="w-full p-2 rounded" />
        <input name="year" placeholder="Year" onChange={handleChange} required className="w-full p-2 rounded" />
        <input name="file" type="file" accept="application/pdf" onChange={handleChange} required className="w-full" />
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">Upload</button>
      </form>
      {message && <div className="mt-4 text-green-400">{message}</div>}
    </div>
  );
};

export default AdminUploadPage;
