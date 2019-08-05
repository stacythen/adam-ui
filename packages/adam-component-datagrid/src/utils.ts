export const isDeepEqual = <L, R>(left: L, right: R): boolean => JSON.stringify(left) === JSON.stringify(right);
