const gates = {
	AND: {
		name: "AND",
		inputs: 2,
		fun: (a) => { return (a[0] === true && a[1] === true); },
		padding: 0.25
	},
	OR: {
		name: "OR",
		inputs: 2,
		fun: (a) => { return (a[0] === true || a[1] === true); },
		padding: 0.25
	},
	NOT: {
		name: "NOT",
		inputs: 1,
		fun: (a) => { return ((a[0] === true) ? false : true); },
		padding: 0.35
	},
	XOR: {
		name: "XOR",
		inputs: 2,
		fun: (a) => { return ((a[0] === true) ? !!!a[1] : !!a[1])},
		padding: 0.25
	}
}

class LogicGate {

	constructor(type,x,y,desc) {
		if (desc === undefined) {
			this.gate = gates[type];
			this.name = this.gate.name; 
			this.inputs = this.gate.inputs;
			this.fun = this.gate.fun;
			this.padding = this.gate.padding;
		} else {
			this.name = type; 
			this.inputs = desc.inputs;
			this.padding = desc.padding;
		}
		this.x = x;
		this.y = y;

		this.width = 150;
		this.height = 75;

		this.dragging = false;
		this.hover = false;
		this.resize = false;
		this.resizeHover = false;
		this.offsetX = 0;
		this.offsetY = 0;

		this.circleHover = false;
		this.drawLine = false;
		this.circleToDraw = 0;
		this.inputCircleCoords = [];
		this.outputCircleCoords = [[]];
		this.inputDiameter = 0;
		this.outputDiameter = 0;
		this.outputLine = false;

		this.in = [];
		for (i=0;i<this.inputs;i++){this.in.push(0);}
		this.out = [];
	}

	draw() {
		let rectColour = 90;
		let outputCircleColour = 180;

		//Detect mouse hover on rectangle
		if ((mouseX > this.x && mouseX < (this.x+this.width)) && (mouseY > this.y && mouseY < (this.y+this.height)) && !this.circleHover){
			rectColour = 50;
			this.hover = true;
		} else if (this.hover) {
			//Reset hover variable
			this.hover = false;
		}

		//Detect mouse in bottom right corner for resize
		if (mouseX > (this.x+this.width-20) && mouseX < (this.x+this.width) && mouseY > (this.y+this.height-20) && mouseY < (this.y+this.height) && !this.circleHover) {
			cursor(CROSS); //Set the cursor to a cross on mouse hover
			this.resizeHover = true;
			if (mouseIsPressed) {
				this.dragging = false;
				this.resize = true;
			}
		} else if (this.resizeHover){
			//Reset cursor
			cursor(ARROW);
			this.resizeHover = false;
		}

		//Draw the rectangle
		fill(rectColour);
		stroke(5);
		strokeWeight(4);

		if (this.dragging) {
			//Move the logic gate if the dragging variable is true
			this.x = mouseX + this.offsetX;
			this.y = mouseY + this.offsetY;
		}

		if (this.resize) {
			//Resize the logic gate
			this.width += mouseX - (this.x + this.width);
			this.height += mouseY - (this.y + this.height);
		}

		rect(this.x,this.y,this.width,this.height);

		this.circleHover = false;
		this.inputCircleCoords = [];

		//Draw the i/o circles
		let sectionHeight = this.height / this.inputs;
		this.inputDiameter = sectionHeight - (2 * this.padding * sectionHeight);
		for (i=0;i<this.inputs;i++) {
			strokeWeight(2);
			stroke(0);
			let inputCircleColour = 180;
			let circlecentreY = this.y+(i*sectionHeight)+(sectionHeight/2);
			this.inputCircleCoords.push([this.x,circlecentreY]);
			//Detect mouse hover on circle
			if (dist(mouseX,mouseY,this.inputCircleCoords[i][0],this.inputCircleCoords[i][1]) < (this.inputDiameter/2) && !draggingObject) {
				this.circleHover = true;
				inputCircleColour = 100;
				strokeWeight(4);

				//Detect if line should be drawn
				if (mouseIsPressed) {
					this.drawLine = true;
					this.circleToDraw = i;
				}
			}
			//Draw circle
			fill(inputCircleColour);
			circle(this.x,circlecentreY,this.inputDiameter);

			//Draw line if necessary
			if (this.drawLine && this.circleToDraw == i) {
				strokeWeight(3);
				line(mouseX, mouseY, this.x, circlecentreY);
			}
		}

		//Draw output circle
		this.outputDiameter = this.height - (0.7*this.height);
		this.outputCircleCoords[0][0] = (this.x+this.width);
		this.outputCircleCoords[0][1] = (this.y+(this.height/2));
		strokeWeight(2);
		if (dist(mouseX,mouseY,this.outputCircleCoords[0][0],this.outputCircleCoords[0][1]) < (this.outputDiameter/2)) {
			this.circleHover = true;
			outputCircleColour = 100;
			strokeWeight(4);

			if (mouseIsPressed) {
				this.drawLine = true;
				this.circleToDraw = this.inputs + 1;
			}
		}

		fill(outputCircleColour);
		circle((this.x+this.width),this.y+(this.height/2),this.outputDiameter);

		//Draw output line if needed
		if (this.drawLine && this.circleToDraw == this.inputs + 1) {
			this.outputLine = true;
			strokeWeight(3);
			line(mouseX, mouseY, (this.x+this.width), this.y+(this.height/2));
		}
		
		//Add Label
		fill(255);
		textAlign(CENTER,CENTER);
		noStroke();
		text(this.name,this.x+(this.width/2),this.y+(this.height/2));

		//Draw Links
		if (this.out.length > 0) {
			for (i=0;i<this.out.length;i++) {this.out[i].draw();}
		}
	}

	pressed(px, py){
		if (px > this.x && px < this.x + this.width && py > this.y && py < this.y + this.height && !this.circleHover) {
			draggingObject = true;
			this.dragging = true;
			this.offsetX = this.x - px;
			this.offsetY = this.y - py;
		}
	}

	notPressed() {
		//Reset variables when mouse is released
		this.dragging = false;
		this.resize = false;
	}

	updateState() {
		let inputs = [];
		//Check if logic gate is fully connected
		let connected = true;
		for (i=0;i<this.in.length;i++) {
			if (this.in[i] == 0){
				connected = false;
			}
		}
		if (this.out.length == 0) {
			connected = false;
		}

		//Update the state of the logic gate, only if it is fully connected
		if (connected){
			for (i=0;i<this.in.length;i++) {inputs.push(this.in[i].state);}
			for (i=0;i<this.out.length;i++) {this.out[i].state = this.fun(inputs);}
		}
	}

	removeConnections() {
		//Delete input links
		this.in.forEach(v => {
			if (v !== 0) {
				v.severLink();
			}
		});
		//Delete output links
		this.out.forEach(v => {
			if (v !== 0) {
				v.severLink();
			}
		});
	}
}