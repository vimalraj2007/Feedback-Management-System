import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new Database(dbPath);

console.log('Initializing database...');

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

// Clear existing
console.log('Clearing existing data...');
db.exec('DELETE FROM responses; DELETE FROM feedback; DELETE FROM questions; DELETE FROM users;');

// Insert Users
const insertUser = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
const adminHash = bcrypt.hashSync('Admin123!', 10);
const userHash = bcrypt.hashSync('User123!', 10);

const adminId = crypto.randomUUID();
const userId = crypto.randomUUID();

insertUser.run(adminId, 'Admin User', 'admin@example.com', adminHash, 'admin');
insertUser.run(userId, 'Regular User', 'user@example.com', userHash, 'user');
console.log('Inserted seed users.');

// Insert Questions
const insertQuestion = db.prepare('INSERT INTO questions (id, text, type, options, required, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)');

const questions = [
  { id: crypto.randomUUID(), text: 'How satisfied are you with our service?', type: 'rating', options: null, req: 1, idx: 0 },
  { id: crypto.randomUUID(), text: 'What features would you like to see?', type: 'text', options: null, req: 0, idx: 1 },
  { id: crypto.randomUUID(), text: 'How did you hear about us?', type: 'choice', options: JSON.stringify(['Google', 'Social Media', 'Friend', 'Other']), req: 1, idx: 2 },
  { id: crypto.randomUUID(), text: 'How likely are you to recommend us to a friend?', type: 'rating', options: null, req: 1, idx: 3 },
  { id: crypto.randomUUID(), text: 'Any additional feedback?', type: 'text', options: null, req: 0, idx: 4 },
];

for (const q of questions) {
  insertQuestion.run(q.id, q.text, q.type, q.options, q.req, q.idx, 1);
}
console.log('Inserted seed questions.');

// Insert Fake Feedback
const insertFeedback = db.prepare('INSERT INTO feedback (id, user_id, is_anonymous, submitted_at) VALUES (?, ?, ?, ?)');
const insertResponse = db.prepare('INSERT INTO responses (id, feedback_id, question_id, rating, text_answer, choice) VALUES (?, ?, ?, ?, ?, ?)');

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const fakeTextResponses = [
  "Great service, really loved it!", 
  "Could be faster, but overall good.",
  "I would like a dark mode.",
  "Excellent customer support.",
  "Needs more configuration options."
];

for (let i = 0; i < 10; i++) {
  const fId = crypto.randomUUID();
  const randomlyAnonymous = Math.random() > 0.7 ? 1 : 0;
  
  // Random date within last 30 days
  const subDate = new Date(thirtyDaysAgo.getTime() + Math.random() * (Date.now() - thirtyDaysAgo.getTime()));
  insertFeedback.run(fId, randomlyAnonymous ? null : userId, randomlyAnonymous, subDate.toISOString());

  // Answer first question (Rating)
  const q1Id = questions[0].id;
  insertResponse.run(crypto.randomUUID(), fId, q1Id, Math.floor(Math.random() * 3) + 3, null, null); // Rating 3-5

  // Answer second question (Text)
  const q2Id = questions[1].id;
  insertResponse.run(crypto.randomUUID(), fId, q2Id, null, fakeTextResponses[i % fakeTextResponses.length], null);
}
console.log('Inserted seed feedback.');

db.close();
console.log('Database seeded successfully.');
