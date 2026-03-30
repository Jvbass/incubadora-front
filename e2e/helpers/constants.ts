export const BASE_API_URL = 'http://localhost:8080/api';

// Unique prefixes per test file to avoid username/email collisions
export const TEST_USER_1 = {
  username: 'testuser1_e2e',
  email: 'testuser1_e2e@test.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'UserOne',
};

export const TEST_USER_2 = {
  username: 'testuser2_e2e',
  email: 'testuser2_e2e@test.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'UserTwo',
};

export const TEST_ADMIN = {
  username: 'admin_e2e',
  email: 'admin_e2e@test.com',
  password: 'Password123!',
  firstName: 'Admin',
  lastName: 'User',
};

export const SAMPLE_PROJECT = {
  title: 'E2E Test Project',
  subtitle: 'A project created during E2E testing',
  description: '## About this project\n\nThis project was created automatically by Playwright tests.',
  status: 'published' as const,
  developmentProgress: 50,
  isCollaborative: false,
  needMentoring: false,
  technologyIds: [] as number[],
};
