import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Feedback & Sentiment Analysis System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Analyze customer feedback, extract insights, and understand sentiment 
            patterns to drive business decisions.
          </p>
          
          <div className="mt-12 space-y-6 text-left">
            <div className="border-l-4 border-deloitte-green pl-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                How It Works
              </h2>
              <p className="text-gray-700">
                Upload your customer feedback data in CSV format, and our system 
                will automatically analyze sentiment, extract key insights, and 
                present actionable analytics on an interactive dashboard.
              </p>
            </div>

            <div className="border-l-4 border-deloitte-green pl-4">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Key Features
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Automated sentiment analysis using VADER</li>
                <li>Real-time sentiment distribution visualization</li>
                <li>Keyword extraction from negative feedback</li>
                <li>Interactive dashboard with comprehensive insights</li>
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <Link
              to="/upload"
              className="inline-block bg-deloitte-green hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-md"
            >
              Upload Feedback Data
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
