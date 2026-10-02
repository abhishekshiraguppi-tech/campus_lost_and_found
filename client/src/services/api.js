const API_BASE = '/api/items';

/**
 * Utility helper to handle HTTP responses and JSON parsing
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || data.errors?.join(', ') || `Server returned status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

/**
 * Fetch all items with optional filters
 * @param {Object} params - { search, status, category, sort }
 */
export async function fetchItems(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.sort) query.append('sort', params.sort);

  const url = `${API_BASE}?${query.toString()}`;
  const response = await fetch(url);
  return handleResponse(response);
}

/**
 * Fetch a single item by ID
 */
export async function getItemById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  return handleResponse(response);
}

/**
 * Fetch system statistics for dashboard
 */
export async function fetchStats() {
  const response = await fetch(`${API_BASE}/stats`);
  return handleResponse(response);
}

/**
 * Create a new lost or found item report
 * @param {FormData} formData - FormData object containing text fields and optional file 'image'
 */
export async function createItem(formData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    body: formData // Content-Type is automatically set by browser for FormData
  });
  return handleResponse(response);
}

/**
 * Update an existing item report
 */
export async function updateItem(id, formData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    body: formData
  });
  return handleResponse(response);
}

/**
 * Mark an item as reunited
 */
export async function markAsReunited(id) {
  const response = await fetch(`${API_BASE}/${id}/reunite`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return handleResponse(response);
}

/**
 * Delete an item
 */
export async function deleteItem(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  return handleResponse(response);
}
