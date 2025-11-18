// Mock API configuration
const API_BASE = import.meta.env.REACT_APP_API_URL || 'https://es-cultura-api-deploy-p.vercel.app/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Error en la API: ${res.status}`);
  }

  return res.json();
}

export const apiapp = {
  events: {
    getAll: () => request('/events/listExplorerEvents'),
    getAllAdmin: () => request('/events/listEventsAdmin'),
    getAllHome: () => request('/events/listHomeEvents'),
    getDashboardStats: () => request('/events/getDashboardStats'),
    getById: (idEvent: string) => request(`/events/getEventById/${idEvent}`),
    getByUser: (idUser: string) => request(`/events/listEventsByUser/${idUser}`),
    create: async (formData: FormData) => {
      const res = await fetch(`${API_BASE}/events/createEvent`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json(); // lo necesitas para el error y el éxito

      if (!res.ok) {
        throw new Error(result.detail?.message || "Error al crear el evento");
      }

      return result; // se devuelve limpio al frontend
    },
    approveEvent: (idEvent: string) =>request(`/events/publishEvent/${idEvent}`),
    rejectEvent: (idEvent: string, reason: string) =>
      request(`/events/rejectEvent/${idEvent}`, {
        method: "POST",
        body: JSON.stringify({ reason })
      }
    )
  },
  categories: {
    getAll: () => request('/categories/getAllCategories'),
    create: (data: { nombre: string; slug: string }) =>
      request('/categories/createCategory', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: { nombre: string; slug: string }) =>
      request(`/categories/updateCategory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/categories/deleteCategory/${id}`, {
        method: 'DELETE',
      }),
  },
  places: {
    getAll: () => request('/places/getAllPlaces'),
    create: (data: any) => request('/places/createPlace', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`places/updatePlace/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`places/deletePlace/${id}`, { method: 'DELETE' }),
  },
  reviews:{
    getReviewsByEvent:(idEvent: string) => request(`/reviews/getReviewsByEvent/${idEvent}`),
    createReview: (idEvent: string, rating: number,autorId: string, comment: string) =>
      request(`/reviews/createReview/${idEvent}`, {
        method: "POST",
        body: JSON.stringify({
          calificacion:rating,
          autorId:autorId,
          comentario: comment.trim(),
        })
      }
    ),
  },
  users:{
    getAll: () => request('/users/getAllUsers'), // Debe devolver usuarios con sus roles incluidos
    create: (data: any) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/users/${id}`, { method: 'DELETE' }),
  },
  roles:{
    getAll: () => request('/roles/getAllRoles'),
    create: (data: any) => request('/roles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      request(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/roles/${id}`, { method: 'DELETE' }),
  },
  user_roles: {
    create: (data: { user_id: string; role_id: string }) =>
      request('/user_roles', { method: 'POST', body: JSON.stringify(data) }),
    delete: (userId: string, roleId: string) =>
      request(`/user_roles/${userId}/${roleId}`, { method: 'DELETE' }),
  },

};

