let gameContainer = document.querySelector(".gameContainer")
let ball = document.querySelector(".ball")
let paddle = document.querySelector(".paddle")
let lives = document.querySelector(".lives")
let score = document.querySelector(".score")

// to get the id of requestAnimationFrame method
let animationID

//set initial positions for ball
//ball will be at the center of container
let xBallPosition = gameContainer.clientWidth / 2 - ball.clientWidth / 2
let yBallPosition = gameContainer.clientHeight / 2 - ball.clientHeight / 2

//set values for movement of ball in x and y axis
let xAddBall = 5
let yAddBall = 3

//set initial positions of paddle at the center of container
let xPaddlePosition = gameContainer.clientWidth / 2 - paddle.clientWidth / 2
paddle.style.left = xPaddlePosition + "px"

let addPaddle = 20

paddle.style.bottom = "10px"

//for dding blocks to gameContainer
let blocks = []
let cols = 7
let rows = 1
let blockWidth = 80
let blockHeight = 30
let gap = 20

//to count how many blocks left
let noBlocks = 0

// initiate  score and store it in local storage
let initialScore = 0
let scoreNum = initialScore
window.localStorage.setItem("score", scoreNum)

//if a block removed then add to score
let blockRemoved = false

score.innerText = "Score:" + initialScore

//no. lives for player in each level
let noLives = 5
lives.innerText = "Lives:" + noLives

//button tryAgain will call this function
const reloadGame = () => {
  let tryAgain = document.querySelector(".tryAgain")

  if (tryAgain) {
    //if button was clicked then reload the current page level
    document.location.reload()
  }
}

const gameOver = () => {
  //if the player lose then the score he earned in the level he lost should not be added to his current score, so i will take his previous level and reset it
  window.localStorage.setItem("score", initialScore)

  let msgContainer = document.querySelector(".gameOver")
  //this will stop the game from playing in background if player lose
  cancelAnimationFrame(animationID)

  //no need to show stopped game in background so here make it hidden while message will be visible
  msgContainer.style.visibility = "visible"
  gameContainer.style.visibility = "hidden"
}

const winGame = () => {
  let msgContainer = document.querySelector(".winGame")

  //if player win stop the game from playing
  cancelAnimationFrame(animationID)

  //no need to show stopped game in background so here make it hidden while message will be visible
  msgContainer.style.visibility = "visible"
  gameContainer.style.visibility = "hidden"
}

//player should not let the ball hit the floor, if he did then he will lose one live from 5. this function will print the remaining lives and if it reach to 0 then it will call gameOver function to stop the game and print message
const countLives = (num) => {
  lives.innerText = "Lives:" + num

  if (num == 0) {
    gameOver()
    //alert("GAME OVER") //alert msg
    //document.location.reload() //this will reload the page after clicking ok to start again
    //clearInterval(interval) //reset interval of the game loop
  }
}

//one block count 10 point so each time the player the ball hit the block 10 points will added to his total score
//receive boolean variable, is block had been hit or not, if so then add 10 points
const countScore = (block) => {
  if (blockRemoved) {
    scoreNum += 10
    //set new score in local storage
    window.localStorage.setItem("score", scoreNum)
    //print new score if it got increase on the screen
    score.innerText = "Score:" + window.localStorage.getItem("score")
  }
}

//every level have different no. blocks (rows * cols), so this function counts how many blocks had been hit, if all blocks got hit then no blocks left in game so player wins and would call winGame func to print winning msg.
const countBlocks = (noBlocks) => {
  if (noBlocks == rows * cols) {
    winGame()
  }
}

//initializing the blocks at index i to have another list
//for (let i = 0; i < rows; i++) {
//  blocks[i] = []
//  for (let j = 0; j < cols; j++) {
//    blocks[i][j] = null
//  }
//}

//
const createBlocks = () => {
  for (let i = 0; i < rows; i++) {
    //pre-initializing the blocks at index i to have another list
    blocks[i] = []
    for (let j = 0; j < cols; j++) {
      //creating the divs with class blocks and id to gameContainer
      let block = document.createElement("div")
      block.classList.add("block")
      block.setAttribute("id", `${i}-${j}`)

      //give blocks width and height
      block.style.left = (blockWidth + gap) * j + "px"
      block.style.top = (blockHeight + gap) * i + "px"

      gameContainer.appendChild(block)

      blocks[i][j] = block
    }
  }
  return blocks
}
createBlocks()

//listen to user if he press left or right arrow and move paddle according to that.
document.addEventListener("keydown", (event) => {
  let key = event.key
  //console.log(key)
  if (key == "ArrowLeft") {
    //toward -x axis so decrease position
    //before moving the paddle and calculate and change position, check the current position at point(check collision),
    // does the point > 0 or not ? if not then don't attempt to change the position so the paddle won't move outside the gameContainer and disappear to the left outside the window
    if (xPaddlePosition > 0) {
      //save new x point of paddle in xPaddlePosition then
      xPaddlePosition -= addPaddle
      //move the the paddle to left
      paddle.style.left = xPaddlePosition + "px"
    }
  }

  if (key == "ArrowRight") {
    //toward +x axis so increase position
    //this condition do the same when paddle move to the right
    // the x point should not exceed the the game container width
    //even if player kept pressing right arrow the xPaddlePosition wont change so paddle wont move out side the container
    if (xPaddlePosition < gameContainer.clientWidth - paddle.clientWidth) {
      xPaddlePosition += addPaddle
      paddle.style.left = xPaddlePosition + "px"
    }
  }
})

// this func start moving the ball and check for collision for the ball with the 4 borders of gameContainer
const moveBall = () => {
  //point x of the ball is at the corner that is why we added its width
  //then i check for the point if it got greater than gameContainer width it will bounce in opposite direction for x and y position
  if (
    xBallPosition + ball.clientWidth >= gameContainer.clientWidth ||
    xBallPosition <= 0
  ) {
    xAddBall = xAddBall * -1
  }

  //collision with bottom border will cause the player to lose one live each time
  if (yBallPosition + ball.clientHeight >= gameContainer.clientHeight) {
    noLives -= 1
    //pass the new no. lives to func to print it on screen
    countLives(noLives)
    yAddBall = yAddBall * -1
  }

  if (yBallPosition <= 0) {
    yAddBall = yAddBall * -1
  }

  //after checking for the amount of addition for x and y will it cause collision or not then it will be added to position variable then change the style

  xBallPosition += xAddBall
  yBallPosition += yAddBall

  ball.style.left = xBallPosition + "px"
  ball.style.top = yBallPosition + "px"
}

//this func will check the collision with ball and paddle and if it happened let the ball bounce with an angle depending where the ball hit paddle.
const movePaddle = () => {
  //calculate the center of the ball
  let ballCenter = xBallPosition + ball.clientWidth / 2

  //condition to detect collision between ball and paddle
  if (
    yBallPosition + ball.clientHeight >= paddle.offsetTop &&
    ballCenter >= paddle.offsetLeft &&
    ballCenter <= paddle.offsetLeft + paddle.clientWidth
  ) {
    //calculate bounce angle
    //
    let hitPoint = ballCenter - paddle.offsetLeft
    //the ra
    let hitRatio = hitPoint / paddle.clientWidth

    let maxAngle = Math.PI / 3 //60 degrees
    let angle = (hitRatio - 0.5) * 2 * maxAngle

    let speed = Math.sqrt(xAddBall * xAddBall + yAddBall * yAddBall)
    xAddBall = speed * Math.sin(angle)
    yAddBall = -Math.abs(speed * Math.cos(angle))

    //prevent ball from going below paddle
    yBallPosition = paddle.offsetTop - ball.clientHeight
  }
}

//this func check collision between the ball and blocks,
//if collision happened then removed block
const hitBlocks = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let block = blocks[i][j]
      //console.log("block", block)
      if (block.style.display !== "none") {
        //collisions conditions that let the ball change direction after hitting the block
        if (
          xBallPosition < block.offsetLeft + block.clientWidth &&
          xBallPosition + ball.clientWidth > block.offsetLeft &&
          yBallPosition < block.offsetTop + block.clientHeight &&
          yBallPosition + ball.clientHeight > block.offsetTop
        ) {
          //get the id of the block that had been hit
          const blockToRemove = document.getElementById(`${i}-${j}`)
          console.log("Removed Block " + blockToRemove.id)

          //if we get the id then remove the block by id
          if (blockToRemove) {
            blockToRemove.remove()
            //counter for blocks to check for win
            noBlocks += 1
            //if block got removed then change the score
            blockRemoved = true //to call and pass the variable to countScore()
            countScore(blockRemoved)
            countBlocks(noBlocks) //pass no. blocks and check for win
          }
          //change it to false until we hit a block again
          blockRemoved = false
          //reverse direction and bounce the ball
          yAddBall = -yAddBall

          return //break from loop after handling one block collision
        }
      }
    }
  }
}

const loadGame = () => {
  animationID = window.requestAnimationFrame(loadGame)
  movePaddle()
  moveBall()
  hitBlocks()
  countScore()
}

loadGame()
