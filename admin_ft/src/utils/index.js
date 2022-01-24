export const  timeInUnix = (hour, minute, sec) => {
    var time = new Date;
    time.setHours(hour);
    time.setMinutes(minute);
    time.setSeconds(sec);
    var timestamp = Math.floor(time / 1000);
    return timestamp
  }