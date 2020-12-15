let logicGateTypes = ["AND","OR","NOT","XOR"];
let logicGates = [];
let links = [];
let startButtons = [];
let outputs = [];
let click = true;
let keyToggle = true;

let barTop;
let barHeight;

function setup() {
	createCanvas(windowWidth, windowHeight);
	startButtons.push(new Input("A", 5, windowHeight*0.3), new Input("B", 5, windowHeight*0.6));
	outputs.push(new Output("Output",windowWidth-50,(windowHeight*0.9)/2,50));
}

function draw() {
	barTop = windowHeight * 0.9;
	barHeight = windowHeight - barTop;
	let screenHeight = barTop;
	background(82,82,82);

	//draw the gate selection area
	fill(54,54,54);
	noStroke();
	rect(0,barTop,windowWidth,(windowHeight-barTop));
	let sectionWidth = (windowWidth/logicGateTypes.length);
	let sectionPadding = sectionWidth * 0.03;
	let heightPadding = barHeight * 0.2;
	//Draw the menu bar
	for (i=0;i<logicGateTypes.length;i++) {
		//Draw the rectangles and detect mouse hover events
		fill(28,28,28);
		noStroke();
		let x = (sectionWidth*i)+sectionPadding;
		let y = barTop+heightPadding;
		let w = sectionWidth-(2*sectionPadding);
		let h = barHeight-(2*heightPadding);

		//Detect mouse over
		if ((mouseX > x && mouseX < (x+w)) && (mouseY > y && mouseY < (y+h))) {
			
			fill(50,50,50);

			//Detect mouse clicked
			if (mouseIsPressed) {
				fill(35,35,35);

				//Create Logic Gate
				if (click){
					click = false;
					logicGates.push(new LogicGate(logicGateTypes[i], windowWidth/2, screenHeight/2));						
				}

			}
		}

		//Draw the rectangle
		rect(x,y,w,h);
		fill(255);
		textAlign(CENTER,CENTER);
		text(logicGateTypes[i],x+(w/2),y+(h/2));
	}

	//Draw Outputs
	outputs.forEach(v => {
		v.draw();
	});

	//Draw Inputs
	startButtons.forEach(v => {
		v.draw();
	});

	//Draw Logic Gates
	logicGates.forEach((v,i) => {
		//Check for collision
		if ((v.y+v.height) > barTop) {
			v.y = barTop - v.height;
		}
		if (v.y < 0) {
			v.y = 0;
		}
		if (v.x < 0) {
			v.x = 0;
		}
		if ((v.x+v.width) > windowWidth) {
			v.x = windowWidth - v.width;
		}
		v.draw();
		v.updateState();

		//Check for mouse hover and backspace key
		if (v.hover && keyIsPressed && keyCode == BACKSPACE && keyToggle) {
			//Delete the links on the logic gate
			v.removeConnections();
			//Remove logic gate from array
			logicGates.splice(i,1);
			//Set key toggle
			keyToggle = false; //key toggle makes it such that the delete process is only ran once per key press
		} else if (!keyIsPressed && !keyToggle) {
			keyToggle = true;
		}
	});
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	//Reset Output coordinates
	outputs.forEach(v => {
		v.x = windowWidth - v.width;
		v.y = (windowHeight-barHeight)/2;
	})
}

function mousePressed() {
	for (i=0;i<logicGates.length;i++) {
		logicGates[i].pressed(mouseX, mouseY);
	}
}

function mouseReleased() {
	click = true;
	//Check if a link needs to be created between two logic gates and also checks for duplicates
	for (i=0;i<logicGates.length;i++) {
		if (logicGates[i].drawLine && logicGates[i].outputLine) {
			for (j=0;j<logicGates.length;j++) {
				if (i!==j){
					for (l=0;l<logicGates[j].inputCircleCoords.length;l++) {
						if (dist(mouseX,mouseY,logicGates[j].inputCircleCoords[l][0],logicGates[j].inputCircleCoords[l][1]) < logicGates[j].inputDiameter) {
							let link = new Link(logicGates[i], logicGates[j], l);
							let duplicate = false;
							if (logicGates[j].in[l] !== 0){
								duplicate = true;
							}
							//If not a duplicate, add the connection
							if (!duplicate) {
								logicGates[i].out.push(link);
								logicGates[j].in[l] = link;
							}
						}
					}
				}
			}

			//Check if a link needs to be created between a logic gate and an output and check for duplicates
			for (j=0;j<outputs.length;j++) {
				if (dist(mouseX,mouseY,outputs[j].inputCircleCoords[0][0],outputs[j].inputCircleCoords[0][1]) < outputs[j].inputDiameter/2) {
					let link = new Link(logicGates[i], outputs[j], 0);
					let duplicate = false;
					if (outputs[j].in[0] !== 0){
						duplicate = true;
					}
					//If not a duplicate, add the connection
					if (!duplicate) {
						logicGates[i].out.push(link);
						outputs[j].in[0] = link;
					}
				}
			}
		}

		logicGates[i].drawLine = false;
		logicGates[i].outputLine = false;
		logicGates[i].notPressed();
	}

	//Check if a link needs to be created between the start buttons and a logic gate and check for duplicates
	for (i=0;i<startButtons.length;i++) {
		if (startButtons[i].drawLine) {
			for (j=0;j<logicGates.length;j++) {
				for (l=0;l<logicGates[j].inputCircleCoords.length;l++) {
					if (dist(mouseX,mouseY,logicGates[j].inputCircleCoords[l][0],logicGates[j].inputCircleCoords[l][1]) < logicGates[j].inputDiameter) {
						let link = new Link(startButtons[i],logicGates[j],l);
						let duplicate = false;
						if (logicGates[j].in[l] !== 0) {
							duplicate = true;
						}
						//If not a duplicate, add the connection
						if (!duplicate) {
							startButtons[i].out.push(link);
							logicGates[j].in[l] = link;
						}
					}
				}
			}

			//Check if a link needs to be created between an input and an output
			for (j=0;j<outputs.length;j++) {
				if (dist(mouseX,mouseY,outputs[j].inputCircleCoords[0][0],outputs[j].inputCircleCoords[0][1]) < outputs[j].inputDiameter/2) {
					let link = new Link(startButtons[i], outputs[j], 0);
					let duplicate = false;
					if (outputs[j].in[0] !== 0) {
						duplicate = true;
					}
					//If not a duplicate, add the connection
					if (!duplicate) {
						startButtons[i].out.push(link);
						outputs[j].in[0] = link;
					}
				}
			}
		}
	}

	//Reset the variables for the start button
	for (i=0;i<startButtons.length;i++) {
		startButtons[i].click = true;
		startButtons[i].drawLine = false;
	}
}