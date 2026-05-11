const FocusSession = require('../models/FocusSession');

exports.saveSession = async (req, res) => {
  try {
    const { duration } = req.body;
    const session = await FocusSession.create({ userId: req.user.id, duration });
    res.status(201).json({ success: true, data: session });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};
