import { Feedback } from '../models/Feedback.js';

export const getSummary = (req, res, next) => {
  try {
    const summary = Feedback.getAnalyticsSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

export const getTrend = (req, res, next) => {
  try {
    const trend = Feedback.getTrend();
    res.json(trend);
  } catch (error) {
    next(error);
  }
};

export const getDistribution = (req, res, next) => {
  try {
    const distribution = Feedback.getDistribution();
    // Calculate percentages
    const totalRatings = distribution.reduce((sum, item) => sum + item.count, 0);
    const finalDist = distribution.map(d => ({
      rating: d.rating,
      count: d.count,
      percentage: totalRatings > 0 ? ((d.count / totalRatings) * 100).toFixed(1) : 0
    }));

    res.json(finalDist);
  } catch (error) {
    next(error);
  }
};

export const getSentimentSummary = (req, res, next) => {
  try {
    const items = Feedback.getSentiment();
    // Group by question_text and run simple mock keyword counting
    const grouped = items.reduce((acc, curr) => {
      if(!acc[curr.question_text]) acc[curr.question_text] = { positive: 0, negative: 0, neutral: 0 };
      const text = curr.text_answer.toLowerCase();
      if (text.includes('great') || text.includes('love') || text.includes('excellent')) {
        acc[curr.question_text].positive++;
      } else if (text.includes('could') || text.includes('slower') || text.includes('needs')) {
        acc[curr.question_text].negative++;
      } else {
        acc[curr.question_text].neutral++;
      }
      return acc;
    }, {});

    const result = Object.entries(grouped).map(([question, counts]) => ({ question, counts }));
    res.json({ result });
  } catch (error) {
    next(error);
  }
};
