// Particle
class Particle extends MovingObject {
    constructor(x, y, r, color) {

        let radius = (r - 1) * Math.random() + 1;
        let velocity = { 
            x: (Math.random() - 0.5) * (Math.random() * (6 - 0) + 0),
            y: (Math.random() - 0.5) * (Math.random() * (6 - 0) + 0)
        };
        super(x, y, radius, color, velocity);
        this.alpha = 1;
    }

    draw(cnv) {
        const c = cnv.getContext('2d'); // Context
        c.save();
        c.globalAlpha = this.alpha;
        super.draw(cnv);
        c.restore();
    }

    update(cnv) {
        this.draw(cnv);
        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}