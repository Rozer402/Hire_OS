import Notification from '../models/Notification.model.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
      
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
      
    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    console.error('GetNotifications Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, data: notification });
  } catch (error) {
    console.error('MarkAsRead Error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('MarkAllAsRead Error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
};
