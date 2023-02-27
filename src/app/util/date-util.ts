export class DateUtil {

  public static getFormattedDate(d) {
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) + ' ' +
      ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2);
  }

  public static getPreviousDate(d, previousDate) {
    const date = new Date(d);
    date.setDate(date.getDate() - previousDate);
    return date;
  }

  public static getAPIFormattedDate(date) {
    const newDate = new Date(date);
    const m = newDate.getMonth() + 1;
    return new Date(newDate.getFullYear() + '-' + m + '-' + newDate.getDate() + ' ' + newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds());
  }

  public static getStartDate(date) {
    const newDate = new Date(date);
    const m = newDate.getMonth() + 1;
    return new Date(newDate.getFullYear() + '-' + m + '-' + newDate.getDate() + ' 00:00:00');
  }

  public static getEndDate(date) {
    const newDate = new Date(date);
    const m = newDate.getMonth() + 1;
    return new Date(newDate.getFullYear() + '-' + m + '-' + newDate.getDate() + ' 23:59:59');
  }

  public static getRandomDate() {
    const newDate = new Date();
    return newDate.getMilliseconds();
  }


}
