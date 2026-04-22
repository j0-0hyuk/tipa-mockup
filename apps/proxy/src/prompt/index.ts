import { problemPrompt } from './problem.js';
import { solutionPrompt } from './solution.js';
import { targetPrompt } from './target.js';
import { competitorPrompt } from './competitor.js';
import { marketPrompt } from './market.js';
import { tractionPrompt } from './traction.js';
import { strategyPrompt } from './strategy.js';
import { businessModelPrompt } from './businessModel.js';
import { milestonePrompt } from './milestone.js';
import { financialPlanPrompt } from './financialPlan.js';
import { teamVisionPrompt } from './teamVision.js';

export const prompts: Record<string, string> = {
  problem: problemPrompt,
  solution: solutionPrompt,
  target: targetPrompt,
  competitor: competitorPrompt,
  market: marketPrompt,
  traction: tractionPrompt,
  strategy: strategyPrompt,
  businessModel: businessModelPrompt,
  milestone: milestonePrompt,
  financialPlan: financialPlanPrompt,
  teamVision: teamVisionPrompt
};

export function getPrompt(type: string): string | undefined {
  return prompts[type];
}
