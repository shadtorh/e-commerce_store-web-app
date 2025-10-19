import { create } from 'zustand';

// Ritualist Store for managing mood entries, routines, and user data
const useRitualistStore = create((set, get) => ({
  // User data
  user: null,
  isAuthenticated: false,
  
  // Onboarding data
  onboardingData: {
    goals: [],
    routineTime: '',
    routineDuration: '',
    avoidActivities: []
  },
  
  // Mood data
  currentMood: null,
  moodHistory: [],
  
  // Routines
  currentRoutine: null,
  savedRoutines: [],
  routineHistory: [],
  
  // Notifications
  notifications: [],
  scheduledNotifications: [],
  
  // Stats
  stats: {
    streak: 0,
    weeklyEntries: 0,
    averageMood: null,
    mostFrequentMood: null,
  },
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: true }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    currentMood: null,
    currentRoutine: null
  }),
  
  // Onboarding actions
  updateOnboardingData: (data) => set((state) => ({
    onboardingData: { ...state.onboardingData, ...data }
  })),
  
  completeOnboarding: async () => {
    // Save onboarding data to backend
    const { onboardingData, user } = get();
    try {
      // API call to save preferences
      // await saveUserPreferences(user.id, onboardingData);
      console.log('Onboarding completed:', onboardingData);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
    }
  },
  
  // Mood actions
  setCurrentMood: (mood) => set({ currentMood: mood }),
  
  addMoodEntry: async (moodData) => {
    try {
      // API call to save mood entry
      // const response = await saveMoodEntry(user.id, moodData);
      
      set((state) => ({
        moodHistory: [moodData, ...state.moodHistory],
        currentMood: moodData
      }));
      
      return moodData;
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      throw error;
    }
  },
  
  // Routine actions
  setCurrentRoutine: (routine) => set({ currentRoutine: routine }),
  
  generateRoutine: async (mood) => {
    const { onboardingData } = get();
    try {
      // API call to generate routine based on mood
      // This would call AWS Lambda function that generates personalized routine
      // const response = await generateRoutineAPI(user.id, mood, notes, onboardingData);
      
      // Mock routine for now
      const mockRoutine = {
        id: Date.now().toString(),
        routineTitle: `${mood.emoji} ${mood.name} Routine`,
        mood: mood,
        routineDuration: onboardingData.routineDuration || 15,
        createdAt: new Date().toISOString(),
        routineSteps: [
          { text: "Take 3 deep breaths", duration: 2 },
          { text: "Gentle stretching", duration: 5 },
          { text: "Mindful meditation", duration: 5 },
          { text: "Set intention for the day", duration: 3 }
        ]
      };
      
      set({ currentRoutine: mockRoutine });
      return mockRoutine;
    } catch (error) {
      console.error('Failed to generate routine:', error);
      throw error;
    }
  },
  
  saveRoutine: async (routine) => {
    try {
      // API call to save routine
      // await saveRoutineAPI(user.id, routine);
      
      set((state) => ({
        savedRoutines: [routine, ...state.savedRoutines]
      }));
      
      // Add notification
      get().addNotification({
        id: Date.now().toString(),
        type: 'routine-saved',
        title: 'Routine Saved',
        message: `"${routine.routineTitle}" has been saved to your library`,
        timestamp: new Date().toISOString(),
        read: false
      });
      
      return routine;
    } catch (error) {
      console.error('Failed to save routine:', error);
      throw error;
    }
  },
  
  completeRoutine: async (routineId) => {
    const { currentRoutine } = get();
    try {
      // API call to mark routine as complete
      // await completeRoutineAPI(user.id, routineId);
      
      set((state) => ({
        routineHistory: [
          { ...currentRoutine, completedAt: new Date().toISOString() },
          ...state.routineHistory
        ]
      }));
      
      // Update stats
      get().updateStats();
      
      return true;
    } catch (error) {
      console.error('Failed to complete routine:', error);
      throw error;
    }
  },
  
  // Notification actions
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  
  markNotificationAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
  })),
  
  clearAllNotifications: () => set({ notifications: [] }),
  
  scheduleNotification: async (routineId, scheduledTime, options) => {
    try {
      // API call to schedule notification
      // await scheduleNotificationAPI(user.id, routineId, scheduledTime, options);
      
      const scheduled = {
        id: Date.now().toString(),
        routineId,
        scheduledTime,
        options,
        status: 'pending'
      };
      
      set((state) => ({
        scheduledNotifications: [...state.scheduledNotifications, scheduled]
      }));
      
      return scheduled;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  },
  
  // Stats actions
  updateStats: async () => {
    const { moodHistory, routineHistory } = get();
    try {
      // Calculate stats from history
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const weeklyMoods = moodHistory.filter(m => 
        new Date(m.timestamp) > sevenDaysAgo
      );
      
      const stats = {
        streak: calculateStreak(routineHistory),
        weeklyEntries: weeklyMoods.length,
        averageMood: calculateAverageMood(weeklyMoods),
        mostFrequentMood: findMostFrequentMood(moodHistory)
      };
      
      set({ stats });
      return stats;
    } catch (error) {
      console.error('Failed to update stats:', error);
      throw error;
    }
  },
  
  // Fetch user data
  fetchUserData: async (userId) => {
    try {
      // API calls to fetch all user data
      // const [moods, routines, notifications] = await Promise.all([
      //   fetchMoodHistory(userId),
      //   fetchSavedRoutines(userId),
      //   fetchNotifications(userId)
      // ]);
      
      // set({
      //   moodHistory: moods,
      //   savedRoutines: routines,
      //   notifications: notifications
      // });
      
      // get().updateStats();
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      throw error;
    }
  }
}));

// Helper functions
function calculateStreak(routineHistory) {
  if (routineHistory.length === 0) return 0;
  
  let streak = 0;
  const sortedHistory = [...routineHistory].sort((a, b) => 
    new Date(b.completedAt) - new Date(a.completedAt)
  );
  
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const routine of sortedHistory) {
    const routineDate = new Date(routine.completedAt);
    routineDate.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.floor((currentDate - routineDate) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateAverageMood(moods) {
  if (moods.length === 0) return null;
  
  // This would need a mood-to-score mapping
  // For now, return the middle mood
  return moods[Math.floor(moods.length / 2)]?.name || null;
}

function findMostFrequentMood(moodHistory) {
  if (moodHistory.length === 0) return null;
  
  const moodCounts = {};
  moodHistory.forEach(mood => {
    const key = mood.name;
    moodCounts[key] = (moodCounts[key] || 0) + 1;
  });
  
  let maxCount = 0;
  let mostFrequent = null;
  
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = mood;
    }
  });
  
  return mostFrequent;
}

export default useRitualistStore;
