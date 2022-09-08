export const phoneToMask = (phone) => {
  if (!phone) return null;

  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') as string;
};
