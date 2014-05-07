

function Screen(canvas){
	this.canvas = canvas;
	this.rendering = this.canvas.getContext('2d');
	this.width = canvas.width;
	this.height = canvas.height - 64 - 10;//due to actionbar
}

Screen.prototype.clear = function(){	
	this.rendering.clearRect(0, 0, this.canvas.width, this.canvas.height); 	
}

Screen.prototype.drawImg = function(img, canvasCoord, rotation)
{	
	this.rendering.save();
	this.rendering.translate(canvasCoord.x, canvasCoord.y); 
	this.rendering.rotate(rotation);// + Math.PI / 2);
	this.rendering.drawImage(img, 0, 0, 64, 64, -32, -32, 64, 64);
	this.rendering.restore();
}
Screen.prototype.drawZoomImg = function(img, canvasCoord, rotation, zoom, alpha)
{	
	this.rendering.save();
	this.rendering.translate(canvasCoord.x, canvasCoord.y); 
	this.rendering.rotate(rotation);// + Math.PI / 2);
	this.rendering.globalAlpha = alpha;
	this.rendering.drawImage(img, 0, 0, 64, 64, -32 * zoom, -32 * zoom, 64 * zoom, 64 * zoom);
	this.rendering.restore();
}

Screen.prototype.fillText = function(text, canvasCoord, color, fontSize)
{	
	this.rendering.fillStyle = color;
	switch(fontSize){
		case 0 : this.rendering.font="16px Arial"; break;
		case 1 : this.rendering.font="20px Arial"; break;
		case 2 : this.rendering.font="24px Arial"; break;
	}
	this.rendering.fillText(text,canvasCoord.x, canvasCoord.y);
}

Screen.prototype.fillRect = function(canvasCoord, width, height, color)
{
	this.rendering.fillStyle = color;	
	this.rendering.fillRect(canvasCoord.x, canvasCoord.y, width, height);
}

Screen.prototype.strokeRect = function(canvasCoord, width, height, color)
{
	this.rendering.strokeStyle  = color;	
	this.rendering.strokeRect(canvasCoord.x, canvasCoord.y, width, height);
} 

