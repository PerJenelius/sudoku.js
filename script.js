document.addEventListener("DOMContentLoaded", function() {
    //initiate Sudoku board
    var sudokuBoard = document.getElementById('sudoku-board');

    for (let i = 0; i < 9; i++) {
        let row = sudokuBoard.insertRow(i);

        for (let j = 0; j < 9; j++) {
            let cell = row.insertCell(j);
            cell.id = i + ':' + j;
            let cellSquare = getSquareNumber(i, j);
            cell.classList = cellSquare;
        }
    }

    //initiate number buttons
    var sudokuButtons = document.getElementById('sudoku-buttons');
    let buttonNumber = 0;

    for (i = 0; i < 3; i++) {
        let row = sudokuButtons.insertRow(i);

        for (j = 0; j < 3; j++) {
            let cell = row.insertCell(j);
            cell.innerHTML = ++buttonNumber;
            cell.classList.add('numberButton');
        }
    }

    //initiate function buttons
    row = sudokuButtons.insertRow(3);
    let cell = row.insertCell(0);
    cell.colSpan = 2;
    cell.innerHTML = 'Clear';
    cell.id = 'clear';
    cell = row.insertCell(1);
    cell.innerHTML = 'Go';
    cell.id = 'go';

    //catch click event in playing field
    let activeCell = '';

    document.querySelectorAll('#sudoku-board td').forEach(item => {
        item.addEventListener('click', event => {
            if (activeCell !== '') {
                activeCell.classList.remove('active-cell');
            }

            activeCell = item;
            item.classList.add('active-cell');
        })
    });

    //catch click event on number buttons
    document.querySelectorAll('.numberButton').forEach(item => {
        item.addEventListener('click', event => {
            if (activeCell !== '') {
                let newNumber = item.innerHTML;
                activeCell.innerHTML = newNumber;
            }
        })
    });

    //catch click event on Clear button
    document.getElementById('clear').addEventListener('click', event => {
        if (activeCell !== '') {
            activeCell.innerHTML = '';
            activeCell.classList.remove('warning');
        }
    });

    //catch click event on Go button
    document.getElementById('go').addEventListener('click', event => {
        solveSudoku();
    });

    //solve the sudoku based on the filled-in numbers
    function solveSudoku() {

        checkForErrors();

        let progressIndex = 0;
        let possibleValueArray = [9];

        for (let i = 0; i < 9; i++) {
            possibleValueArray[i] = [9];

            for (let j = 0; j < 9; j++) {
                possibleValueArray[i][j] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            }
        }

        do {
            progressIndex = 0;

            document.querySelectorAll('#sudoku-board td').forEach(item => {
                var rowNo = parseInt(item.id.split(':')[0]);
                var colNo = parseInt(item.id.split(':')[1]);
                var sqrNo = item.classList[0];

                if (item.innerHTML !== '') {
                    possibleValueArray[rowNo][colNo] = [ item.innerHTML ];
                }
    
                if (item.innerHTML === '') {
                    let possibleValues = possibleValueArray[rowNo][colNo];
    
                    //remove known values from cells in the same row, column and square
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            let id = i + ':' + j;
                            let cell = document.getElementById(id);

                            if (cell.classList[0] === sqrNo || i === rowNo || j === colNo) {
                                let cellValue = cell.innerHTML;
    
                                if (cellValue !== '') {
                                    let index = possibleValueArray[rowNo][colNo].indexOf(cellValue)

                                    if (index > -1) {
                                        possibleValueArray[rowNo][colNo].splice(index, 1);
                                        possibleValues.splice(index, 1);
                                        ++progressIndex;
                                    }
                                } else {
                                    let posVals = possibleValueArray[i][j];

                                    for (let k = 0; k < posVals.length; k++) {
                                        let index = possibleValues.indexOf(posVals[k])

                                        if (index > -1) {
                                            possibleValues.splice(index, 1);
                                        }
                                    }

                                    if(rowNo === 0 && colNo === 0) {
                                        console.log(posVals);
                                        console.log(possibleValues);
                                    }
                                }
                            }
                        }
                    }
    
                    if (possibleValueArray[rowNo][colNo].length === 1) {
                        item.classList.add('calculated');
                        item.innerHTML = possibleValueArray[rowNo][colNo][0];
                    }

                    // if (possibleValues.length === 1) {
                    //     item.classList.add('calculated');
                    //     item.innerHTML = possibleValues[0];
                    //     ++progressIndex;
                    // }
                }
            });

        } while (progressIndex > 0)

        console.log(possibleValueArray[0][0]);
    }

    //check if the value in a cell conflicts with any other value
    function checkForErrors() {
        document.querySelectorAll('#sudoku-board td').forEach(item => {
            var rowNo = item.id.split(':')[0];
            var colNo = item.id.split(':')[1];
            var sqrNo = item.classList[0];

            if (item.innerHTML !== '') {
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        let id = i + ':' + j;
                        let cell = document.getElementById(id);
                        if (cell.classList[0] === sqrNo || i == rowNo || j == colNo) {
                            if (cell.id !== item.id && cell.innerHTML === item.innerHTML) {
                                item.classList.add('warning');
                                cell.classList.add('warning');
                            }
                        }
                    }
                }
            }
        });
    }

    function getSquareNumber(i, j) {
        let cellSquare = i < 3 && j < 3 ? '1' : i < 3 && j < 6 ? '2' : i < 3 ? '3' :
                         i < 6 && j < 3 ? '4' : i < 6 && j < 6 ? '5' : i < 6 ? '6' :
                         j < 3 ? '7' : j < 6 ? '8' : '9';
        return cellSquare;
    }
});