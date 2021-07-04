class Rectangle{
    constructor(thickness, color, startX, startY){
        this.thickness = thickness;
        this.color = color;
        this.shapeType = "rectangle";
        this.startX = startX;
        this.startY = startY;
        this.points = [];
    }

    render(ctx, e){
        ctx.globalCompositeOperation='destination-over';
        ctx.lineWidth = this.thickness;
        ctx.lineCap = "round";
        let cdLength = this.points.length; 
        let startX = this.startX;
        let startY = this.startY;
        let x = cdLength <= 1 ? startX : this.points[cdLength-1]['x'];
        let y = cdLength <= 1 ? startY : this.points[cdLength-1]['y'];
        console.log(x, y);

        //for cleaning old re-render
        if (startX < x){
            if (startY < y) ctx.clearRect(startX, startY, x, y);
            else ctx.clearRect(startX - 10, startY, maxX, minY - startY - 10);
        }else{
            if (startY < y) ctx.clearRect(startX, startY, minX - startX - 10 , y);
            else ctx.clearRect(startX, startY, minX - startX - 10, minY - startY - 10);
        }

        //for removing extra lines left while resizing!
        if (startX < x){
            if (startY < y){
            ctx.clearRect(startX - 10, y, x, maxY);
            ctx.clearRect(x, startY - 10, maxX, y);
            }
            else {
            console.log("topl");
            ctx.clearRect(startX - 10, y, x, minY - startY - 10);
            ctx.clearRect(x, startY - 10, minX, y);
            }
        }else{
            if (startY < y) {
            ctx.clearRect(startX + 10, y, minX - startX - 10, maxY);
            ctx.clearRect(x, startY - 10, minX - startX - 10, y);
            }
            else {
            ctx.clearRect(startX + 10, y, minX - startX - 20, maxY);
            ctx.clearRect(startX + 10, y, minX - startX - 20, minY - startY);
            
            }
        }

        // ctx.clearRect(startX - 10, y, x, maxY);
        // ctx.clearRect(x, startY - 10, maxX, y);

        const width = e.clientX - startX;
        const height = e.clientY - startY;
        ctx.rect(startX, startY, width, height);
        ctx.strokeStyle = penColor;
        ctx.stroke();   
        ctx.beginPath();
        if (e.clientX > maxX) maxX = e.clientX;
        else if (e.clientX < minX) minX = e.clientX;
        if (e.clientY > maxY) maxY = e.clientY;
        else if (e.clientY < minY) minY = e.clientY;
        this.points.push({ x: e.clientX, y: e.clientY });
    }
}