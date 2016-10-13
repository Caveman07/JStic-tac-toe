const EMPTY_CELL = "";

$().ready(function() {
		var newGame = Object.create(GamePrototype);
    newGame.init();
    newGame.playGame();
});

//Game object
var GamePrototype = {
		init: function() {
    			this.players = [];
          var player1 = Object.create(PlayerPrototype),
          		player2 = Object.create(PlayerPrototype);
          player1.init("X");
          player2.init("O");
          this.players.push(player1,player2);
          this.board = Object.create(BoardPrototype);
          this.board.init();
          this.assignPlayer();

    },

   //choose player randaonly
    assignPlayer: function() {
    			this.turn = Math.round(Math.random())?"X":"O";
    },

    //main game
    playGame: function() {
    			var row,col,symbol, msg;
          var that = this;
          $('.board').click(function(event){
          			if(this.board.setCell(row,col,symbol)){
										msg = this.board.checkGameOver();
										$('.row:nth-child('+(row+1)+') .col:nth-child('+(col+1)+')').addClass(symbol).html(symbol);
										if(msg){
												if(msg === "winner") {
														console.log("Player '" + this.turn + "' is the winner!");
                            }
												else {
														console.log("Draw game!");
                            }
												this.restartGame(msg);
										}
										this.switchTurns();
								}
                else {
										 console.log("Cell Occupied");
										 }
								}.bind(this));

         //hover effect and assigning symbol, col, row on hover
         $('.col').hover(function(event){
                    symbol = that.turn;
                    row = $(event.target).closest('.row').index('.row');
                    col = $(event.target).closest('.col').index('.col')%3;
                    if(that.board.getCell(row,col) === EMPTY_CELL){
                      $(this).html(symbol);
                    }
                  }, function(){
                        if(that.board.getCell(row,col) === EMPTY_CELL){
                          	$(this).html("");
                        }
                			});

    },

    //switch players after each turn
    switchTurns: function(){
					this.turn = (this.turn === "X")?"O":"X";
		},

    //restart game
    restartGame: function(msg){
          $('.board').unbind('click');
          $('.col').unbind('mouseenter mouseleave');
          $('.board').prepend('<div class="overlay"></div>');
          if(msg === "winner")
            	$('.overlay').append('<p>Player "'+ this.turn + '" Wins!</p>');
          else
            	$('.overlay').append('<p>Draw Game!</p>');
          $('.overlay').append('<p><a href="">Play Again?</a></p>');
		}
};

//Board object
var BoardPrototype = {
		init: function() {
    			this.grid = [];
          for (var i = 0; i<3; i++ ) {
          		var row = [];
              var int = i+1;

              for (var j = 0; j<3; j++) {
              		var cell = Object.create(CellPrototype);
                  cell.init();
                  row.push(cell);
                  }
              this.grid.push(row);
              }
    },

    //get cell symbol
    getCell: function(row,col){
					 return this.grid[row][col].getSymbol();
		},

    //set cell symbol
		setCell: function(row,col,symbol){
					 if(this.getCell(row,col) === EMPTY_CELL){
							this.grid[row][col].setSymbol(symbol);
							return true;
					 		}
					 return false;
		},

    //check if game is over
    checkGameOver: function(){
            if(this.win()) return "winner";
            if(this.draw()) return "draw";
            return false;
		},

    //check if all cells in array have the same symbol
	  allSame: function(arr){
            for(var i of arr){
              if(i.getSymbol() !== arr[0].getSymbol())
                return false;
            }
            return true;
		},

    //check if all cells in array are empty
		allEmpty: function(arr){
            for(var i of arr){
              if(i.getSymbol() !== EMPTY_CELL)
                return false;
            }
            return true;
		},

    //check if none of cells in array are empty
		noneEmpty: function(arr){
          for(var i of arr){
            if(i.getSymbol() === EMPTY_CELL)
              return false;
          }
          return true;
    },

    //transform grid elements vertically
    transposeGrid: function(){
          var transposed_grid = this.grid[0].map(function(col, i){
            return this.grid.map(function(row){
              return row[i];
            });
          },this);
					return transposed_grid;
	  },

    //get all diagonal cells
		diagonalRows: function(){
          return [
            [this.grid[0][0], this.grid[1][1], this.grid[2][2]],
            [this.grid[0][2], this.grid[1][1], this.grid[2][0]]
          ];
		},

  	//get all winnining positions
	  winningPositions: function(){
				 return this.grid.concat(this.transposeGrid(), this.diagonalRows());
	  },

  	//check if win
		win: function(){
        var positions = this.winningPositions();
        for(var i = 0; i < positions.length; i++){
          if(this.allEmpty(positions[i])) continue;
          if(this.allSame(positions[i])) return true;
        }
        return false;
		},

    //check if draw
  	draw: function(){
        var flattened = this.winningPositions().reduce(function(a,b){
          return a.concat(b);
        });
        if(this.noneEmpty(flattened))
          return true;
        return false;
		}
};

//Cell Object
var CellPrototype = {
		init: function() {
    			this.symbol = EMPTY_CELL;
          },
    setSymbol: function (symbol) {
    			this.symbol = symbol;
    			},
    getSymbol: function() {
    			return this.symbol;
    			}
};


//Player Object
var PlayerPrototype = {
		init: function(mark) {
    			this.symbol = mark;
          },
    get:  function() {
    				return this.symbol;
          }
};
