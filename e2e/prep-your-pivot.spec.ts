import { expect, test } from '@playwright/test';

import {
  clickByText,
  clickFirstVisibleText,
  clickPairInColumns,
  clickVisibleOptionAndWaitForSelection,
  completeOnboarding,
  expectCompletedDayCount,
  openNextTimelineDay,
  openPathTimeline,
} from './helpers/path-helpers';

const prepYourPivotRoute = '/paths/career-transitions/prep-your-pivot';

const confidenceGapAnswers = [
  'I feel tongue-tied and struggle to explain',
  "\"I'm not qualified enough.\"",
  'Unsure what to say about myself',
  'Believing I can succeed in a different world',
  "\"I knew I wasn't cut out for this.\"",
  "I freeze and worry they won't understand",
  "\"I'm too nervous to reach out.\"",
  'Anxious and doubtful',
  'Learning to trust myself more',
];

const talkTheTalkResponses = [
  'See the difference?',
  'Nice!',
  'Look at those transferable skills!',
  "Ok, she's evolving!",
  'Look at you!',
  "You're in your growth era!",
  'We love that skill translation!',
];

const danceSkillPairs = [
  ['Auditioned in a room of 500', 'Performs well under pressure'],
  ['Learned choreography in under an hour', 'Quick learner who thrives in fast-paced environments'],
  ['Performed the same show 12 times a week for months', 'Reliable, consistent, and committed to excellence'],
  ['Toured internationally with minimal support', 'Adaptable and self-sufficient in high-stress situations'],
  ['Collaborated with diverse casts and creative teams', 'Strong communicator and team player across cultures and personalities'],
  ['Trained in an elite form of dance for 24 years', 'Disciplined and motivated with the ability to follow-through'],
  ['Always made sure headshots and resumes were printed for auditions', 'Experience in administration, organization, and project management'],
  ['Maintained a successful freelance dance career for 11 years', 'A self-starter with a determined, entrepreneurial spirit'],
  ['Held various part-time jobs at once to support the dance lifestyle', 'Hard-working with the ability to balance competing priorities'],
  ['Acted as dance captain to a cast of 12 dancers', 'Able to give and receive feedback to ensure high-quality output'],
];

const linkedInStepTitles = [
  'Nail Your First Impression',
  'Claim Your Handle',
  'Headline That Translates Dance into Value',
  'Write an About Summary',
  'Add Experience with Transferable Skills',
  'Tag Skills to Match Your Pivot',
  'Add Your Education',
  'Ask for Recommendations',
  'Show Up',
  'Final Polish',
];

const makeYourPlanOptions = [
  'I want to start my career change now',
  'I have a clear direction and goal',
  'I have the skills I need to pivot',
  'I have a strong network outside of dance',
  'I have some savings stashed away',
  "I have a Bachelor's degree",
  'I live in a big city like New York or London',
  'I have a support system around me',
  "I've worked on my non-dance resume already",
  'I feel ready to take on my pivot',
];

async function openPrepYourPivotTimeline(page: Parameters<typeof openPathTimeline>[0]) {
  await openPathTimeline(page, prepYourPivotRoute, 'Confidence Gap');
}

async function completeConfidenceGapDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openPrepYourPivotTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome to Your Confidence Journey', { exact: true })).toBeVisible();
  await clickByText(page, "I'm Ready to Begin");
  await expect(page.getByText("Where's your confidence gap?", { exact: true })).toBeVisible();
  await clickByText(page, "Let's find out");

  for (const [index, answer] of confidenceGapAnswers.entries()) {
    await expect(page.getByText(`${index + 1} of 9`, { exact: true })).toBeVisible();
    await clickVisibleOptionAndWaitForSelection(page, [answer], 'rgb(146, 132, 144)', 'xpath=../../..');
    await clickByText(page, index === confidenceGapAnswers.length - 1 ? 'See Results' : 'Continue');
  }

  await expect(page.getByText('Your Confidence Gap is Mindset', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText("Here's Who You Can Become:", { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('Build Your Confidence', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue Your Journey');
  await expect(page.getByText('Congratulations!', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark as Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeCureImposterSyndromeDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openPrepYourPivotTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Cure Imposter Syndrome', { exact: true }).first()).toBeVisible();
  await clickByText(page, "I'm Ready to Begin");
  await page.getByLabel('Play imposter syndrome visualization').click();
  await expect(page.getByText('Reflect on Your Experience', { exact: true })).toBeVisible({ timeout: 10_000 });
  await clickByText(page, 'Continue');
  await expect(page.getByText('Ready for More Guidance?', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeTalkTheTalkDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openPrepYourPivotTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Talk the Talk', { exact: true }).first()).toBeVisible();
  await clickByText(page, "Let's go");
  await clickByText(page, 'Start Learning');

  for (const [index, response] of talkTheTalkResponses.entries()) {
    await expect(page.getByText(`${index + 1} of 7`, { exact: true })).toBeVisible();
    await clickByText(page, 'See the alternative');
    await page.waitForTimeout(700);
    await clickByText(page, response);
  }

  await expect(page.getByText('Mastering Interview Language', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('Can you "talk the talk"?', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeDanceSkillMatchDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openPrepYourPivotTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Welcome to Dance Skill Match!', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await clickByText(page, 'Start the Game');

  for (const [index, [danceExperience, careerSkill]] of danceSkillPairs.entries()) {
    await expect(page.getByText(`${index}/10 pairs matched`, { exact: true })).toBeVisible();
    await clickPairInColumns(page, {
      leftColumnTitle: 'Dance Experience',
      rightColumnTitle: 'Career Skill',
      leftText: danceExperience,
      rightText: careerSkill,
    });
    await page.waitForTimeout(800);

    if (index < danceSkillPairs.length - 1) {
      await expect(page.getByText(danceExperience, { exact: true })).not.toBeVisible({
        timeout: 5_000,
      });
      await expect(page.getByText(careerSkill, { exact: true })).not.toBeVisible({
        timeout: 5_000,
      });
    }
  }

  await expect(page.getByText('Time for Reflection', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText("You're Recognizing Your Value!", { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeLinkedInUpgradeDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openPrepYourPivotTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('LinkedIn Upgrade', { exact: true }).first()).toBeVisible();
  await clickByText(page, 'Get started');

  for (const [index, title] of linkedInStepTitles.entries()) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
    await clickByText(page, index === linkedInStepTitles.length - 1 ? 'Complete' : 'Continue');
  }

  await expect(page.getByText('LinkedIn Optimization Tips', { exact: true })).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('And that\'s it!', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeWhoWouldYouHireDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openPrepYourPivotTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Who would you hire?', { exact: true }).first()).toBeVisible();
  await clickByText(page, "Let's Begin");

  const strongAnswers = [
    'As a professional dancer, I experienced rejection almost daily at auditions. I developed resilience, learned how to take constructive feedback, and kept improving my performance. These are qualities I\'ll bring to handling challenges in sales.',
    'I led weekly dance classes of up to 30 kids, adapted my teaching style to different learning needs, and motivated dancers to be performance-ready in time for recital. These are skills directly applicable to managing a team here.',
    'As a dancer, I understand the importance of professional presentation and body language. I know how to create a strong first impression, carry myself with confidence, and adapt my appearance to suit the occasion.',
  ];

  for (const [index, answer] of strongAnswers.entries()) {
    await expect(page.getByText(`Scenario ${index + 1} of 3`, { exact: true })).toBeVisible();
    await clickByText(page, 'See Their Answers');
    await clickVisibleOptionAndWaitForSelection(page, [answer], 'rgb(146, 132, 144)', 'xpath=../..');
    await clickByText(page, 'Continue');
    await expect(page.getByText("Here's our take", { exact: true })).toBeVisible();
    await clickByText(page, 'Continue');
  }

  await expect(page.getByText('Both candidates did well.', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

async function completeMakeYourPlanDay(page: Parameters<typeof openPathTimeline>[0]) {
  await openPrepYourPivotTimeline(page);
  await openNextTimelineDay(page);
  await expect(page.getByText('Prep Your Pivot', { exact: true }).first()).toBeVisible();
  await clickByText(page, 'Continue');
  await expect(page.getByText('Make Your Plan', { exact: true }).first()).toBeVisible();
  await clickByText(page, "Let's plan");

  for (let index = 0; index < 10; index += 1) {
    await expect(page.getByText(`${index + 1} of 10`, { exact: true })).toBeVisible();
    await clickVisibleOptionAndWaitForSelection(page, makeYourPlanOptions, 'rgb(146, 132, 144)', 'xpath=../..');
    await clickByText(page, 'Continue');
  }

  await expect(page.getByText('Make Your Plan', { exact: true })).toBeVisible();
  for (let index = 0; index < 6; index += 1) {
    await clickByText(page, 'Continue');
  }
  await clickByText(page, 'Learn more');
  await expect(page.getByText('Start Your Pivot', { exact: true })).toBeVisible();
  await clickByText(page, 'Mark As Complete');
  await expect(page).toHaveURL(/profile/);
}

test('completes the Prep Your Pivot path end to end', async ({ page }) => {
  await completeOnboarding(page, 'Career Transitions', 'Prep Your Pivot');

  await test.step('Day 1: Confidence Gap', async () => {
    await completeConfidenceGapDay(page);
  });
  await test.step('Day 2: Cure Imposter Syndrome', async () => {
    await completeCureImposterSyndromeDay(page);
  });
  await test.step('Day 3: Talk The Talk', async () => {
    await completeTalkTheTalkDay(page);
  });
  await test.step('Day 4: Dance Skill Match', async () => {
    await completeDanceSkillMatchDay(page);
  });
  await test.step('Day 5: LinkedIn Upgrade', async () => {
    await completeLinkedInUpgradeDay(page);
  });
  await test.step('Day 6: Who Would You Hire?', async () => {
    await completeWhoWouldYouHireDay(page);
  });
  await test.step('Day 7: Make Your Plan', async () => {
    await completeMakeYourPlanDay(page);
  });

  await openPrepYourPivotTimeline(page);
  await expectCompletedDayCount(page, 7);
});
