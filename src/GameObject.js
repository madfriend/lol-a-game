export class GameObject {
    constructor (...args) {
        this._initArgs = args;
    }

    isStatic () { return true; }

    isVisible () { return this.isStatic; }

    preDraw (newState) {}

    draw (screen) {}

    isVisible (x1, y1, x2, y2) { return true; }

    copy (cls) {
        return new this.constructor(...this._initArgs);
    }

    addMixin (mixin) {
        for (let prop in mixin) {
            this[prop] = mixin[prop].bind(this);
        }
    }
}