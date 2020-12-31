class Link {

	constructor(start, end, inputnum, outputnum){
		this.start = start;
		this.end = end;
		this.inputnum = inputnum;
		this.outputnum = (outputnum === undefined ? 0 : outputnum); 

		this.state = false;
	}

	draw() {
		let inputCircleCoords = this.end.inputCircleCoords;
		let outputCircleCoords = this.start.outputCircleCoords;

		let x1 = outputCircleCoords[this.outputnum][0];
		let y1 = outputCircleCoords[this.outputnum][1];
		let x2 = inputCircleCoords[this.inputnum][0];
		let y2 = inputCircleCoords[this.inputnum][1];

		stroke(0);
		strokeWeight(2);
		//Change colour to red if the connection is on
		if (this.state) {stroke(255,0,0);}
		
		//Check for mouse hover
		let m = ((windowHeight-y2)-(windowHeight-y1))/(x2-x1);
		if ((m*mouseX)-(m*x1)+(windowHeight-y1) < (windowHeight-mouseY)+4 && (m*mouseX)-(m*x1)+(windowHeight-y1) > (windowHeight-mouseY)-4) {
			if (mouseX > x1 && mouseX < x2) {
				strokeWeight(4);
				if (mouseIsPressed) {
					if (dist(mouseX,mouseY,this.start.outputCircleCoords[0],this.start.outputCircleCoords[1]) > this.start.outputDiameter/2 && dist(mouseX,mouseY,this.end.inputCircleCoords[this.inputnum][0],this.end.inputCircleCoords[this.inputnum][1]) > this.end.inputDiameter/2 && !draggingObject) {
						this.severLink();
					}
				}
			}
		}

		//Draw the link
		line(x1,y1,x2,y2);
		strokeWeight(2);
	}

	severLink() {
		//Delete output link
		for (i=0;i<this.start.out.length;i++) {
			if (this.start.out[i].start == this.start && this.start.out[i].end == this.end && this.inputnum == this.start.out[i].inputnum) {
				this.start.out.splice(i,1);
			}
		}
		//Delete input link
		if (this.end.in[this.inputnum].start == this.start && this.end.in[this.inputnum].end == this.end) {
			this.end.in[this.inputnum] = 0;
		}
	}
}