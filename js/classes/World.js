
var imgPlants = new Array();
for(var i = 0; i < indexPlants.length; i++){
	imgPlants.push(LoadImage('img/plants/' + indexPlants[i]));
}
var imgHerbivores = new Array();
for(var i = 0; i < indexHerbivores.length; i++){
	imgHerbivores.push(LoadImage('img/herbivores/' + indexHerbivores[i]));
}
var imgCarnivores = new Array();
for(var i = 0; i < indexCarnivores.length; i++){
	imgCarnivores.push(LoadImage('img/carnivores/' + indexCarnivores[i]));
}

function World(screen)
{	
	this.animations = new Array();
	this.width = screen.width;
	this.height = screen.height;
	this.currentScore = 0;
	this.bestScore = localStorage.getItem('bestScore');
	if(this.bestScore == null){
		this.bestScore = 0;
	}

}

World.prototype.addAnimation = function(anim, zIndex){
	anim.zIndex = zIndex;
	anim.isActive = true;
	for(var i = 0; i < this.animations.length; i++){
		if(zIndex < this.animations[i].zIndex){
			this.animations.splice(i, 0, anim);//InsertAt(i)
			return;
		}
	}
	this.animations.push(anim);
}

World.prototype.drawAll = function(screen){
	for(var i = 0; i < this.animations.length; i++){
		this.animations[i].draw(screen);
	}  
}

World.prototype.increaseScore = function(tickNumber)
{
	if(tickNumber % 5 != 0){
		return;
	}
	var plants = new Object();
	var creatures = new Object();
	for(var i = 0; i < this.animations.length; i++){
		if(this.animations[i].isEatable){
			if(this.animations[i].isPlant){
				plants["p" + this.animations[i].plantIndex] = true;
			}
			if(this.animations[i].creatureIndex != undefined){
				creatures["c" +this.animations[i].creatureIndex] = true;
			}
		}
	}
	this.currentScore += Object.keys(plants).length * Object.keys(creatures).length;
} 
World.prototype.resetScore = function(){
	if(this.currentScore > this.bestScore){
		this.bestScore = this.currentScore;
		localStorage.setItem('bestScore',this.bestScore);

	}
	this.currentScore = 0;
}
World.prototype.tick = function(tickNumber){
	var cloneAnimation = this.animations.slice(0);//Since tick() can insert items
	for(var i = 0; i < cloneAnimation.length; i++){
		if(cloneAnimation[i].isActive){
			cloneAnimation[i].tick(tickNumber, this);
		}
	}
	for(var i = 0; i < cloneAnimation.length; i++){
		var anim = cloneAnimation[i];
		anim.isMouseOver = Math.abs(this.mouseCoord.x - anim.coord.x) < 32 && Math.abs(this.mouseCoord.y - anim.coord.y) < 32;
	}
	for(var i = this.animations.length - 1; i >=0 ; i--){
		if(!this.animations[i].isActive){
			this.animations.splice(i, 1);
		}
	}
	this.increaseScore(tickNumber);
}

World.prototype.getPolarCoord = function(anim, targetCoord){
	var dx = targetCoord.x - anim.coord.x;
	var dy = targetCoord.y - anim.coord.y;
	var distance = Math.sqrt(dx*dx + dy*dy);
	var angus = Math.atan2(dy, dx);
	return {distance: distance, angus: angus};
}

World.prototype.getAnimationsAt = function(point, distance, except){
	var r = new Array();
	for(var i = 0; i < this.animations.length; i++){
		if(this.animations[i] != except){
			if(this.animations[i].isActive){
				if(this.getPolarCoord(this.animations[i], point).distance <= distance){
					r.push(this.animations[i]);
				}	
			}
		}
	}
	return r;
}

World.prototype.getActiveAnimations = function(except){
	var r = new Array();
	for(var i = 0; i < this.animations.length; i++){
		if(this.animations[i] != except){
			if(this.animations[i].isActive){
				r.push(this.animations[i]);
			}
		}
	}
	return r;
}