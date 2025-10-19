# Ritualist - Mood-Based Routine Generator

A modern web application that transforms emotional states into productive actions through personalized routines. Built with React, Vite, Tailwind CSS, and AWS services.

## Features

### 🎯 Core Functionality
- **Mood Tracking**: Log your emotional state with an intuitive emoji-based interface
- **AI-Generated Routines**: Get personalized routines based on your current mood
- **Voice Guidance**: Listen to step-by-step instructions using Web Speech API
- **Analytics Dashboard**: Track mood patterns and routine completion over time
- **Notification System**: Schedule reminders for your saved routines
- **Routine Library**: Browse, filter, and manage your saved routines

### 📱 User Experience
- Responsive design that works on all devices
- Smooth animations with Framer Motion
- Beautiful gradient UI with Tailwind CSS
- Real-time notifications and updates
- Voice synthesis for accessibility

### ☁️ AWS Integration
- **AWS Cognito**: Secure user authentication
- **AWS DynamoDB**: Scalable data storage
- **AWS S3**: Audio file hosting
- **AWS Comprehend**: Sentiment analysis
- **AWS Polly**: Text-to-speech conversion
- **AWS Lambda**: Serverless functions
- **AWS SNS**: Push notifications

## Tech Stack

- **Frontend**: React 19, Vite 6
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Routing**: React Router 7
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: React Icons (Feather Icons)
- **Notifications**: React Toastify
- **AWS SDK**: @aws-sdk/client-sns, @aws-sdk/client-cognito-identity-provider

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── ritualist/
│   │       └── RitualistNav.jsx     # Bottom navigation
│   ├── data/
│   │   └── moods.js                 # Mood data and onboarding options
│   ├── pages/
│   │   └── ritualist/
│   │       ├── Dashboard.jsx        # Main dashboard with mood check-in
│   │       ├── MoodEntry.jsx        # Mood selection and entry
│   │       ├── RoutineDisplay.jsx   # Routine details and execution
│   │       ├── RoutineLibrary.jsx   # Saved routines management
│   │       ├── Statistics.jsx       # Analytics and insights
│   │       ├── NotificationCenter.jsx # Notification management
│   │       ├── RitualistLogin.jsx   # Authentication
│   │       ├── Onboarding.jsx       # User preferences setup
│   │       └── index.js             # Page exports
│   ├── services/
│   │   ├── authService.js           # AWS Cognito authentication
│   │   ├── notificationService.js   # AWS SNS notifications
│   │   └── voiceService.js          # Web Speech API wrapper
│   ├── stores/
│   │   └── useRitualistStore.js     # Zustand state management
│   ├── App.jsx                      # Main app with routing
│   └── index.css                    # Global styles
└── .env.example                     # Environment variables template
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- AWS account with appropriate services configured
- Basic knowledge of React and AWS

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-commerce_store-web-app/client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your AWS credentials and service ARNs.

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## AWS Setup

### 1. AWS Cognito Setup
1. Create a User Pool in AWS Cognito
2. Configure app client (no secret)
3. Enable username and email authentication
4. Copy the User Pool ID and Client ID to `.env`

### 2. AWS SNS Setup
1. Create an SNS Platform Application (for mobile push)
2. Configure Firebase Cloud Messaging (FCM) or APNS
3. Copy the Platform Application ARN to `.env`

### 3. AWS Lambda Setup
1. Create a Lambda function for sending routine reminders
2. Configure triggers from EventBridge for scheduled notifications
3. Copy the function ARN to `.env`

### 4. AWS DynamoDB (Backend)
Create tables for:
- Users (userId as partition key)
- Moods (userId as partition key, timestamp as sort key)
- Routines (userId as partition key, routineId as sort key)
- Notifications (userId as partition key, notificationId as sort key)

## Key Features

### Dashboard
- Personalized greeting based on time of day
- Quick mood check-in with emoji grid
- Daily routine preview
- Mood trends visualization
- Quick stats (streak, weekly entries, average mood)
- Notification center preview

### Mood Entry
- 24 mood options with emojis
- Search functionality for emotions
- Optional notes field
- Generate routine or save mood only options
- Animated loading state during routine generation

### Routine Display
- Step-by-step routine instructions
- Voice guidance with play/pause controls
- Save, share, and schedule options
- Progress tracking through steps
- Completion confirmation

### Routine Library
- Searchable routine grid
- Filter by completion status
- Routine cards with details
- Click to view/start routine

### Statistics & Analytics
- Time period selector (7/30/90 days)
- Mood trend line charts
- Mood distribution pie charts
- Weekly activity bar charts
- Sentiment analysis
- Engagement metrics

### Notification Center
- Filter by type (saved routines, reminders, achievements)
- Mark as read/unread functionality
- Clear all notifications
- Scheduled notifications management
- Delete individual notifications

### Onboarding Flow
1. **Goals Selection**: Choose your wellness goals
2. **Routine Time**: Select preferred time of day
3. **Duration**: Pick routine length (5/15/30 minutes)
4. **Activities to Avoid**: Customize your experience

## Usage Examples

### Basic Usage Flow

1. **Sign Up/Login**
```javascript
// User logs in with AWS Cognito
await signIn(username, password);
```

2. **Complete Onboarding**
```javascript
// Set user preferences
updateOnboardingData({
  goals: ['focus', 'wellness'],
  routineTime: 'morning',
  routineDuration: 15,
  avoidActivities: ['high-intensity']
});
```

3. **Track Mood**
```javascript
// Log current mood
await addMoodEntry({
  mood: { id: 1, emoji: '😊', name: 'Happy' },
  notes: 'Feeling great today!',
  timestamp: new Date().toISOString()
});
```

4. **Generate Routine**
```javascript
// Create personalized routine
const routine = await generateRoutine(mood, notes);
```

5. **Execute Routine**
```javascript
// Play voice guidance
voiceService.speakRoutineSteps(routine);

// Complete routine
await completeRoutine(routineId);
```

6. **Schedule Notification**
```javascript
// Set reminder
await scheduleNotification(routineId, scheduledTime, {
  useVoice: true
});
```

## Voice Service

The Voice Service uses the Web Speech API for text-to-speech:

```javascript
import VoiceService from './services/voiceService';

const voiceService = new VoiceService();
voiceService.init();

// Speak routine introduction
voiceService.speakRoutineIntro(routine);

// Speak all steps
voiceService.speakRoutineSteps(routine);

// Stop speaking
voiceService.stopSpeaking();
```

## State Management

Ritualist uses Zustand for simple and efficient state management:

```javascript
import useRitualistStore from './stores/useRitualistStore';

// In your component
const { 
  user,
  currentMood,
  savedRoutines,
  addMoodEntry,
  generateRoutine,
  saveRoutine
} = useRitualistStore();
```

## Notifications

### Browser Notifications
```javascript
// Request permission
const granted = await requestNotificationPermission();

// Show notification
showBrowserNotification('Routine Reminder', {
  body: 'Time for your morning routine!',
  icon: '/icon.png',
  badge: '/badge.png'
});
```

### AWS SNS Push Notifications
```javascript
// Register device
const endpointArn = await registerDeviceForNotifications(token, userId);

// Send notification
await sendRoutineReminder(userId, routineId, endpointArn, routine);

// Schedule notification
await scheduleNotification(userId, routineId, scheduledTime);
```

## Customization

### Adding New Moods
Edit `src/data/moods.js`:
```javascript
export const moods = [
  { id: 25, emoji: '🤗', name: 'Affectionate', category: 'positive' },
  // ... add more moods
];
```

### Customizing Routine Generation
Modify `generateRoutine` in `useRitualistStore.js` to integrate with your AI service or customize the logic.

### Styling
The app uses Tailwind CSS. Customize colors in `tailwind.config.js` or add custom classes in `index.css`.

## Performance Optimization

- **Code Splitting**: Consider implementing dynamic imports for routes
- **Image Optimization**: Use WebP format for images
- **Caching**: Implement service workers for offline functionality
- **Bundle Size**: Monitor bundle size and use tree-shaking

## Security Best Practices

1. **Never commit `.env` files** with real credentials
2. **Use AWS IAM roles** with least privilege principle
3. **Implement rate limiting** on AWS Lambda functions
4. **Validate all user inputs** on both client and server
5. **Use HTTPS** for all API communications
6. **Implement CSRF protection** for authentication flows

## Troubleshooting

### Voice not working
- Check browser compatibility (Chrome, Edge, Safari work best)
- Ensure voices are loaded: `speechSynthesis.getVoices()`
- Try different voice selections

### AWS SDK errors
- Verify credentials in `.env`
- Check IAM permissions for your AWS user/role
- Ensure correct region is specified

### Build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Update dependencies: `npm update`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

## Acknowledgments

- React team for the amazing framework
- AWS for cloud services
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Recharts for beautiful charts
