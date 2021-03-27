'use strict';

const FREQUENCIES = [125, 250, 500, 1000, 2000, 4000];

const PRESETS = [
  {'flat'          : [0, 0, 0, 0, 0, 0]},
  {'perfect'       : [9, 7, 6, 5, 7, 9]},
  {'explosion'     : [9, 7, 6, 5, 7, 4]},
  {'acoustic'      : [5, 1, 2, 3, 4, 2]},
  {'bassbooster'   : [3, 2, 1, 0, 0, 0]},
  {'bassreducer'   : [-4, -3, -1, 0, 0, 0]},
  {'deep'          : [2, 1, 3, 2, 1, -2]},
  {'hiphop'        : [2, 3, -2, -2, 2, -1]},
  {'latin'         : [0, 0, -2, -2, -2, 0]},
  {'loudness'      : [0, 0, -2, 0, -1, -5]},
  {'lounge'        : [-1, -2, 4, 2, 0, -2]},
  {'piano'         : [0, 2, 3, 1, 3, 4]},
  {'rb'            : [6, 2, -3, -2, 2, 3]},
  {'treblebooster' : [0, 0, 0, 1, 3, 4]},
  {'trablereducer' : [0, 0, 0, -2, -3, -4]}
];

class GraphicEqualizer extends X.Effector {
  constructor(context) {
    super(context);

    this.context = context;

    this.filters = new Array(FREQUENCIES.length);

    for (let i = 0, len = this.filters.length; i < len; i++) {
      this.filters[i]                 = this.context.createBiquadFilter();
      this.filters[i].type            = 'peaking';
      this.filters[i].frequency.value = FREQUENCIES[i];
      this.filters[i].Q.value         = 2;
      this.filters[i].gain.value      = 0;
    }

    this.input.connect(this.filters[0]);

    for (let i = 0, len = this.filters.length; i < len; i++) {
      if (i < len - 1) {
        this.filters[i].connect(this.filters[i + 1]);
      } else {
        this.filters[i].connect(this.output);
      }
    }
  }

  param(key, value) {
    const k = parseFloat(key);

    const index = FREQUENCIES.indexOf(k);

    if (index === -1) {
      return;
    }

    const v = parseFloat(value);

    const mindB = -24;
    const maxdB =  24;

    if (v >= mindB && v <= maxdB) {
      this.filters[index].gain.value = v;
    }
  }
}
