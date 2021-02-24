// Enemy
class Enemy extends MovingObject {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
    }

    update(cnv) {
        this.draw(cnv);
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}