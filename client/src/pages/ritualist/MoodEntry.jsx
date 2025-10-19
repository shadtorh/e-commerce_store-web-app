import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import useRitualistStore from '../../stores/useRitualistStore';
import { moods } from '../../data/moods';
import { toast } from 'react-toastify';

const MoodEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addMoodEntry, generateRoutine } = useRitualistStore();
  
  const [selectedMood, setSelectedMood] = useState(location.state?.mood || null);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const filteredMoods = moods.filter(mood =>
    mood.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowNotes(true);
  };

  const handleGenerateRoutine = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }

    setIsGenerating(true);

    try {
      // Save mood entry
      await addMoodEntry({
        mood: selectedMood,
        notes,
        timestamp: new Date().toISOString()
      });

      // Generate routine
      const routine = await generateRoutine(selectedMood, notes);
      
      setTimeout(() => {
        setIsGenerating(false);
        navigate('/routine-display', { state: { routine } });
      }, 2000); // Simulate generation time
    } catch (error) {
      console.error('Error generating routine:', error);
      toast.error('Failed to generate routine');
      setIsGenerating(false);
    }
  };

  const handleSaveOnly = async () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }

    try {
      await addMoodEntry({
        mood: selectedMood,
        notes,
        timestamp: new Date().toISOString()
      });

      toast.success('Mood saved successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving mood:', error);
      toast.error('Failed to save mood');
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-8xl mb-6"
          >
            {selectedMood?.emoji}
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Generating Your Routine...
          </h2>
          <p className="text-gray-600">
            Creating a personalized routine based on your mood
          </p>
          <motion.div
            className="mt-8 flex justify-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-purple-600 rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple-600 hover:text-purple-700 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            How are you feeling?
          </h1>
          <p className="text-gray-600">
            Select the emoji that best represents your current mood
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search emotions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* Mood Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            <AnimatePresence>
              {filteredMoods.map((mood) => (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood)}
                  className={`aspect-square flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                    selectedMood?.id === mood.id
                      ? 'bg-purple-600 shadow-lg'
                      : 'bg-gradient-to-br from-purple-100 to-blue-100 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-1">{mood.emoji}</div>
                  <div
                    className={`text-xs font-medium text-center ${
                      selectedMood?.id === mood.id ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {mood.name}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Notes Section */}
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6 overflow-hidden"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Add Notes (Optional)
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind? Any specific thoughts or situations you'd like to share?"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={handleGenerateRoutine}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Generate Routine
            </button>
            <button
              onClick={handleSaveOnly}
              className="flex-1 bg-white text-purple-600 border-2 border-purple-600 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all"
            >
              Save Mood Only
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MoodEntry;
