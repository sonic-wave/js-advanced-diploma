export default function distance(char, index, type) {
    let range = null;
  
    const arrDistance = new Set();
    const boardSize = 8;
    const curIndex = index;
  
    if (type === 'move') {
      range = char.character.moveDistance;
    }
  
    if (type === 'attack') {
      range = char.character.attackDistance;
    }
  
    let maxTop = curIndex;
    let maxTopRight = curIndex;
    let maxRight = curIndex;
    let maxBottomRight = curIndex;
    let maxBottom = curIndex;
    let maxBottomLeft = curIndex;
    let maxLeft = curIndex;
    let maxTopLeft = curIndex;
  
    for (let i = 0; i < range; i += 1) {
      if (maxTop >= boardSize) {
        maxTop -= boardSize;
        arrDistance.add(maxTop);
      }
  
      if (maxTopRight >= boardSize && maxTopRight % boardSize !== boardSize - 1) {
        maxTopRight -= (boardSize - 1);
        arrDistance.add(maxTopRight);
      }
  
      if (maxRight % boardSize !== boardSize - 1) {
        maxRight += 1;
        arrDistance.add(maxRight);
      }
  
      if (maxBottomRight <= (boardSize ** 2)
      - boardSize && maxBottomRight % boardSize !== boardSize - 1) {
        maxBottomRight += (boardSize + 1);
        arrDistance.add(maxBottomRight);
      }
  
      if (maxBottom <= (boardSize ** 2) - boardSize) {
        maxBottom += boardSize;
        arrDistance.add(maxBottom);
      }
  
      if (maxBottomLeft <= (boardSize ** 2) - boardSize && maxBottomLeft % boardSize !== 0) {
        maxBottomLeft += (boardSize - 1);
        arrDistance.add(maxBottomLeft);
      }
  
      if (maxLeft % boardSize !== 0) {
        maxLeft -= 1;
        arrDistance.add(maxLeft);
      }
  
      if (maxTopLeft > boardSize && maxTopLeft % boardSize !== 0) {
        maxTopLeft -= (boardSize + 1);
        arrDistance.add(maxTopLeft);
      }
    }
  
    if (type === 'attack') {
      const rowStart = Math.floor(maxTop / boardSize);
      const rowEnd = Math.floor(maxBottom / boardSize);
      const colStart = (maxLeft % boardSize);
      const colEnd = (maxRight % boardSize);
  
      for (let i = rowStart; i <= rowEnd; i += 1) {
        for (let j = colStart; j <= colEnd; j += 1) {
          arrDistance.add(i * boardSize + j);
        }
      }
    }
  
    return Array.from(arrDistance);
  }