export const defaultCategories = [
  { id: 1, name: "Technology", status: 1 },
  { id: 2, name: "Campus Life", status: 1 },
  { id: 3, name: "Academic", status: 1 },
  { id: 4, name: "Events", status: 0 }
];

export const defaultNews = [
  {
    id: 1,
    title: "Spring Boot 3.4 Integration Guide Released",
    content: "Detailed walkthrough for connecting React SPA frontend with Spring Boot backend services.",
    categoryId: 1,
    createdBy: "Admin",
    status: 1
  },
  {
    id: 2,
    title: "FPT University Welcomes New Semester",
    content: "Campus events and orientation schedules for students entering the Fall term.",
    categoryId: 2,
    createdBy: "Admin",
    status: 1
  },
  {
    id: 3,
    title: "Midterm Project Presentation Guidelines",
    content: "Evaluation criteria and rubrics for single page application presentations.",
    categoryId: 3,
    createdBy: "Staff",
    status: 1
  },
  {
    id: 4,
    title: "Annual Sports Festival Postponed",
    content: "Due to facility upgrades, the sports festival will be held next month.",
    categoryId: 4,
    createdBy: "Staff",
    status: 0
  }
];

export const defaultUsers = [
  { id: 1, username: "Admin", password: "Admin", role: 1, status: 1 },
  { id: 2, username: "john_staff", password: "123", role: 2, status: 1 },
  { id: 3, username: "mary_editor", password: "123", role: 2, status: 1 },
  { id: 4, username: "guest_user", password: "123", role: 2, status: 0 }
];

export function getStoredData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage", error);
  }
}
