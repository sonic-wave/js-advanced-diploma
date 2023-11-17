/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index) {
  if (index === 0) {
    return 'top-left';
  }
  if (index > 0 && index < 7) {
    return 'top';
  }
  if (index === 7) {
    return 'top-right';
  }
  if (index % 8 === 0 && index !== 56) {
    return 'left';
  }
  if (index === 56) {
    return 'bottom-left';
  }
  if (index > 56 && index < 63) {
    return 'bottom';
  }
  if (index % 8 === 7 && index !== 63) {
    return 'right';
  }
  if (index === 63) {
    return 'bottom-right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
