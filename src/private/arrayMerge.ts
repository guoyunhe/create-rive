export const arrayMerge = (target: any[], source: any[]) =>
  Array.from(new Set([...source, ...target]));
