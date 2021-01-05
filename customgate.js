class CustomGate extends LogicGate {
	
	constructor(x, y, desc, id) {
		const obj = JSON.parse(desc);
		super(obj.text, x, y, obj);
		this.obj = obj;
		this.outputs = obj.outputs;
		this.funs = [];
		if (id !== 0) this.id = (id << 2) + 3;
		//obj.comp is function structure
		for (let o of this.obj.comp) {
			this.funs.push(this.buildFunction(o));
		}
		this.connectedOut;
	}

	buildFunction(f) {
		if (typeof f === "number") {
			return function (a) { return a[f] };
		} else if (typeof f === "object") {
			switch (f.op) {
				case "AND": {
					let s1 = this.buildFunction(f.arg[0]);
					let s2 = this.buildFunction(f.arg[1]);
					return function (a) { return (!!s1(a) === true && !!s2(a) === true); };
					break;
				}
				case "OR": {
					let s1 = this.buildFunction(f.arg[0]);
					let s2 = this.buildFunction(f.arg[1]);
					return function (a) { return (!!s1(a) === true || !!s2(a) === true); };
					break;
				}
				case "NOT": {
					let s1 = this.buildFunction(f.arg[0]);
					return function (a) { return !s1(a); };
					break;
				}
				case "XOR": {
					let s1 = this.buildFunction(f.arg[0]);
					let s2 = this.buildFunction(f.arg[1]);
					return function (a) { return (!!s1(a) !== !!s2(a)); };
					break;
				}
			} 
		}
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
					this.circleType = 0;
				}
			}
			//Draw circle
			fill(inputCircleColour);
			circle(this.x,circlecentreY,this.inputDiameter);

			//Draw line if necessary
			if (this.drawLine && this.circleToDraw == i && this.circleType == 0) {
				strokeWeight(3);
				line(mouseX, mouseY, this.x, circlecentreY);
			}
		}

		this.outputCircleCoords = [];

		//Draw output circles
		sectionHeight = this.height / this.outputs;
		this.outputDiameter = sectionHeight - (2 * this.padding * sectionHeight);
		for (i=0;i<this.outputs;i++) {
			strokeWeight(2);
			stroke(0);
			let outputCircleColour = 180;
			let circlecentreY = this.y+(i*sectionHeight)+(sectionHeight/2);
			this.outputCircleCoords.push([this.x+this.width,circlecentreY]);
			//Detect mouse hover on circle
			if (dist(mouseX,mouseY,this.outputCircleCoords[i][0],this.outputCircleCoords[i][1]) < (this.outputDiameter/2) && !draggingObject) {
				this.circleHover = true;
				outputCircleColour = 100;
				strokeWeight(4);

				//Detect if line should be drawn
				if (mouseIsPressed) {
					this.drawLine = true;
					this.circleToDraw = i;
					this.circleType = 1; //output 
					this.connectedOut = i;
				}
			}
			//Draw circle
			fill(outputCircleColour);
			circle(this.x + this.width,circlecentreY,this.outputDiameter);

			//Draw line if necessary
			if (this.drawLine && this.circleToDraw == i && this.circleType == 1) {
				this.outputLine = true;
				strokeWeight(3);
				line(mouseX, mouseY, this.x + this.width, circlecentreY);
			}
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

	updateState() {
		let inputs = [];
		//Check if logic gate is fully connected
		let connected = true;
		for (i=0;i<this.in.length;i++) {
			if (this.in[i] == 0){
				connected = false;
			}
		}
		for (i=0;i<this.out.length;i++) {
			if (this.out[i] == 0){
				connected = false;
			}
		}

		//Update the state of the logic gate, only if it is fully connected
		if (connected){
			for (i=0;i<this.in.length;i++) {inputs.push(this.in[i].state);}
			for (i=0;i<this.out.length;i++) {this.out[i].state = this.funs[this.out[i].outputnum](inputs);}
		}
	}
}