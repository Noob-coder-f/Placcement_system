// components/Classes.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Classes = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      title: 'React Masterclass',
      instructor: 'Sarah Johnson',
      date: '2024-01-20',
      time: '14:00 - 16:00',
      duration: '2 hours',
      category: 'Frontend',
      description: 'Live coding session on React advanced patterns',
      maxStudents: 20,
      enrolledStudents: 15,
      isPaid: false,
      price: 0,
      meetingLink: ''
    },
    {
      id: 2,
      title: 'Node.js Workshop',
      instructor: 'Mike Chen',
      date: '2024-01-22',
      time: '10:00 - 12:00',
      duration: '2 hours',
      category: 'Backend',
      description: 'Hands-on Node.js workshop with real projects',
      maxStudents: 15,
      enrolledStudents: 12,
      isPaid: true,
      price: 49.99,
      meetingLink: ''
    },
    {
      id: 3,
      title: 'System Design Interview Prep',
      instructor: 'Alex Rodriguez',
      date: '2024-01-25',
      time: '16:00 - 18:00',
      duration: '2 hours',
      category: 'Architecture',
      description: 'Prepare for system design interviews',
      maxStudents: 25,
      enrolledStudents: 18,
      isPaid: false,
      price: 0,
      meetingLink: ''
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  const [planInfo, setPlanInfo] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  const navigate = useNavigate();

  const categories = ['All', 'Frontend', 'Backend', 'Architecture', 'Database', 'Mobile'];

  const filteredClasses = selectedCategory === 'All' 
    ? classes 
    : classes.filter(cls => cls.category === selectedCategory);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await axios.get('/api/payments/current-plan');
        if (data.success) {
          setPlanInfo(data);

          // ✅ Define your access rule here:
          // Option A: any non-NONE plan:
          const paidPlan = data.planCategory && data.planCategory !== 'NONE';
          // Option B (optional): require at least 1 jobCredit:
          // const paidPlan = data.planCategory !== 'NONE' && data.jobCredits > 0;

          setHasAccess(paidPlan);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        console.error('Error fetching plan info:', err);
        setHasAccess(false);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, []);


  const handleEnroll = async (classId) => {
    const classItem = classes.find(cls => cls.id === classId);
    
    if (classItem.enrolledStudents >= classItem.maxStudents) {
      alert('Class is full!');
      return;
    }

    if (classItem.isPaid) {
      alert('This is a paid class. Redirecting to payment...');
      return;
    }

    try {
      // API call to enroll
      setEnrolledClasses(prev => [...prev, classId]);
      setClasses(classes.map(cls => 
        cls.id === classId 
          ? { ...cls, enrolledStudents: cls.enrolledStudents + 1 }
          : cls
      ));
      alert('Successfully enrolled in the class!');
    } catch (error) {
      alert('Error enrolling in class', error);
    }
  };

  const handleJoin = (classId) => {
    if (!enrolledClasses.includes(classId)) {
      alert('You are not enrolled in this class!');
      return;
    }
    alert(`Joining class ${classId}`);
  };

  const isUpcoming = (classDate) => {
    return new Date(classDate) > new Date();
  };

  // ⏳ While checking plan
  if (loadingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your subscription...</p>
        </div>
      </div>
    );
  }

  // ❌ No active plan → show upgrade screen instead of classes
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-gray-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Upgrade Required
          </h1>
          <p className="text-gray-600 mb-6">
            You need an active plan to access live classes. 
            Upgrade your plan to unlock all live sessions and premium content.
          </p>

          <button
            onClick={() => navigate('/payments')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3"
          >
            Go to Plans & Pricing
          </button>

          {planInfo && (
            <p className="text-xs text-gray-500">
              Current status: <span className="font-semibold">{planInfo.planCategory || 'NONE'}</span>
              {planInfo.jobCredits !== undefined && ` • Job Credits: ${planInfo.jobCredits}`}
            </p>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Live Classes</h1>
          <p className="text-gray-600 mt-2">Join interactive live classes with expert instructors</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredClasses.map((classItem) => {
            const isEnrolled = enrolledClasses.includes(classItem.id);
            const upcoming = isUpcoming(classItem.date);
            const isFull = classItem.enrolledStudents >= classItem.maxStudents;

            return (
              <div key={classItem.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      classItem.category === 'Frontend' ? 'bg-blue-100 text-blue-800' :
                      classItem.category === 'Backend' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {classItem.category}
                    </span>
                    <div className="flex space-x-2">
                      {classItem.isPaid && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Paid
                        </span>
                      )}
                      {!upcoming && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{classItem.title}</h3>
                  <p className="text-gray-600 mb-4">{classItem.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <span className="mr-2">👨‍🏫</span>
                      {classItem.instructor}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📅</span>
                      {classItem.date}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">⏰</span>
                      {classItem.time}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">👥</span>
                      {classItem.enrolledStudents}/{classItem.maxStudents}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      {classItem.isPaid ? (
                        <span className="text-lg font-semibold text-gray-900">${classItem.price}</span>
                      ) : (
                        <span className="text-green-600 font-semibold">Free</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {isEnrolled && upcoming && (
                        <button
                          onClick={() => handleJoin(classItem.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Join Class
                        </button>
                      )}
                      
                      {!isEnrolled && upcoming && (
                        <button
                          onClick={() => handleEnroll(classItem.id)}
                          disabled={isFull}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isFull
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : classItem.isPaid
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isFull ? 'Class Full' : classItem.isPaid ? 'Enroll & Pay' : 'Enroll Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Classes Message */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏫</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">No classes available for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classes;