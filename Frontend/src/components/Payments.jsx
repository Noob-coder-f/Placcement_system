// components/Payments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPlan, setCurrentPlan] = useState({});
  const [loading, setLoading] = useState(false);

  // Plan configurations - ALL PAID PLANS ONLY
const plans = [
  {
    id: 'silver',
    name: 'SILVER',
    price: 199,
    duration: 'One-time purchase',
    category: 'SILVER',
    credits: 10, // 🎯 Only difference
    features: [
      '10 job application credits',
      'Full access to study materials',
      'Full access to all video lectures',
      'Email support'
    ],
    popular: false
  },
  {
    id: 'gold',
    name: 'GOLD',
    price: 299,
    duration: 'One-time purchase',
    category: 'GOLD',
    credits: 25, // 🎯 Only difference
    features: [
      '25 job application credits',
      'Full access to study materials',
      'Full access to all video lectures',
      'Priority support',
      'Resume review & optimization'
    ],
    popular: true
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    price: 399,
    duration: 'One-time purchase',
    category: 'PLATINUM',
    credits: 50, // 🎯 Only difference (or unlimited → your choice)
    features: [
      '50 job application credits',
      'Full access to study materials',
      'Full access to all video lectures',
      '24/7 priority support',
      'Career guidance & mock interviews',
    ],
    popular: false
  }
];


  useEffect(() => {
    fetchPaymentHistory();
    fetchCurrentPlan();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get('/api/payments/history');
      if (response.data.success) {
        setPaymentHistory(response.data.paymentHistory);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const response = await axios.get('/api/payments/current-plan');
      if (response.data.success) {
        setCurrentPlan(response.data);
      }
    } catch (error) {
      console.error('Error fetching current plan:', error);
    }
  };

  const handlePurchase = async (planId) => {
    try {
      setLoading(true);
      const plan = plans.find(p => p.id === planId);
      
      const response = await axios.post('/api/payments/purchase', { 
        planId: plan.id,
        planCategory: plan.category,
        amount: plan.price,
        // In real implementation, you'd get internId from auth context
        // internId: user.id 
      });
      
      if (response.data.success) {
        // Redirect to payment gateway or show success message
        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          alert(`Successfully purchased ${plan.name} plan! ${plan.credits} credits added.`);
          fetchCurrentPlan();
          fetchPaymentHistory();
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert(`Error purchasing plan: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = async (paymentId) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/payments/retry', { 
        paymentId,
        // internId: user.id 
      });
      
      if (response.data.success) {
        alert('Payment retried successfully!');
        fetchPaymentHistory();
        fetchCurrentPlan();
      }
    } catch (error) {
      console.error('Retry payment error:', error);
      alert(`Error retrying payment: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get current plan display name
  const getCurrentPlanName = () => {
    if (!currentPlan.planCategory || currentPlan.planCategory === 'NONE') {
      return 'No Active Plan';
    }
    const plan = plans.find(p => p.category === currentPlan.planCategory);
    return plan ? plan.name : 'No Active Plan';
  };

  // Check if user has any active plan
  const hasActivePlan = () => {
    return currentPlan.planCategory && currentPlan.planCategory !== 'NONE';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with current plan info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments & Billing</h1>
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-gray-600">
                  Current Plan: <span className="font-semibold text-lg text-gray-900">{getCurrentPlanName()}</span>
                </p>
                {hasActivePlan() && currentPlan.jobCredits !== undefined && (
                  <p className="text-gray-600 mt-1">
                    Available Job Credits: <span className="font-semibold text-green-600">{currentPlan.jobCredits}</span>
                  </p>
                )}
              </div>
              {!hasActivePlan() && (
                <div className="mt-2 md:mt-0">
                  <p className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded-md">
                    ⚠️ No active plan. Purchase a plan to access job applications and premium content.
                  </p>
                </div>
              )}
            </div>
          </div>
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
                  <p className="text-gray-600">Purchase a plan to unlock job applications and premium content</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {plans.map((plan) => {
                    const isCurrentPlan = plan.category === currentPlan.planCategory;
                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-xl border-2 p-6 transition-all ${
                          isCurrentPlan
                            ? 'border-blue-500 bg-blue-50 transform scale-105'
                            : plan.popular
                            ? 'border-yellow-400 bg-white shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
                              Most Popular
                            </span>
                          </div>
                        )}

                        {isCurrentPlan && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                              Current Plan
                            </span>
                          </div>
                        )}

                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                          <div className="flex items-baseline justify-center mb-2">
                            <span className="text-3xl font-bold text-gray-900">{formatCurrency(plan.price)}</span>
                            <span className="text-gray-600 ml-2">/{plan.duration}</span>
                          </div>
                          <div className="text-green-600 font-semibold">
                            {plan.credits === 50 ? 'Unlimited' : `${plan.credits}`} Job Credits
                          </div>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-3 mt-1 flex-shrink-0">✓</span>
                              <span className="text-gray-600 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handlePurchase(plan.id)}
                          disabled={isCurrentPlan || loading}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                            isCurrentPlan
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : plan.popular
                              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 disabled:bg-yellow-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
                          }`}
                        >
                          {loading ? 'Processing...' : 
                           isCurrentPlan ? 'Current Plan' : 
                           'Purchase Now'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Important Notice */}
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-600 text-lg">💡</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        You need to purchase a plan to access job applications and premium content. 
                        Choose the plan that best fits your needs and start applying to internships today!
                      </p>
                    </div>
                  </div>
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
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Plan</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {formatDate(payment.date)}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">
                              Plan Purchase - {payment.planPurchased}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {payment.planPurchased}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.status?.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {payment.status === 'failed' && (
                                <button
                                  onClick={() => handleRetryPayment(payment._id)}
                                  disabled={loading}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-blue-300"
                                >
                                  {loading ? 'Processing...' : 'Retry Payment'}
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
                    <p className="text-gray-600">Your payment history will appear here after you make your first purchase.</p>
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