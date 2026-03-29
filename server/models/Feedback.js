import db from '../db/index.js';

export const Feedback = {
  create: (id, userId, isAnonymous) => {
    const stmt = db.prepare('INSERT INTO feedback (id, user_id, is_anonymous) VALUES (?, ?, ?)');
    return stmt.run(id, userId, isAnonymous);
  },

  createResponse: (id, feedbackId, questionId, rating, textAnswer, choice) => {
    const stmt = db.prepare('INSERT INTO responses (id, feedback_id, question_id, rating, text_answer, choice) VALUES (?, ?, ?, ?, ?, ?)');
    return stmt.run(id, feedbackId, questionId, rating, textAnswer, choice);
  },

  findById: (id) => {
    const stmt = db.prepare(`
      SELECT f.*, u.name as user_name, u.email as user_email
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE f.id = ?
    `);
    const feedback = stmt.get(id);
    if (!feedback) return null;

    const resStmt = db.prepare(`
      SELECT r.*, q.text as question_text 
      FROM responses r 
      LEFT JOIN questions q ON r.question_id = q.id 
      WHERE r.feedback_id = ?
    `);
    feedback.responses = resStmt.all(id);
    return feedback;
  },

  findByUserId: (userId) => {
    // To show aggregate for the dashboard
    const stmt = db.prepare(`
      SELECT f.*, 
        (SELECT AVG(rating) FROM responses WHERE feedback_id = f.id AND rating IS NOT NULL) as avg_rating
      FROM feedback f
      WHERE f.user_id = ?
      ORDER BY f.submitted_at DESC
    `);
    return stmt.all(userId);
  },

  findAllPaginated: (limit, offset, filters = {}) => {
    let query = `
      SELECT f.*, u.name as user_name, u.email as user_email,
        (SELECT AVG(rating) FROM responses WHERE feedback_id = f.id AND rating IS NOT NULL) as avg_rating
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.rating) {
      query += ` AND f.id IN (SELECT feedback_id FROM responses WHERE rating = ?)`;
      params.push(filters.rating);
    }
    
    if (filters.from) {
      query += ` AND f.submitted_at >= ?`;
      params.push(filters.from);
    }

    if (filters.to) {
      query += ` AND f.submitted_at <= ?`;
      params.push(filters.to);
    }

    if (filters.search) {
      query += ` AND f.id IN (SELECT feedback_id FROM responses WHERE text_answer LIKE ?)`;
      params.push(`%${filters.search}%`);
    }

    query += ` ORDER BY f.submitted_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const stmt = db.prepare(query);
    const results = stmt.all(...params);

    // Count query
    let countQuery = `
      SELECT COUNT(DISTINCT f.id) as total
      FROM feedback f
      WHERE 1=1
    `;
    const countParams = [];
    if (filters.rating) {
      countQuery += ` AND f.id IN (SELECT feedback_id FROM responses WHERE rating = ?)`;
      countParams.push(filters.rating);
    }
    if (filters.from) {
      countQuery += ` AND f.submitted_at >= ?`;
      countParams.push(filters.from);
    }
    if (filters.to) {
      countQuery += ` AND f.submitted_at <= ?`;
      countParams.push(filters.to);
    }
    if (filters.search) {
      countQuery += ` AND f.id IN (SELECT feedback_id FROM responses WHERE text_answer LIKE ?)`;
      countParams.push(`%${filters.search}%`);
    }

    const countStmt = db.prepare(countQuery);
    const total = countStmt.get(...countParams).total;

    return { data: results, total };
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM feedback WHERE id = ?');
    return stmt.run(id);
  },

  getAnalyticsSummary: () => {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM feedback');
    const total = totalStmt.get().total;

    const avgStmt = db.prepare('SELECT AVG(rating) as avg_rating FROM responses WHERE rating IS NOT NULL');
    const avgRating = avgStmt.get().avg_rating;

    // simplistic response rate (total feedback / total distinct users)
    const userCountStmt = db.prepare('SELECT COUNT(*) as total FROM users WHERE role = ?');
    const users = userCountStmt.get('user').total;
    const responseRate = users > 0 ? (total / users) * 100 : 0;

    return { total, avgRating, responseRate };
  },

  getTrend: () => {
    const stmt = db.prepare(`
      SELECT date(f.submitted_at) as date, AVG(r.rating) as avg_rating, COUNT(DISTINCT f.id) as count
      FROM feedback f
      LEFT JOIN responses r ON f.id = r.feedback_id
      WHERE f.submitted_at >= date('now', '-30 days')
      GROUP BY date(f.submitted_at)
      ORDER BY date ASC
    `);
    return stmt.all();
  },

  getDistribution: () => {
    const stmt = db.prepare(`
      SELECT rating, COUNT(*) as count
      FROM responses
      WHERE rating IS NOT NULL
      GROUP BY rating
      ORDER BY rating ASC
    `);
    return stmt.all();
  },
  
  getSentiment: () => {
    // Basic aggregation: fetching raw text grouped by question
    const stmt = db.prepare(`
      SELECT q.text as question_text, r.text_answer
      FROM responses r
      JOIN questions q ON r.question_id = q.id
      WHERE r.text_answer IS NOT NULL AND r.text_answer != ''
    `);
    return stmt.all();
  }
};
