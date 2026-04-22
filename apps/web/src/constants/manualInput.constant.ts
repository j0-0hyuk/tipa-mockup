export interface ManualInputFieldConfig {
  name: string;
  labelKey: string;
  placeholderKey: string;
  tooltipKey: string;
}

export const OPTIONAL_INPUTS: ManualInputFieldConfig[] = [
  {
    name: 'solution.painPoint',
    labelKey:
      'onboarding:manualInputDetailed.steps.solution.form.painPoint.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.solution.form.painPoint.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.solution.form.painPoint.tooltip'
  },
  {
    name: 'solution.background',
    labelKey:
      'onboarding:manualInputDetailed.steps.solution.form.background.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.solution.form.background.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.solution.form.background.tooltip'
  },
  {
    name: 'solution.features',
    labelKey:
      'onboarding:manualInputDetailed.steps.solution.form.features.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.solution.form.features.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.solution.form.features.tooltip'
  },
  {
    name: 'solution.mission',
    labelKey:
      'onboarding:manualInputDetailed.steps.solution.form.mission.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.solution.form.mission.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.solution.form.mission.tooltip'
  },
  {
    name: 'market.target',
    labelKey: 'onboarding:manualInputDetailed.steps.market.form.target.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.market.form.target.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.market.form.target.tooltip'
  },
  {
    name: 'market.rival',
    labelKey: 'onboarding:manualInputDetailed.steps.market.form.rival.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.market.form.rival.placeholder',
    tooltipKey: 'onboarding:manualInputDetailed.steps.market.form.rival.tooltip'
  },
  {
    name: 'market.profit',
    labelKey: 'onboarding:manualInputDetailed.steps.market.form.profit.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.market.form.profit.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.market.form.profit.tooltip'
  },
  {
    name: 'market.revenueModel',
    labelKey:
      'onboarding:manualInputDetailed.steps.market.form.revenueModel.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.market.form.revenueModel.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.market.form.revenueModel.tooltip'
  },
  {
    name: 'market.strategy',
    labelKey: 'onboarding:manualInputDetailed.steps.market.form.strategy.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.market.form.strategy.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.market.form.strategy.tooltip'
  },
  {
    name: 'goal.currentStatus',
    labelKey:
      'onboarding:manualInputDetailed.steps.goal.form.currentStatus.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.goal.form.currentStatus.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.goal.form.currentStatus.tooltip'
  },
  {
    name: 'goal.plan',
    labelKey: 'onboarding:manualInputDetailed.steps.goal.form.plan.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.goal.form.plan.placeholder',
    tooltipKey: 'onboarding:manualInputDetailed.steps.goal.form.plan.tooltip'
  },
  {
    name: 'goal.sales',
    labelKey: 'onboarding:manualInputDetailed.steps.goal.form.sales.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.goal.form.sales.placeholder',
    tooltipKey: 'onboarding:manualInputDetailed.steps.goal.form.sales.tooltip'
  },
  {
    name: 'goal.cost',
    labelKey: 'onboarding:manualInputDetailed.steps.goal.form.cost.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.goal.form.cost.placeholder',
    tooltipKey: 'onboarding:manualInputDetailed.steps.goal.form.cost.tooltip'
  },
  {
    name: 'goal.investment',
    labelKey: 'onboarding:manualInputDetailed.steps.goal.form.investment.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.goal.form.investment.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.goal.form.investment.tooltip'
  },
  {
    name: 'rnd.goal',
    labelKey: 'onboarding:manualInputDetailed.steps.rnd.form.goal.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.rnd.form.goal.placeholder',
    tooltipKey: 'onboarding:manualInputDetailed.steps.rnd.form.goal.tooltip'
  },
  {
    name: 'rnd.tech',
    labelKey: 'onboarding:manualInputDetailed.steps.rnd.form.tech.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.rnd.form.tech.placeholder',
    tooltipKey: 'onboarding:manualInputDetailed.steps.rnd.form.tech.tooltip'
  },
  {
    name: 'rnd.infra',
    labelKey: 'onboarding:manualInputDetailed.steps.rnd.form.infra.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.rnd.form.infra.placeholder',
    tooltipKey: 'onboarding:manualInputDetailed.steps.rnd.form.infra.tooltip'
  },
  {
    name: 'rnd.status',
    labelKey: 'onboarding:manualInputDetailed.steps.rnd.form.status.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.rnd.form.status.placeholder',
    tooltipKey: 'onboarding:manualInputDetailed.steps.rnd.form.status.tooltip'
  },
  {
    name: 'rnd.copyright',
    labelKey: 'onboarding:manualInputDetailed.steps.rnd.form.copyright.label',
    placeholderKey:
      'onboarding:manualInputDetailed.steps.rnd.form.copyright.placeholder',
    tooltipKey:
      'onboarding:manualInputDetailed.steps.rnd.form.copyright.tooltip'
  }
];
