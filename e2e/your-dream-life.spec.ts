import { expect, Page, test } from '@playwright/test';

import {
  clickButtonContainer,
  clickByText,
  clickVisibleOptionAndWaitForSelection,
  completeOnboarding,
  expectCompletedDayCount,
  openNextTimelineDay,
  openPathTimeline as openSharedPathTimeline,
  clickPairInColumns,
} from './helpers/path-helpers';

const skillsQuizAnswers = [
  'Say something you think is realistic and achievable.',
  "I want more clarity about what's possible.",
  'Structured with clear, safe steps.',
  'How do I get there?',
  'I calculate every detail before deciding.',
  'A solid plan with job security and peace.',
  "I know what I want, but I don't believe I can have it.",
  'Say only what sounds "reasonable".',
  'A starting point and actionable steps.',
  "I don't want to be unrealistic.",
];

const mythPairs = [
  ["Dancers shouldn't have a plan B.", 'A backup plan is essential.'],
  ["I can dance well into my 40s.", 'Most dance careers end in your early 30s.'],
  ['Real dancers sacrifice everything.', "Balance doesn't make you a worse dancer."],
  ['The dance industry is my family.', 'Dance work cultures are often toxic.'],
  ['Do what you love.', "Passion doesn't pay the bills."],
  ['The show must go on.', 'Everyone needs sick days.'],
  ['Dance is the dream.', 'You can have more than one dream.'],
  ['Leaving dance makes me a sellout.', 'Staying in dance can be seen as settling.'],
  ['Never give up.', "It's ok to let go."],
];

const dreamBiggerOptions = [
  'Beach house',
  'Mountain cabin',
  'Travel the world',
  'Buy your forever home',
  'Learn to surf',
  'Learn to build pottery',
  'Start a family',
  'Start a business',
  '6-figure income',
  'Unlimited time off',
  'Personal chef',
  'High-quality wardrobe',
  'Work part time',
  'Retire early',
  'Season tickets to the theatre',
  'Create your own show',
  'Run a marathon',
  'Annual yoga retreats',
  'Donate to charity',
  'Help your parents retire',
];

const valuesDiscoveryOptions = [
  "I'm doing something expressive or artistic",
  "I'm setting my own schedule",
  "I have a worthy goal to work towards",
  'The ability to express my inner world and create something',
  "The structure and discipline of knowing what's expected",
  'The connection to a group or shared goal',
  'A sense of personal growth or evolution',
  'Flexibility in how I engage with it',
  'Feeling disconnected in the ultra-competitive environment',
  'Time for learning new skills and evolving personally',
  'A flexible daily schedule with no rigid structure',
  'A calm, consistent rhythm that brings peace of mind',
  'Keep using your creativity in a new way',
  'Feel free to explore your other interests without pressure or judgment',
  "Find a way of life that's less overwhelming",
  'I want to be challenged and find that spark again',
  'I want to finally live on my own terms',
  'I want to feel like I belong, even without dance',
  "You're tapping in to your most creative self",
  "You're in a community that understands your dancer experience",
  "You know what's expected and what comes next",
  'You feel cut off from your identity',
  "You don't have an outlet for self-expression",
  "You don't know what your next step should be",
  'Space to discover the new version of yourself',
  'Confidence to go after what you really want',
  'Encouragement to step into something meaningful',
  'The unique choreography and artistic choices',
  'The bond and energy shared with the cast and audience',
  'How much I grew and challenged myself during the process',
];

const flipTheScriptResponses = [
  "Doesn't that feel better?",
  'See how empowering that sounds?',
  "That's owning your story!",
  "Ok, she's evolving!",
  'Look at you!',
  "You're in your growth era!",
  'Ok, multi-hyphenate queen!',
  'We love that positive honesty!',
  "You're still a dancer, girl!",
  "That's the confidence we love!",
];

async function openPathTimeline(page: Page) {
  await openSharedPathTimeline(page, '/paths/mindset/discover-dream-life', 'What kind of dreamer are you?');
}

async function completeSkillsQuizDay(page: Page) {
  await clickByText(page, 'What kind of dreamer are you?');
  await expect(page.getByText('Welcome to Your Path John')).toBeVisible();
  await clickByText(page, "I'm Ready to Begin");
  await clickByText(page, "Let's do it");

  for (const answer of skillsQuizAnswers) {
    await clickByText(page, answer);
    const buttonText = answer === skillsQuizAnswers[skillsQuizAnswers.length - 1] ? 'See Results' : 'Continue';
    await clickByText(page, buttonText);
  }

  await expect(page.getByText(/Dreamer/, { exact: false })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText("Here's What You Could Be:", { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('Take Action', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue Your Journey');
  await expect(page.getByText('Congratulations!', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark as Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeMythBusterDay(page: Page) {
  await openPathTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome Back John')).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'Start the Game');

  for (const [index, [myth, reality]] of mythPairs.entries()) {
    await expect(page.getByText(`${index}/9 pairs matched`, { exact: true })).toBeVisible();
    await clickPairInColumns(page, {
      leftColumnTitle: 'Myth',
      rightColumnTitle: 'Reality',
      leftText: myth,
      rightText: reality,
    });
    await expect(page.getByText(`${index + 1}/9 pairs matched`, { exact: true })).toBeVisible({
      timeout: 5_000,
    });

    if (index < mythPairs.length - 1) {
      await expect(page.getByText(myth, { exact: true })).not.toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('Time for Reflection')).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeRoleplayDay(page: Page) {
  await openPathTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome Back John')).toBeVisible();
  await clickByText(page, "Let's Begin");
  await expect(page.getByText('What is this roleplay about?')).toBeVisible();
  await clickByText(page, 'Begin');
  await expect(page.getByText('Imagine This')).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('Your Options')).toBeVisible();
  await clickByText(
    page,
    "Respectfully decline the invitation. Your dance career comes first. It's a no-brainer."
  );
  await clickByText(page, 'Continue');
  await expect(page.getByText("Here's where you're at")).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText("Here's your situation")).toBeVisible();
  await clickByText(page, 'See the Alternative');
  await expect(page.getByText("So, what's the alternative?")).toBeVisible();
  await clickByText(page, 'Continue to Reflection');
  await expect(page.getByText('Reflect on Today')).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('Congrats!')).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeDreamBiggerDay(page: Page) {
  await openPathTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome Back John')).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'Start dreaming');

  for (let index = 0; index < 10; index += 1) {
    await expect(page.getByText(`${index + 1} of 10`, { exact: true })).toBeVisible();
    await clickVisibleOptionAndWaitForSelection(page, dreamBiggerOptions);
    await clickByText(page, 'Continue');

    if (index < 9) {
      await expect(page.getByText(`${index + 2} of 10`, { exact: true })).toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('Reflect on Today')).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeValuesDiscoveryDay(page: Page) {
  await openPathTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome Back John')).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, "Let's Explore");

  for (let index = 0; index < 10; index += 1) {
    await expect(page.getByText(`${index + 1} of 10`, { exact: true })).toBeVisible();
    await clickVisibleOptionAndWaitForSelection(page, valuesDiscoveryOptions);
    await clickByText(page, index === 9 ? 'See Results' : 'Continue');

    if (index < 9) {
      await expect(page.getByText(`${index + 2} of 10`, { exact: true })).toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await clickByText(page, 'Continue');
  await clickByText(page, 'Continue');
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeFlipTheScriptDay(page: Page) {
  await openPathTimeline(page);
  await openNextTimelineDay(page);
  await clickByText(page, "Let's go");
  await clickByText(page, 'Start Flipping');

  for (const [index, response] of flipTheScriptResponses.entries()) {
    await expect(page.getByText(`${index + 1} of 10`, { exact: true })).toBeVisible();
    await clickByText(page, 'Flip the script!');
    await page.waitForTimeout(700);
    await clickButtonContainer(page, response);

    if (index < flipTheScriptResponses.length - 1) {
      await expect(page.getByText(`${index + 2} of 10`, { exact: true })).toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('Navigating Imposter Syndrome', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText("Now It's Your Turn")).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeVoiceMessageDay(page: Page) {
  await openPathTimeline(page);
  await openNextTimelineDay(page);
  await clickByText(page, "I'm Ready to Begin");
  await page.getByLabel('Play guided visualization').click();
  await expect(page.getByText('Reflect on Your Experience')).toBeVisible({ timeout: 10_000 });
  await clickByText(page, 'Continue');
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

test('completes the Your Dream Life path end to end', async ({ page }) => {
  await completeOnboarding(page, 'Mindset & Wellness', 'Your Dream Life');

  await test.step('Day 1: Skills Quiz', async () => {
    await completeSkillsQuizDay(page);
  });
  await test.step('Day 2: Myth Buster', async () => {
    await completeMythBusterDay(page);
  });
  await test.step("Day 3: What's the alternative?", async () => {
    await completeRoleplayDay(page);
  });
  await test.step('Day 4: Dream Bigger', async () => {
    await completeDreamBiggerDay(page);
  });
  await test.step('Day 5: Values Discovery', async () => {
    await completeValuesDiscoveryDay(page);
  });
  await test.step('Day 6: Flip the Script', async () => {
    await completeFlipTheScriptDay(page);
  });
  await test.step('Day 7: Visualize Your Dream Life', async () => {
    await completeVoiceMessageDay(page);
  });

  await openPathTimeline(page);
  await expectCompletedDayCount(page, 7);
});
