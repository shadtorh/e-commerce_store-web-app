// AWS SNS Push Notification Setup
import { SNSClient, PublishCommand, CreatePlatformEndpointCommand } from "@aws-sdk/client-sns";

// Note: For production, use AWS Cognito Identity Pools or assume role from backend
// Frontend should never contain AWS credentials
const snsClient = new SNSClient({ 
  region: import.meta.env.VITE_AWS_REGION || "us-east-1"
  // Credentials should be obtained via AWS Cognito Identity Pools or backend proxy
});

// Register device for push notifications
export async function registerDeviceForNotifications(token, userId) {
  try {
    // Create platform endpoint for this device
    const createEndpointCommand = new CreatePlatformEndpointCommand({
      PlatformApplicationArn: import.meta.env.VITE_SNS_PLATFORM_ARN || "arn:aws:sns:us-east-1:123456789012:app/GCM/Ritualist",
      Token: token,
      CustomUserData: userId
    });
    
    const endpointData = await snsClient.send(createEndpointCommand);
    
    // Store endpoint ARN in user profile (this would be done via API)
    // await updateUserEndpoint(endpointData.EndpointArn);
    
    return endpointData.EndpointArn;
  } catch (error) {
    console.error("Failed to register device:", error);
    throw error;
  }
}

// Send routine reminder notification
export async function sendRoutineReminder(userId, routineId, endpointArn, routine) {
  const message = {
    default: `Time for your ${routine.routineTitle} routine!`,
    GCM: JSON.stringify({
      notification: {
        title: `Routine Reminder: ${routine.routineTitle}`,
        body: `It's time for your ${routine.routineDuration}-minute routine. Start now?`,
        sound: "default",
        click_action: `OPEN_ROUTINE_${routineId}`
      },
      data: {
        routineId: routineId,
        type: "reminder"
      }
    })
  };
  
  const publishCommand = new PublishCommand({
    TargetArn: endpointArn,
    Message: JSON.stringify(message),
    MessageStructure: "json"
  });
  
  try {
    return await snsClient.send(publishCommand);
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
}

// Schedule a notification for later delivery
export async function scheduleNotification(userId, routineId, scheduledTime) {
  // Use AWS EventBridge to schedule the notification
  const params = {
    ScheduleExpression: `cron(${getCronExpression(scheduledTime)})`,
    State: "ENABLED",
    Description: `Routine reminder for user ${userId}`,
    Target: {
      Arn: import.meta.env.VITE_LAMBDA_FUNCTION_ARN || "arn:aws:lambda:us-east-1:123456789012:function:send-routine-reminder",
      Input: JSON.stringify({
        userId,
        routineId,
        useVoice: true
      })
    }
  };
  
  // Store the scheduled event in user's profile (via API)
  // await addScheduledNotification(userId, {
  //   routineId,
  //   scheduledTime,
  //   status: "pending"
  // });
  
  return params;
}

// Helper function to convert date to cron expression
function getCronExpression(scheduledTime) {
  const date = new Date(scheduledTime);
  const minute = date.getMinutes();
  const hour = date.getHours();
  const dayOfMonth = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  return `${minute} ${hour} ${dayOfMonth} ${month} ? ${year}`;
}

// Handle notification click
export function handleNotificationClick(notification) {
  if (notification.data?.type === 'routine-reminder' && notification.data?.useVoice) {
    // const routineId = notification.data.routineId;
    
    // Fetch the routine details (this would come from API)
    // getRoutineById(routineId).then(routine => {
    //   voiceService.speakRoutineIntro(routine);
    //   window.location.href = `/routine/${routineId}`;
    // });
  }
}

// Request permission for browser notifications
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

// Show browser notification
export function showBrowserNotification(title, options) {
  if (Notification.permission === "granted") {
    return new Notification(title, options);
  }
  return null;
}
