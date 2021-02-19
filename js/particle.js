// Particle
class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = (radius - 1) * Math.random() + 1;
        this.color = color;
        this.velocity = { 
            x: (Math.random() - 0.5) * (Math.random() * (6 - 0) + 0),
            y: (Math.random() - 0.5) * (Math.random() * (6 - 0) + 0)
        };
        this.alpha = 1;
        //this.pastXY = [];
    }

    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();

        // // Trail effect
        // let a = 0.7;
        // for(let i=this.pastXY.length-1; i>=0; i--) {
        //     if(a > 0) {
        //         let r = parseInt(this.color.slice(1, 3), 16);
        //         let g = parseInt(this.color.slice(3, 5), 16);
        //         let b = parseInt(this.color.slice(5, 7), 16);
        //         c.fillStyle = `rgba(${r},${g},${b}, ${a})`;
        //         c.arc(this.pastXY[i][0], this.pastXY[i][1], this.radius, 0, Math.PI*2, false); 
        //         a -= 0.08;
        //         c.fill();
        //     }
        //     else {
        //         this.pastXY.splice(i, 1);
        //     }
        // }
        c.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
        //this.pastXY.push([this.x, this.y]);
    }
}