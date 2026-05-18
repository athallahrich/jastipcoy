export const useApi = () => {
  const config = useRuntimeConfig();
  let baseUrl = config.public.apiBase;

  // Deteksi dinamis: jika diakses dari localhost, paksa pakai API lokal
  if (process.client) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      baseUrl = 'http://localhost/jastiper-engine/api';
    } else {
      baseUrl = 'https://jastiper-engine.cleanly.biz.id/api';
    }
  }

  const fetchApi = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'API request failed');
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return {
    fetchApi,
    getLocations: () => fetchApi('/locations'),
    createLocation: (data) => fetchApi('/locations', { method: 'POST', body: JSON.stringify(data) }),
    registerJastiper: (data) => fetchApi('/register_jastiper', { method: 'POST', body: JSON.stringify(data) }),
    createSession: (data) => fetchApi('/sessions', { method: 'POST', body: JSON.stringify(data) }),
    getSessions: (params = '') => fetchApi(`/sessions${params}`),
    getSession: (id) => fetchApi(`/sessions?id=${id}`),
    getSessionByToken: (token) => fetchApi(`/sessions?token=${token}`),
    placeOrder: (data) => fetchApi('/orders', { method: 'POST', body: JSON.stringify(data) }),
    getOrders: (sessionId) => fetchApi(`/orders?session_id=${sessionId}`),
    updateOrderStatus: (id, status) => fetchApi('/orders', { method: 'PATCH', body: JSON.stringify({ id, status }) }),
    deleteOrder: (id) => fetchApi(`/orders?id=${id}`, { method: 'DELETE' }),
    updateBatchStatus: (sessionId, status) => fetchApi('/update_orders_status', { method: 'POST', body: JSON.stringify({ session_id: sessionId, status }) }),
    updateSessionMenuPrice: (sessionId, itemId, itemName, newPrice) => fetchApi('/update_session_menu_price', { method: 'POST', body: JSON.stringify({ session_id: sessionId, item_id: itemId, item_name: itemName, new_price: newPrice }) }),
    getDashboardStats: (jastiperId) => fetchApi(`/dashboard_stats?jastiper_id=${jastiperId}`),
    updateProfile: (data) => fetchApi('/update_profile', { method: 'POST', body: JSON.stringify(data) }),
    getUser: (id) => fetchApi(`/user?id=${id}`),
    getOrder: (id) => fetchApi(`/order_by_id?id=${id}`),
    getPaymentMethods: (userId) => fetchApi(`/payment_methods?user_id=${userId}`),
    addPaymentMethod: (data) => fetchApi('/payment_methods', { method: 'POST', body: JSON.stringify(data) }),
    deletePaymentMethod: (id) => fetchApi(`/payment_methods?id=${id}`, { method: 'DELETE' }),
    uploadReceipt: (data) => fetchApi('/upload_receipt', { method: 'POST', body: JSON.stringify(data) }),
  };
};
