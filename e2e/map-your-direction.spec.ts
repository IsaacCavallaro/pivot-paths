import { expect, test } from '@playwright/test';

import {
  clickByText,
  clickCardByText,
  clickFirstVisibleText,
  clickPairInColumns,
  clickVisibleOptionAndWaitForSelection,
  completeOnboarding,
  expectCompletedDayCount,
  openNextTimelineDay,
  openPathTimeline,
} from './helpers/path-helpers';

const mapYourDirectionRoute = '/paths/career-transitions/map-your-direction';

const expandHorizonsOptions = [
  'Working with people',
  'Working with numbers',
  'A job with creativity at its core',
  'A job that solves problems',
  'Helping individuals one-on-one',
  'Designing systems that help many people at once',
  'A structured office role',
  'A flexible, self-directed role',
  "A job where you're constantly learning",
  "A job where you're the expert, teaching others",
  'Stability and long-term security',
  'Adventure and variety',
  'A role tied closely to the arts',
  'A role that stretches you into a brand-new industry',
  'A behind-the-scenes role',
  'A front-facing role with lots of interaction',
  'Building something new',
  'Joining something established',
];

const energizerAnswers = [
  'Helped people directly',
  'A buzzing, people-filled space',
  'Talking and connecting',
  'Organizing a group event',
  'Ask for input or advice',
  '"You really made me feel supported."',
  'The one connecting people',
  'Meeting new people',
  'Seeing someone light up from your help',
  'Connecting and uplifting others',
];

const sparkCuriosityButtons = [
  'Write it down',
  'Think about it',
  "Let's reflect",
  'Hmm… interesting',
  'Start asking',
  'Do some reflection',
  'Get thinking',
  "Let's learn",
  'Sounds good!',
];

const dealBreakerPairs = [
  ['No creative freedom', 'Rigid, highly structured corporate roles'],
  ['Low flexibility', 'Jobs with strict 9–5 schedules and no hybrid options'],
  ['Constant public scrutiny', 'Front-facing client roles or media positions'],
  ['Minimal social interaction', 'Remote or solitary work without collaboration'],
  ['Unclear expectations', 'Roles with no defined processes or guidance'],
  ['Repetitive tasks', 'Roles with limited variety or creativity like data entry or admin'],
  ['Lack of growth opportunities', 'Positions with little training or promotion potential'],
  ['Low autonomy', 'Jobs requiring constant supervision'],
];

const experimentButtons = [
  "I've chosen my focus",
  'I found my resource',
  'Goal set!',
  'Connection made',
  "I've reflected",
  'Next move decided',
];

async function openMapYourDirectionTimeline(page: Parameters<typeof openPathTimeline>[0]) {
  await openPathTimeline(page, mapYourDirectionRoute, 'Expand Your Horizons');
}

async function completeExpandYourHorizonsDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openMapYourDirectionTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Expand Your Horizons', { exact: true }).first()).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'Start exploring');

  for (let index = 0; index < 9; index += 1) {
    await expect(page.getByText(`${index + 1} of 9`, { exact: true })).toBeVisible();
    await clickVisibleOptionAndWaitForSelection(page, expandHorizonsOptions);
    await clickByText(page, 'Continue');

    if (index < 8) {
      await expect(page.getByText(`${index + 2} of 9`, { exact: true })).toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('Explore Your Horizons', { exact: true })).toBeVisible();
  for (let index = 0; index < 9; index += 1) {
    await clickByText(page, 'Continue');
  }
  await expect(page).toHaveURL(/profile/);
}

async function completeWhatEnergizesYouDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openMapYourDirectionTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome to Your Energy Discovery', { exact: true })).toBeVisible();
  await clickByText(page, "I'm Ready to Begin");
  await expect(page.getByText('What Energizes You?', { exact: true }).first()).toBeVisible();
  await clickByText(page, "Let's find out");

  for (const [index, answer] of energizerAnswers.entries()) {
    await expect(page.getByText(`${index + 1} of 10`, { exact: true })).toBeVisible();
    await clickVisibleOptionAndWaitForSelection(page, [answer], 'rgb(146, 132, 144)', 'xpath=../../..');
    await clickByText(page, index === energizerAnswers.length - 1 ? 'See Results' : 'Continue');

    if (index < energizerAnswers.length - 1) {
      await expect(page.getByText(`${index + 2} of 10`, { exact: true })).toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('The Connector', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText("Here's How You Can Use Your Energy:", { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('Take Action', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue Your Journey');
  await expect(page.getByText('Congratulations!', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark as Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeSparkCuriosityDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openMapYourDirectionTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome to Your Curiosity Journey', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue to Curiosity');
  await expect(page.getByText('Spark Curiosity', { exact: true })).toBeVisible();
  await clickByText(page, "Let's go");

  for (const [index, buttonText] of sparkCuriosityButtons.entries()) {
    await expect(page.getByText(`${index + 1} of 9`, { exact: true })).toBeVisible();
    await clickByText(page, buttonText);

    if (index < sparkCuriosityButtons.length - 1) {
      await expect(page.getByText(`${index + 2} of 9`, { exact: true })).toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('Cultivating Your Curiosity', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText("It's Time to Reflect", { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeTryItOnDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openMapYourDirectionTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Try It On', { exact: true })).toBeVisible();
  await clickByText(page, 'Begin');

  await expect(page.getByText('Your First Client Meeting', { exact: true })).toBeVisible();
  await clickByText(page, 'What will you do?');
  await clickCardByText(page, "\"I'm not sure, I'll need to think about it.\"");
  await expect(page.getByText("Here's where you're at", { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'What will you do?');
  await clickCardByText(page, 'Stress out and agree to everything immediately.');
  await expect(page.getByText("Here's where you're at", { exact: true })).toBeVisible();
  await clickFirstVisibleText(page, ['Next Scenario', 'Continue']);

  await clickCardByText(page, '"I\'m just doing the tasks I was assigned."');
  await expect(page.getByText("Here's where you're at", { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'What will you do?');
  await clickCardByText(page, "Agree anyway. You don't want to let anyone down.");
  await expect(page.getByText("Here's where you're at", { exact: true })).toBeVisible();
  await clickFirstVisibleText(page, ['Next Scenario', 'Continue']);

  await clickCardByText(page, 'Stay quiet and hope the group calms down.');
  await expect(page.getByText("Here's where you're at", { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'What will you do?');
  await clickCardByText(page, 'Offer a quick solution and move on.');
  await expect(page.getByText("Here's where you're at", { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');

  await expect(page.getByText('How did that feel?', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeBreakOutOfYourBubbleDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openMapYourDirectionTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Break Out of Your Bubble', { exact: true })).toBeVisible();
  await clickByText(page, "I'm Ready to Begin");
  await page.getByLabel('Play bubble-break visualization').click();
  await expect(page.getByText('Reflect on Breaking Out', { exact: true })).toBeVisible({
    timeout: 10_000,
  });
  await clickByText(page, 'Continue');
  await expect(page.getByText('How did that feel?', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeDealBreakersDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openMapYourDirectionTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome Back John', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'Start the Game');

  for (const [index, [dealBreaker, environment]] of dealBreakerPairs.entries()) {
    await expect(page.getByText(`${index}/8 pairs matched`, { exact: true })).toBeVisible();
    await clickPairInColumns(page, {
      leftColumnTitle: 'Deal Breaker',
      rightColumnTitle: 'Environment',
      leftText: dealBreaker,
      rightText: environment,
    });
    await expect(page.getByText(`${index + 1}/8 pairs matched`, { exact: true })).toBeVisible({
      timeout: 5_000,
    });

    if (index < dealBreakerPairs.length - 1) {
      await expect(page.getByText(dealBreaker, { exact: true })).not.toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('Take a moment to reflect', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('Great Work!', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeYourFirstExperimentDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openMapYourDirectionTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Take the Leap: Your First Career Experiment', { exact: true })).toBeVisible();
  await clickByText(page, "Let's experiment");
  await expect(page.getByText('Your Experiment Journey', { exact: true })).toBeVisible();
  await clickByText(page, 'Start Step 1');

  for (const [index, buttonText] of experimentButtons.entries()) {
    await expect(page.getByText(`Step ${index + 1} of 6`, { exact: true })).toBeVisible();
    await clickByText(page, buttonText);

    if (index < experimentButtons.length - 1) {
      await expect(page.getByText(`Step ${index + 2} of 6`, { exact: true })).toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('Make Progress Every Day', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

test('completes the Map Your Direction path end to end', async ({ page }) => {
  await completeOnboarding(page, 'Career Transitions', 'Map Your Direction');

  await test.step('Day 1: Expand Your Horizons', async () => {
    await completeExpandYourHorizonsDay(page);
  });
  await test.step('Day 2: What Energizes You?', async () => {
    await completeWhatEnergizesYouDay(page);
  });
  await test.step('Day 3: Spark Curiosity', async () => {
    await completeSparkCuriosityDay(page);
  });
  await test.step('Day 4: Try It On', async () => {
    await completeTryItOnDay(page);
  });
  await test.step('Day 5: Break Out of Your Bubble', async () => {
    await completeBreakOutOfYourBubbleDay(page);
  });
  await test.step('Day 6: Deal Breakers', async () => {
    await completeDealBreakersDay(page);
  });
  await test.step('Day 7: Your First Experiment', async () => {
    await completeYourFirstExperimentDay(page);
  });

  await openMapYourDirectionTimeline(page);
  await expectCompletedDayCount(page, 7);
});
