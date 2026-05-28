module.exports = function handler(req, res) {
  res.status(200).json({ message: 'GET works', method: req.method });
};
