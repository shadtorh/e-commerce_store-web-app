// AWS Cognito Authentication Service
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
});

const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || "";

// Sign up new user
export async function signUp(username, password, email, name) {
  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
      ],
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}

// Sign in user
export async function signIn(username, password) {
  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    const response = await cognitoClient.send(command);
    
    if (response.AuthenticationResult) {
      // Store tokens
      localStorage.setItem("accessToken", response.AuthenticationResult.AccessToken);
      localStorage.setItem("idToken", response.AuthenticationResult.IdToken);
      localStorage.setItem("refreshToken", response.AuthenticationResult.RefreshToken);
      
      return response.AuthenticationResult;
    }
    
    return response;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

// Confirm sign up with verification code
export async function confirmSignUp(username, code) {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Confirm sign up error:", error);
    throw error;
  }
}

// Resend confirmation code
export async function resendConfirmationCode(username) {
  try {
    const command = new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: username,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Resend confirmation code error:", error);
    throw error;
  }
}

// Forgot password
export async function forgotPassword(username) {
  try {
    const command = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: username,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

// Confirm forgot password with code
export async function confirmForgotPassword(username, code, newPassword) {
  try {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: code,
      Password: newPassword,
    });

    const response = await cognitoClient.send(command);
    return response;
  } catch (error) {
    console.error("Confirm forgot password error:", error);
    throw error;
  }
}

// Sign out
export function signOut() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("idToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

// Check if user is authenticated
export function isAuthenticated() {
  const token = localStorage.getItem("accessToken");
  return !!token;
}

// Get current user from token
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Decode JWT token
export function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}
