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


function ArrayNavigator(elements, startIndex) {

  var startIndex = (typeof startIndex !== 'undefined') ? startIndex : -1;
  this.elements = elements;
  this.index = startIndex;

  this.current = function() {
    return this.elements[this.index]; 
  };

  this.next = function() {
    if (this.elements[this.index + 1]) {
      this.index++;
    }
    return this.current();
  };

  this.previous = function() {
    if (this.index < 0) {
      this.index = 0;
    }
    if (this.elements[this.index - 1]) {
      this.index--;
    }
    return this.current(); 
  };
}