import React, { useState } from 'react';
import { 
  Play, 
  BookOpen, 
  Users, 
  Globe, 
  Award, 
  Clock, 
  CheckCircle, 
  Lock, 
  ArrowLeft, 
  Star, 
  Download,
  MessageCircle,
  Share2,
  Bookmark,
  User,
  Calendar,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Navbar from '../home/Navbar';
import Footer from '../home/Footer';

const CourseDetailPage = (props) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModule, setExpandedModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([1, 2, 5]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const onPageChange = props.onPageChange;

  // Sample course data
  const course = {
    title: "Complete Blockchain & Cryptocurrency Course",
    description: "Master blockchain technology and cryptocurrency fundamentals with practical examples from the African market. Learn from industry experts and earn while you learn.",
    image: "🔗",
    rating: 4.8,
    students: 12500,
    duration: "8 hours",
    language: "English",
    level: "Beginner",
    price: "Free",
    rewards: "150 AFX",
    lastUpdated: "Dec 2024"
  };

  const modules = [
    {
      id: 1,
      title: "Blockchain Fundamentals",
      duration: "45 min",
      lessons: [
        { id: 1, title: "What is Blockchain?", duration: "12 min", type: "video", completed: true },
        { id: 2, title: "How Does Blockchain Work?", duration: "15 min", type: "video", completed: true },
        { id: 3, title: "Blockchain vs Traditional Systems", duration: "10 min", type: "reading", completed: false },
        { id: 4, title: "Quiz: Blockchain Basics", duration: "8 min", type: "quiz", completed: false }
      ]
    },
    {
      id: 2,
      title: "Understanding Cryptocurrency",
      duration: "60 min",
      lessons: [
        { id: 5, title: "Introduction to Cryptocurrency", duration: "18 min", type: "video", completed: true },
        { id: 6, title: "Bitcoin vs Altcoins", duration: "20 min", type: "video", completed: false },
        { id: 7, title: "Cryptocurrency Wallets", duration: "15 min", type: "interactive", completed: false },
        { id: 8, title: "Practical Exercise: Setting up a Wallet", duration: "7 min", type: "exercise", completed: false }
      ]
    },
    {
      id: 3,
      title: "Cryptocurrency in Africa",
      duration: "75 min",
      lessons: [
        { id: 9, title: "African Crypto Landscape", duration: "25 min", type: "video", completed: false },
        { id: 10, title: "Local Use Cases & Adoption", duration: "20 min", type: "case-study", completed: false },
        { id: 11, title: "Regulatory Environment", duration: "20 min", type: "reading", completed: false },
        { id: 12, title: "Building Local Communities", duration: "10 min", type: "discussion", completed: false }
      ]
    },
    {
      id: 4,
      title: "Security & Best Practices",
      duration: "50 min",
      lessons: [
        { id: 13, title: "Crypto Security Fundamentals", duration: "20 min", type: "video", completed: false },
        { id: 14, title: "Common Scams & How to Avoid Them", duration: "15 min", type: "case-study", completed: false },
        { id: 15, title: "Advanced Security Measures", duration: "10 min", type: "reading", completed: false },
        { id: 16, title: "Final Assessment", duration: "5 min", type: "exam", completed: false }
      ]
    }
  ];

  const reviews = [
    {
      id: 1,
      user: "Amina Hassan",
      avatar: "👩🏿",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent course! The explanations are clear and the African context makes it very relevant. Earned my first AFX tokens!"
    },
    {
      id: 2,
      user: "Joseph Okonkwo",
      avatar: "👨🏿",
      rating: 5,
      date: "1 week ago",
      comment: "Dr. Asante explains complex concepts in a way that's easy to understand. The practical exercises were very helpful."
    },
    {
      id: 3,
      user: "Fatima Al-Rashid",
      avatar: "👩🏿‍💼",
      rating: 4,
      date: "2 weeks ago",
      comment: "Great introduction to blockchain. Would love to see more advanced courses in local languages."
    }
  ];

  const instructor = {
    name: "Dr. Kwame Asante",
    title: "Blockchain Expert & Educator",
    avatar: "👨🏿‍💼",
    rating: 4.9,
    students: 12500,
    courses: 8,
    bio: "Dr. Kwame Asante is a leading blockchain educator and consultant with over 8 years of experience in cryptocurrency and distributed ledger technology. He has helped thousands of students across Africa understand and leverage blockchain technology for financial empowerment."
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return '🎥';
      case 'reading': return '📖';
      case 'quiz': return '❓';
      case 'exercise': return '⚡';
      case 'interactive': return '🎮';
      case 'case-study': return '📊';
      case 'discussion': return '💬';
      case 'exam': return '🎯';
      default: return '📝';
    }
  };

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedCount = completedLessons.length;
  const progressPercentage = (completedCount / totalLessons) * 100;

  const handleEnroll = async () => {
    setEnrolling(true);
    await new Promise(res => setTimeout(res, 1200));
    setIsEnrolled(true);
    setEnrolling(false);
  };

  return (
    <div className="min-h-screen  bg-gray-50">
      <Navbar onPageChange={onPageChange} />
      <div className="min-h-screen  bg-gray-50">
        {/* Navigation features (e.g., back button) can be added here if needed */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 mt-20 space-y-6">
              
              {/* Course Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="text-6xl">{course.image}</div>
                  <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-yellow-700">{course.rating}</span>
                    <span className="text-yellow-600 text-sm">({course.students.toLocaleString()})</span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">{course.title}</h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{course.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">{course.language}</span>
                  </div>
                  <div className="flex items-center text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="font-medium">{course.rewards}</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-medium">Certificate</span>
                  </div>
                </div>

                {/* Progress Bar (if enrolled) */}
                {isEnrolled && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-700">Your Progress</span>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded-full">{completedCount}/{totalLessons} lessons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-600">{Math.round(progressPercentage)}% Complete</span>
                      <span className="text-xs text-emerald-600 font-medium">Keep going! 🎯</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100">
                  <nav className="flex px-8">
                    {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-6 border-b-2 font-medium text-sm capitalize transition-all duration-200 ${
                          activeTab === tab
                            ? 'border-orange-500 text-orange-600 bg-orange-50'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-8">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900">What You'll Learn</h3>
                        <div className="grid gap-4">
                          {[
                            "Understand blockchain technology and its core principles",
                            "Learn about different types of cryptocurrencies and their use cases",
                            "Explore the African cryptocurrency landscape and opportunities",
                            "Master security best practices for cryptocurrency storage",
                            "Set up and manage your first cryptocurrency wallet"
                          ].map((item, index) => (
                            <div key={index} className="flex items-start bg-green-50 rounded-lg p-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-6 text-gray-900">Course Features</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { icon: Download, color: 'blue', text: 'Downloadable resources' },
                            { icon: Award, color: 'green', text: 'Certificate of completion' },
                            { icon: Clock, color: 'purple', text: 'Lifetime access' },
                            { icon: MessageCircle, color: 'orange', text: 'Community support' }
                          ].map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4">
                              <div className={`w-10 h-10 bg-${feature.color}-100 rounded-xl flex items-center justify-center`}>
                                <feature.icon className={`w-5 h-5 text-${feature.color}-600`} />
                              </div>
                              <span className="font-medium text-gray-700">{feature.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Curriculum Tab */}
                  {activeTab === 'curriculum' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900">Course Curriculum</h3>
                        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          {totalLessons} lessons • {course.duration}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {modules.map((module) => (
                          <div key={module.id} className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                            >
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">{module.title}</h4>
                                <p className="text-sm text-gray-600">{module.lessons.length} lessons • {module.duration}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                  {module.lessons.filter(l => completedLessons.includes(l.id)).length}/{module.lessons.length}
                                </div>
                                {expandedModule === module.id ? (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </button>
                            
                            {expandedModule === module.id && (
                              <div className="border-t border-gray-100 bg-gray-50">
                                {module.lessons.map((lesson) => (
                                  <div key={lesson.id} className="flex items-center justify-between p-4 ml-8 hover:bg-white rounded-lg mx-2 my-1 transition-colors duration-200">
                                    <div className="flex items-center space-x-3">
                                      <span className="text-lg">{getTypeIcon(lesson.type)}</span>
                                      <div>
                                        <span className={`text-sm font-medium ${lesson.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                                          {lesson.title}
                                        </span>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                                          <span className="text-xs text-gray-300">•</span>
                                          <span className="text-xs text-gray-500 capitalize">{lesson.type}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {lesson.completed ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                      ) : isEnrolled ? (
                                        <Play className="w-5 h-5 text-orange-500 hover:text-orange-600 cursor-pointer" />
                                      ) : (
                                        <Lock className="w-5 h-5 text-gray-400" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Instructor Tab */}
                  {activeTab === 'instructor' && (
                    <div className="space-y-6">
                      <div className="flex items-start space-x-6 bg-gray-50 rounded-2xl p-6">
                        <div className="text-6xl">{instructor.avatar}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2 text-gray-900">{instructor.name}</h3>
                          <p className="text-gray-600 mb-4">{instructor.title}</p>
                          
                          <div className="grid grid-cols-3 gap-6 mb-6">
                            <div className="text-center bg-white rounded-lg p-4">
                              <div className="text-2xl font-bold text-gray-900">{instructor.rating}</div>
                              <div className="text-sm text-gray-600">Rating</div>
                            </div>
                            <div className="text-center bg-white rounded-lg p-4">
                              <div className="text-2xl font-bold text-gray-900">{instructor.students.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Students</div>
                            </div>
                            <div className="text-center bg-white rounded-lg p-4">
                              <div className="text-2xl font-bold text-gray-900">{instructor.courses}</div>
                              <div className="text-sm text-gray-600">Courses</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white">
                        <p className="text-gray-700 leading-relaxed">{instructor.bio}</p>
                      </div>
                    </div>
                  )}

                  {/* Reviews Tab */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Student Reviews</h3>
                        <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-semibold text-yellow-700">{course.rating}</span>
                          <span className="text-yellow-600 text-sm">({course.students.toLocaleString()} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-start space-x-4">
                              <div className="text-3xl">{review.avatar}</div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{review.user}</h4>
                                    <div className="flex items-center space-x-1 mt-1">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{review.date}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Enrollment Card */}
            <div className="space-y-6 flex  mt-20 flex-col">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{course.price}</div>
                  <div className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full inline-block">
                    Earn up to {course.rewards}
                  </div>
                </div>
                
                {!isEnrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg mb-4 ${enrolling ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {enrolling ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Enrolling...
                      </div>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                ) : (
                  <button className="w-full bg-green-500 text-white py-4 px-6 rounded-xl font-semibold text-lg mb-4 flex items-center justify-center" disabled>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Successfully Enrolled
                  </button>
                )}
                
                <div className="text-center text-sm text-gray-600 mb-6 bg-gray-50 py-2 px-4 rounded-lg">
                  <Users className="w-4 h-4 inline mr-1" />
                  {course.students.toLocaleString()} students enrolled
                </div>
                
                <div className="space-y-4 text-sm">
                  {[
                    { label: 'Duration', value: course.duration, icon: Clock },
                    { label: 'Lessons', value: totalLessons, icon: BookOpen },
                    { label: 'Level', value: course.level, icon: TrendingUp },
                    { label: 'Language', value: course.language, icon: Globe },
                    { label: 'Last Updated', value: course.lastUpdated, icon: Calendar }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center text-gray-600">
                        <item.icon className="w-4 h-4 mr-2" />
                        <span>{item.label}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Courses */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-0">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Related Courses</h3>
                <div className="space-y-3">
                  {[
                    { title: "DeFi Basics", level: "Intermediate", reward: "75 AFX", emoji: "🏦" },
                    { title: "Wallet Security", level: "Beginner", reward: "50 AFX", emoji: "🔐" },
                    { title: "Trading Strategies", level: "Advanced", reward: "100 AFX", emoji: "📈" }
                  ].map((relatedCourse, index) => (
                    <div key={index} className=" rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{relatedCourse.emoji}</span>
                          <h4 className="font-semibold text-sm text-gray-900">{relatedCourse.title}</h4>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full">{relatedCourse.level}</span>
                        <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded-full font-medium">{relatedCourse.reward}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer onPageChange={onPageChange} />
    </div>
  );
};

export default CourseDetailPage;