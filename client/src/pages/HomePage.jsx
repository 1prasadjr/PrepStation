import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ToDoList from '../components/ToDoList';
import { ArrowRight, BookOpen, Brain, Target, Users } from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const [headersVisible, setHeadersVisible] = useState(false);

  useEffect(() => {
    // Trigger header animation
    const timer = setTimeout(() => {
      setHeadersVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Main Content */}
      <div>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-6xl mx-auto">
            <h1 className={`text-6xl md:text-8xl font-bold text-white mb-6 transition-all duration-1000 ease-out ${
              headersVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
            }`}>
              <span className="bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
                PrepStation
              </span>
            </h1>
            <h2 className={`text-2xl md:text-4xl font-semibold text-white mb-8 transition-all duration-1000 ease-out delay-300 ${
              headersVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
            }`}>
              Your University Success Partner
            </h2>
            <p className={`text-xl text-gray-300 mb-12 max-w-3xl mx-auto transition-all duration-1000 ease-out delay-500 ${
              headersVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
            }`}>
              Revolutionize your study experience with AI-powered question prediction, 
              intelligent assistance, and comprehensive exam preparation tools.
            </p>
            
            {!isAuthenticated ? (
              <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 ease-out delay-700 ${
                headersVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
              }`}>
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-red-700 transition-all duration-300 shadow-lg shadow-purple-500/50 flex items-center justify-center"
                >
                  Get Started <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 border-2 border-purple-500 text-purple-400 font-semibold rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className={`px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-red-700 transition-all duration-300 shadow-lg shadow-purple-500/50 inline-flex items-center ${
                  headersVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
                } delay-700`}
              >
                Go to Dashboard <ArrowRight className="ml-2" size={20} />
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-4xl font-bold text-white text-center mb-16">
              Why Choose PrepStation?
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'AI Question Prediction',
                  description: 'Advanced AI analyzes past papers to predict likely exam questions'
                },
                {
                  icon: BookOpen,
                  title: 'Comprehensive Library',
                  description: 'Access thousands of previous year question papers across all subjects'
                },
                {
                  icon: Target,
                  title: 'Smart Study Plans',
                  description: 'Personalized study schedules based on your academic goals'
                },
                {
                  icon: Users,
                  title: 'Collaborative Learning',
                  description: 'Connect with peers and share study materials effectively'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
                >
                  <feature.icon size={40} className="text-purple-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Todo List Section */}
        {isAuthenticated && (
          <section className="py-10 px-2 sm:py-20 sm:px-4">
            <div className="w-full max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
                Stay Organized
              </h3>
              <ToDoList />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;