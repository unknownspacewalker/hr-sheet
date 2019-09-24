const concatIfNotNull = (
  separator: string,
  ...parts: (string | null | number)[]
): string => parts.filter((part) => part !== null).join(separator);

export default concatIfNotNull;
