export const timeStampConverter = (time) => {
  const date = new Date(time);
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  return `${hour}:${minute}`;
};
