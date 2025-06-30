import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Users, Globe, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import CourseDetailPage from './DetialCourse';

const RemiFiAcademy = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Beginner', 'DeFi', 'Local Markets', 'Tokenomics', 'Security'];

  const courses = [
    {
      id: 1,
      title: "Introduction to Blockchain & Cryptocurrency",
      description: "Learn the fundamentals of blockchain technology and how cryptocurrencies work in simple terms.",
      level: "Beginner",
      duration: "45 min",
      language: "English & Local Languages",
      rewards: "50 AFX",
      status: "available",
      image: "🌟"
    },
    {
      id: 2,
      title: "DeFi Basics: Your Gateway to Decentralized Finance",
      description: "Understand decentralized finance protocols, yield farming, and how to safely interact with DeFi platforms.",
      level: "Intermediate",
      duration: "60 min",
      language: "Multiple Languages",
      rewards: "75 AFX",
      status: "available",
      image: "💰"
    },
    {
      id: 3,
      title: "Local Market Analysis & Trading Strategies",
      description: "Explore cryptocurrency trading strategies tailored for African markets and economic conditions.",
      level: "Advanced",
      duration: "90 min",
      language: "Local Languages",
      rewards: "100 AFX",
      status: "coming-soon",
      image: "📈"
    },
    {
      id: 4,
      title: "Wallet Security & Best Practices",
      description: "Master the art of keeping your crypto assets safe with comprehensive security guidelines.",
      level: "Beginner",
      duration: "30 min",
      language: "English & Local Languages",
      rewards: "40 AFX",
      status: "available",
      image: "🔒"
    },
    {
      id: 5,
      title: "RemiFi Tokenomics Deep Dive",
      description: "Learn how AFX's reward system works and how to maximize your earnings as a content creator.",
      level: "Intermediate",
      duration: "55 min",
      language: "Multiple Languages",
      rewards: "80 AFX",
      status: "available",
      image: "🏆"
    },
    {
      id: 6,
      title: "Building Web3 Communities Locally",
      description: "Strategies for growing blockchain adoption and education in your local community.",
      level: "Advanced",
      duration: "70 min",
      language: "Local Languages",
      rewards: "120 REMIFI",
      status: "coming-soon",
      image: "🌍"
    }
  ];

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.level === selectedCategory || course.title.toLowerCase().includes(selectedCategory.toLowerCase()));

  const stats = [
    { icon: Users, label: "Active Learners", value: "12,500+" },
    { icon: BookOpen, label: "Courses Available", value: "45+" },
    { icon: Globe, label: "Languages Supported", value: "8" },
    { icon: Award, label: "Rewards Distributed", value: "₦2.5M" }
  ];

  // Handler to open course detail via navigation
  const handleCourseClick = (course) => {
    if (course.status === 'available') {
      navigate('/app/courseDetail', { state: { course } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto">
        <section className="relative py-20 px-4 ml-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Learn. Create. Earn.
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join Africa's first decentralized crypto education platform. Build blockchain knowledge, 
                create valuable content for your community, and earn rewards in our native token.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-8 py-2 font-semibold transition-all transform hover:scale-105">
                  Start Learning
                </button>
                <button className="border border-emerald-500 px-8 py-4 font-semibold transition-colors text-emerald-700 hover:bg-emerald-50">
                  Become a Creator
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="w-80 h-80 mx-auto relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/30 rounded-full blur-3xl"></div>
                <img 
                  src="https://res.cloudinary.com/ecosheane/image/upload/v1751307218/hero_uemhpr.png" 
                  alt="Academy Hero" 
                />
              </div>
            </div>
          </div>
        </section>
      </div>

     

      {/* Course Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Explore Our Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              High-quality, locally relevant content created by the community, for the community
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className={`bg-white/70 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all group ${course.status === 'available' ? '' : 'opacity-70'}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{course.image}</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.status === 'available' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    }`}>
                      {course.status === 'available' ? 'Available' : 'Coming Soon'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors text-gray-900">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {course.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {course.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      {course.language}
                    </div>
                    <div className="flex items-center text-sm text-orange-600">
                      <Award className="w-4 h-4 mr-2" />
                      Earn {course.rewards}
                    </div>
                  </div>
                  <button
                    disabled={course.status !== 'available'}
                    className={`w-full py-3 font-semibold transition-all flex items-center justify-center gap-2 ${
                      course.status === 'available'
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                    }`}
                    onClick={() => handleCourseClick(course)}
                  >
                    {course.status === 'available' ? (
                      <>
                        <Play className="w-4 h-4" />
                        Start Learning
                      </>
                    ) : (
                      'Coming Soon'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
       {/* Stats Section */}
       <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <div className="text-3xl font-bold mb-2 text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How RemiFi Academy Works</h2>
            <p className="text-xl text-gray-600">Decentralized education with transparent rewards</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Learn & Create</h3>
              <p className="text-gray-600">Access high-quality courses or create your own educational content for the community</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Community Validation</h3>
              <p className="text-gray-600">Content quality is determined by community feedback and engagement, not gatekeepers</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Earn Rewards</h3>
              <p className="text-gray-600">Get rewarded in REMIFI tokens based on content quality, engagement, and community value</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Revolution?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Help build Africa's blockchain knowledge base while earning rewards for your contributions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-8 py-4 font-semibold transition-all transform hover:scale-105">
              Start Your Journey
            </button>
            <button className="border border-emerald-500 px-8 py-4 font-semibold transition-colors text-emerald-700 hover:bg-emerald-50">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RemiFiAcademy;