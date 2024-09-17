import { isNumber } from 'lodash';

export const getTimeAgo = (timestampInSeconds: number) => {
  if (!isNumber(timestampInSeconds)) return null;

  const now = new Date();
  const timeDifference =
    now.getTime() - new Date(timestampInSeconds * 1000).getTime();

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
  } else {
    return 'Few secs ago';
  }
};