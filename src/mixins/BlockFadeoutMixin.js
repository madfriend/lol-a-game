const MAX_FRAME_COUNT = 120;

export const BlockFadeoutMixin = {
    preDraw () {
        if (!this._frameCounter) this._frameCounter = 0;
        this._frameCounter++;
    },

    draw (screen) {
        if (this._frameCounter >= MAX_FRAME_COUNT) return;

        screen.globalAlpha = 1 / (this._frameCounter % MAX_FRAME_COUNT);

        screen.fillStyle = this.color;

        screen.shadowColor = this.shadowColor;
        screen.shadowBlur = 4;
        screen.shadowOffsetY = 1;

        const diff = this._frameCounter;

        screen.fillRect(
          this.x - diff,
          this.y - diff,
          this.width + diff * 2,
          this.height + diff * 2
        );

        screen.globalAlpha = 1;
    },

    isVisible () {
        return this._frameCounter <= MAX_FRAME_COUNT;
    },

    isStatic () {
        return false;
    },

    collidesWithBall () {
        return false;
    }

};