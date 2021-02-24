class MovingObject extends GameObject {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius);
        this.color = color;
        this.velocity = velocity;
    }

    draw(cnv) {
        const c = cnv.getContext('2d'); // Context
       
        c.save();

        c.beginPath();
        c.arc(this.x, this.y, this.dim, 0, Math.PI*2, false);
        c.fillStyle =  this.color;
        c.fill();
        c.closePath();

        c.restore();
    }
}