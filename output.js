class Output {

	constructor (text, x, y, width) {
		this.text = text;
		this.x = x;
		this.y = y;

		this.width = width;

		this.in = [0];
		this.inputCircleCoords=[[0,0]];
		this.inputDiameter = 0;

		this.move = false;
		this.baseColour = 54;
		this.connectorHover = false;
		
		this.dragging = false;
		this.offsetY = 0;
	}

	draw() {

		//If dragging is true, move the input
		if (this.dragging) {
			this.y = mouseY + this.offsetY;
		}
		
		//Base rectangle
		fill(this.baseColour);
		noStroke();
		rect(this.x,this.y,this.width);
		//Connector
		let connectorX = this.x+(this.width/2);
		let connectorY = this.y+(this.width/2);
		let connectorDiameter = this.width - (this.width*0.5);
		this.inputCircleCoords[0][0] = connectorX;
		this.inputCircleCoords[0][1] = connectorY;
		this.inputDiameter = connectorDiameter;

		fill(200);
		if(dist(mouseX,mouseY,connectorX,connectorY) < connectorDiameter/2) {
			fill(160);
			this.connectorHover = true;
		} else {this.connectorHover = false;}
		if (this.in.length > 0 && this.in[0].state){
			fill(255,0,0);
		}
		circle(connectorX, connectorY, connectorDiameter);
	}

	pressed(px, py) {
		//Check for mouse hover
		if (px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.width && !this.connectorHover && this.move) {
			this.dragging = true;
			draggingObject = true;
			this.offsetY = this.y - py;
		}
	}

	notPressed() {
		//Reset variables when mouse is release
		this.dragging = false;
	}

	moveMode(px, py) {
		if (px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.width && !this.connectorHover) {
			//Turn on move mode
			this.move = !this.move;
			//Toggle Rectangle Colour
			if (this.baseColour == 54) {this.baseColour = 65;} else {this.baseColour = 54;}
		}
	} 
}

class OutputCust extends Output {
	constructor (text, x, y) {
		super(text, x, y, 50);
		this.x = x;
		this.y = y;
	} 

	moveMode() {};
	pressed() {};
	notPressed() {};
}