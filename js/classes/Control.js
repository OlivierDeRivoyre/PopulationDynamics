

/*****************************  Control  *******************************************/


function Control(topLeftCoord, downRightCoord)
{
	this.topLeftCoord = topLeftCoord;
	this.downRightCoord = downRightCoord;
	this.controls = new Array();
	
}

Control.prototype.getControl = function(coord){
	if(coord.x >= this.topLeftCoord.x && 
 	 coord.y >= this.topLeftCoord.y &&
	 coord.x < this.downRightCoord.x && 
	 coord.y < this.downRightCoord.y){
		for(var i = 0; i < this.controls.length; i++){
			var child = this.controls[i].getControl(coord);
			if(child != null){
				return child;
			}			
		}
		return this;
	}
	return null;
} 
Control.prototype.draw = function(canvas, rendering){
	if(this.ondraw != null){
		this.ondraw(canvas, rendering, this);
	}
	for(var i = 0; i < this.controls.length; i++){
		this.controls[i].draw(canvas, rendering);
	}
}