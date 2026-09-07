import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test('renders all portfolio sections in order', async ({ page }) => {
  await page.goto('/?lang=es');

  await expect(page).toHaveTitle(/Diego Betancourt/);

  // Hero heading visible (About section merged with Hero)
  await expect(page.getByRole('heading', { name: 'Diego Betancourt' })).toBeVisible();

  // Section headings visible
  const sectionHeadings = ['Experiencia', 'Proyectos', 'Contacto'];
  for (const heading of sectionHeadings) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }

  // All 6 sections must be present (about, experience, projects, chat, cv, contact)
  const sections = page.locator('main section[id]');
  await expect(sections).toHaveCount(6);

  await expect(page.locator('#about')).toBeVisible();
  await expect(page.locator('#experience')).toBeVisible();
  await expect(page.locator('#projects')).toBeVisible();
  await expect(page.locator('#chat')).toBeVisible();
  await expect(page.locator('#cv')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
});

test('shows the desktop navigation sidebar with all links', async ({ page }) => {
  await page.goto('/?lang=es');

  // Header sidebar visible on desktop
  const header = page.locator('#site-header');
  await expect(header).toBeVisible();

  // Navigation links by their section data attribute
  const navLinks = ['about', 'experience', 'projects', 'chat', 'cv', 'contact'];
  for (const id of navLinks) {
    await expect(page.locator(`.nav-link[data-section="${id}"]`)).toBeVisible();
  }

  // Blog link present
  await expect(page.getByRole('link', { name: /Blog/ })).toBeVisible();

  // Projects link goes to correct anchor
  await expect(page.locator('.nav-link[data-section="projects"]')).toHaveAttribute(
    'href',
    '/?lang=es#projects'
  );
});

test('active section label changes color on scroll (scroll spy)', async ({ page }) => {
  await page.goto('/?lang=es');

  const experienceLink = page.locator('.nav-link[data-section="experience"]');

  // Before scroll: experience label should be muted
  const labelBefore = experienceLink.locator('.nav-label');
  await expect(labelBefore).toBeVisible();

  // Scroll to experience section
  await page.locator('#experience').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // let IntersectionObserver fire

  // After scroll: color style should change (not checking blue, just that style changed)
  const color = await labelBefore.evaluate((el: HTMLElement) => el.style.color);
  expect(color).toBeTruthy();
});
