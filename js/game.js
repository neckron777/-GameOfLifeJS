const GRID_WIDHT  = 1080,
	  GRID_HEIGHT = 520,
	  GRID_ROWS   = 36,
	  GRID_COLS   = 64,
	  GAME_SPEED  = 200;


let isPlaying = false;
let interval  = undefined;

const root  	= document.getElementById('root');
const table 	= createTable(GRID_ROWS, GRID_COLS);
const grid  	= createGrid(GRID_ROWS, GRID_COLS); 
const nextGrid 	= createGrid(GRID_ROWS, GRID_COLS);	 
createControls();

function play() {
	computeNextGrid();
	updateView();
}

function createTable(rows , cols) {
	const table = document.createElement('table');

	table.className = 'grid';

	for (let i = 0; i < rows ; i++) {
		const row = document.createElement('tr');

		row.className = 'row';

		for (let j = 0 ; j < cols ; j++) {
			const cell = document.createElement('td');

			cell.className = 'cell';
			cell.width  = GRID_WIDHT / cols ;
			cell.height = GRID_HEIGHT / rows ;

			row.appendChild(cell)
		}

		table.appendChild(row)
	}

	table.addEventListener('click', event => {
		if (!event.target.classList.contains('cell')) return;
		
		const cell = event.target;
		const rowIndex  = cell.parentNode.rowIndex
		const cellIndex = cell.cellIndex;
		const isCellAlive = grid[rowIndex][cellIndex] === 1 ? true : false ;

		grid[rowIndex][cellIndex] = isCellAlive ? 0 : 1 ;

		cell.classList.toggle('alive', !isCellAlive);	
	});

	root.appendChild(table);

	return table
}
	  
function createControls() {
	const startButton = document.createElement('button');
	startButton.className = 'material-icons';
	startButton.textContent = 'play_arrow';
	startButton.addEventListener('click', function() {
		if (isPlaying) {
			isPlaying = false;
			this.textContent = 'play_arrow';
			clearInterval(interval);
		}else {
			isPlaying = true;
			this.textContent = 'pause';
			interval = setInterval(play, GAME_SPEED)
			play();
		}
	});

	const resetButton = document.createElement('button');
	resetButton.className = 'material-icons';
	resetButton.textContent = 'replay';
	resetButton.addEventListener('click', function() {
		isPlaying = false;
		startButton.textContent = 'play_arrow';
		clearInterval(interval);

		resetGrid();
		updateView();
	});

	const randomaizeButton = document.createElement('button');
	randomaizeButton.className = 'material-icons';
	randomaizeButton.textContent = 'transform';
	randomaizeButton.addEventListener('click', function() {
		isPlaying = false;
		startButton.textContent = 'play_arrow';
		clearInterval(interval);

		randomaizeGrid();
		updateView();
	});


	const container = document.createElement('div');
	container.className = 'controls';

	container.append(startButton, resetButton, randomaizeButton)

	root.appendChild(container)

}

function createGrid(rows ,cols) {
	var grid = [];

	for (var  i = 0; i < rows ; i++ ) {
		grid[i] = [];

		for (var j = 0; j < cols ; j++) {
			grid[i][j] = 0;
		}
	}

	return grid
}

function randomaizeGrid() {
	for (var  i = 0; i < grid.length ; i++ ) {
		for (var j = 0; j < grid[i].length ; j++) {
			grid[i][j] = Math.round(Math.random());
		}
	}	
}

function updateView() {
	for (var  i = 0; i < grid.length ; i++ ) {
		for (var j = 0; j < grid[i].length ; j++) {
			const cell = table.rows[i].cells[j]
			const isCellAlive = grid[i][j];

			cell.classList.toggle('alive', isCellAlive)
		}
	}
}

function resetGrid() {
	for (var  i = 0; i < grid.length ; i++ ) {
		for (var j = 0; j < grid[i].length ; j++) {
			grid[i][j] = 0
		}
	}	
}

function computeNextGrid() {
	for (var  i = 0; i < grid.length ; i++ ) {
		for (var j = 0; j < grid[i].length ; j++) {
			applyRules(i,j)
		}
	}
	copyNextGrid();
}


function copyNextGrid() {
	for (var  i = 0; i < grid.length ; i++ ) {
		for (var j = 0; j < grid[i].length ; j++) {
			grid[i][j] = nextGrid[i][j]
			nextGrid[i][j] = 0;
		}
	}
}

function applyRules(row,col) {
	const isCellAlive = grid[row][col];
	const numberOfNeighbors = countNeigbors(row,col);
	if (isCellAlive) {
		if (numberOfNeighbors < 2) {

			nextGrid[row][col] = 0 ;
		
		}else if (numberOfNeighbors == 2 || numberOfNeighbors == 3){

			nextGrid[row][col] = 1

		}else if (numberOfNeighbors > 3) {

			nextGrid[row][col] = 0
		
		}
	}else {
		if (numberOfNeighbors == 3) {
		
			nextGrid[row][col] = 1
		
		}
	}
}

function countNeigbors(row, col) {
	let count = 0;

	if (row - 1 >= 0) {//top
		if (grid[row - 1][col] == 1) count++
	}

	if (row - 1 >= 0 && col - 1 >= 0) {//top-left
		if (grid[row - 1][col - 1] == 1) count++
	}

	if (row - 1 >= 0 && col + 1 >= 0) {//top-right
		if (grid[row - 1][col + 1] == 1) count++
	}

	if (col - 1 >= 0) {//left
		if (grid[row][col - 1] == 1) count++
	}

	if (col - 1 < GRID_COLS) {//right
		if (grid[row][col + 1] == 1) count++
	}

	if (row + 1 < GRID_ROWS) {//bottom
		if (grid[row + 1][col] == 1) count++
	}

	if (row + 1 < GRID_ROWS && col - 1 >= 0) {//bottom-left
		if (grid[row + 1][col - 1] == 1) count++
	}

	if (row + 1 < GRID_ROWS && col + 1 < GRID_COLS) {//bottom-right
		if(grid[row + 1][col + 1] == 1) count++
	}

	return count;
}

function showBreed() {
	const breed = document.createElement('div');
	breed.className = "breed";

	root.appendChild(breed)
}