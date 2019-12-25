let playerInRange = (enemy, player) => {
  let playerLeftX = player.body.x - player.body.width/2;
  let playerRightX = player.body.x + player.body.width/2;
  let enemyLeftX = enemy.body.x - enemy.body.width/2;
  let enemyRightX = enemy.body.x + enemy.body.width/2;
  if ((playerRightX >= enemyLeftX && playerRightX <= enemyRightX) || (playerLeftX <= enemyRightX && playerLeftX >= enemyLeftX)) {
    return true;
  }
  return false;
}

export {playerInRange};
