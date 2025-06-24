export const getIndentation = (currentLevel: number) => {
  return "\u00A0".repeat(currentLevel * 4); // Non-breaking spaces, 4 per level
};
