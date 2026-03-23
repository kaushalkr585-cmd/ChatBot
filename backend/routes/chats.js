const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Chat = require('../models/Chat');

// @route   GET api/chats
// @desc    Get all chats for user
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/chats/:id
// @desc    Get a specific chat
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ msg: 'Chat not found' });
    if (chat.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chats
// @desc    Create a new chat
router.post('/', auth, async (req, res) => {
  const { title, messages } = req.body;
  try {
    const newChat = new Chat({
      userId: req.user.id,
      title: title || 'New Chat',
      messages: messages || []
    });

    const chat = await newChat.save();
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/chats/:id
// @desc    Update a chat (append messages and optionally update title)
router.put('/:id', auth, async (req, res) => {
  const { messages, title } = req.body;
  
  try {
    let chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ msg: 'Chat not found' });
    if (chat.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    // Update fields
    if (messages) chat.messages = messages; // Override complete history arrays from frontend
    if (title) chat.title = title;

    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/chats/:id
// @desc    Delete a chat
router.delete('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ msg: 'Chat not found' });
    if (chat.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await chat.deleteOne();
    res.json({ msg: 'Chat removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
