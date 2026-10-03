export function parseHumanSchedule(phrase: string): string {
  const clean = phrase.toLowerCase().trim();

  // Every X minutes
  const minMatch = clean.match(/every\s+(\d+)\s+minutes?/);
  if (minMatch) {
    return `*/${minMatch[1]} * * * *`;
  }

  // Every hour
  if (clean === 'every hour') {
    return '0 * * * *';
  }

  // Every day at HH:MM
  const dailyMatch = clean.match(/every day at (\d{1,2}):(\d{2})/);
  if (dailyMatch) {
    return `${parseInt(dailyMatch[2], 10)} ${parseInt(dailyMatch[1], 10)} * * *`;
  }

  // Day of week at HH:MM
  const DOW: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };

  const dowMatch = clean.match(/every (sunday|monday|tuesday|wednesday|thursday|friday|saturday) at (\d{1,2}):(\d{2})/);
  if (dowMatch) {
    const dow = DOW[dowMatch[1]];
    return `${parseInt(dowMatch[3], 10)} ${parseInt(dowMatch[2], 10)} * * ${dow}`;
  }

  return '* * * * *';
}
