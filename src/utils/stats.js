export function calculateStats(history) {
  if (!history || history.length === 0) return { streak: 0, badges: [] };

  const dates = [...new Set(history.map(h => new Date(h.scannedAt || h.scanned_at || Date.now()).toDateString()))];
  dates.sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0,0,0,0);
  
  const todayStr = currentDate.toDateString();
  let yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (dates.length > 0 && (dates[0] === todayStr || dates[0] === yesterdayStr)) {
    let checkDate = new Date(dates[0]);
    for (const d of dates) {
      if (d === checkDate.toDateString()) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  const badges = [];
  if (history.length >= 1) badges.push({ id: 'first_scan', name: 'First Scan', icon: '🌱' });
  if (streak >= 7) badges.push({ id: 'streak_7', name: '7-Day Streak', icon: '🔥' });
  if (history.length >= 50) badges.push({ id: 'plant_doctor', name: 'Plant Doctor', icon: '🔬' });

  return { streak, badges };
}
