'use strict';

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript(null, {
    'code' :`
      X.setup().catch(error => error).finally(() => {
        const video = document.querySelector('video');

        if (!video) {
          return;
        }

        const visualizerCanvasId = 'visualizer-canvas';
        const controllerCanvasId = 'controller-canvas';
        const selectPresetId     = 'select-preset';

        let visualizerCanvas = document.getElementById(visualizerCanvasId);
        let controllerCanvas = document.getElementById(controllerCanvasId);
        let select           = document.getElementById(selectPresetId);

        if (visualizerCanvas && controllerCanvas && select) {
          if (visualizerCanvas.getAttribute('hidden') && controllerCanvas.getAttribute('hidden') && select.getAttribute('hidden')) {
            visualizerCanvas.removeAttribute('hidden');
            controllerCanvas.removeAttribute('hidden');
            select.removeAttribute('hidden');
          } else {
            visualizerCanvas.setAttribute('hidden', 'hidden');
            controllerCanvas.setAttribute('hidden', 'hidden');
            select.setAttribute('hidden', 'hidden');
          }

          return;
        }

        const equalizer = new GraphicEqualizer(X.get());

        X('media')
          .setup({
            media   : video,
            autoplay: true
          })
          .install('graphicequalizer', equalizer);

        // for Visualizer
        visualizerCanvas = document.createElement('canvas');

        visualizerCanvas.width  = window.innerWidth;
        visualizerCanvas.height = window.innerHeight;

        visualizerCanvas.id = visualizerCanvasId;

        document.body.appendChild(visualizerCanvas);

        X('media')
          .module('analyser')
          .domain('fft')
          .setup(visualizerCanvas)
          .state(true)
          .param({
            interval: 'auto',
            shape   : 'rect',
            wave    : '#ff0100',
            width   : 1,
            grid    : 'none',
            text    : 'none',
            top     : 0,
            right   : 0,
            bottom  : 0,
            left    : 0
          });

        // for Graphic Equalizer
        controllerCanvas = document.createElement('canvas');

        controllerCanvas.width  = window.innerWidth;
        controllerCanvas.height = window.innerHeight;

        controllerCanvas.id = controllerCanvasId;

        document.body.appendChild(controllerCanvas);

        const middle      = Math.floor(controllerCanvas.height / 2);
        const fftSize     = X('media').module('analyser').param('fftSize');
        const fsDivN      = X.SAMPLE_RATE / fftSize;
        const drawnSize   = X('media').module('analyser').domain('fft').param('size');
        const f125        = FREQUENCIES[0] / fsDivN;
        const f250        = FREQUENCIES[1] / fsDivN;
        const f500        = FREQUENCIES[2] / fsDivN;
        const f1000       = FREQUENCIES[3] / fsDivN;
        const f2000       = FREQUENCIES[4] / fsDivN;
        const f4000       = FREQUENCIES[5] / fsDivN;
        const widthOfRect = controllerCanvas.width / drawnSize;

        let f125X  = Math.floor(widthOfRect * f125);
        let f250X  = Math.floor(widthOfRect * f250);
        let f500X  = Math.floor(widthOfRect * f500);
        let f1000X = Math.floor(widthOfRect * f1000);
        let f2000X = Math.floor(widthOfRect * f2000);
        let f4000X = Math.floor(widthOfRect * f4000);

        let f125Y  = middle;
        let f250Y  = middle;
        let f500Y  = middle;
        let f1000Y = middle;
        let f2000Y = middle;
        let f4000Y = middle;

        let isMouseDown = false;

        const onMousedown = () => {
            isMouseDown = true;
        };

        const onMousemove = event => {
          // const x = event.pageX - window.pageXOffset;
          // const y = event.pageY - window.pageYOffset;

          const { clientX: x, clientY: y } = event;

          const { width: w, height: h } = controllerCanvas;

          const maxdB = 24;
          const rate  = (middle - y) / middle;
          const dB    = rate * maxdB;

          const className = 'onController';

          controllerCanvas.classList.remove(className);

          context.clearRect(0, 0, w, h);

          // Draw controllers

          // 125 Hz
          ui.drawLine(0, middle, f125X, f125Y);
          ui.drawCircle(f125X, f125Y, false);

          if (context.isPointInPath(x, y)) {
            controllerCanvas.classList.add(className);

            ui.drawCross((FREQUENCIES[0] + ' Hz ' + Math.floor(dB) + ' dB'), x, y);

            if (isMouseDown) {
              ui.drawLine(0, middle, f125X, y);
              ui.drawCircle(f125X, y, true);

              f125Y = y;

              X('media').module('graphicequalizer').param(FREQUENCIES[0], 2 * dB);
            }
          }

          // 250 Hz
          ui.drawLine(f125X, f125Y, f250X, f250Y);
          ui.drawCircle(f250X, f250Y, false);

          if (context.isPointInPath(x, y)) {
            controllerCanvas.classList.add(className);

            ui.drawCross((FREQUENCIES[1] + ' Hz ' + Math.floor(dB) + ' dB'), x, y);

            if (isMouseDown) {
              ui.drawLine(f125X, f125Y, f250X, y);
              ui.drawCircle(f250X, y, true);

              f250Y = y;

              X('media').module('graphicequalizer').param(FREQUENCIES[1], dB);
            }
          }

          // 500 Hz
          ui.drawLine(f250X, f250Y, f500X, f500Y);
          ui.drawCircle(f500X, f500Y, false);

          if (context.isPointInPath(x, y)) {
            controllerCanvas.classList.add(className);

            ui.drawCross((FREQUENCIES[2] + ' Hz ' + Math.floor(dB) + ' dB'), x, y);

            if (isMouseDown) {
              ui.drawLine(f250X, f250Y, f500X, y);
              ui.drawCircle(f500X, y, true);

              f500Y = y;

              X('media').module('graphicequalizer').param(FREQUENCIES[2], dB);
            }
          }

          // 1000 Hz
          ui.drawLine(f500X, f500Y, f1000X, f1000Y);
          ui.drawCircle(f1000X, f1000Y, false);

          if (context.isPointInPath(x, y)) {
            controllerCanvas.classList.add(className);

            ui.drawCross((FREQUENCIES[3] + ' Hz ' + Math.floor(dB) + ' dB'), x, y);

            if (isMouseDown) {
              ui.drawLine(f500X, f500Y, f1000X, y);
              ui.drawCircle(f1000X, y, true);

              f1000Y = y;

              X('media').module('graphicequalizer').param(FREQUENCIES[3], dB);
            }
          }

          // 2000 Hz
          ui.drawLine(f1000X, f1000Y, f2000X, f2000Y);
          ui.drawCircle(f2000X, f2000Y, false);

          if (context.isPointInPath(x, y)) {
            controllerCanvas.classList.add(className);

            ui.drawCross((FREQUENCIES[4] + ' Hz ' + Math.floor(dB) + ' dB'), x, y);

            if (isMouseDown) {
              ui.drawLine(f1000X, f1000Y, f2000X, y);
              ui.drawCircle(f2000X, y, true);

              f2000Y = y;

              X('media').module('graphicequalizer').param(FREQUENCIES[4], dB);
            }
          }

          // 4000 Hz
          ui.drawLine(f2000X, f2000Y, f4000X, f4000Y);
          ui.drawCircle(f4000X, f4000Y, false);

          if (context.isPointInPath(x, y)) {
            controllerCanvas.classList.add(className);

            ui.drawCross((FREQUENCIES[5] + ' Hz ' + Math.floor(dB) + ' dB'), x, y);

            if (isMouseDown) {
              ui.drawLine(f2000X, f2000Y, f4000X, y);
              ui.drawCircle(f4000X, y, true);

              f4000Y = y;

              X('media').module('graphicequalizer').param(FREQUENCIES[5], dB);
            }
          }

          ui.drawLine(f4000X, f4000Y, controllerCanvas.width, middle);
        };

        const onMouseup = () => {
          isMouseDown = false;
        };

        const context = controllerCanvas.getContext('2d');

        const ui = new UI(controllerCanvas, context);

        ui.drawLine(0, f125Y, f125X, f125Y);
        ui.drawLine(f125X, f250Y, f250X, f250Y);
        ui.drawLine(f250X, f500Y, f500X, f500Y);
        ui.drawLine(f500X, f1000Y, f1000X, f1000Y);
        ui.drawLine(f1000X, f2000Y, f2000X, f2000Y);
        ui.drawLine(f2000X, f4000Y, f4000X, f4000Y);
        ui.drawLine(f4000X, middle, controllerCanvas.width, middle);

        ui.drawCircle(f125X, f125Y, false);
        ui.drawCircle(f250X, f250Y, false);
        ui.drawCircle(f500X, f500Y, false);
        ui.drawCircle(f1000X, f1000Y, false);
        ui.drawCircle(f2000X, f2000Y, false);
        ui.drawCircle(f4000X, f4000Y, false);

        controllerCanvas.addEventListener('mousedown', onMousedown, false);
        controllerCanvas.addEventListener('mousemove', onMousemove, true);
        controllerCanvas.addEventListener('mouseup', onMouseup, false);

        // const onPopstate = () => {
        //   document.body.removeChild(visualizerCanvas);
        //   document.body.removeChild(controllerCanvas);

        //   window.removeEventListener('popstate', onPopstate, false);
        // };

        // window.addEventListener('popstate', onPopstate, false);

        const onResize = () => {
          const { innerWidth: width, innerHeight: height } = window;

          visualizerCanvas.width  = width;
          visualizerCanvas.height = height;

          controllerCanvas.width  = width;
          controllerCanvas.height = height;

          window.removeEventListener('resize', onResize, false);
        };

        window.addEventListener('resize', onResize, false);

        select = document.createElement('select');

        select.id = selectPresetId;

        const fragment = document.createDocumentFragment();

        PRESETS.forEach(preset => {
          const option = document.createElement('option');

          option.value       = Object.keys(preset)[0];
          option.textContent = Object.keys(preset)[0].toUpperCase();

          fragment.appendChild(option);
        });

        select.appendChild(fragment);

        document.body.appendChild(select);

        const onChangePreset = event => {
          const preset       = PRESETS[event.currentTarget.selectedIndex];
          const presetName   = Object.keys(preset)[0];
          const presetValues = preset[presetName]

          for (let i = 0, len = presetValues.length; i < len; i++) {
            X('media').module('graphicequalizer').param(FREQUENCIES[i], presetValues[i] * 1.5);

            const maxdB = 40;
            const y     = -((presetValues[i] / maxdB) * middle) + middle;

            switch (i) {
              case 0:
                f125Y = y
                break;
              case 1:
                f250Y = y;
                break;
              case 2:
                f500Y = y;
                break;
              case 3:
                f1000Y = y;
                break;
              case 4:
                f2000Y = y;
                break;
              case 5:
                f4000Y = y;
                break;
              default:
                break;
            }

            const mouseEvent = document.createEvent('Event');

            mouseEvent.initEvent('mousemove', true, true);
            controllerCanvas.dispatchEvent(mouseEvent);
          }
        };

        select.addEventListener('change', onChangePreset, false);
      });
    `
  });
});
