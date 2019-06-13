function LifeMonitor(minValue, maxValue, initValue) {

	this.minValue = minValue;
	this.maxValue = maxValue;
	this.initValue = initValue;
	this.ansiedad = initValue;
	this.felicidad = initValue;
	this.miedo = initValue;
	this.hambre = initValue;
	this.dinero = initValue;
	this.energia = initValue;
	this.dead = false;

	this.resetFactors = function() {
		this.ansiedad   = this.initValue;
		this.felicidad  = this.initValue;
		this.miedo      = this.initValue;
		this.energia    = this.initValue;
		this.hambre     = this.initValue;
		this.dinero     = this.initValue;
		this.dead = false;
	};

	this.cicle = function(deltaAnsiedad, deltaFelicidad, miedoNew, energiaNew, hambreNew, dineroNew) {
		if (!this.dead) {
			this.ansiedad = this.calculateNewFactorValue(this.ansiedad, deltaAnsiedad);
			this.felicidad = this.calculateNewFactorValue(this.felicidad, deltaFelicidad);
			this.miedo = this.calculateNewFactorValue(this.miedo, miedoNew);
			this.energia = this.calculateNewFactorValue(this.energia, energiaNew);
			this.hambre = this.calculateNewFactorValue(this.hambre, hambreNew);
			this.dinero = this.calculateNewFactorValue(this.dinero, dineroNew);
		}
		this.dead = this.dead || this.calculateIsDead();
	};

	this.calculateNewFactorValue = function(actual, delta) {
		var newValue = actual + delta * 7;
		return Math.min(Math.max(newValue, this.minValue), this.maxValue);
	};

	this.calculateIsDead = function() {
  		return this.ansiedad >= this.maxValue || this.miedo >= this.maxValue || 
          this.felicidad <= this.minValue || this.energia <= this.minValue || 
          this.hambre <= this.minValue || this.dinero <= this.minValue;
	}

	this.getAnsiedad = function() {
		return this.ansiedad;
	};
	this.getFelicidad = function() {
		return this.felicidad;
	};
	this.getMiedo = function() {
		return this.miedo;
	};
	this.getHambre = function() {
		return this.hambre;
	};
	this.getDinero = function() {
		return this.dinero;
	};
	this.getEnergia = function() {
		return this.energia;
	};
	this.isDead = function() {
		return this.dead;
	};

	this.forceDie = function() {
		this.dead = true;
	};
}