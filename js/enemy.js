// Enemy
class Enemy {
    constructor(x, y, radius, color, velocity, palavra) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.palavra = palavra;
        
        if(this.palavra !== null) {
            this.id = palavra.replace(/[^a-zA-Z]+/g, '');
            palavrasDiv.append(`<span id="${this.id}" class="user-select-none m-0 p-0 text-light text-center palavra">${this.palavra}</span>`)
        } 
        else {
            this.id = null;
        }
    }

    draw(cnv) {
        const c = cnv.getContext('2d'); // Context

        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.fillStyle =  this.color;//'rgba(255,255,255,10)'// //'rgba(0,0,0,0)';
        //c.strokeStyle = this.color;
        //c.stroke();
        c.fill();
        c.closePath();

        if(this.palavra !== null) {
            let tag = `#${this.id}`;
            let w = parseFloat($(tag).css('width'));
            let h = parseFloat($(tag).css('height'));
            if($(tag)[0] != undefined){
                $(tag)[0].style.left = `${this.x-w/2}px`;
                $(tag)[0].style.top = `${this.y-h/2}px`;   
                // if(this.radius < 20) {   
                //     $(tag).remove();
                //     this.palavra = null;
                // }
                if(w > this.radius*2) {
                    $(tag).remove();
                    this.palavra = null;
                    this.id = null;
                }
            }
        }
    }

    update(cnv) {
        this.draw(cnv);
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}