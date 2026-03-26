import Message from '../models/Message.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    if (!recipientId || !content) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      content
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('SendMessage Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;
    
    const messages = await Message.find({
      $or: [
        { sender: myId, recipient: userId },
        { sender: userId, recipient: myId }
      ]
    }).sort({ createdAt: 1 });
    
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('GetConversation Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversation' });
  }
};
