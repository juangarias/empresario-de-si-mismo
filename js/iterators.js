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
		return this.prefix + this.rangeIterator.next();
	};

}


function ArrayNavigator(elements, startIndex) {

  this.elements = elements;
  this.index = (typeof startIndex !== 'undefined') ? startIndex : -1;
  this.max = elements.length;

  this.current = function() {
    return this.elements[this.index]; 
  };

  this.next = function() {
    this.index++;
    this.index = this.index % this.max;
    return this.current();
  };

  this.previous = function() {
    this.index--;
    if (this.index < 0) {
      this.index = this.max - 1;
    }
    return this.current(); 
  };
}