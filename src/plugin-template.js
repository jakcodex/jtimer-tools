//
//  This is a template plugin for JTimer.
//  You would insert your plugin code to the CustomTimerPlugin.calculate() method. It will be executed every time a new sample is recorded.
//  This is conveniently located at the top of the file! Line 10 :)
//  Check out JTimerAggregate in jtimer.js to see a simple plugin that calculates statistics on samples
//
class CustomTimerPlugin {

    //  calculate the sample average
    calculate() {

        //  your code to process the samples
        //  this.samples contains all recorded values
        //  if running JTimer with an internal plugin, this.timer is accessible here

    }

    //  build the timer aggregate
    constructor(timer, options) {

        this.options = options;
        if ( typeof timer === 'object' && !(timer instanceof JTimer) ) {

            this.options = timer;
            timer = undefined;

        }

        if ( typeof this.options !== 'object' ) this.options = {};

        try {

            if ( typeof this.options !== 'object' ) throw 'Supplied options is not a valid type';

            //  automatically run the aggregate if a timer is supplied
            if ( typeof timer === 'object' && !(timer instanceof JTimer) ) throw "Supplied timer is not a valid timer";

        } catch (e) {

            this.state = 'error';
            this.error = e;
            if ( ['string', 'number', 'boolean', 'object'].indexOf(typeof e) === -1 ) throw 'TimerPlugin/Error - invalid error message';
            console.error(e);
            return;

        }

        this.timer = timer;
        this.samples = [];

    }

    //  receive a timer callbackup
    callback(timer) {

        try {

            if ( timer instanceof JTimer ) {

                //  state must be done
                if ( this.timer instanceof JTimer ) throw "Timer was supplied at construction";
                this.timer = timer;

            } else this.timer = {options:{}};

            //  state must be done
            if ( this.timer.state !== 'done' ) throw "Supplied timer is not in a valid state";

        } catch (e) {

            this.state = 'error';
            this.error = e;
            if ( ['string', 'number', 'boolean', 'object'].indexOf(typeof e) === -1 ) throw 'Plugin/Error - ' + this.timer.options.name + ' - invalid error message';
            console.error('Plugin/Error - ' + ( this.timer.options.name || 'Unknown') + ' - ' + e);
            return;

        }

        //  push the new sample
        this.samples.push(this.timer.runtime);
        this.calculate();

        //  remove the timer if it was provided at runtime
        if ( timer instanceof JTimer ) delete this.timer;

    }

    //  precision rounding
    round(number, precision) {

        if ( typeof precision !== 'number' ) precision = this.options.precision;
        if ( typeof precision !== 'number' ) precision = 0;
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;

    }

}
