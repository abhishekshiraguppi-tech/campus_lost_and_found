import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createItem } from '../services/api';

const CATEGORIES = [
  'Electronics',
  'Keys & Cards',
  'Bags & Wallets',
  'Clothing & Accessories',
  'Books & Notes',
  'Personal Items',
  'Other'
];

export default function ItemForm({ mode = 'lost' }) {
  const isLost = mode === 'lost';
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    contactName: '',
    contactInfo: '',
    additionalDetails: ''
  });

  // File state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Errors & Status State
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for field when user edits
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPG, PNG, WEBP, or GIF).' }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB.' }));
      return;
    }

    setErrors(prev => ({ ...prev, image: null }));
    setImageFile(file);

    // Create object URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Item name is required.';
    if (!formData.category) newErrors.category = 'Please select a category.';
    if (!formData.description.trim()) newErrors.description = 'Item description is required.';
    if (!formData.date) newErrors.date = 'Date is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required.';
    if (!formData.contactInfo.trim()) newErrors.contactInfo = 'Contact email or phone number is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('date', formData.date);
      submitData.append('location', formData.location);
      submitData.append('contactName', formData.contactName);
      submitData.append('contactInfo', formData.contactInfo);
      submitData.append('additionalDetails', formData.additionalDetails);
      submitData.append('type', mode);

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await createItem(submitData);

      if (res.success) {
        setSuccess(true);
      } else {
        setServerError(res.message || 'Error submitting report');
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="form-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
        <h2 style={{ fontSize: '1.8rem', color: isLost ? 'var(--color-lost)' : 'var(--color-found)', marginBottom: '0.75rem' }}>
          {isLost ? 'Lost Item Report Created!' : 'Found Item Turned In!'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
          Thank you for reporting. Your item has been listed in the campus registry so fellow students can view and connect.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/browse')}>
            🔍 Browse All Listings
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                location: '',
                contactName: '',
                contactInfo: '',
                additionalDetails: ''
              });
              removeImage();
            }}
          >
            + Report Another Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div style={{ marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`} style={{ marginBottom: '0.5rem' }}>
          {isLost ? '🔴 Report Lost Property' : '🟢 Report Found Property'}
        </span>
        <h1 style={{ fontSize: '1.8rem', marginTop: '0.4rem' }}>
          {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLost
            ? 'Provide details about what you lost and where it might have been left.'
            : 'Provide details about an item you found on campus so the owner can claim it.'}
        </p>
      </div>

      {serverError && (
        <div className="alert alert-error">
          <span>⚠️ {serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Item Name */}
        <div className="form-group">
          <label className="form-label">
            Item Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? 'error' : ''}`}
            placeholder={isLost ? 'e.g., TI-84 Calculator or Blue Backpack' : 'e.g., Dorm Keys or Apple AirPods Case'}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        {/* Category & Date */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              name="category"
              className={`form-control ${errors.category ? 'error' : ''}`}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">-- Select Category --</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <div className="error-text">{errors.category}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              {isLost ? 'Date Lost' : 'Date Found'} <span className="required">*</span>
            </label>
            <input
              type="date"
              name="date"
              className={`form-control ${errors.date ? 'error' : ''}`}
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <div className="error-text">{errors.date}</div>}
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">
            {isLost ? 'Approximate Location Lost' : 'Location Found'} <span className="required">*</span>
          </label>
          <input
            type="text"
            name="location"
            className={`form-control ${errors.location ? 'error' : ''}`}
            placeholder={isLost ? 'e.g., Science Building Rm 204 or Library 3rd Floor' : 'e.g., Bench outside Student Union'}
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && <div className="error-text">{errors.location}</div>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            Description <span className="required">*</span>
          </label>
          <textarea
            name="description"
            rows="4"
            className={`form-control ${errors.description ? 'error' : ''}`}
            placeholder="Provide a detailed description (color, brand, distinguishing features, stickers, contents inside...)"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>

        {/* Optional Image Upload */}
        <div className="form-group">
          <label className="form-label">Optional Photo Upload</label>
          {imagePreview ? (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Item Preview" />
              <button type="button" className="image-remove-btn" onClick={removeImage} title="Remove Image">
                ✕
              </button>
            </div>
          ) : (
            <label className="image-upload-box" style={{ display: 'block' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Click to upload an image</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>PNG, JPG, WEBP or GIF (Max size 5MB)</div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
          {errors.image && <div className="error-text">{errors.image}</div>}
        </div>

        {/* Contact Name & Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">
              Your Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="contactName"
              className={`form-control ${errors.contactName ? 'error' : ''}`}
              placeholder="Enter your name"
              value={formData.contactName}
              onChange={handleChange}
            />
            {errors.contactName && <div className="error-text">{errors.contactName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Email or Phone Number <span className="required">*</span>
            </label>
            <input
              type="text"
              name="contactInfo"
              className={`form-control ${errors.contactInfo ? 'error' : ''}`}
              placeholder="email@campus.edu or phone number"
              value={formData.contactInfo}
              onChange={handleChange}
            />
            {errors.contactInfo && <div className="error-text">{errors.contactInfo}</div>}
          </div>
        </div>

        {/* Additional Details */}
        <div className="form-group">
          <label className="form-label">Additional Instructions / Notes (Optional)</label>
          <textarea
            name="additionalDetails"
            rows="2"
            className="form-control"
            placeholder="e.g., Turned turned in to security desk, or reward offered!"
            value={formData.additionalDetails}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Form Actions */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button
            type="submit"
            className={`btn ${isLost ? 'btn-danger' : 'btn-success'}`}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : isLost ? '🚨 Post Lost Report' : '📦 Post Found Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
