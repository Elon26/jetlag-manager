const today = new Date();

export function isToday(date: Date) {
  const dateToHandle = new Date(date);
  return (
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toString() ===
    new Date(
      dateToHandle.getFullYear(),
      dateToHandle.getMonth(),
      dateToHandle.getDate()
    ).toString()
  );
}

export function isThisMonth(date: Date) {
  const dateToHandle = new Date(date);
  return (
    today.getFullYear() === dateToHandle.getFullYear() &&
    today.getMonth() === dateToHandle.getMonth()
  );
}

export function isBeforeToday(date: Date) {
  const dateToHandle = new Date(date);
  const todayMorningTimestamp = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();

  return dateToHandle.getTime() < todayMorningTimestamp;
}
