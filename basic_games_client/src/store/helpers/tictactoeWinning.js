module.exports = function(board, sign) {
  let winning_cond = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //Строки
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], //Столбцы
    [0, 4, 8],
    [2, 4, 6],
  ]; //Диагонали
  for (let win = 0; win < winning_cond.length; win++) {
    let won = sign;
    for (let cell = 0; cell < winning_cond[win].length; cell++) {
      let check_row = Math.floor(winning_cond[win][cell] / 3);
      let check_cell = winning_cond[win][cell] % 3;
      if (board[check_row][check_cell] !== sign) {
        won = false;
        break;
      }
    }
    if (won) {
      return winning_cond[win];
    }
  }
  return false;
};
