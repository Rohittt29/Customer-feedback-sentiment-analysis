import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSentimentSummary, getKeywords, getSampleFeedback } from '../services/api';

const COLORS = {
  Positive: '#86BC25',
  Negative: '#DC2626',
  Neutral: '#6B7280',
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [sampleFeedback, setSampleFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [summaryData, keywordsData, feedbackData] = await Promise.all([
        getSentimentSummary(),
        getKeywords(10),
        getSampleFeedback(50),
      ]);

      setSummary(summaryData);
      setKeywords(keywordsData.keywords || []);
      setSampleFeedback(feedbackData.feedback || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-deloitte-green"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
          <button
            onClick={loadDashboardData}
            className="mt-4 bg-deloitte-green hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!summary || summary.total === 0) {
    return (
      <div className="px-4 sm:px-0">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-6">No data available. Please upload feedback data first.</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Positive', value: summary.positive, percentage: summary.positive_percentage },
    { name: 'Negative', value: summary.negative, percentage: summary.negative_percentage },
    { name: 'Neutral', value: summary.neutral, percentage: summary.neutral_percentage },
  ];

  const barData = [
    { name: 'Positive', count: summary.positive, percentage: summary.positive_percentage },
    { name: 'Neutral', count: summary.neutral, percentage: summary.neutral_percentage },
    { name: 'Negative', count: summary.negative, percentage: summary.negative_percentage },
  ];

  const keywordsBarData = keywords.slice(0, 10).map(kw => ({
    name: kw.word,
    count: kw.count,
  }));

  const getSentimentColor = (label) => {
    return COLORS[label] || COLORS.Neutral;
  };

  return (
    <div className="px-4 sm:px-0 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
        
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Total Feedback</p>
            <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600">Positive</p>
            <p className="text-2xl font-bold text-deloitte-green">{summary.positive}</p>
            <p className="text-sm text-gray-600">{summary.positive_percentage}%</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-gray-600">Negative</p>
            <p className="text-2xl font-bold text-red-600">{summary.negative}</p>
            <p className="text-sm text-gray-600">{summary.negative_percentage}%</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Neutral</p>
            <p className="text-2xl font-bold text-gray-600">{summary.neutral}</p>
            <p className="text-sm text-gray-600">{summary.neutral_percentage}%</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sentiment Pie Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment Bar Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sentiment Count</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keywords Chart */}
        {keywords.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Top Keywords from Negative Feedback
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={keywordsBarData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#DC2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sample Feedback Table */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Feedback</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleFeedback.slice(0, 20).map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                      {item.feedback_text.length > 100
                        ? `${item.feedback_text.substring(0, 100)}...`
                        : item.feedback_text}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className="px-2 py-1 text-xs font-semibold rounded-full"
                        style={{
                          backgroundColor: `${getSentimentColor(item.sentiment_label)}20`,
                          color: getSentimentColor(item.sentiment_label),
                        }}
                      >
                        {item.sentiment_label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.sentiment_score.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sampleFeedback.length > 20 && (
            <p className="mt-4 text-sm text-gray-600 text-center">
              Showing 20 of {sampleFeedback.length} feedback entries
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
