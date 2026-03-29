import { Question } from '../models/Question.js';

export const getAllActiveQuestions = (req, res, next) => {
  try {
    const questions = Question.findAllActive();
    // Parse JSON options
    questions.forEach(q => {
      if (q.options) {
        try { q.options = JSON.parse(q.options); } catch (e) {}
      }
    });
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

export const getAllQuestions = (req, res, next) => {
  try {
    const questions = Question.findAll();
    questions.forEach(q => {
      if (q.options) {
        try { q.options = JSON.parse(q.options); } catch (e) {}
      }
    });
    res.json(questions);
  } catch (error) {
    next(error);
  }
};

export const createQuestion = (req, res, next) => {
  try {
    const { text, type, options, required } = req.body;
    const questions = Question.findAll();
    const newOrderIndex = questions.length > 0 ? questions[questions.length - 1].order_index + 1 : 0;
    
    // For Node 22 we can use crypto.randomUUID
    const id = crypto.randomUUID();
    const optionsStr = options ? JSON.stringify(options) : null;

    Question.create(id, text, type, optionsStr, required ? 1 : 0, newOrderIndex);
    const newQ = Question.findById(id);
    if(newQ.options) newQ.options = JSON.parse(newQ.options);
    res.status(201).json(newQ);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, type, options, required } = req.body;
    const optionsStr = options ? JSON.stringify(options) : null;
    
    Question.update(id, text, type, optionsStr, required ? 1 : 0);
    const updated = Question.findById(id);
    if(updated.options) updated.options = JSON.parse(updated.options);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deactivateQuestion = (req, res, next) => {
  try {
    const { id } = req.params;
    Question.deactivate(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const reorderQuestions = (req, res, next) => {
  try {
    const { orders } = req.body; // [{id, order_index}]
    
    for (const item of orders) {
      if (item.id !== undefined && item.order_index !== undefined) {
        Question.updateOrder(item.id, item.order_index);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
