const truncate = (str: string, maxLength: number) => (
  str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str
);

export default truncate;