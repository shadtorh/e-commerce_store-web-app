import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useRitualistStore from '../../stores/useRitualistStore';
import { goals, routineTimes, routineDurations, avoidActivities } from '../../data/moods';
import { toast } from 'react-toastify';

const Onboarding = () => {
  const navigate = useNavigate();
  const { updateOnboardingData, completeOnboarding } = useRitualistStore();
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    goals: [],
    routineTime: '',
    routineDuration: '',
    avoidActivities: []
  });

  const handleGoalToggle = (goalId) => {
    setSelections(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleAvoidActivityToggle = (activityId) => {
    setSelections(prev => ({
      ...prev,
      avoidActivities: prev.avoidActivities.includes(activityId)
        ? prev.avoidActivities.filter(a => a !== activityId)
        : [...prev.avoidActivities, activityId]
    }));
  };

  const handleNext = () => {
    if (step === 1 && selections.goals.length === 0) {
      toast.error('Please select at least one goal');
      return;
    }
    if (step === 2 && !selections.routineTime) {
      toast.error('Please select a preferred time');
      return;
    }
    if (step === 3 && !selections.routineDuration) {
      toast.error('Please select a duration');
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    updateOnboardingData(selections);
    await completeOnboarding();
    toast.success('Welcome to Ritualist!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step} of 4
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
            />
          </div>
        </div>

        {/* Step 1: Goals */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What are your goals?
            </h2>
            <p className="text-gray-600 mb-8">
              Select all that apply to personalize your experience
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleGoalToggle(goal.id)}
                  className={`p-6 rounded-xl text-center transition-all ${
                    selections.goals.includes(goal.id)
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-800 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-2">{goal.icon}</div>
                  <div className="font-semibold">{goal.label}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Routine Time */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              When do you prefer routines?
            </h2>
            <p className="text-gray-600 mb-8">
              Choose the time that works best for you
            </p>
            <div className="space-y-4 mb-8">
              {routineTimes.map((time) => (
                <button
                  key={time.id}
                  onClick={() => setSelections(prev => ({ ...prev, routineTime: time.id }))}
                  className={`w-full p-6 rounded-xl text-left transition-all ${
                    selections.routineTime === time.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-800 hover:shadow-md'
                  }`}
                >
                  <div className="font-semibold text-lg mb-1">{time.label}</div>
                  <div className={selections.routineTime === time.id ? 'text-purple-100' : 'text-gray-600'}>
                    {time.time}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Duration */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              How long should routines be?
            </h2>
            <p className="text-gray-600 mb-8">
              Select your preferred routine duration
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {routineDurations.map((duration) => (
                <button
                  key={duration.id}
                  onClick={() => setSelections(prev => ({ ...prev, routineDuration: duration.value }))}
                  className={`p-8 rounded-xl text-center transition-all ${
                    selections.routineDuration === duration.value
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-800 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl font-bold mb-2">{duration.value}</div>
                  <div className="text-sm">minutes</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Avoid Activities */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Activities to avoid?
            </h2>
            <p className="text-gray-600 mb-8">
              Select activities you'd prefer not to include (optional)
            </p>
            <div className="space-y-3 mb-8">
              {avoidActivities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleAvoidActivityToggle(activity.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    selections.avoidActivities.includes(activity.id)
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-800 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{activity.label}</span>
                    {selections.avoidActivities.includes(activity.id) && (
                      <span className="text-2xl">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-white text-purple-600 border-2 border-purple-600 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {step === 4 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
