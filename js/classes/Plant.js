
function Plant(img, plantIndex, startCoord){
	this.coord = startCoord;
	this.plantIndex = plantIndex;
	this.img = img;
	this.creatureType = 0;
	this.energy = 10;
	this.seedPercent = 95;
	this.angus =  Math.random() * 2 * Math.PI;
	this.isEatable = true;
	this.isPlant = true;
	this.imgZoom = 1.0;
	this.isDead = false;
	this.alpha = 1.0;
	this.energyPhotosynthese = 3.00;
	this.energyConsomation = 0.01;
	this.seedPercentSpeed = 0.50 / (3 + this.plantIndex);
}
Plant.prototype.tick = function(tickNumber, world){
	this.energy -=  Math.max(0, this.energyConsomation / 25);
	if(tickNumber % 250 == 0){
		this.energyConsomation += (this.energyPhotosynthese / 30);//5 minutes and no more energy++		
	}
	if(this.energy <= 0){
		this.isDead = true;
		this.energy = 0;
	}	
	if(this.isDead){
		this.alpha = Math.max(0, this.alpha - 0.05);
		if(this.alpha == 0){
			this.isActive = false;
		}
		return;
	}	
	this.energy = Math.min(100, this.energy + this.energyPhotosynthese / 25);//Plant's Photosynthese	
	if(this.imgZoom < 1.0){
		this.imgZoom =  Math.min(100,this.imgZoom + 0.004);
	}
	this.seedPercent = Math.min(100, this.seedPercent + this.seedPercentSpeed * this.energy / 100.0 );
	
	if(this.seedPercent == 100)
	{
		this.seedPercent = 0;
		var seed = new Seed(this.img, this.plantIndex, {x: this.coord.x, y: this.coord.y}, false);
		var seedEnergy = Math.min(this.energy / 2, 40);
		this.energy = this.energy - seedEnergy;
		seed.energy = seedEnergy;
		world.addAnimation(seed, 40);
	}
}
Plant.prototype.draw = function(screen){	
	screen.drawZoomImg(this.img, this.coord, this.angus, this.imgZoom, this.alpha);
	if(this.isDead){
		return;
	}
	if(this.isMouseOver){	
		//energy
		screen.fillRect({x: this.coord.x - 32, y : this.coord.y + 24,}, 64.0 * this.energy / 100, 4, 'rgba(0, 255, 0, 0.5)');		
		screen.strokeRect({x: this.coord.x - 32, y : this.coord.y + 24,}, 64, 4, 'rgba(50, 205, 50, 0.5)');
		//seed percent
		screen.fillRect({x: this.coord.x - 32, y : this.coord.y + 28,}, 64.0 * this.seedPercent / 100, 4, 'rgba(160, 150, 120, 0.5)');		
		screen.strokeRect({x: this.coord.x - 32, y : this.coord.y + 28,}, 64, 4, 'rgba(120, 120, 70, 0.5)');	
	}
}
