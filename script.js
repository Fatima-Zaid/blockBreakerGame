let gameContainer = document.querySelector(".gameContainer")
let ball = document.querySelector(".ball")
let paddle = document.querySelector(".paddle")
let lives = document.querySelector(".lives")
let score = document.querySelector(".score")

//set initial positions for ball
let xBallPosition = gameContainer.clientWidth / 2 - ball.clientWidth / 2
let yBallPosition = gameContainer.clientHeight / 2 - ball.clientHeight / 2

//set values for movement of ball in x and y axis
let xAddBall = 5
let yAddBall = 3

//set initial positions of paddle
let xPaddlePosition = gameContainer.clientWidth / 2 - paddle.clientWidth / 2
paddle.style.left = xPaddlePosition + "px"

let addPaddle = 20

paddle.style.bottom = "10px"

let scoreNum = 0

let blocks = []
let cols = 7
let rows = 4

let initialScore = 0
let blockRemoved = false

score.innerText = "Score:" + initialScore

let noLives = 3
lives.innerText = "Lives:" + noLives

const countLives = (num) => {
  //if ball hit the ground then stop the game
  //this source shows how we can stop game, url: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Game_over

  lives.innerText = "Lives:" + num

  if (num == 0) {
    alert("GAME OVER") //alert msg
    document.location.reload() //this will reload the page after clicking ok to start again
    clearInterval(interval) //reset interval of the game loop
  }
}

const countScore = (block) => {
  if (blockRemoved) {
    scoreNum += 10
    score.innerText = "Score:" + scoreNum
  }
}

for (let i = 0; i < rows; i++) {
  blocks[i] = []
  for (let j = 0; j < cols; j++) {
    blocks[i][j] = null
  }
}

const createBlocks = () => {
  let id = 0
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let block = document.createElement("div")
      block.classList.add("block")
      block.setAttribute("id", `${i}-${j}`)
      gameContainer.appendChild(block)

      blocks[i][j] = block
    }
  }
}
createBlocks()

document.addEventListener("keydown", (event) => {
  let key = event.key
  //console.log(key)
  if (key == "ArrowLeft") {
    //toward -x axis so decrease position
    if (xPaddlePosition > 0) {
      xPaddlePosition -= addPaddle
      paddle.style.left = xPaddlePosition + "px"
    }
  }

  if (key == "ArrowRight") {
    //toward +x axis so increase position
    if (xPaddlePosition < gameContainer.clientWidth - paddle.clientWidth) {
      xPaddlePosition += addPaddle
      paddle.style.left = xPaddlePosition + "px"
    }
  }
})

const moveBall = () => {
  if (
    xBallPosition + ball.clientWidth >= gameContainer.clientWidth ||
    xBallPosition <= 0
  ) {
    xAddBall = xAddBall * -1
  }

  if (yBallPosition + ball.clientHeight >= gameContainer.clientHeight) {
    noLives -= 1
    countLives(noLives)
    yAddBall = yAddBall * -1
  }

  if (yBallPosition <= 0) {
    yAddBall = yAddBall * -1
  }

  xBallPosition += xAddBall
  yBallPosition += yAddBall

  ball.style.left = xBallPosition + "px"
  ball.style.top = yBallPosition + "px"
}

const movePaddle = () => {
  // Paddle collision
  let ballCenter = xBallPosition + ball.clientWidth / 2

  if (
    yBallPosition + ball.clientHeight >= paddle.offsetTop &&
    ballCenter >= paddle.offsetLeft &&
    ballCenter <= paddle.offsetLeft + paddle.clientWidth
  ) {
    // calculate bounce angle
    let hitPoint = ballCenter - paddle.offsetLeft
    let hitRatio = hitPoint / paddle.clientWidth

    let maxAngle = Math.PI / 3 // 60 degrees
    let angle = (hitRatio - 0.5) * 2 * maxAngle

    let speed = Math.sqrt(xAddBall * xAddBall + yAddBall * yAddBall)
    xAddBall = speed * Math.sin(angle)
    yAddBall = -Math.abs(speed * Math.cos(angle))

    // prevent ball from going below paddle
    yBallPosition = paddle.offsetTop - ball.clientHeight
  }
}

const hitBlocks = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let block = blocks[i][j]
      //console.log("block", block)
      if (block.style.display !== "none") {
        if (
          xBallPosition < block.offsetLeft + block.clientWidth &&
          xBallPosition + ball.clientWidth > block.offsetLeft &&
          yBallPosition < block.offsetTop + block.clientHeight &&
          yBallPosition + ball.clientHeight > block.offsetTop
        ) {
          const blockToRemove = document.getElementById(`${i}-${j}`)
          console.log("Removed Block " + blockToRemove.id)
          if (blockToRemove) {
            blockToRemove.remove()
            blockRemoved = true
            countScore(blockRemoved)
          }
          blockRemoved = false
          yAddBall = -yAddBall
          return
        }
      }
    }
  }
  return true
}

const loadGame = () => {
  movePaddle()
  moveBall()
  hitBlocks()
  countScore()

  requestAnimationFrame(loadGame)
}
requestAnimationFrame(loadGame)
