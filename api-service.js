// API Service for Catering Reservation System
class CateringAPI {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
    }

    // Helper method to make API requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Health check
    async checkHealth() {
        return await this.request('/health');
    }

    // Reservation methods
    async submitReservation(reservationData) {
        return await this.request('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
    }

    async getReservation(id) {
        return await this.request(`/reservations/${id}`);
    }

    async getAllReservations(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/reservations?${queryString}`);
    }

    async updateReservationStatus(id, status) {
        return await this.request(`/reservations/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // Contact methods
    async submitContactMessage(contactData) {
        return await this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }
}

// Initialize API service
const api = new CateringAPI();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CateringAPI;
}

// Make available globally
window.CateringAPI = CateringAPI;
window.api = api;
