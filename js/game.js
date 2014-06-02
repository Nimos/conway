var gameOfLife = function (canvas, width, height) {
	this.width = width;
	this.height = height;
	this.canvas = canvas;
	this.ctx = canvas.getContext("2d");
	this.cellNo = width*height;

	this.canvas.onclick = this.handleClick.bind(this);

	if (stopgo) {
		stopgo.onclick = this.stopgo.bind(this);
	}
	if (clear) {
		clear.onclick = this.clear.bind(this);
	}

	this.play = false;
	this.cells = [];

	this.FPS = 10;
	this.waitFrames = (60/this.FPS)-1;


	for (var x=0;x<this.cellNo; x++) {
		this.cells[x] = 0;
	}

	if (window.location.hash != "") {
		for (var x=0;x<window.location.hash.length;x+=4) {
			var n = parseInt(window.location.hash.substr(1+x,4))
			this.cells[n] = 1;
		}
	}

	this.main();
}

gameOfLife.prototype.clear = function () {
	for (var x=0;x<this.cellNo; x++) {
		this.cells[x] = 0;
	}	
}

gameOfLife.prototype.stopgo = function () {
	this.play = !this.play;
}

gameOfLife.prototype.main = function () {
	window.location.hash = this.export();
	
	if (!this.play || this.waitFrames-- >= 0) {
		this.render();
		requestAnimationFrame(this.main.bind(this));
		return;
	}


	this.waitFrames = (60/this.FPS)-1;

	var newCells = [];

	for (var x=0; x<this.cells.length; x++) {
		var alive = this.getAliveNeighbors(x);
		if (alive < 2) {
			newCells[x] = 0;
		} else if (alive < 4 && this.cells[x] == 1) {
			newCells[x] = 1;
		} else if (alive >= 4) {
			newCells[x] = 0;
		} else if (alive == 3) {
			newCells[x] = 1;
		}
	}
	this.cells = newCells;

	this.render();
	requestAnimationFrame(this.main.bind(this));
}

gameOfLife.prototype.getAliveNeighbors = function (cell) {
	var result = 0;

	var onEdgeLeft = (cell%this.width == 0);
	var onEdgeRight = (cell+1)%this.width == 0;

	if (this.cells[cell-(this.width+1)] && !onEdgeLeft) {// up and left
		result+=this.cells[cell-(this.width+1)];
	}
	if (this.cells[cell-(this.width)]) {// up
		result+=this.cells[cell-(this.width)];
	}	
	if (this.cells[cell-(this.width-1)] && !onEdgeRight) {// up and right
		result+=this.cells[cell-(this.width-1)];
	}
	if (this.cells[cell-1] && !onEdgeLeft) {// left
		result+=this.cells[cell-1];
	}
	if (this.cells[cell+1] && !onEdgeRight) {// right
		result+=this.cells[cell+1];
	}
	if (this.cells[cell+(this.width-1)] && !onEdgeLeft) {// down and left
		result+=this.cells[cell+(this.width-1)];
	}
	if (this.cells[cell+(this.width)]) {// down
		result+=this.cells[cell+(this.width)];
	}	
	if (this.cells[cell+this.width+1] && !onEdgeRight) {// down and right
		result+=this.cells[cell+this.width+1];
	}
	return result;
}

gameOfLife.prototype.render = function () {
	var pX = this.canvas.width;
	var pY = this.canvas.height;


	var cellWidth = pX/this.width;
	var cellHeight = pY/this.height;

	this.ctx.fillStyle = "#000000";
	this.ctx.fillRect(0,0,pX,pY);
	this.ctx.fillStyle = "#111";

	for (var y=0; y<this.height; y++) {
		this.ctx.fillRect(0,y*cellHeight,pX,1);
	}
	for (var x=0; x<this.width; x++) {
		this.ctx.fillRect(x*cellWidth,0,1,pY);
	}
	this.ctx.fillStyle = "#DDD"

	for (var y=0; y<this.height; y++) {
		for (var x=0; x<this.width; x++) {
			var cellNo = y*this.width + x;
			if (this.cells[cellNo] == 1) {
				this.ctx.fillRect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
			}
		}
	}
}

gameOfLife.prototype.handleClick = function (event) {

	var cellWidth = this.canvas.width/this.width;
	var cellHeight = this.canvas.height/this.height;

	var coordsX = Math.floor(event.offsetX/cellWidth);

	var coordsY = Math.floor(event.offsetY/cellHeight);

	var cellid = coordsY*this.width + coordsX
	this.cells[cellid] = !this.cells[cellid]*1; //true*1 = 1, false*1 = 0 #justjavascriptthings

}

gameOfLife.prototype.export = function () {
	var r="";
	var padSize = (this.cellNo+"").length
	
	for (var x=0;x<this.cells.length;x++) {
		if (this.cells[x]) {
			var s = "0000000000"+x;
			r+=s.substr(s.length-padSize);
		}
	}
	return r;
}