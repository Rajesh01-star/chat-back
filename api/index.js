import app from '../src/index.js';

export default async function handler(req, res) {
  return app.fetch(req, res);
} 