// API Service Layer
// Always use relative path in production (Vercel proxy)
const API_BASE_URL = import.meta.env.PROD 
  ? "/api"  // Production: use Vercel proxy (no CORS)
  : "http://localhost:3001/api";  // Development: direct to backend

// Helper function untuk fetch dengan error handling
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Terjadi kesalahan pada server");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: async (username, password) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  logout: async () => {
    return fetchAPI("/auth/logout", {
      method: "POST",
    });
  },

  getProfile: async () => {
    return fetchAPI("/auth/profile");
  },
};

// Stok API
export const stokAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/stok?${queryString}` : "/stok";
    return fetchAPI(endpoint);
  },

  getById: async (id) => {
    return fetchAPI(`/stok/${id}`);
  },

  create: async (data) => {
    return fetchAPI("/stok", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return fetchAPI(`/stok/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/stok/${id}`, {
      method: "DELETE",
    });
  },
};

// Barang Masuk API
export const barangMasukAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/barang-masuk?${queryString}` : "/barang-masuk";
    return fetchAPI(endpoint);
  },

  getLatest: async () => {
    return fetchAPI("/barang-masuk/latest");
  },

  getById: async (id) => {
    return fetchAPI(`/barang-masuk/${id}`);
  },

  create: async (data) => {
    return fetchAPI("/barang-masuk", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return fetchAPI(`/barang-masuk/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/barang-masuk/${id}`, {
      method: "DELETE",
    });
  },
};

// Barang Keluar API
export const barangKeluarAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/barang-keluar?${queryString}` : "/barang-keluar";
    return fetchAPI(endpoint);
  },

  getLatest: async () => {
    return fetchAPI("/barang-keluar/latest");
  },

  getById: async (id) => {
    return fetchAPI(`/barang-keluar/${id}`);
  },

  create: async (data) => {
    return fetchAPI("/barang-keluar", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return fetchAPI(`/barang-keluar/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/barang-keluar/${id}`, {
      method: "DELETE",
    });
  },
};

// Kategori API
export const kategoriAPI = {
  getAll: async () => {
    return fetchAPI("/kategori");
  },

  getById: async (id) => {
    return fetchAPI(`/kategori/${id}`);
  },

  create: async (data) => {
    return fetchAPI("/kategori", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return fetchAPI(`/kategori/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/kategori/${id}`, {
      method: "DELETE",
    });
  },
};

// Supplier API
export const supplierAPI = {
  getAll: async () => {
    return fetchAPI("/supplier");
  },

  getById: async (id) => {
    return fetchAPI(`/supplier/${id}`);
  },

  create: async (data) => {
    return fetchAPI("/supplier", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id, data) => {
    return fetchAPI(`/supplier/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/supplier/${id}`, {
      method: "DELETE",
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/dashboard/stats?${queryString}` : "/dashboard/stats";
    return fetchAPI(endpoint);
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_BASE_URL}/upload`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal upload file");
      }

      return data;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  },
};
