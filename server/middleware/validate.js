/**
 * Middleware to validate required fields for lost/found item submission.
 */
function validateItemForm(req, res, next) {
  const { name, category, description, date, location, contactName, contactInfo } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Item name is required.');
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('Category is required.');
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    errors.push('Description is required.');
  }

  if (!date || typeof date !== 'string' || date.trim() === '') {
    errors.push('Date is required.');
  }

  if (!location || typeof location !== 'string' || location.trim() === '') {
    errors.push('Location is required.');
  }

  if (!contactName || typeof contactName !== 'string' || contactName.trim() === '') {
    errors.push('Contact name is required.');
  }

  if (!contactInfo || typeof contactInfo !== 'string' || contactInfo.trim() === '') {
    errors.push('Contact information (email or phone) is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
}

module.exports = {
  validateItemForm
};
