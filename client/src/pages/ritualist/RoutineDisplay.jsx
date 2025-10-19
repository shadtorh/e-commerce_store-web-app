import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiPlay, FiPause, FiShare2, FiBookmark, FiClock } from 'react-icons/fi';
import useRitualistStore from '../../stores/useRitualistStore';
import VoiceService from '../../services/voiceService';
import { toast } from 'react-toastify';

const RoutineDisplay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveRoutine, completeRoutine, scheduleNotification } = useRitualistStore();
  
  const [routine] = useState(location.state?.routine);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceService] = useState(() => new VoiceService());
  const [currentStep, setCurrentStep] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  useEffect(() => {
    voiceService.init();
    return () => {
      voiceService.stopSpeaking();
    };
  }, [voiceService]);

  const handlePlayAudio = () => {
    if (isPlaying) {
      voiceService.stopSpeaking();
      setIsPlaying(false);
    } else {
      voiceService.speakRoutineSteps(routine);
      setIsPlaying(true);
    }
  };

  const handleSaveRoutine = async () => {
    try {
      await saveRoutine(routine);
      toast.success('Routine saved to your library!');
      setShowSchedule(true);
    } catch (error) {
      console.error('Error saving routine:', error);
      toast.error('Failed to save routine');
    }
  };

  const handleScheduleNotification = async () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error('Please select date and time');
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    
    try {
      await scheduleNotification(routine.id, scheduledDateTime.toISOString(), {
        useVoice: true
      });
      toast.success('Reminder scheduled!');
      setShowSchedule(false);
    } catch (error) {
      console.error('Error scheduling notification:', error);
      toast.error('Failed to schedule reminder');
    }
  };

  const handleStartRoutine = () => {
    toast.success('Routine started! Follow the steps below.');
    setCurrentStep(0);
  };

  const handleCompleteRoutine = async () => {
    try {
      await completeRoutine(routine.id);
      toast.success('🎉 Routine completed! Great job!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Error completing routine:', error);
      toast.error('Failed to complete routine');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: routine.routineTitle,
          text: `Check out my ${routine.routineTitle} routine on Ritualist!`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      toast.info('Share feature not supported on this device');
    }
  };

  if (!routine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No routine found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Go to Dashboard
          </button>
        </div>
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
        </motion.div>

        {/* Routine Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl">{routine.mood.emoji}</span>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {routine.routineTitle}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <FiClock />
                    <span>{routine.routineDuration} minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Voice Guidance</p>
                <p className="text-sm text-gray-600">Listen to step-by-step instructions</p>
              </div>
              <button
                onClick={handlePlayAudio}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isPlaying
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-white text-purple-600 hover:bg-gray-100'
                }`}
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Routine Steps
            </h3>
            <div className="space-y-4">
              {routine.routineSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                    currentStep === index
                      ? 'bg-purple-100 border-2 border-purple-500'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{step.text}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Duration: {step.duration} minutes
                    </p>
                  </div>
                  {currentStep === index && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setCurrentStep(index + 1)}
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Next →
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={handleStartRoutine}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FiPlay />
              Start
            </button>
            <button
              onClick={handleSaveRoutine}
              className="bg-white text-purple-600 border-2 border-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
            >
              <FiBookmark />
              Save
            </button>
            <button
              onClick={handleShare}
              className="bg-white text-blue-600 border-2 border-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <FiShare2 />
              Share
            </button>
            <button
              onClick={() => setShowSchedule(true)}
              className="bg-white text-green-600 border-2 border-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2"
            >
              <FiClock />
              Schedule
            </button>
          </div>
        </motion.div>

        {/* Schedule Modal */}
        {showSchedule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSchedule(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Schedule Reminder
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleScheduleNotification}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Schedule
                  </button>
                  <button
                    onClick={() => setShowSchedule(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Complete Button */}
        {currentStep >= routine.routineSteps.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Great Job! 🎉
            </h3>
            <p className="text-gray-600 mb-6">
              You've completed all the steps. Ready to mark this routine as complete?
            </p>
            <button
              onClick={handleCompleteRoutine}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Complete Routine
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoutineDisplay;
