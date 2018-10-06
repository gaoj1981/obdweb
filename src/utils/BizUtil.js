export function getAreaId(areaIdArr) {
  if (areaIdArr) {
    const { length } = areaIdArr;
    if (length > 0) return parseInt(areaIdArr[length - 1], 10);
  }
  return null;
}

export function getTODO() {}
