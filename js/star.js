class Star {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(cnv) {
        const c = cnv.getContext('2d'); // Context

        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fill();
        c.closePath();

        c.beginPath();
        c.strokeStyle = this.color;
        c.lineWidth = this.radius * this.velocity * 0.6;
        c.moveTo(this.x, this.y)
        c.lineTo(this.x, this.y - this.radius * 5);
        c.stroke();
        c.closePath();
    }

    update(cnv, ) {
        this.draw(cnv);
        this.y += this.velocity;

        if(this.y > cnv.height + this.radius) {
            this.y = this.radius; // Reposition if left the screen
        }
    }

    setVelocity(vel) {
        this.velocity = vel;
    }
}