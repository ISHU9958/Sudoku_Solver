// for start button when user click
const startbtn = document.querySelector("#start-btn");
const inputlist=document.querySelectorAll(".gridinput");
let start=false;
const board = Array.from({ length: 9 }, () => Array(9).fill(0));
const audio=new Audio('gamestart.mp3');
const loss=new Audio('lossmusic.mp3');
const clickmusic=new Audio('mouseclick.mp3');



startbtn.addEventListener("click", (event) => {
  start=true;
  
  for(let input of inputlist){
    input.value='';
    input.style.backgroundColor="white";
    input.readOnly=false;
  }
  const difficultyLevel = prompt(
    "Enter difficulty level (easy, medium, hard): "
  );
  audio.play();
  loss.pause();
  
  const sudokuPuzzle = generateSudoku(difficultyLevel);
  let k=0;
  for(let i=0;i<=8;i++){
    for(let j=0;j<=8;j++){
      if(sudokuPuzzle[i][j]!=0){
        inputlist[k].value=sudokuPuzzle[i][j];
        inputlist[k].readOnly=true;
        inputlist[k].style.backgroundColor="yellow";
        inputlist[k].style.color="black";
      }

      k++;
    }
  }

});

const solbtn=document.querySelector("#solution-btn");
solbtn.addEventListener("click",(event)=>{

  if(start===false) {
    alert('first start the game !');
    return ;
  }
  solveSudoku(board);
 
  let k=0;
  for(let i=0;i<=8;i++){
    for(let j=0;j<=8;j++){
      inputlist[k].value=board[i][j];
      if(inputlist[k].readOnly===false){
        inputlist[k].readOnly=true;
        inputlist[k].style.color="black";
      }
      k++;
    }
  }
});

const playagainbtn=document.querySelector("#play-again-btn");
playagainbtn.addEventListener("click",(event)=>{
  startbtn.click();
})

let ans=true;
const verifybtn=document.querySelector("#verify-btn");
verifybtn.addEventListener("click",(event)=>{
  if(start===false) {
    alert('first start the game !');
    return ;
  }
  for(let i=0;i<=8;i++){
    for(let j=0;j<=8;j++){
        board[i][j]=inputlist[i*9+j].value;
        
    }
  }
  printSudoku(board);
  const result=document.querySelectorAll('.winline');
  const iframe=document.querySelectorAll('iframe');
  for(let i=0;i<=8;i++){
    for(let j=0;j<=8;j++){
      if(isValid(board,i,j,inputlist[i*9+j].value)===false){
        inputlist[i*9+j].style.backgroundColor="red";
        inputlist[i*9+j].style.color="white";
        ans=false;
        break;
        console.log('wrong');
        return ;
      }
      // }else{
      //   inputlist[i*9+j].style.backgroundColor="green";
      //   inputlist[i*9+j].style.color="white";
      // }
    }
    if(ans===false){
      audio.pause();
      loss.play();
      result[1].style.display="block";
      iframe[1].style.display="block";
      break;
    }
  }

  if(ans===true){
    result[0].style.display="block";
      iframe[0].style.display="block";
  }

  
});


const pausebtn=document.querySelector('#pause-btn');
pausebtn.addEventListener('click',()=>{

  if(ans===false){
    loss.pause();
  }
  else audio.pause();
  for(let input of inputlist){
    input.readOnly=true;
  }
})
// main logic of sudoku
function printSudoku(board) {
  for (let row of board) {
    console.log(row.join(" "));
  }
}

const resumebtn=document.querySelector('#resume-btn');
resumebtn.addEventListener('click',()=>{
  if(ans===false){
    loss.play();
  }
  else audio.play();
  for(let input of inputlist){
    if(input.style.backgroundColor==="yellow") continue;
    input.readOnly=false;
  }
})


function isValid(board, row, col, num) {
  // // Check if the number is not in the current row or column
  // if (board[row].includes(num) || board.some((r) => r[col] === num)) {

  //   return false;
  // }

  // // Check if the number is not in the current 3x3 box
  // const startRow = 3 * Math.floor(row / 3);
  // const startCol = 3 * Math.floor(col / 3);
  // for (let i = startRow; i < startRow + 3; i++) {
  //   for (let j = startCol; j < startCol + 3; j++) {
  //     if (board[i][j] === num) {

  //       return false;
  //     }
  //   }
  // }

  // return true;


  for(let i=0;i<9;i++){
            if(i!=col && board[row][i]===num){
              console.log(row,col);
              console.log('hy');
                return false;
            }

            if(i!=row && board[i][col]===num){
              console.log(row,col);
              console.log('hello');
                return false;
            }

            let x=3*(Math.floor(row/3)) + Math.floor(i/3);
            let y=3*(Math.floor(col/3)) + i%3;
            if((x!=row && y!=col) && board[x][y] === num){
              console.log(row,col);
              console.log('my');
                return false;
            }
  }
  return true;
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateSudoku(difficulty) {
  // const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(board);

  // Remove numbers based on difficulty level
  let numToRemove;
  switch (difficulty) {
    case "easy":
      numToRemove = 25;
      break;
    case "medium":
      numToRemove = 35;
      break;
    case "hard":
      numToRemove = 45;
      break;
    default:
      throw new Error(
        "Invalid difficulty level. Use 'easy', 'medium', or 'hard'."
      );
  }

  const cells = Array.from({ length: 81 }, (_, index) => [
    Math.floor(index / 9),
    index % 9,
  ]);
  cells.sort(() => Math.random() - 0.5);

  for (let i = 0; i < numToRemove; i++) {
    const [row, col] = cells[i];
    board[row][col] = 0;
  }

  return board;
}
