export const cypherUpdateObject = (objName: string, obj: object): string => {
  const ary = [];
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = `"${obj[key]}"`;
    }
    ary.push(`${objName}.${key} = ${obj[key]}`);
  }
  const result = ary.join(', ');
  return result;
};
