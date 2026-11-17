export const calculatePriority = ({
  category,
  reportCount,
  isBreached
}: {
  category: string;
  reportCount: number;
  isBreached: boolean;
}) => {

  const categoryWeights: Record<string, number> = {
    lift: 10,
    security: 9,
    water: 8,
    electricity: 7,
    plumbing: 6,
    cleanliness: 4
  };

  const categoryScore = categoryWeights[category] || 3;
  const reportScore = reportCount * 2;
  const breachScore = isBreached ? 15 : 0;

  return categoryScore + reportScore + breachScore;
};