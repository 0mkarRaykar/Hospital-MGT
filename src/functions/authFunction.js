import express from "express";
import serverlessHttp from "serverless-http";

const app = express();

app.get("/.netlify/functions/authFunction", (req, res) => {
  res.json({
    message: "hello world",
  });
});

const serverlessHandler = serverlessHttp(app);

export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Authentication function is working!" }),
  };
};
