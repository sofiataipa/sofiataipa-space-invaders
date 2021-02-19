// Player
class Player {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        // this.image = new Image;
        // this.image.src = './assets/Rapaz parte de cima.png';
        // c.webkitImageSmoothingEnabled = false;
        // c.mozImageSmoothingEnabled = false;
        // c.msImageSmoothingEnabled = false;
        // c.imageSmoothingEnabled = false;
    }

    draw() {
        playerElement.show();
        playerElement[0].style.left = `${this.x}px`;
        playerElement[0].style.top = `${this.y+this.h/2}px`;
        
        // c.beginPath();
        // //c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        // c.rect(this.x-this.w/2, this.y, this.w, this.h);
        // //c.drawImage(this.image, this.x-this.w/2, this.y, this.w, this.h);
        // c.strokeStyle = this.color;
        // c.stroke();
        // c.fillStyle = 'rgba(0,0,0,0)';
        // //c.fillStyle = this.color;
        // c.fill();
    }

    update(e, cnv) {
        if(e.targetTouches !== undefined ) {
            let touchX = e.targetTouches[0].pageX;
            if(touchX > this.w/2 && touchX < cnv.width - this.w/2 ) { 
                this.x = touchX;
            }
           
        }
        
        if(e.clientX > this.w/2 && e.clientX < cnv.width - this.w/2 ) {
            this.x = e.clientX;  
        } 
    }
}