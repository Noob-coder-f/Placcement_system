// components/Payments.js
import React, { useState } from 'react';
import axios from 'axios';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [paymentHistory] = useState([
    {
      id: 1,
      amount: 29.99,
      currency: 'USD',
      date: '2024-01-15',
      description: 'Video Lecture - Advanced Node.js',
      status: 'success',
      paymentId: 'pay_123456'
    },
    {
      id: 2,
      amount: 49.99,
      currency: 'USD',
      date: '2024-01-10',
      description: 'Node.js Workshop Enrollment',
      status: 'success',
      paymentId: 'pay_123457'
    },
    {
      id: 3,
      amount: 19.99,
      currency: 'USD',
      date: '2024-01-05',
      description: 'Study Material - System Design',
      status: 'failed',
      paymentId: 'pay_123458'
    }
  ]);

  const plans = [
    {
      id: 'free',
      name: 'FREE',
      price: 0,
      duration: 'Forever',
      features: [
        '2 free job applications per month',
        'Access to free study materials',
        'Basic video lectures',
        'Free live classes',
        'Email support'
      ],
      current: true
    },
    {
      id: 'basic',
      name: 'BASIC',
      price: 9.99,
      duration: 'per month',
      features: [
        '10 job applications per month',
        'All study materials',
        'All video lectures',
        'Priority class enrollment',
        'Email & chat support',
        'Resume review'
      ],
      current: false
    },
    {
      id: 'premium',
      name: 'PREMIUM',
      price: 19.99,
      duration: 'per month',
      features: [
        'Unlimited job applications',
        'All study materials + early access',
        'All video lectures + exclusive content',
        'Guaranteed class enrollment',
        '24/7 priority support',
        'Resume review + optimization',
        'Mentorship sessions',
        'Career guidance'
      ],
      current: false
    }
  ];

  const handleUpgrade = async (planId) => {
    try {
      // API call to upgrade plan
       await axios.post('/api/payments/upgrade', { planId });
      alert(`Successfully upgraded to ${planId.toUpperCase()} plan!`);
      // Refresh page or update state
    } catch (error) {
      alert('Error upgrading plan', error);
    }
  };

  const handleRetryPayment = async (paymentId) => {
    try {
      // API call to retry payment
      await axios.post('/api/payments/retry', { paymentId });
      alert('Payment retried successfully!');
    } catch (error) {
      alert('Error retrying payment', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and payment history</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('plans')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'plans'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Subscription Plans
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Payment History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Subscription Plans */}
            {activeTab === 'plans' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
                  <p className="text-gray-600">Upgrade to unlock more features and opportunities</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-xl border-2 p-6 transition-all ${
                        plan.current
                          ? 'border-blue-500 bg-blue-50 transform scale-105'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      {plan.current && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                            Current Plan
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                          {plan.price > 0 && (
                            <span className="text-gray-600 ml-2">/{plan.duration}</span>
                          )}
                        </div>
                        {plan.price === 0 && (
                          <span className="text-gray-600">{plan.duration}</span>
                        )}
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-3">✓</span>
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={plan.current}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                          plan.current
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : plan.id === 'premium'
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {plan.current ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade Now'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment History */}
            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
                
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment.id} className="border-b border-gray-200 last:border-b-0">
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.date}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{payment.description}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">
                              ${payment.amount} {payment.currency}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {payment.status === 'failed' && (
                                <button
                                  onClick={() => handleRetryPayment(payment.paymentId)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  Retry Payment
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {paymentHistory.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No payment history</h3>
                    <p className="text-gray-600">Your payment history will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;