import * as bcrypt from 'bcrypt';

export const hashData = async (data: string): Promise<string> => {
  const hashed = bcrypt.hashSync(data, 10);

  return hashed;
};

export const compareData = async (
  data: string,
  hashedData: string,
): Promise<boolean> => {
  const compare = bcrypt.compareSync(data, hashedData);
  return compare;
};
