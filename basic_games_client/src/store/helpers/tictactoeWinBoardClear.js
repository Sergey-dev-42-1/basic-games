//Очистить доску от всех ходов, кроме выигрышной комбинации
module.exports = function(board, win_comb) {
  let win_indexes = [];
  for (let win_con = 0; win_con < win_comb.length; win_con++) {
    let check_row = Math.floor(win_comb[win_con] / 3);
    let check_cell = win_comb[win_con] % 3;
    win_indexes.push([check_row, check_cell]);
  }
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[row].length; column++) {
      let save = false;
      for (let i = 0; i < win_indexes.length; i++) {
        if (win_indexes[i][0] === row && win_indexes[i][1] === column) {
          save = true;
        }
      }
      if (!save) {
        board[row][column] = "";
      }
      console.log(board);
    }
  }
  console.log(board);
  return board;
};
