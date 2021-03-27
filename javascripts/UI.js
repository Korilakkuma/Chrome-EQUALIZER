'use strict';

class UI {
  constructor(canvas, context) {
    this.canvas  = canvas;
    this.context = context;
  }

  drawCircle(x, y, isMouseDown) {
    const radius = isMouseDown ? 24 : 12;

    this.context.fillStyle = '#fdfdfd';
    this.context.beginPath();
    this.context.arc(Math.floor(x), Math.floor(y), radius, 0, 2 * Math.PI, true);
    this.context.fill();
  }

  drawLine(startX, startY, endX, endY) {
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#fdfdfd';
    this.context.beginPath();
    this.context.moveTo(Math.floor(startX), Math.floor(startY));
    this.context.lineTo(Math.floor(endX), Math.floor(endY));
    this.context.stroke();
  }

  drawCross(text, x, y) {
    const {'width' : w, 'height' : h} = this.canvas;
    const offset = 24;

    this.context.fillStyle = '#fdfdfd';
    this.context.fillRect(x, h, 1, -(h - offset));
    this.context.fillRect(0, y, w, 1);

    const fontSize = 16;

    this.context.font      = `${fontSize}px 'Lato'`;
    this.context.fillStyle = '#fdfdfd';
    this.context.textAlign = 'center';
    this.context.fillText(text, x, fontSize);
  }
}
