/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const App = () => {
  const [pdf, setPdf] = useState(null);
  const [rules, setRules] = useState(["", "", ""]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!pdf || !rules[0]) {
      alert("Upload PDF and enter rules");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", pdf);
    formData.append("rules", JSON.stringify(rules));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/pdf/check-rules",
        formData
      );
      setResults(res.data.results.results);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 flex justify-center items-start py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700 tracking-tight">
          Niyamr AI
        </h1>

        {/* Upload Input */}
        <div className="mb-8">
          <label className="block font-semibold mb-2 text-gray-700">
            Upload PDF File
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Rules Input */}
        <div className="mb-8">
          <label className="block font-semibold mb-2 text-gray-700">
            Enter 3 Rules
          </label>

          {rules.map((rule, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Rule ${i + 1}`}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              value={rule}
              onChange={(e) => {
                const copy = [...rules];
                copy[i] = e.target.value;
                setRules(copy);
              }}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition active:scale-95"
        >
          {loading ? "Checking Document..." : "Check Document"}
        </button>

        {/* RESULTS */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-5 text-gray-800">
              Results Summary
            </h2>

            <div className="overflow-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full bg-white">
                <thead className="bg-gray-100 text-gray-700 text-sm">
                  <tr>
                    <th className="p-3 text-left font-semibold">Rule</th>
                    <th className="p-3 text-left font-semibold">Status</th>
                    <th className="p-3 text-left font-semibold">Evidence</th>
                    <th className="p-3 text-left font-semibold">Reasoning</th>
                    <th className="p-3 text-left font-semibold">Confidence</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {results.map((r, idx) => (
                    <tr
                      key={idx}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{r.rule}</td>

                      <td
                        className={`p-3 font-bold ${
                          r.status === "pass"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </td>

                      <td className="p-3">{r.evidence}</td>
                      <td className="p-3">{r.reasoning}</td>

                      <td className="p-3 font-semibold">{r.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default App;
