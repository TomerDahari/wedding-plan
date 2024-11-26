import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// פונקציות לניהול משתמשים
export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);

// פונקציות לניהול מוזמנים
export const addGuest = (data) => API.post('/guests', data);
export const getGuests = (userId) => API.get(`/guests/${userId}`);
export const deleteGuest = (id) => API.delete(`/guests/${id}`);


// פונקציות לניהול הוצאות
export const addExpense = (data) => API.post('/expenses', data);
export const getExpenses = (userId) => API.get(`/expenses/${userId}`);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);

// סקיצה
export const saveLayout = (data) => API.post('/layouts', data);
export const getLayouts = (userId) => API.get(`/layouts/${userId}`);
export const updateLayout = (userId, data) => API.put(`/layouts/${userId}`, data);
export const deleteLayout = (userId) => API.delete(`/layouts/${userId}`);