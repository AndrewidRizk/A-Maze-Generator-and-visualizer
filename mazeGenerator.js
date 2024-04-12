// Maze Generation using DEPTH FIRST SEARCH in JS



// Initialize the canvas

let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let generationComplete = false;

let current;
let goal;

class Maze {


    /**
     * this is a conestractor for the maze
     * @param {Size of the Maze} size 
     * @param {Rows of the Maze} rows 
     * @param {Columns of the Maze} columns 
     * using stack to push and pop the visited cells 
     */
  constructor(size, rows, columns) 
   {
    this.canvas = document.getElementById("mazeCanvas"); // Adjusted to select by ID
    this.size = size;  
    this.columns = columns;
    this.rows = rows;
    this.grid = [];
    this.stack = [];

    let arr = [];

    // creating two dimensional array
    for (let i = 0; i< rows; i++) {
        for(let j = 0; j< columns; j++) {
            arr[i] = [];
        }
    }

    // inserting elements to array
    for (let i = 0; i< rows; i++) {
        for(let j = 0; j< columns; j++) {
            arr[i][j] = "1111";
        }
    }
    this.Maze_creator = arr;



  }


     // Ensure resetMaze correctly resets canvas size and reinitializes the maze
  getMaze_creator() {
    return this.Maze_creator
  }


  
  /**
   * Inistial set up method, sets up the grid on the canvas, and drow each individual
   * cell to the canvas screen 
   */
  setup()
   {

     // For each 2D array we Create a new instance of the Cell class and push it to the maze grid array

    for (let i = 0; i < this.rows; i++) {
      let row = [];

      for (let j = 0; j < this.columns; j++)
       {
        let cell = new Cell(i, j, this.grid, this.size,  this.Maze_creator);
        row.push(cell);
      }

      this.grid.push(row);

    }

    // Set the starting grid
    current = this.grid[0][0];
    this.grid[this.rows - 1][this.columns - 1].goal = true;

  }



  /**
   * this method take care of drawing the maze
   */
  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "green";
    // Set the first cell as visited
    current.visited = true;
    // Loop through the 2d grid array and call the show method for each cell instance
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.columns);
      }
    }
    // This function will assign the variable 'next' to random cell out of the current cells available neighbouting cells
    let next = current.checkNeighbours();
    // If there is a non visited neighbour cell
    if (next) {
      next.visited = true;
      // Add the current cell to the stack for backtracking
      this.stack.push(current);
      // this function will highlight the current cell on the grid. The parameter columns is passed
      // in order to set the size of the cell
      current.highlight(this.columns);
      // This function compares the current cell to the next cell and removes the relevant walls for each cell
      current.removeWalls(current, next);
      // Set the nect cell to the current cell
      current = next;

      // Else if there are no available neighbours start backtracking using the stack
    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      current = cell;
      current.highlight(this.columns);
    }
    // If no more items in the stack then all cells have been visted and the function can be exited
    if (this.stack.length === 0) {
      generationComplete = true;
      return;
    }

    // Recursively call the draw function. This will be called up until the stack is empty
    window.requestAnimationFrame(() => {
      this.draw();
    });

  }
}

class Cell {
  
  /**
   * Constructor takes in the rowNum and colNum which will be used as coordinates to draw on the canvas.
   * @param {the number of the current row} rowNum 
   * @param {the number of the current column} colNum 
   * @param {the parint Grid of the Maze} parentGrid 
   * @param {the parint size of the maze} parentSize 
   */

  constructor(rowNum, colNum, parentGrid, parentSize, maze_creator)
   {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.visited = false;
    this.maze_creator= maze_creator;

    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };

    this.goal = false;

    // parentGrid is passed in to enable the checkneighbours method.
    // parentSize is passed in to set the size of each cell on the grid

    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
  }

  /**
   * Checks if the cell have a neighbour or no, so it does not go outside the grid
   * @returns if the cell have a neighbour
   */

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;
    let neighbours = [];

    // The following lines push all available neighbours to the neighbours array
    // undefined is returned where the index is out of bounds (edge cases)
    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    // if the following are not 'undefined' then push them to the neighbours array
    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (bottom && !bottom.visited) neighbours.push(bottom);
    if (left && !left.visited) neighbours.push(left);

    // Choose a random neighbour from the neighbours array
    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  /**
   * This method is resposble of drawing the top row
   * @param {Takes the X coordinates} x 
   * @param {Takes the y coordinates} y 
   * @param {Size} size 
   * @param {Columns} columns 
   * @param {Rows} rows 
   */
  drawTopWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }

  /**
   * This method is resposble of drawing the Right row
   * @param {Takes the X coordinates} x 
   * @param {Takes the y coordinates} y 
   * @param {Size} size 
   * @param {Columns} columns 
   * @param {Rows} rows 
   */

  drawRightWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }


  /**
   * This method is resposble of drawing the Bottom row
   * @param {Takes the X coordinates} x 
   * @param {Takes the y coordinates} y 
   * @param {Size} size 
   * @param {Columns} columns 
   * @param {Rows} rows 
   */


  drawBottomWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }


  /**
   * This method is resposble of drawing the Right row
   * @param {Takes the X coordinates} x 
   * @param {Takes the y coordinates} y 
   * @param {Size} size 
   * @param {Columns} columns 
   * @param {Rows} rows 
   */

  drawLeftWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

 
  /**
   * this method jighlights the current cell on the grid. Columns is once again passed in to set the size of the grid.
   * @param {columns of the maze} columns 
   */
  highlight(columns) {
    // Additions and subtractions added so the highlighted cell does cover the walls
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;
    ctx.fillStyle = "purple";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }

/**
 * 
 * @param {String you want to modefy} str 
 * @param {Index in which you want to change} index 
 * @param {the new character} chr 
 * @returns 
 */
  setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}


  /**
   * This method deletes the wall depending on the location of the cell he is going to
   * @param {cell one (the cell he moved from)} cell1 
   * @param {cell Two (the cell he is moving into)} cell2 
   */

  
  removeWalls(cell1, cell2) {
    // compares to two cells on x axis
    let x = cell1.colNum - cell2.colNum;
    // Removes the relevant walls if there is a different on x axis
    
    if (x === 1)
    {
      cell1.walls.leftWall = false;
      this.maze_creator[cell1.rowNum][cell1.colNum] = this.setCharAt( this.maze_creator[cell1.rowNum][cell1.colNum],1, "0");
      cell2.walls.rightWall = false;
      this.maze_creator[cell2.rowNum][cell2.colNum] = this.setCharAt(this.maze_creator[cell2.rowNum][cell2.colNum], 3, "0");
    } 

    else if (x === -1)
    {
      cell1.walls.rightWall = false;
      this.maze_creator[cell1.rowNum][cell1.colNum] = this.setCharAt(this.maze_creator[cell1.rowNum][cell1.colNum], 3, "0");
      cell2.walls.leftWall = false;
      this.maze_creator[cell2.rowNum][cell2.colNum] = this.setCharAt(this.maze_creator[cell2.rowNum][cell2.colNum], 1, "0");
    }

    // compares to two cells on y axis

    let y = cell1.rowNum - cell2.rowNum;

    // Removes the relevant walls if there is a different on y axis

    if (y === 1) 
    {
      cell1.walls.topWall = false;
      this.maze_creator[cell1.rowNum][cell1.colNum] = this.setCharAt(this.maze_creator[cell1.rowNum][cell1.colNum], 0, "0");
      cell2.walls.bottomWall = false;
      this.maze_creator[cell2.rowNum][cell2.colNum] = this.setCharAt(this.maze_creator[cell2.rowNum][cell2.colNum], 2, "0");
    } 

    else if (y === -1) 
    {
      cell1.walls.bottomWall = false;
      this.maze_creator[cell1.rowNum][cell1.colNum] = this.setCharAt(this.maze_creator[cell1.rowNum][cell1.colNum], 2, "0");
      cell2.walls.topWall = false;
      this.maze_creator[cell2.rowNum][cell2.colNum] = this.setCharAt(this.maze_creator[cell2.rowNum][cell2.colNum], 0, "0");
    }
  }

  /**
   * This method draws each of the the cells on the maze canvas
   * @param {Size pf the maze} size 
   * @param {Number of Rows} rows 
   * @param {NUmber of Columns} columns 
   */
  show(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;
    ctx.strokeStyle = "#blue";
    ctx.fillStyle = "green"; 
    ctx.lineWidth = 2;
    
    // calls the draw methods 

    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
    if (this.goal) {
      ctx.fillStyle = "rgb(83, 247, 43)";
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }


}

// Create a new instance of Maze with a default size of 500
let newMaze = new Maze(500, 10, 10);

function generateMaze() {
  console.log("Generate Maze button clicked"); // Add this line to test
  let mazeSizeInput = document.getElementById("mazeSize");
  let mazeSize = parseInt(mazeSizeInput.value, 10);

  // Check for a valid maze size
  if (isNaN(mazeSize)) {
      console.error("Invalid maze size");
      return;
  }
  newMaze = new Maze(500, mazeSize, mazeSize);
  newMaze.setup();
  newMaze.draw();
}

function SolveMazeApi(){
  console.log("Solve Maze API button clicked");
  const mazeData = newMaze.getMaze_creator();
  let firstElement = mazeData[0][0]; // Get the first element of the first row
  // Replace the first character with "0"
  firstElement = '0' + firstElement.substring(1);
  // Assign the modified string back to the first element of the first row
  mazeData[0][0] = firstElement;
  let lastRowIndex = mazeData.length - 1; // Index of the last row
  let lastColIndex = mazeData[lastRowIndex].length - 1; // Index of the last element in the last row
  let lastElement = mazeData[lastRowIndex][lastColIndex]; // Get the last element of the last row

  // Replace the last character with "0"
  lastElement = lastElement.substring(0, lastElement.length - 1) + '0';
  
  // Assign the modified string back to the last element of the last row
  mazeData[lastRowIndex][lastColIndex] = lastElement;

  fetch('http://localhost:8080/solve', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(mazeData)
  })
  .then(response => response.text())
  .then(result => {
      console.log('Solution:', result);
  })
  .catch(error => {
      console.error('Error solving maze:', error);
  });
}
// Listen for click event on the "Generate Maze" button
let generateButton = document.getElementById("generateButton");
generateButton.addEventListener("click", generateMaze);

let SolveMaze = document.getElementById("SolveMaze");
SolveMaze.addEventListener("click", SolveMazeApi);

// Setup and draw the initial maze
newMaze.setup();
newMaze.draw();