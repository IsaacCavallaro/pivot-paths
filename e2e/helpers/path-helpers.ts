import { expect, Page } from '@playwright/test';

export async function clickByText(page: Page, text: string) {
  await page.getByText(text, { exact: true }).click();
}

export async function clickFirstVisibleText(page: Page, texts: string[]) {
  for (const text of texts) {
    const locator = page.getByText(text, { exact: true });
    if (await locator.isVisible().catch(() => false)) {
      await locator.click();
      return text;
    }
  }

  throw new Error(`No visible text found for candidates: ${texts.join(', ')}`);
}

export async function clickCardByText(page: Page, text: string) {
  await page.getByText(text, { exact: true }).locator('xpath=../..').click({ force: true });
}

export async function clickButtonContainer(page: Page, text: string) {
  await page.getByText(text, { exact: true }).locator('xpath=..').click({ force: true });
}

export async function completeOnboarding(page: Page, categoryTitle: string, pathTitle: string) {
  await page.goto('/welcome');
  await page.getByPlaceholder('First name').fill('John');
  await clickByText(page, 'Confirm');
  await clickByText(page, categoryTitle);
  await clickByText(page, 'Start With This Focus');
  await expect(page.getByText(pathTitle, { exact: true })).toBeVisible();
  await clickByText(page, pathTitle);
}

export async function openPathTimeline(page: Page, route: string, expectedDayTitle: string) {
  await page.goto(route);
  await expect(page.getByText(expectedDayTitle, { exact: true }).first()).toBeVisible();
}

export async function openNextTimelineDay(page: Page) {
  await page.getByText('Start', { exact: true }).click();
}

export async function clickPairInColumns(
  page: Page,
  {
    leftColumnTitle,
    rightColumnTitle,
    leftText,
    rightText,
    selectedBorderColor = 'rgb(100, 124, 144)',
  }: {
    leftColumnTitle: string;
    rightColumnTitle: string;
    leftText: string;
    rightText: string;
    selectedBorderColor?: string;
  }
) {
  const leftColumn = page.getByText(leftColumnTitle, { exact: true }).locator('xpath=..');
  const rightColumn = page.getByText(rightColumnTitle, { exact: true }).locator('xpath=..');
  const leftCard = leftColumn.getByText(leftText, { exact: true }).locator('xpath=..');
  const rightCard = rightColumn.getByText(rightText, { exact: true }).locator('xpath=..');

  await leftCard.click();
  await expect
    .poll(async () => {
      return leftCard.evaluate((element) => window.getComputedStyle(element as HTMLElement).borderColor);
    })
    .toBe(selectedBorderColor);
  await rightCard.click();
}

export async function clickVisibleOptionAndWaitForSelection(
  page: Page,
  options: string[],
  selectedBorderColor = 'rgb(146, 132, 144)',
  cardLocatorPath = 'xpath=../..'
) {
  for (const option of options) {
    const optionText = page.getByText(option, { exact: true });
    if (await optionText.isVisible().catch(() => false)) {
      const optionCard = optionText.locator(cardLocatorPath);
      await optionCard.click();
      await expect
        .poll(async () => {
          return optionCard.evaluate((element) => window.getComputedStyle(element as HTMLElement).borderColor);
        })
        .toBe(selectedBorderColor);
      return option;
    }
  }

  throw new Error('No visible option found for current screen');
}

export async function expectCompletedDayCount(page: Page, count: number) {
  await expect(page.getByText('Completed').first()).toBeVisible();
  await expect(page.getByText('Completed')).toHaveCount(count);
}
