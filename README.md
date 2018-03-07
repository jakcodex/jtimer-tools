# JTimer Tools

A simple tool for high precision code timing in the browser.

Timers are simple to create and return runtimes in milliseconds. Custom callbacks can be executed at timer start and stop. Single or multiple timers can have results aggregated to provide a wide range of statistics.

Custom external plugins can easily be created using the plugin template.

## JTimer - Simple Event Timing

### Methods
+ `JTimer(options)`
+ `JTimer.start(startCallback)`
+ `JTimer.stop(stopCallback)`
+ `JTimer.restart(startCallback)`
+ `JTimer.cancel()`
+ `JTimer.history(message, data)`

### Properties
+ `JTimer.error`
+ `JTimer.historyData`
+ `JTimer.options`
+ `JTimer.optionsTemplate`
+ `JTimer.runtime`
+ `JTimer.state`
+ `JTimer.track.start`
+ `JTimer.track.stop`

### States (valid callable methods)
+ init (cancel)
+ ready (start, cancel)
+ running (stop, cancel, restart)
+ done (restart)
+ cancelled (restart)
+ error

### Configuration Options
+ name                  Custom name for the task [default=JTimerDefault]
+ autoStart             Start timer on creation [default=true]
+ verbose               Enable verbose logging [default=false]
+ startCallback         Callback to execute upon starting the timer [default=undefined]
+ stopCallback          Callback to execute upon stopping the timer [default=undefined]

### Basic Usage

```js
var timer = new JTimer;
//  your task here
timer.stop();
//  timer.runtime is how long the task took in ms
```

### Advanced Usage

```js
var timer = new JTimer({
    name: 'MyTimer',
    verbose: true,
    startCallback: function(self) {
        //  your task here
        self.stop();
    },
    stopCallback: function(self) {
        //  your stop code here
        console.log(self.runtime);
    }
});
```

### Other Examples

```js
//  let's say you're storing many timers
var timer = {};
timer.mytimer = new JTimer;

//  some work is done here

//  you decide to stop the timer and change the stopCallback
timer.mytimer.stop(function(self) {

    //  let's delete the timer data
    delete timer.mytimer;

});
```

## JTimerAggregate - Statistics for Multiple Timer Samples

### Methods
+ `JTimerAggregate(timer, options)`
+ `JTimerAggregate.calculate()`

### Properties
+ `JTimerAggregate.apdex`
+ `JTimerAggregate.apdex.satisfied`
+ `JTimerAggregate.apdex.tolerated`
+ `JTimerAggregate.apdex.frustrated`
+ `JTimerAggregate.apdex.score`
+ `JTimerAggregate.average`
+ `JTimerAggregate.max`
+ `JTimerAggregate.mean`
+ `JTimerAggregate.median`
+ `JTimerAggregate.min`
+ `JTimerAggregate.percentiles`
+ `JTimerAggregate.range`
+ `JTimerAggregate.samples`

### Configuration Options
+ apdex                 Value to considered sample satisfied [default=disabled]
+ negative              Apdex will report dissatisfied scored [default=disabled]
+ precision             Rounding precision for calculated statistics [default=0]

### Aggregation Usage

If you're just going to restart the same timer repeatedly, you can use an internal aggregate object.

```js
var timer = new JTimer({plugins: ['aggregate']});
timer.stop();
timer.restart();
timer.stop();
//  etc
//  read internal aggregate data
timer.options.plugins.aggregate.average
timer.options.plugins.aggregate.percentiles
timer.options.plugins.aggregate.mean
timer.options.plugins.aggregate.range
```

If you need to run multiple separate timers you can aggregate their results together by providing an external aggregate object.

```js
var aggregate = new JTimerAggregate;
var timer = new JTimer({plugins: [aggregate]});
timer.stop();
var newtimer = new JTimer({plugins: [aggregate]});
newtimer.stop();
newtimer.restart();
newtimer.stop();
//  etc
//  read aggregate data
aggregate.average
aggregate.percentiles
aggregate.mean
aggregate.range
```

## Custom Plugins

Custom plugins are easy to create. A method named callback must be available and it should take the timer object as its argument. Callbacks are executed in their order in the plugin list.

See [src/plugin-example.js](src/plugin-example.js) for more information.

External plugin method
```js
var plugin = new CustomTimerPlugin;
var timer = new JTimer({plugins: [plugin]});
timer.stop();
```
