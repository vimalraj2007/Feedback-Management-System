import { Feedback } from '../models/Feedback.js';

export const submitFeedback = (req, res, next) => {
  try {
    const { isAnonymous, responses } = req.body;
    // responses is an array: { questionId, rating, textAnswer, choice }
    const feedbackId = crypto.randomUUID();
    const userId = req.user.id;
    
    // Create main feedback entry
    Feedback.create(feedbackId, isAnonymous ? null : userId, isAnonymous ? 1 : 0);
    
    // Create responses
    for (const resp of responses) {
      Feedback.createResponse(
        crypto.randomUUID(),
        feedbackId,
        resp.questionId,
        resp.rating || null,
        resp.textAnswer || null,
        resp.choice || null
      );
    }
    
    // Bonus Feature Placeholder: Sentiment Tagging
    // (mock implementation)
    // console.log("Would normally run sentiment tagging here based on text answers");

    // Bonus Feature Placeholder: Email Notification stub
    console.log(`[Email Stub] Would send email to admin about new feedback ${feedbackId}`);

    res.status(201).json({ success: true, feedbackId });
  } catch (error) {
    next(error);
  }
};

export const getMyFeedback = (req, res, next) => {
  try {
    const feedbackList = Feedback.findByUserId(req.user.id);
    res.json(feedbackList);
  } catch (error) {
    next(error);
  }
};

export const getAllFeedback = (req, res, next) => {
  try {
    let { page = 1, limit = 10, rating, from, to, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const filters = {};
    if (rating) filters.rating = parseInt(rating);
    if (from) filters.from = from;
    if (to) filters.to = to;
    if (search) filters.search = search;

    const result = Feedback.findAllPaginated(limit, offset, filters);
    res.json({
      data: result.data,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleFeedback = (req, res, next) => {
  try {
    const { id } = req.params;
    const feedback = Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    // Also attach sentiment tag based on texts
    feedback.responses = feedback.responses.map(r => {
      let sentiment = 'neutral';
      if (r.text_answer) {
        const text = r.text_answer.toLowerCase();
        if (text.includes('great') || text.includes('love') || text.includes('excellent')) sentiment = 'positive';
        else if (text.includes('could') || text.includes('slower') || text.includes('needs')) sentiment = 'negative';
      }
      return { ...r, sentiment };
    });

    res.json(feedback);
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = (req, res, next) => {
  try {
    const { id } = req.params;
    Feedback.delete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
