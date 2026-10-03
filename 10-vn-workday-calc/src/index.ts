export function getVNHolidays(year: number): string[] {
  // Fixed solar holidays in Vietnam
  return [
    `${year}-01-01`, // Tết Dương lịch
    `${year}-04-30`, // Ngày Giải phóng miền Nam
    `${year}-05-01`, // Ngày Quốc tế Lao động
    `${year}-09-02`, // Quốc khánh
    `${year}-09-03`  // Ngày liền kề Quốc khánh
  ];
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export function isVNWorkday(date: Date | string): boolean {
  const d = new Date(date);
  if (isWeekend(d)) return false;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  const holidays = getVNHolidays(yyyy);
  return !holidays.includes(dateStr);
}

export function calculateWorkdays(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) return 0;

  let count = 0;
  const cur = new Date(start);

  while (cur <= end) {
    if (isVNWorkday(cur)) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return count;
}
