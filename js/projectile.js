// Projectile
class Projectile extends MovingObject {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color, velocity);

        this.pastY = [];
        this.image = new Image;
        this.image.src = './assets/fire.png';
        this.w = this.dim * 1.5
    }

    draw(cnv) {
        const c = cnv.getContext('2d'); // Context

        c.beginPath();

        let a = 0.7;
        for(let i=this.pastY.length; i>=0; i--) {
            if(a > 0) {
                var rgb = this.color.match(/\d+/g);
                let r = rgb[0];
                let g = rgb[1];
                let b = rgb[2];
                c.fillStyle = `rgba(${r},${g},${b}, ${a})`;
                c.arc(this.x, this.pastY[i], this.dim, 0, Math.PI*2, false); 
                a -= 0.08;
                c.fill();
            }
            else {
                this.pastY.splice(i, 1);
            }
        }
        c.closePath();

        c.beginPath();

        c.arc(this.x, this.y, this.dim, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();

        c.drawImage(this.image, this.x-this.w, this.y-this.w, this.w*2, this.w*2);
        
        // Create a trail effect
        c.closePath();
    }

    update(cnv) {
        this.draw(cnv);
        this.y = this.y - this.velocity;
        // Saves the last y position to create a trail effect
        this.pastY.push(this.y);
    }
}