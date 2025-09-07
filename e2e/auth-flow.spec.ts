import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete user registration and login flow', async ({ page }) => {
    // Navigate to registration
    await page.click('[data-testid="register-button"]');
    await expect(page).toHaveURL(/.*register/);

    // Fill registration form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'SecurePassword123!');
    await page.fill('[data-testid="confirm-password-input"]', 'SecurePassword123!');
    await page.fill('[data-testid="full-name-input"]', 'Test User');

    // Submit registration
    await page.click('[data-testid="register-submit"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();

    // Navigate to login
    await page.click('[data-testid="login-link"]');
    await expect(page).toHaveURL(/.*login/);

    // Login with created account
    await page.fill('[data-testid="login-email"]', 'test@example.com');
    await page.fill('[data-testid="login-password"]', 'SecurePassword123!');
    await page.click('[data-testid="login-submit"]');

    // Verify successful login
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('MFA setup and verification flow', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[data-testid="login-email"]', 'test@example.com');
    await page.fill('[data-testid="login-password"]', 'SecurePassword123!');
    await page.click('[data-testid="login-submit"]');

    // Navigate to security settings
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="security-settings"]');

    // Enable MFA
    await page.click('[data-testid="enable-mfa-button"]');

    // Verify QR code is displayed
    await expect(page.locator('[data-testid="mfa-qr-code"]')).toBeVisible();

    // Verify backup codes are shown
    await expect(page.locator('[data-testid="backup-codes"]')).toBeVisible();

    // Enter verification code (simulate)
    await page.fill('[data-testid="mfa-verification-code"]', '123456');
    await page.click('[data-testid="verify-mfa-button"]');

    // Verify MFA is enabled
    await expect(page.locator('[data-testid="mfa-enabled-status"]')).toBeVisible();
  });

  test('password reset flow', async ({ page }) => {
    await page.goto('/login');
    await page.click('[data-testid="forgot-password-link"]');

    // Fill reset form
    await page.fill('[data-testid="reset-email"]', 'test@example.com');
    await page.click('[data-testid="reset-submit"]');

    // Verify success message
    await expect(page.locator('[data-testid="reset-success"]')).toBeVisible();
  });

  test('account lockout after failed attempts', async ({ page }) => {
    await page.goto('/login');

    // Attempt multiple failed logins
    for (let i = 0; i < 6; i++) {
      await page.fill('[data-testid="login-email"]', 'test@example.com');
      await page.fill('[data-testid="login-password"]', 'WrongPassword');
      await page.click('[data-testid="login-submit"]');
      
      if (i < 5) {
        await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      }
    }

    // Verify account is locked
    await expect(page.locator('[data-testid="account-locked-message"]')).toBeVisible();
  });
});