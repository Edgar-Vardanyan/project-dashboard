export function generateNumericId(): number {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 100000);

  return timestamp + randomNum;
}
