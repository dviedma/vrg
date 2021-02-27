export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log(">>> POST:", req);
  }
  res.status(200).json(req)
}