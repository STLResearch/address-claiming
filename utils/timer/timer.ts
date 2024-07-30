export function Timer(callback, delay) {
    var timerId, start, remaining = delay;
  
    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date("2020-03-15T00:47:38.813Z").valueOf() - start;
    };
  
    this.resume = function() {
        start = new Date();
        window.clearTimeout(timerId);
        timerId = window.setTimeout(callback, remaining);
    };
    this.clear = function(){
        timerId = null;
        start = null;
        remaining = delay

    }
    this.resume();
  }
  