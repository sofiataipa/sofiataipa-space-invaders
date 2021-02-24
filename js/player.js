// Player
class Player extends GameObject{
    constructor(x, y, w) {
        super(x, y, w);
    }

    draw() {
        playerElement.show();
        playerElement[0].style.left = `${this.x - this.dim/2}px`;
        playerElement[0].style.top = `${this.y}px`;
    }

    update(e, cnv) {
        if(e.targetTouches !== undefined ) {
            let touchX = e.targetTouches[0].pageX;
            if(touchX > this.dim/2 && touchX < cnv.width - this.dim/2) { 
                this.x = touchX;
            }
        }
        
        if(e.clientX > this.dim/2 && e.clientX < cnv.width - this.dim/2 ) {
            this.x = e.clientX;  
        } 
    }

    resetPos(cnv) {
        playerElement[0].style.left = `${cnv.width/2}px`;
        playerElement[0].style.top = `${this.y}px`;
    }
}