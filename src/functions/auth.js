// src/functions/auth-login.js
import { loginUser } from "../controllers/authController.js";

export async function handler(event) {
  try {
    // Ensure the body exists and is valid JSON
    const data = JSON.parse(event.body || '{}');
    console.log('Parsed data:', data);

    // Proceed with your logic
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', data }),
    };
  } catch (err) {
    console.error('Error parsing JSON:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON input' }),
    };
  }
}
