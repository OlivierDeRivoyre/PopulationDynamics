

function Creature(startCoord, creatureType, creatureIndex, img){
	this.coord = startCoord;
	this.creatureType = creatureType;
	this.creatureIndex = creatureIndex;
	this.img = img;
	this.energy = 0.01;
	this.energyConsomation = 0.50;	
	this.angus =  Math.random() * 2 * Math.PI;
	this.isEatable = true;
	this.lastBaby = tickNumber;
	this.puberty = 25 * 12;
	this.speed = 0.40;
	this.eatSpeed = 0.20;
	if(this.creatureType == 2){
		this.speed = 1.6;
		this.eatSpeed = 1.00;
	}
	this.hasEatThisTick = false;
	this.doesReproducePerCouple = false;	
	this.doesEggAndDie = false;
	this.doesEggWhenFilled = false;	
	this.targetCreature = null;
	this.isClever = false;
	if(this.creatureIndex % 6 >= 3){
		this.isClever = true;
	}
	if(this.creatureIndex % 3 == 0)
	{
		this.doesReproducePerCouple = true;
		if(!this.isClever && Math.random() < 0.5){
			this.isClever = true;	
		}
	} 
	else if(this.creatureIndex % 3 == 1)
	{
		this.doesEggWhenFilled = true;
		this.speed = this.speed * 0.5;
		this.puberty = Math.floor((Math.random() * 20 + 20) * 25);
	}
	else if(this.creatureIndex % 3 == 2)
	{
		this.doesEggAndDie = true;
		this.speed = this.speed * 0.7;
		this.puberty = Math.floor((Math.random() * 40 + 30) * 25);
	} 
	
	
	if(this.creatureType == 2)
	{
		this.puberty *= 3;//Do not reproduce too kickly
	}	
	this.isDead = false;
	this.alpha = 1.0;
	this.lastAngusChangeTick = tickNumber;
	this.cancelDieSound = false;
}
Creature.prototype.tick = function(tickNumber, world){
	this.hasEatThisTick = false;
	if(!this.isDead){
		this.energy -= (this.energyConsomation / 25);
		if(tickNumber % 250 == 0){
			this.energyConsomation += 0.5;//became older and older	
		}
		if(this.energy < 0){
			this.isDead = true;
			if(!this.cancelDieSound){
				playAudioDie();
			}
		}
	}
	if(this.isDead){
		this.alpha = Math.max(0, this.alpha - 0.05);
		if(this.alpha == 0){
			this.isActive = false;
		}
		return;
	}
		
	this.move(tickNumber, world);
	this.interactWithOtherCreatures(world);
}

Creature.prototype.move = function(tickNumber, world){
	this.coord = {x: this.coord.x + this.speed * Math.cos(this.angus),
			y: this.coord.y + this.speed * Math.sin(this.angus)};
	var resetAngus = false;		
	if(this.coord.x < 32){
		resetAngus = true;
		this.coord.x = 32;
	}
	if(this.coord.x + 32 > world.width ){
		resetAngus = true;
		this.coord.x = world.width  - 32;
	}
	if(this.coord.y < 32){
		resetAngus = true;
		this.coord.y = 32;
	}
	if(this.coord.y + 32 > world.height ){
		resetAngus = true;
		this.coord.y = world.height  - 32;
	}	
	
	if(resetAngus){
		this.targetCreature = this.getATarget(world);
		if(this.targetCreature != null){
			this.angus = world.getPolarCoord(this, this.targetCreature.coord).angus;
		} else {
			this.angus =  Math.random() * 2 * Math.PI;
		}
		this.lastAngusChangeTick = tickNumber
	} 
	else if(this.isClever &&  tickNumber - this.lastAngusChangeTick > 2 * 25 && this.energy > 5)
	{		
		this.lastAngusChangeTick = tickNumber;
		//Adjust trajectory		
		if(this.targetCreature == null || this.targetCreature.isDead){
			this.targetCreature = this.getATarget(world);
		}
		if(this.targetCreature != null){
			this.energy -= 2;	
			var perfectAngus = world.getPolarCoord(this, this.targetCreature.coord).angus;
			this.angus = perfectAngus;			
		} 
	}
}

Creature.prototype.getATarget = function(world){
	if(this.isClever){
		var lookingForSex = false;
		if(this.doesReproducePerCouple && this.energy > 50){
			lookingForSex = true;
		}
		var allAnims = world.getActiveAnimations(this);
		for(var i = 0; i < allAnims.length; i++){
			var anim = allAnims[i];
			if(anim.isEatable == undefined){
				continue;
			}
			if(lookingForSex){
				if(anim.creatureType == this.creatureType && anim.img  == this.img)
				{
					return anim;
				}
			} else {
				if(anim.creatureType + 1 == this.creatureType){
					return anim;
				}
			}
		}
	}
	return null;
}
Creature.prototype.interactWithOtherCreatures = function(world){
	var anims = world.getAnimationsAt(this.coord, 40, this);
	for(var i = 0; i < anims.length; i++){
		var anim = anims[i];
		if(anim.isEatable == undefined){
			continue;
		}
		if(!anim.isActive || anim.isDead){
			continue;
		}
		if(anim.creatureType + 1 == this.creatureType){//eat
			if(this.energy < 99){
				var eatEnergy = Math.min(this.eatSpeed, anim.energy); 
				anim.energy = Math.max(0, anim.energy - eatEnergy);
				this.energy = Math.min(100, this.energy + eatEnergy);
				playAudioMiamMiam();	
			}					
			this.hasEatThisTick = true;								
		}
		
		if(this.doesReproducePerCouple){
			
			if(anim.creatureType == this.creatureType && anim.creatureIndex  == this.creatureIndex){//Reproduce
				if(this.energy > 20 && anim.energy > 20){
					if(tickNumber - this.lastBaby > this.puberty
					&&
					 tickNumber - anim.lastBaby > this.puberty
					){
						playAudioKiss();
						var egg = new Egg({x: this.coord.x, y: this.coord.y}, this.creatureType, this.creatureIndex, this.img);
						this.lastBaby = tickNumber;
						anim.lastBaby = tickNumber;						
						this.energy = this.energy - 10;//Egg cost
						var eggEnergy = Math.min(this.energy * 0.50, 30);
						this.energy = this.energy - eggEnergy;
						egg.energy = eggEnergy;
						world.addAnimation(egg, 20);
					}
				}
			}
		} 
		else if(this.doesEggWhenFilled)//reproduce alone
		{
			if(this.energy >= 90 && tickNumber - this.lastBaby > this.puberty){
				this.lastBaby = tickNumber;
				this.energy = this.energy - 10;//Egg cost
				var egg = new Egg({x: this.coord.x, y: this.coord.y}, this.creatureType, this.creatureIndex, this.img);
				var eggEnergy = Math.min(this.energy * 0.60, 60);
				this.energy = this.energy - eggEnergy;
				egg.energy = eggEnergy;
				world.addAnimation(egg, 20);
			}			
		} 
		else if(this.doesEggAndDie)
		{
			if(tickNumber - this.lastBaby > this.puberty){				
				this.lastBaby = tickNumber;					
				if(this.energy > 30){
					this.energy = this.energy - 10;//Egg cost
					var numberOfCreatures = (this.energy > 50.0 ? 2 : 1);
					if(numberOfCreatures > 0){
						var egg = new Egg({x: this.coord.x, y: this.coord.y}, this.creatureType, this.creatureIndex, this.img);
						egg.numberOfCreatures = numberOfCreatures;
						var eggEnergy =  Math.max(0.0001, Math.min(this.energy - 1, 60));
						this.energy = this.energy - eggEnergy;
						egg.energy = eggEnergy;
						world.addAnimation(egg, 20);
						this.cancelDieSound = true;
					}		
				}				
			}
		}
	}	
}

Creature.prototype.draw = function(screen){	
	screen.drawZoomImg(this.img, this.coord, this.angus, 1, this.alpha);
	if(this.isDead)
	{
		return;
	}
	if(this.isMouseOver || this.hasEatThisTick){		
		var outerColor = 'rgba(50, 50, 200, 0.5)';
		if(this.creatureType == 2){			
			outerColor = 'rgba(200, 50, 50, 0.5)';
		}		
		//energy
		screen.fillRect({x: this.coord.x - 32, y : this.coord.y + 28,}, 64.0 * this.energy / 100, 4, 'rgba(0, 255, 0, 0.5)');
		screen.strokeRect({x: this.coord.x - 32, y : this.coord.y + 28,}, 64, 4, outerColor);
	 }	
}

