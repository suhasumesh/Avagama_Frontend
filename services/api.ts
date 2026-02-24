
/**
 * API Service for Avagama AI
 * Integrated with Render backend at https://avagama-backend.onrender.com/api
 */

const BASE_URL = 'https://avagama-backend.onrender.com/api';

const getHeaders = (isJson = true) => {
  const token = localStorage.getItem('token');
  return {
    ...(isJson ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error: any = new Error(data.message || data.error || `Server Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
};

export const apiService = {
  auth: {
    login: async (credentials: any) => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    },
    register: async (userData: any) => {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    forgotPassword: async (email: string) => {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });
      return handleResponse(response);
    },
    resetPassword: async (token: string, password: any) => {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ token, password }),
      });
      return handleResponse(response);
    }
  },

  evaluations: {
    create: async (discoveryData: any) => {
      const response = await fetch(`${BASE_URL}/evaluations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(discoveryData),
      });
      return handleResponse(response);
    },
    uploadSOP: async (id: string, file: File) => {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      // Key must be 'file' as per requirement
      formData.append('file', file);
      
      const response = await fetch(`${BASE_URL}/evaluations/${id}/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData,
      });
      return handleResponse(response);
    },
    updateOperations: async (id: string, opsData: any) => {
      const response = await fetch(`${BASE_URL}/evaluations/${id}/operations`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(opsData),
      });
      return handleResponse(response);
    },
    updateAIConfig: async (id: string, configData: any) => {
      const response = await fetch(`${BASE_URL}/evaluations/${id}/ai-config`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(configData),
      });
      return handleResponse(response);
    },
    runAgent: async (id: string) => {
      const response = await fetch(`${BASE_URL}/evaluations/${id}/run`, {
        method: 'POST',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    list: async () => {
      const response = await fetch(`${BASE_URL}/evaluations`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    get: async (id: string) => {
      const response = await fetch(`${BASE_URL}/evaluations/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getDashboard: async () => {
      const response = await fetch(`${BASE_URL}/dashboard`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    export: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/export/evaluations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream'
        },
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No response body');
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Export failed');
        } catch (e: any) {
          throw new Error(`Server error (${response.status})`);
        }
      }
      return response.blob();
    }
  },

  useCases: {
    generateCompany: async (company: string) => {
      const response = await fetch(`${BASE_URL}/usecases/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ company }),
      });
      return handleResponse(response);
    },
    listCompany: async () => {
      const response = await fetch(`${BASE_URL}/usecases`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getCompany: async (id: string) => {
      const response = await fetch(`${BASE_URL}/usecases/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    generateDomain: async (payload: { domain: string, user_role: string, objective: string }) => {
      const response = await fetch(`${BASE_URL}/usecases-domain/generate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(response);
    },
    listDomain: async () => {
      const response = await fetch(`${BASE_URL}/usecases-domain`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getDomain: async (id: string) => {
      const response = await fetch(`${BASE_URL}/usecases-domain/${id}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    }
  },

  ai: {
    askCortex: async (question: string) => {
      const response = await fetch(`${BASE_URL}/ai/ask-cortex`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ question }),
      });
      return handleResponse(response);
    },
    getUsecaseChat: async (sourceType: string, documentId: string, usecaseId: string) => {
      const response = await fetch(`${BASE_URL}/ai/usecase-chat/${sourceType}/${documentId}/${usecaseId}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getUsecaseDetails: async (sourceType: string, documentId: string, usecaseId: string) => {
      const response = await fetch(`${BASE_URL}/ai/usecase-details/${sourceType}/${documentId}/${usecaseId}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    askUsecase: async (payload: { question: string, sourceType: string, documentId: string, usecaseId: string }) => {
      const response = await fetch(`${BASE_URL}/ai/ask-usecase`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(response);
    }
  },

  documents: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${BASE_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      return handleResponse(response);
    },
    ask: async (documentId: string, question: string) => {
      const response = await fetch(`${BASE_URL}/documents/ask`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ documentId, question }),
      });
      return handleResponse(response);
    },
    getChatHistory: async (documentId: string) => {
      const response = await fetch(`${BASE_URL}/documents/chat/${documentId}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    getMessage: async (documentId: string, messageId: string) => {
      const response = await fetch(`${BASE_URL}/documents/chat/${documentId}/message/${messageId}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    deleteMessage: async (documentId: string, messageId: string) => {
      const response = await fetch(`${BASE_URL}/documents/chat/${documentId}/message/${messageId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    }
  },

  admin: {
    getUsers: async () => {
      const response = await fetch(`${BASE_URL}/admin/users`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    approveUser: async (id: string) => {
      const response = await fetch(`${BASE_URL}/admin/approve/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    grantAdmin: async (id: string) => {
      const response = await fetch(`${BASE_URL}/admin/grant-admin/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    revokeAdmin: async (id: string) => {
      const response = await fetch(`${BASE_URL}/admin/revoke-admin/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    toggleStatus: async (id: string) => {
      const response = await fetch(`${BASE_URL}/admin/toggle-status/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    assignPlan: async (id: string, planData: { plan: string, validityDays: number, credits: number }) => {
      const response = await fetch(`${BASE_URL}/admin/assign-plan/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(planData),
      });
      return handleResponse(response);
    },
    adjustCredits: async (id: string, credits: number) => {
      const response = await fetch(`${BASE_URL}/admin/adjust-credits/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ credits }),
      });
      return handleResponse(response);
    },
    getDashboard: async () => {
      const response = await fetch(`${BASE_URL}/admin/dashboard`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    },
    deleteUser: async (id: string) => {
      const response = await fetch(`${BASE_URL}/admin/delete-user/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    }
  }
};
