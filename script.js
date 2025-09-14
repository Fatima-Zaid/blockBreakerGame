let gameContainer = document.querySelector(".gameContainer")
let ball = document.querySelector(".ball")
let paddle = document.querySelector(".paddle")
let fbs = 60

let cols = 7
let rows = 4

let blocksContainer = document.querySelector(".blocksContainer")

for (let i = 0; i < 28; i++) {
  let newBlock = document.createElement("div")
  newBlock.classList.add("block")
  blocksContainer.appendChild(newBlock)
}

let block = document.querySelectorAll(".block")

//let paddleCoordinates = paddle.getBoundingClientRect()
//console.log(paddle.offsetTop)
//console.log(paddleCoordinates)

//let position = gameContainer.getBoundingClientRect()
//console.log(position)
//

//set initial positions for ball
let xPosition = gameContainer.clientWidth / 2
let yPosition = gameContainer.clientHeight / 2

let xAdd = 4
let yAdd = 4

//set initial positions of paddle
let paddlePosition = gameContainer.clientWidth / 2 - paddle.clientWidth / 2
let addPaddle = 0.2

const moveBall = () => {
  ball.style.left = xPosition + "px"
  ball.style.top = yPosition + "px"
}

const movePaddle = () => {
  paddle.style.left = paddlePosition + "px"

  document.addEventListener("keydown", (event) => {
    let key = event.key
    console.log(key)
    if (key == "ArrowLeft") {
      //toward -x axis so decrease position
      if (paddlePosition > 0) {
        paddlePosition -= addPaddle
        paddle.style.left = paddlePosition + "px"
      }
    }

    if (key == "ArrowRight") {
      //toward +x axis so increase position
      if (paddlePosition < gameContainer.clientWidth - paddle.clientWidth) {
        paddlePosition += addPaddle
        paddle.style.right = paddlePosition + "px"
      }
    }
  })
}
console.log(yPosition)
console.log(xPosition)

const hitBlock = () => {
  for (let i = 0; i < block.length; i++) {
    if (
      block[i] &&
      yPosition <= block[i].offsetTop + block[i].clientHeight &&
      xPosition + ball.clientWidth >= block[i].offsetLeft &&
      xPosition + ball.clientWidth <= block[i].offsetLeft + block[i].clientWidth
    ) {
      //console.log(block[i].offsetTop)
      //console.log(block[i])
      //console.log(block)
      block[i].remove()
      block[i] = null
      yAdd = -yAdd
      yPosition = block[i].offsetTop + ball.clientHeight
      break
    }
  }
}

//the ball should move within time, i want the ball to change its position every x amount of time. so i will use setInterval() method. URL: https://www.w3schools.com/js/js_timing.asp
//the method add 3px to the initial x and y position of the ball every 1 second = 1000 millisecond, and it keep calling the moveBall() function which will take the new positions and change them

setInterval(() => {
  if (
    xPosition + ball.clientWidth >= gameContainer.clientWidth ||
    xPosition <= 0
  ) {
    xAdd = xAdd * -1
  }

  if (
    yPosition + ball.clientHeight >= gameContainer.clientHeight ||
    yPosition <= 0
  ) {
    yAdd = yAdd * -1
  }

  xPosition += xAdd
  yPosition += yAdd

  //I used offsetTop instead on clientTop  because it  returns  top position (in pixels) relative to the parent gameContainer
  if (
    yPosition + ball.clientHeight >= paddle.offsetTop &&
    xPosition + ball.clientWidth >= paddle.offsetLeft &&
    xPosition + ball.clientWidth <= paddle.offsetLeft + paddle.clientWidth
  ) {
    yAdd = -yAdd //so when it will be used again, make sure this value reversed and make ball go up
    //console.log((yPosition = paddle.offsetTop - ball.clientHeight))
    //yPosition = paddle.offsetTop - ball.clientHeight //ensures ball will no go beneath paddle ever again and gives new position in y starting from above the paddle directly
  }
  moveBall()
  movePaddle()
  hitBlock()
}, 1000 / fbs)
