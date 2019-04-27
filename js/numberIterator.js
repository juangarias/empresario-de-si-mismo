function RangeIterator(count) {
  
  this.currentValue = count - 1;
  this.max = count;

  this.next = function() {
    this.currentValue++;
  	this.currentValue = this.currentValue % this.max;
  	return this.currentValue;
  };
}

function ConsecutiveIdIterator(prefix, count) {

	this.prefix = prefix;
	this.rangeIterator = new RangeIterator(count);

	this.next = function() {
		return "#" + this.prefix + this.rangeIterator.next();
	};

}