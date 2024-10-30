export const AGENT_SLUGS: {
  [agentName: string]: string;
} = {
  Predict: 'predict',
  Optimus: 'optimus',
};

export type AgentSlug = keyof typeof AGENT_SLUGS;
