import express from "express";
import serverlessHttp from "serverless-http";

const app = express();

app.get("/.netlify/functions/authFunction", (req, res) => {
  res.json({
    message: "hello world",
  });
});

const serverlessHandler = serverlessHttp(app);

// Export the handler for Netlify to use
export const handler = async (event, context) => {
  const result = await serverlessHandler(event, context);
  return result;
};
