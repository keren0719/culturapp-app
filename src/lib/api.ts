// Mock API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const api = {
  auth: {
    loginWithGoogle: async (token: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Usuario Demo',
          role: 'participant' as const,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=demo`,
        }
      };
    },
    loginWithFacebook: async (token: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Usuario Demo',
          role: 'participant' as const,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=demo`,
        }
      };
    },
    register: async (data: { email: string; password: string; name: string; role: 'organizer' | 'participant' }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        token: 'mock-jwt-token',
        user: {
          id: '2',
          email: data.email,
          name: data.name,
          role: data.role as 'organizer' | 'participant',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        }
      };
    }
  },
  events: {
    getAll: async (filters?: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEvents;
    },
    getById: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEvents.find(e => e.id === id);
    },
    create: async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: String(Date.now()), ...data, status: 'pending' };
    },
    createEvent: async (formData: FormData) => {
      // Simulate file upload and event creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const eventData = {
        id: String(Date.now()),
        title: formData.get('name') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        capacity: Number(formData.get('capacity')),
        price: Number(formData.get('price')),
        location: {
          address: formData.get('location') as string,
          lat: 10.4236,
          lng: -75.5512
        },
        status: 'pending',
        photos: [],
        videos: []
      };
      
      return eventData;
    },
    update: async (id: string, data: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id, ...data };
    },
    delete: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
  },
  admin: {
    getPendingEvents: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEvents.filter(e => e.status === 'pending');
    },
    approveEvent: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, status: 'approved' };
    },
    rejectEvent: async (id: string, reason: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, status: 'rejected', reason };
    },
    getStats: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        totalEvents: 156,
        pendingEvents: 12,
        activeOrganizers: 45,
        totalParticipants: 2834,
        monthlyGrowth: 15.3
      };
    },
    createInvite: async (data: { email: string; role: 'admin' }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { inviteCode: 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase() };
    }
  }
};

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Festival de Jazz en la Plaza',
    description: 'Disfruta de una noche mágica con los mejores exponentes del jazz colombiano en el corazón del centro histórico.',
    category: 'musica',
    tags: ['jazz', 'musica en vivo', 'aire libre'],
    date: '2025-12-15',
    time: '19:00',
    duration: 180,
    capacity: 200,
    price: 50000,
    location: {
      address: 'Plaza de Bolívar, Centro Histórico, Cartagena',
      lat: 10.4236,
      lng: -75.5512
    },
    organizer: {
      id: 'org1',
      name: 'Fundación Cultural Cartagena',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FCC'
    },
    images: ['https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'],
    purchaseLink: 'https://example.com/tickets',
    status: 'approved',
    attendees: 87,
    rating: 4.8,
    reviews: []
  },
  {
    id: '2',
    title: 'Taller de Pintura al Óleo',
    description: 'Aprende técnicas de pintura al óleo con artistas locales reconocidos. Todos los materiales incluidos.',
    category: 'arte',
    tags: ['pintura', 'taller', 'arte'],
    date: '2025-12-20',
    time: '15:00',
    duration: 120,
    capacity: 15,
    price: 80000,
    location: {
      address: 'Galería de Arte Moderna, Getsemaní, Cartagena',
      lat: 10.4145,
      lng: -75.5478
    },
    organizer: {
      id: 'org2',
      name: 'Arte Vivo Cartagena',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AVC'
    },
    images: ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'],
    purchaseLink: 'https://example.com/tickets',
    status: 'approved',
    attendees: 12,
    rating: 4.9,
    reviews: []
  },
  {
    id: '3',
    title: 'Noche de Teatro: Macondo Vivo',
    description: 'Adaptación teatral de cuentos del realismo mágico colombiano. Una experiencia única que combina teatro, música y danza.',
    category: 'teatro',
    tags: ['teatro', 'cultura', 'literatura'],
    date: '2025-11-28',
    time: '20:00',
    duration: 150,
    capacity: 100,
    price: 40000,
    location: {
      address: 'Teatro Adolfo Mejía, Centro, Cartagena',
      lat: 10.4240,
      lng: -75.5500
    },
    organizer: {
      id: 'org3',
      name: 'Compañía Teatro del Caribe',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CTC'
    },
    images: ['https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'],
    purchaseLink: 'https://example.com/tickets',
    status: 'pending',
    attendees: 45,
    rating: 0,
    reviews: []
  },
  {
    id: '4',
    title: 'Festival Gastronómico del Caribe',
    description: 'Celebra los sabores del Caribe con showcookings, degustaciones y charlas con chefs reconocidos.',
    category: 'gastronomia',
    tags: ['comida', 'festival', 'gastronomia'],
    date: '2025-12-10',
    time: '11:00',
    duration: 480,
    capacity: 500,
    price: 0,
    location: {
      address: 'Parque Centenario, Manga, Cartagena',
      lat: 10.4095,
      lng: -75.5315
    },
    organizer: {
      id: 'org4',
      name: 'Sabores Caribeños',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SC'
    },
    images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'],
    purchaseLink: null,
    status: 'approved',
    attendees: 312,
    rating: 4.7,
    reviews: []
  }
];
