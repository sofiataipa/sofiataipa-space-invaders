class Star extends MovingObject {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);
    }

    draw(cnv) {
        const c = cnv.getContext('2d'); // Context
        
        // linear gradient from start to end of line
        let grad = c.createLinearGradient(cnv.width/2, 0, cnv.width/2, cnv.height);
        grad.addColorStop(0, "#99C5FF");
        grad.addColorStop(1, "#9334AD");

        c.globalAlpha = 0.35;
        c.fillStyle = grad;
        c.beginPath();
        c.arc(this.x, this.y, this.dim, 0, Math.PI*2);
        c.fill();
        c.closePath();

        c.beginPath();
        c.strokeStyle = grad;
        c.lineWidth = this.dim * 1.5;
        c.moveTo(this.x, this.y)
        c.lineTo(this.x, this.y - this.dim * this.velocity * 3);
        c.stroke();
        c.closePath();

        c.globalAlpha = 1;
    }

    update(cnv) {
        this.draw(cnv);
        this.y += this.velocity;

        if(this.y > cnv.height + this.dim * this.velocity * 3) {
            this.y = this.dim; // Reposition if left the screen
        }
    }

    setVelocity(vel) {
        this.velocity = vel;
    }
}