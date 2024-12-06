// src/functions/auth-login.js
import { loginUser } from "../controllers/authController.js";

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const response = await loginUser(body);
    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
