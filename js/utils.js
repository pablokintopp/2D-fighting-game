
let timer = 10
let timerTimeoutId
function decreaseTimer() {
    document.getElementById('timer-value').innerHTML = timer
    if (timer > 0) {
        timer--;
        timerTimeoutId = setTimeout(decreaseTimer, 1000);
    } else {
        determineWinner();
    }
}

function determineWinner() {
    let status = ''
    if (player.health === enemy.health) {
        status = 'GAME TIED!'
    } else if (player.health > enemy.health) {
        status = 'PLAYER 1 WINS!'
    } else {
        status = 'PLAYER 2 WINS!'
    }

    document.getElementById('game-status-value').innerHTML = status
    document.getElementById('game-status-value').style.display = 'block'

    if (timer > 0 && timerTimeoutId) {
        clearTimeout(timerTimeoutId)
    }

    gameOver = true

}

function detectCollisionBetweenRectangles({ rect1, rect2 }) {
    return (
        rect1.position.x + rect1.width >= rect2.position.x &&
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y + rect1.height >= rect2.position.y &&
        rect1.position.y <= rect2.position.y + rect2.height)
}