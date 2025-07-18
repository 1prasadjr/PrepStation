import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Download, Filter, Search, FileText } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    stream: '',
    branch: '',
    year: '',
    semester: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true); // Start loading
    const params = new URLSearchParams();
    if (filters.stream) params.append('stream', filters.stream);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.year) params.append('year', filters.year);
    if (filters.semester) params.append('semester', filters.semester);

    fetch(`${API_URL}/api/papers?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setPapers(data);
        setLoading(false); // Stop loading after data is set
      })
      .catch(() => setLoading(false)); // Stop loading even if there's an error
  }, [filters]);

  const filteredPapers = papers.filter(paper => {
    const matchesFilter = (
      (!filters.stream || paper.stream === filters.stream) &&
      (!filters.branch || paper.branch === filters.branch) &&
      (!filters.year || paper.year === filters.year) &&
      (!filters.semester || (paper.semester ? paper.semester === filters.semester : true))
    );
    const matchesSearch = !searchQuery || 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (paper.subject && paper.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleDownload = (paper) => {
    fetch(`${API_URL}/api/papers/${paper._id}/download`)
      .then(response => {
        if (!response.ok) throw new Error('File not found');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${paper.title || paper.subject || 'question-paper'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        alert('Failed to download PDF: ' + err.message);
      });
  };

  if (loading) {
    return <div className="text-center text-white py-12">Loading papers...</div>;
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400">
            Explore question papers and boost your exam preparation
          </p>
        </div>

        {/* Filters and Search */}
        {/* Removed filter and search box for mobile simplification */}

        {/* Question Papers Grid */}
        <h2 className="text-4xl font-bold mb-8 text-center">
          <span className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
            UNIVERSITY PYQS
          </span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && filteredPapers.length === 0 && (
            <div className="text-center text-gray-400 py-12">No papers found.</div>
          )}
          {filteredPapers.map((paper) => (
            <div
              key={paper._id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="text-purple-400 flex-shrink-0" size={24} />
                <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  {paper.examYear || paper.uploadedAt?.slice(0, 4)} {paper.semester || ''}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {paper.title || paper.subject}
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Stream:</span>
                  <span className="text-white">{paper.stream}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Branch:</span>
                  <span className="text-white">{paper.branch}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Year:</span>
                  <span className="text-white">{paper.year}</span>
                </div>
              </div>
              <button
                onClick={() => handleDownload(paper)}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center"
              >
                <Download className="mr-2" size={20} />
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;