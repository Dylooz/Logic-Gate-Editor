class Input {

	constructor (text, x, y){
		this.text = text;
		this.x = x;
		this.y = y;

		this.width = 100;
		this.height = 50;

		this.out = [];
		this.click = true;
		this.state = false;
		this.drawLine = false;

		this.outputCircleCoords = [0,0];
		this.outputDiameter = 0;

		this.buttonHover = false;
		this.connectorHover = false;
		this.dragging = false;
		this.offsetY = 0;

		this.baseColour = 54;
		this.move = false;
	}

	draw() {

		//If dragging is true, move the input
		if (this.dragging) {
			this.y = mouseY + this.offsetY;
		}

		//Base Rectangle
		fill(this.baseColour);
		noStroke();
		rect(this.x,this.y,this.width,this.height);
		//Button
		let buttonX = this.x+(this.width*0.05);
		let buttonY = this.y+(this.height*0.1);
		let buttonWidth = this.width*0.2;
		let buttonHeight = this.height*0.8;
		fill(100);
		//Check for mouse hover over button
		if (mouseX > buttonX && mouseX < buttonX+buttonWidth && mouseY > buttonY && mouseY < buttonY+buttonHeight && !draggingObject) {
			this.buttonHover = true;
			fill(80);
			//Check for mouse click
			if (mouseIsPressed && this.click) {
				this.click = false;
				//Toggle the state of the button
				this.state = !this.state;
			}
		} else if (this.buttonHover) {
			this.buttonHover = false;
		}
		if (this.state) {
			fill(255,0,0);
		}

		rect(buttonX,buttonY,buttonWidth,buttonHeight);
		//Text
		textAlign(CENTER, CENTER);
		fill(255);
		text(this.text,this.x+(this.width*0.5),this.y+(this.height*0.5));
		//Connector
		fill(200);
		let connectorX = this.x+(this.width*0.8);
		let connectorY = this.y+(this.height/2);
		let connectorDiameter = this.width*0.2;
		this.outputCircleCoords[0] = connectorX;
		this.outputCircleCoords[1] = connectorY;
		this.outputDiameter = connectorDiameter;
		//Check for mouse hover over connector
		if (dist(mouseX,mouseY,connectorX,connectorY) < connectorDiameter/2 && !draggingObject) {
			this.connectorHover = true;
			fill(160);
			//Check if line should be drawn
			if (mouseIsPressed) {
				this.drawLine = true;
			}
		} else if (this.connectorHover) {
			this.connectorHover = false;
		}
		circle(connectorX,connectorY,connectorDiameter);

		//Draw line if necessary
		if (this.drawLine) {
			strokeWeight(3);
			stroke(0);
			line(connectorX,connectorY,mouseX,mouseY);
		}

		//Draw Links
		this.updateState(); //Update the link with the button state
		if (this.out.length > 0) {
			for (i=0;i<this.out.length;i++) {this.out[i].draw();}
		}
	}

	updateState() {
		//Update every link with the correct state
		for (i=0;i<this.out.length;i++) {
			this.out[i].state = this.state;
		}
	}

	pressed(px, py) {
		//Check for mouse hover
		if (px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.height && !this.connectorHover && !this.buttonHover && this.move) {
			this.dragging = true;
			draggingObject = true;
			this.offsetY = this.y - py;
		}
	}

	notPressed() {
		//Reset variables when mouse is released
		this.dragging = false;
	}

	moveMode(px, py) {
		//Check if mouse is hovering over input
		if (px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.height && !this.connectorHover && !this.buttonHover) {
			this.move = !this.move;
			//Toggle rectangle colour
			if (this.baseColour == 54) {this.baseColour=65;} else {this.baseColour=54;}

		}
	}
}

class InputCust extends Input {
	constructor (text, x, y) {
		super(text, x, y);
	} 

	moveMode() {};
	pressed() {};
	notPressed() {};
}