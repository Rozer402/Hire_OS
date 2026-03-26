import Application from '../models/Application.model.js';
import Job from '../models/Job.model.js';
import Interview from '../models/Interview.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments({ postedBy: req.user._id, status: 'active' });
    const totalApplications = await Application.countDocuments({ recruiter: req.user._id });
    const totalInterviews = await Interview.countDocuments({ recruiter: req.user._id });
    const totalHired = await Application.countDocuments({ recruiter: req.user._id, status: 'offered' });

    res.json({
      success: true,
      data: { totalJobs, totalApplications, totalInterviews, totalHired }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

export const getApplicationsOverTime = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const applications = await Application.aggregate([
      { $match: { recruiter: req.user._id, createdAt: { $gte: sevenDaysAgo } } },
      { 
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedData = applications.map(app => ({
      date: app._id,
      count: app.count
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Applications Over Time Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications over time' });
  }
};

export const getHiringFunnel = async (req, res) => {
  try {
    const funnel = await Application.aggregate([
      { $match: { recruiter: req.user._id } },
      { 
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format output mapping status counts
    const funnelMap = funnel.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({ success: true, data: funnelMap });
  } catch (error) {
    console.error('Hiring Funnel Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hiring funnel' });
  }
};

export const getTopCandidates = async (req, res) => {
  try {
    const topCandidates = await Application.find({ recruiter: req.user._id })
      .populate('candidate', 'name avatar email title')
      .populate('job', 'title')
      .sort({ aiScore: -1 })
      .limit(5);

    res.json({ success: true, data: topCandidates });
  } catch (error) {
    console.error('Top Candidates Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch top candidates' });
  }
};
