
var lastCastTickNumber = -100000;
var globalCooldown = 25 * 6;//One click per 6 sec
var newCompetanceCooldown = globalCooldown * 1.5;//a new competance each 15 sec
function Competance(
			creatureType, //0= vegetal, 1= herbivor, 2=carnivor			
			creatureIndex,
			img, //image of the monster
			firstCooldownIndex //how many seconds			
			){
	this.creatureType = creatureType;
	this.creatureIndex = creatureIndex;
	this.img = img;
	this.firstCooldown = Math.max(0, firstCooldownIndex - 1) * newCompetanceCooldown ;
	this.lastUse = 0;
	this.cooldownPercent = 100;
	this.borderColor = creatureType == 0 ? 'green' : creatureType == 1 ? 'blue' : 'red';
}


Competance.prototype.tick = function(tickNumber){
	var firstCooldownPercent = 0;
	var firstCooldownPendingTick = this.firstCooldown - tickNumber;
	if(firstCooldownPendingTick > 0 ){
		firstCooldownPercent = firstCooldownPendingTick * 100 / this.firstCooldown;
	}	
	var universalCooldown = 0;
	var globalCooldownPendingTick = (lastCastTickNumber + globalCooldown) - tickNumber;
	if(globalCooldownPendingTick > 0){
		universalCooldown = globalCooldownPendingTick * 100 / globalCooldown;
	}
	this.cooldownPercent = Math.max(firstCooldownPercent, universalCooldown);
}

Competance.prototype.tryCast = function(world, clickPoint){
	if(this.cooldownPercent != 0){
		return;
	}	
	world.resetScore();
	lastCastTickNumber = tickNumber;
	if(this.creatureType == 0){
		playAudioSimplePloup();
		var seed = new Seed(this.img,this.creatureIndex,{x: clickPoint.x, y: screen.height - 48}, true);
		seed.energy = 30;
		world.addAnimation(seed, 40);
	}
	else 
	{
		playAudioPloupPloup();
		var egg = new Egg({x: clickPoint.x, y: screen.height - 64}, this.creatureType, this.creatureIndex, this.img);
		egg.energy = 30;		
		world.addAnimation(egg, 20);
	}
}
