import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, BarChart3, MessageSquare } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

export const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white border-b border-gray-100 flex-1 flex flex-col justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white/20 -z-10" />
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center items-center flex flex-col">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Star className="w-4 h-4 mr-2" /> The #1 Feedback Platform
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-gray-900 tracking-tight max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Digital-First <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Feedback</span> Collection
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Transform how you gather insights. Replace manual forms with a seamless, dynamic, and anonymous platform built for modern teams.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link to="/register" className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5 w-full sm:w-auto">
                Start for free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/login" className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all w-full sm:w-auto">
                Log in to Account
              </Link>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-24 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={MessageSquare}
                title="Seamless Submissions"
                desc="A unified one-page form with interactive stars and easy text inputs keeps friction low."
              />
              <FeatureCard 
                icon={Star}
                title="Anonymous Mode"
                desc="Encourage honesty by allowing users to toggle their identity completely off."
              />
              <FeatureCard 
                icon={BarChart3}
                title="Deep Analytics"
                desc="Admin dashboards turn raw feedback into charts, ratings distributions, and sentiment tags."
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} Feedbak. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
    <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-7 h-7 text-primary-600" />
    </div>
    <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm md:text-base">{desc}</p>
  </div>
);
