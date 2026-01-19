import React, { useEffect, useState } from 'react';
import { Sparkles, Loader, RefreshCw, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import aiService from '../services/aiService';

const BudgetOverview = () => {
  const { budgets, balance, loadBudgets, dashboardData } = useFinance();
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const budgetList = Array.isArray(budgets) ? budgets : [];
  const activeBudgets = budgetList.filter(b => b.isActive !== false);

  useEffect(() => {
    if (!budgets || budgets.length === 0) {
      loadBudgets();
    }
  }, [budgets, loadBudgets]);

  // Fetch AI suggestions when data is available
  const fetchAISuggestions = async () => {
    setIsLoadingAI(true);
    setAiError(null);

    try {
      // Check if we have any financial data
      const hasData = balance && (
        (balance.income > 0 || balance.expense > 0) ||
        activeBudgets.length > 0 ||
        (dashboardData?.recentRecords && dashboardData.recentRecords.length > 0)
      );

      if (!hasData) {
        setAiError('Please add some financial data (income, expenses, or budgets) to get AI suggestions.');
        setIsLoadingAI(false);
        return;
      }

      const financialData = {
        balance,
        budgets: activeBudgets,
        recentTransactions: dashboardData?.recentRecords || [],
        monthlySummary: dashboardData?.monthlyData || null
      };

      console.log('Fetching AI suggestions with data:', financialData);
      const suggestions = await aiService.getFinancialSuggestions(financialData);
      console.log('AI suggestions received:', suggestions);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to fetch AI suggestions:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      // Use the error message from the service, or provide a default
      setAiError(error.message || 'Unable to load AI suggestions. Please try again.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Don't auto-load AI suggestions - let user click to load
  // This prevents showing errors if credits aren't available
  // useEffect(() => {
  //   if (balance && (budgets?.length > 0 || balance.expense > 0)) {
  //     fetchAISuggestions();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [balance, budgets, dashboardData]);


  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Financial Advisor</h3>
            <p className="text-sm text-gray-600">Personalized insights & savings recommendations</p>
          </div>
        </div>
        <button
          onClick={fetchAISuggestions}
          disabled={isLoadingAI}
          className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
          title="Refresh suggestions"
        >
          <RefreshCw className={`w-5 h-5 ${isLoadingAI ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State */}
      {isLoadingAI && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-700">Analyzing your financial data...</p>
          <p className="mt-1 text-xs text-gray-500">This may take a few seconds</p>
        </div>
      )}

      {/* Error State */}
      {aiError && !isLoadingAI && (
        <div className={`rounded-xl p-5 border ${aiError.includes('API Key') ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'
          }`}>
          <div className="flex items-start">
            <AlertCircle className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${aiError.includes('API Key') ? 'text-blue-600' : 'text-amber-600'
              }`} />
            <div className="flex-1">
              <h4 className={`text-sm font-semibold mb-1 ${aiError.includes('API Key') ? 'text-blue-800' : 'text-amber-800'
                }`}>
                {aiError.includes('API Key') ? 'Configuration Required' : 'AI Service Unavailable'}
              </h4>
              <p className={`text-sm mb-3 ${aiError.includes('API Key') ? 'text-blue-700' : 'text-amber-700'
                }`}>
                {aiError}
              </p>
              <button
                onClick={fetchAISuggestions}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${aiError.includes('API Key')
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
                  }`}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try again</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions Content */}
      {!isLoadingAI && !aiError && aiSuggestions && (
        <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl p-6 border border-gray-100">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                {(() => {
                  const text = aiSuggestions.trim();
                  return text.length > 500 ? text.substring(0, 500) + '...' : text;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoadingAI && !aiError && !aiSuggestions && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">Ready to Get Started</h4>
          <p className="text-sm text-gray-600 mb-4">Click the refresh button above to get AI-powered financial insights</p>
          <button
            onClick={fetchAISuggestions}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get AI Suggestions</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default BudgetOverview;
