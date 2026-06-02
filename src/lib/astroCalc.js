// src/lib/astroCalc.js
// 命理計算工具函式：純運算，無外部依賴

function reduceDigits(n) {
  let next = Number(n);
  while (next > 22 || (next > 11 && next !== 22)) {
    if (next === 10 || next === 11 || next === 22) break;
    next = String(next).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return next;
}

function reduceToSingle(n) {
  let next = Number(n);
  while (next > 9) {
    next = String(next).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return next;
}

export function calcMasterNumber(birthDate) {
  if (!birthDate) return null;
  const digits = birthDate.replace(/-/g, "").split("").map(Number);
  const sum = digits.reduce((total, digit) => total + digit, 0);
  return reduceDigits(sum);
}

export function calcDayNumber(birthDate) {
  if (!birthDate) return null;
  const day = parseInt(birthDate.split("-")[2], 10);
  return reduceDigits(day);
}

export function calcGridMatrix(birthDate) {
  if (!birthDate) return null;
  const digits = birthDate.replace(/-/g, "").split("").map(Number).filter((digit) => digit > 0);
  const matrix = {};
  for (let i = 1; i <= 9; i += 1) matrix[i] = 0;
  digits.forEach((digit) => {
    if (digit >= 1 && digit <= 9) matrix[digit] += 1;
  });
  return matrix;
}

export function calcArrows(gridMatrix) {
  if (!gridMatrix) return { strength: [], weakness: [] };
  const lines = [
    [1, 5, 9],
    [3, 5, 7],
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];

  return {
    strength: lines.filter((line) => line.every((digit) => gridMatrix[digit] > 0)),
    weakness: lines.filter((line) => line.every((digit) => gridMatrix[digit] === 0)),
  };
}

export function calcIsolatedDigits(gridMatrix) {
  if (!gridMatrix) return [];
  const conditions = {
    1: [2, 4, 5],
    3: [2, 5, 6],
    7: [4, 5, 8],
    9: [5, 6, 8],
  };

  return Object.entries(conditions)
    .filter(([digit, neighbors]) =>
      gridMatrix[Number(digit)] > 0 && neighbors.every((neighbor) => gridMatrix[neighbor] === 0)
    )
    .map(([digit]) => Number(digit));
}

export function calcFlowNumber(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const worldYear = reduceToSingle(
    String(year).split("").reduce((sum, digit) => sum + Number(digit), 0)
  );
  return reduceToSingle(worldYear + reduceToSingle(month) + reduceToSingle(day));
}

export function calcPersonalYear(birthDate, targetYear = new Date().getFullYear()) {
  if (!birthDate) return null;
  const [, monthRaw, dayRaw] = birthDate.split("-");
  const month = parseInt(monthRaw, 10);
  const day = parseInt(dayRaw, 10);
  const worldYear = reduceToSingle(
    String(targetYear).split("").reduce((sum, digit) => sum + Number(digit), 0)
  );
  return reduceToSingle(worldYear + reduceToSingle(month) + reduceToSingle(day));
}

export function calcBirthYearStem(year) {
  const stems = ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"];
  return stems[year % 10];
}

export function calcBirthYearBranch(year) {
  const branches = ["申", "酉", "戌", "亥", "子", "丑", "寅", "卯", "辰", "巳", "午", "未"];
  return branches[year % 12];
}

export function calcZodiacSign(birthDate) {
  if (!birthDate) return null;
  const [, monthRaw, dayRaw] = birthDate.split("-");
  const month = parseInt(monthRaw, 10);
  const day = parseInt(dayRaw, 10);
  const md = month * 100 + day;

  if (md >= 321 && md <= 420) return "牡羊座";
  if (md >= 421 && md <= 520) return "金牛座";
  if (md >= 521 && md <= 620) return "雙子座";
  if (md >= 621 && md <= 721) return "巨蟹座";
  if (md >= 722 && md <= 822) return "獅子座";
  if (md >= 823 && md <= 922) return "處女座";
  if (md >= 923 && md <= 1022) return "天秤座";
  if (md >= 1023 && md <= 1122) return "天蠍座";
  if (md >= 1123 && md <= 1222) return "射手座";
  if (md >= 1223 || md <= 121) return "摩羯座";
  if (md >= 122 && md <= 220) return "水瓶座";
  return "雙魚座";
}

export function calcFullAstroProfile(birthDate, date = new Date()) {
  if (!birthDate) return null;
  const year = parseInt(birthDate.split("-")[0], 10);
  const gridMatrix = calcGridMatrix(birthDate);
  const arrows = calcArrows(gridMatrix);
  const layerCounts = {
    body: (gridMatrix[1] || 0) + (gridMatrix[4] || 0) + (gridMatrix[7] || 0),
    soul: (gridMatrix[2] || 0) + (gridMatrix[5] || 0) + (gridMatrix[8] || 0),
    mind: (gridMatrix[3] || 0) + (gridMatrix[6] || 0) + (gridMatrix[9] || 0),
  };
  const dominantLayer = Object.entries(layerCounts).sort((a, b) => b[1] - a[1])[0][0];

  return {
    birth_date: birthDate,
    master_number: calcMasterNumber(birthDate),
    day_number: calcDayNumber(birthDate),
    grid_matrix: gridMatrix,
    active_arrows: arrows,
    isolated_digits: calcIsolatedDigits(gridMatrix),
    life_number: calcFlowNumber(date),
    current_personal_year: calcPersonalYear(birthDate, date.getFullYear()),
    birth_year_stem: calcBirthYearStem(year),
    birth_year_branch: calcBirthYearBranch(year),
    zodiac_sign: calcZodiacSign(birthDate),
    personality_dimensions: {
      dominant_layer: dominantLayer,
      layer_counts: layerCounts,
    },
  };
}
