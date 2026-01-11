import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFeedback } from "../services/api";


const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (
      selectedFile.type === 'text/csv' ||
      selectedFile.name.toLowerCase().endsWith('.csv')
    ) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a CSV file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadFeedback(file);

      setSuccess(
        `Successfully processed ${result.rows_processed} feedback entries!`
      );

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Failed to upload file'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Upload Customer Feedback
        </h1>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="font-semibold text-gray-900 mb-2">
            CSV Format Requirements:
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>File must be in CSV format (.csv)</li>
            <li>
              Must contain one of these columns:{' '}
              <code className="bg-gray-200 px-1 rounded">feedback_text</code>,{' '}
              <code className="bg-gray-200 px-1 rounded">feedback</code>,{' '}
              <code className="bg-gray-200 px-1 rounded">text</code>,{' '}
              <code className="bg-gray-200 px-1 rounded">comment</code>,{' '}
              <code className="bg-gray-200 px-1 rounded">review</code>
            </li>
            <li>Other columns will be ignored</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select CSV File
            </label>

            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={loading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-deloitte-green file:text-white
                hover:file:bg-green-600
                cursor-pointer"
            />

            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected:{' '}
                <span className="font-medium">{file.name}</span> (
                {(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
              <p className="mt-2 text-sm">Redirecting to dashboard…</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-deloitte-green hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
          >
            {loading ? 'Processing…' : 'Upload and Analyze'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
