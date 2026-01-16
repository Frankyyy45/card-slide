
export class DateHelper {
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("sv-SE");
  }
}
