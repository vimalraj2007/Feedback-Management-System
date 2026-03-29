import { Feedback } from '../models/Feedback.js';

export const exportCSV = (req, res, next) => {
  try {
    // Basic CSV implementation
    const data = Feedback.findAllPaginated(10000, 0, {}).data;
    
    let csv = 'Feedback ID,User ID,User Email,Anonymous,Date,Avg Rating\n';
    data.forEach(row => {
      const email = row.is_anonymous ? 'Anonymous' : (row.user_email || 'N/A');
      csv += `${row.id},${row.user_id || 'N/A'},${email},${row.is_anonymous},${row.submitted_at},${row.avg_rating || ''}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="feedback_export.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportPDF = (req, res, next) => {
  try {
    // Stub implementation for PDF (generating a simple text response instead of full PDF generation package overhead)
    // Normally we'd use pdfkit here.
    const summary = Feedback.getAnalyticsSummary();
    const pdfTextContent = `Feedback System Summary Report\n--------------------------\nTotal Feedback: ${summary.total}\nAverage Rating: ${summary.avgRating?.toFixed(1) || 'N/A'}\nResponse Rate: ${summary.responseRate?.toFixed(1)}%`;
    
    res.setHeader('Content-Type', 'text/plain'); // using plain text for stub
    res.setHeader('Content-Disposition', 'attachment; filename="feedback_summary.txt"');
    res.send(pdfTextContent);
  } catch (error) {
    next(error);
  }
};
