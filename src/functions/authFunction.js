import express from "express";
import serverlessHttp from "serverless-http";

const app = express();

app.get("/.netlify/functions/api", (req, res) => {
  res.json({
    message: "hello world",
  });
});

const serverlessHandler = serverlessHttp(app);

export const handler = async (event, context) => {
  const result = await serverlessHandler(event, context);
  return result;
};
