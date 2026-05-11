const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notes });
  } catch (error) { res.status(500).json({ success: false, message: 'Server error' }); }
};

exports.addNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.create({ userId: req.user.id, title, content });
    res.status(201).json({ success: true, data: note });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.userId.toString() !== req.user.id)
      return res.status(404).json({ success: false, message: 'Note not found' });
    await note.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};
