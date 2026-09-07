import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('defaults to English when no language is set', async ({ page }) => {
  await page.goto('/');

  // Hero heading (About section merged with Hero)
  await expect(page.getByRole('heading', { name: 'Diego Betancourt' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
});

test('switches to English and reloads with translated content', async ({ page }) => {
  await page.goto('/?lang=es');

  await page.getByRole('link', { name: 'Switch to English' }).click();
  await expect(page).toHaveURL(/[?&]lang=en/);

  // Hero heading visible (About section merged with Hero)
  await expect(page.getByRole('heading', { name: 'Diego Betancourt' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
});

test('switches back to Spanish', async ({ page }) => {
  await page.goto('/?lang=en');

  // Hero heading visible (About section merged with Hero)
  await expect(page.getByRole('heading', { name: 'Diego Betancourt' })).toBeVisible();

  await page.getByRole('link', { name: 'Cambiar a español' }).click();
  await expect(page).toHaveURL(/[?&]lang=es/);
  await expect(page.getByRole('heading', { name: 'Diego Betancourt' })).toBeVisible();
});
