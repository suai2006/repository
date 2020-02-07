class dgTree {

    constructor(container, options = {}) {

        let defaultOptions = {
            fontName: '"Segoe UI",Tahoma,Helvetica,Arial,sans-serif',
            textSize: "14",
            linesColor: "rgba(0,0,0,0.5)",
            colorEven: "rgba(0,0,0,0.05)",
            colorHovered: "rgba(0,0,0,0.1)",
            colorActive: "#2185d0",
            textColor: "#000000de",
            textColorActive: "white",
            paddingX: 0.8,
            paddingY: 0.4,
            scrollSize: 10,
            treeBoxSize: 8,
            imageSize: 20
        };

        this.container = container;
        this.root = new treeNode(this, null, "", "");
        this.visibleNodes = [];
        this.selectedNode = null;
        this.hoveredNode = null;
        this.options = Object.assign({}, options, defaultOptions);
        this.onExpand = null;     
        this.onCollapse = null;    
        this.onContextmenu = null;
        this.onSelect = null;
        this.treeRequest = null; //Блокировка кликов при выполнении запроса
        this.onWheelScroll = null;
        this.onMouseScroll = null;

        this.canvas = document.createElement("canvas");
        
        this.canvas.classList.add("dg-tree");
        this.canvas.onmousemove = (e) => { this.mouseMove(e); };
        this.canvas.onmouseleave = (e) => { this.mouseLeave(e); };
        this.canvas.onclick = (e) => { this.mouseClick(e); };
        this.canvas.onwheel = (e) =>{this.whell(e);};
        this.canvas.oncontextmenu = (e) =>{this.mouseContextmenu(e);};
        this.container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");     

        this.fontHeight = Utils.textHeight(this.options.textSize, this.options.fontName, "W");
        this.fontWidth = this.ctx.measureText("W").width;
        this.itemPaddingX = Math.floor(this.fontWidth * this.options.paddingX);
        this.itemPaddingY = Math.floor(this.fontHeight * this.options.paddingY);
        this.itemHeight = this.fontHeight + 2 * this.itemPaddingY;
        this.size = {width: 0, height: 0};
        
        this.scrollDelta = 0;
        
        this.resize();
        this.globalResize = null;
        
    }

    remove() {  
        
        this.el.remove();
        this.el = null;
    }

    resize() {

        let s = {width: Math.floor(this.container.offsetWidth - 2), height: Math.floor(this.container.offsetHeight)};

        if(this.size.width != s.width || this.size.height != s.height) {
            this.size = s;
            this.canvas.setAttribute("width", this.size.width);
            this.canvas.setAttribute("height", this.size.height);

            this.paint();
        }

    }

    paint() {
        
        this.ctx.clearRect(0, 0, this.size.width, this.size.height);       
        
        this.scrollDelta = (this.scrollBar!==undefined)?this.scrollBar.scrollTop : 0;        
        
        // Сначала отрисовываем сами элементы
        let r = {left: 0, top: 0, width: this.size.width, height: this.itemHeight, scroll: this.scrollDelta};       
        for(var j = 0; j < this.visibleNodes.length; j++) this.visibleNodes[j].paint(j, r); 
        
        if(this.visibleNodes.length*this.itemHeight > this.canvas.clientHeight){
            this.scrollBarPaint(true);
        }else{
            this.scrollBarPaint(false);
        }
    }
    

    setMousePos(event) {
        let canvasTop = Math.floor(this.canvas.getBoundingClientRect().top)-this.scrollDelta;
        let index = Math.floor((event.clientY-canvasTop) / this.itemHeight);
        let el = null;
        if(index >= 0 && index < this.visibleNodes.length) el = this.visibleNodes[index];
        return el;

    }

    mouseMove(event) {

        let el = this.setMousePos(event);

        if(el != this.hoveredNode) {
            this.hoveredNode = el;
            this.paint();
        }
    
    }

    mouseLeave(event) {

        if(null != this.hoveredNode) {
            this.hoveredNode = null;
            this.paint();
        }

    }   
    
    whell(event){ 
        
        if(this.scrollBar === undefined)return;
        this.hoveredNode = null;
        if(event.deltaY > 0){
             this.scrollBar.scrollTop = this.scrollBar.scrollTop + this.itemHeight;
         }
         else if(event.deltaY < 0){
             this.scrollBar.scrollTop = this.scrollBar.scrollTop - this.itemHeight;
         }
    }
    
    
    scrollBarPaint(flag){
        // Переделал на не кастомизированный скорлл вышло проще и работает как надо
        // И для однобразия скролов
        
        if(flag){
            this.scrollBar = document.querySelector("#odb_treeView_ScrollBar");
            if(this.scrollBar === null){
                this.scrollBar = document.createElement("div");
                this.scrollBar.id = "odb_treeView_ScrollBar";
                this.scrollBar.className = "odb_treeView_ScrollBar";
                this.scrollBar.innerHTML = "<div class='slider'></div>";
                this.container.appendChild(this.scrollBar);
            }        
            let slider = this.scrollBar.firstElementChild;        
            slider.style.cssText="height:"+this.visibleNodes.length*this.itemHeight+"px;"; 
            let ctx = this.ctx;
            // Создаем место для прокрутки чистим холст
            ctx.clearRect(this.canvas.width - this.scrollBar.offsetWidth-2,0,this.canvas.width,this.canvas.height);
            this.scrollBar.onscroll=(e)=>{
                this.paint();
            };

        }
        else{
            $("#odb_treeView_ScrollBar").remove();
        }
    }
    deepEqual(a, b) {
        if (a === b) {
            return true;
        }

        if (a == null || typeof(a) != "object" ||
            b == null || typeof(b) != "object")
        {
            return false;
        }

        var propertiesInA = 0, propertiesInB = 0;
        for (var property in a) {
            propertiesInA += 1;
        }
        for (var property in b) {
            propertiesInB += 1;
            if (!(property in a) || !this.deepEqual(a[property], b[property])) {
                return false;        
            }
        }        
        return propertiesInA == propertiesInB;
    }
    
    mouseClick(event) {
        
        if(this.treeRequest !== null) return;
        let el = this.setMousePos(event);
        let canvasleft = Math.floor(this.canvas.getBoundingClientRect().left);
        
        if(el != this.selectedNode && this.selectedNode != null){
            
            if(!this.deepEqual(el.parent, this.selectedNode)){
//                this.visibleNodes
//                    .filter(c => c.expanded === true)
//                    .map((c)=>{
//                        c.collapse();
//                        return c;
//                    });
//                console.log(this.visibleNodes);
//                this.selectedNode.collapse();
            } 
            
            this.selectedNode.selected = false;
        } 
        
        this.hoveredNode = el; 
        this.selectedNode = el;
             
        if(el != null) {
            if(!el.selected){
                if(el.tree.onSelect !== null) {
                    // Раскрытие можно отменить             
                    if(!el.tree.onSelect(el)) return;           
                }
            }
            
            el.selected = true; 
           
           if(el.children.length > 0 && !el.expanded) {
                let iconX1 = el.level * this.options.imageSize, iconX2 = iconX1 + this.options.imageSize;
                if((event.clientX-canvasleft) >= iconX1 && (event.clientX-canvasleft) <= iconX2) el.expand();
                
            } 
            else if(el.children.length > 0 && el.expanded) {
                let iconX1 = el.level * this.options.imageSize, iconX2 = iconX1 + this.options.imageSize;
                if((event.clientX-canvasleft) >= iconX1 && (event.clientX-canvasleft) <= iconX2) el.collapse();
                
            } 
        }       
        
        this.paint();
    }
    
    mouseContextmenu(e){
        e.preventDefault();
        if(this.treeRequest !== null) return;
        let el = this.setMousePos(event);
        if(el != this.selectedNode && this.selectedNode != null) this.selectedNode.selected = false;
        this.hoveredNode = el; 
        this.selectedNode = el;
        if(el != null) {
            if(!el.selected){
                if(el.tree.onSelect !== null) {
                    // Раскрытие можно отменить             
                    if(!el.tree.onSelect(el)) return;           
                }
            }
            
            el.selected = true; 
            el.contextMenu();
        }else{
            
            if(this.onContextmenu !== null) {            
                // Свертывание можно отменить
                if(!this.onContextmenu(this)) return;
            }
        }
        
        this.paint();
    }

    static folderImage() {
        return "\uf07b";
    }

}

class treeNode {

    constructor(tree, parent, caption, image, userData = null, level = -1) {

        this.tree = tree;
        this.parent = parent;
        this.level = level;
        this.children = [];
        this.expanded = false;
        this.selected = false;
        
        this.caption = caption;
        this.image = image;
        this.userData = userData;

    }

    addChild(caption, image = "", userData = null) {
        
        let node = new treeNode(this.tree, this, caption, image, userData, this.level + 1);
        
        this.children.push(node);
        
        // Корневые пункты всегда добавляем к числу выбранных, и всегда в самый конец
        if(this.parent == null) {            
            this.tree.visibleNodes.push(node);
        }
        
        // Остальные только если добавляем в развернутый узел родителя
        else if(this.expanded) {
            if(this.children[0].caption === "Загружаем данные..."){
                let fIndex = this.tree.visibleNodes.indexOf(this.children[0]);
                this.tree.visibleNodes.splice(fIndex, 1); //Удаляем из видимого списка
                this.children[0].remove(); //Удаляем из списка детей
            }
            
            let index = this.tree.visibleNodes.indexOf(this);
            let childIndex = this.children.length;
            this.tree.visibleNodes.splice(index + childIndex, 0, node);
        }
        
        this.tree.paint();
        return node;

    }
 
    remove() {    
        
        if(this.parent != null) {
            let p = this.parent.children.indexOf(this);
            this.parent.children.splice(p, 1);
        }

    }

    expand() {        
        if(this.expanded) return;    
        if(this.tree.onExpand !== null) {
            // Раскрытие можно отменить      
            if(!this.tree.onExpand(this)) return;           
        }
        
        if(this.children.length == 0) return;
        
        //if(this.children.length === 1 && this.children[0] === null) return; 
        if(this.children[0] === null) return; 
        if(this.children[0].caption === "Загружаем данные..."){
            let fIndex = this.tree.visibleNodes.indexOf(this);
            this.tree.visibleNodes.splice(fIndex + 1, 0, this.children[0]);
        }
        this.expanded = true;
        this.tree.paint();
        
    }

    collapse(r = false) {        
        if(this.children.length == 0) return;
        
        if(!this.expanded) return;

        this.expanded = false;
        
        for(var j = 0; j < this.children.length; j++) {
            let p = this.tree.visibleNodes.indexOf(this.children[j]);
            if(p >= 0) this.tree.visibleNodes.splice(p, 1);
        }
        
        this.children = [];
        if(this.tree.onCollapse !== null) {            
            // Свертывание можно отменить
            if(!this.tree.onCollapse(this)) return;
        }
        
        if(r == false) this.tree.paint();

    }
    
    contextMenu(){
        if(this.tree.onContextmenu !== null) {            
            // Свертывание можно отменить
            if(!this.tree.onContextmenu(this)) return;
        }
    }

    paint(index, r) {
        
        let ctx = this.tree.ctx;
        let pIndex = this.parent.children.indexOf(this), isLast = pIndex == this.parent.children.length - 1;
        if((index % 2) && (this.tree.options.colorEven.length > 0) && !this.selected) {
            ctx.fillStyle = this.tree.options.colorEven;
            ctx.fillRect(r.left, r.top- r.scroll, r.width, r.height);
        }

        if(this.selected) {
            ctx.fillStyle = this.tree.options.colorActive;
            ctx.fillRect(r.left, r.top- r.scroll, r.width, r.height);
        }
        if(this.tree.hoveredNode == this) {
            ctx.fillStyle = this.tree.options.colorHovered;
            ctx.fillRect(r.left, r.top- r.scroll, r.width, r.height);
        }
        
        ctx.strokeStyle = this.tree.options.linesColor;

        let lx = 0.5 + r.left + this.level * this.tree.options.imageSize;
        let tx = lx + (this.tree.options.imageSize - this.tree.options.treeBoxSize) / 2;
        let ly = (0.5 + r.top + (r.height - this.tree.options.treeBoxSize) / 2) - r.scroll;        
        
        // Рисуем +/- для элементов с дочерними элементами
        if(this.children.length > 0) {
            
            // Вертикальный участок соединительной линии

            ctx.beginPath();
            ctx.moveTo(tx, ly);
            ctx.lineTo(tx + this.tree.options.treeBoxSize, ly);
            ctx.lineTo(tx + this.tree.options.treeBoxSize, ly + this.tree.options.treeBoxSize);
            ctx.lineTo(tx, ly + this.tree.options.treeBoxSize);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(tx + 2, ly + this.tree.options.treeBoxSize / 2);
            ctx.lineTo(tx + this.tree.options.treeBoxSize - 2, ly + this.tree.options.treeBoxSize / 2);
            ctx.stroke();

            if(!this.expanded) {
                ctx.beginPath();
                ctx.moveTo(tx + this.tree.options.treeBoxSize / 2, ly + 2);
                ctx.lineTo(tx + this.tree.options.treeBoxSize / 2, ly + this.tree.options.treeBoxSize - 2);
                ctx.stroke();
            }

            // Вертикальные соединители
            ctx.beginPath();
            ctx.moveTo(tx + this.tree.options.treeBoxSize / 2, r.top - r.scroll);
            ctx.lineTo(tx + this.tree.options.treeBoxSize / 2, ly);
            ctx.stroke();

            if(!isLast) {
                ctx.beginPath();
                ctx.moveTo(tx + this.tree.options.treeBoxSize / 2, ly + this.tree.options.treeBoxSize);
                ctx.lineTo(tx + this.tree.options.treeBoxSize / 2, (r.top + r.height) - r.scroll);
                ctx.stroke();
            }
            // Дорисовываем вертикальный соединитель, если он был пропущен в предыдущих пунктах
            let p = this.parent.children.indexOf(this);            
            if(p > 0) {                
                let prevP = this.tree.visibleNodes.indexOf(this.parent.children[p - 1]);
                if(prevP < index - 1) {
                    ctx.beginPath();
                    ctx.moveTo(tx + this.tree.options.treeBoxSize / 2, ((r.top - (index - prevP) * this.tree.itemHeight)+this.tree.itemHeight) - r.scroll);
                    ctx.lineTo(tx + this.tree.options.treeBoxSize / 2, r.top - r.scroll);
                    ctx.stroke();
                }
            }

        }
        else {
            
            // Горизонтальный участок соединительной линии
            ctx.beginPath();
            ctx.moveTo(tx + this.tree.options.treeBoxSize / 2, ly + this.tree.options.treeBoxSize / 2);
            ctx.lineTo(lx + this.tree.options.imageSize - 2, ly + this.tree.options.treeBoxSize / 2);
            ctx.stroke();

            // Вертикальные соединители
            ctx.beginPath();
            ctx.moveTo(tx + this.tree.options.treeBoxSize / 2, r.top - r.scroll);
            ctx.lineTo(tx + this.tree.options.treeBoxSize / 2, ly + this.tree.options.treeBoxSize / 2);
            ctx.stroke();

            if(!isLast) {
                ctx.beginPath();
                ctx.moveTo(tx + this.tree.options.treeBoxSize / 2, ly + this.tree.options.treeBoxSize / 2);
                ctx.lineTo(tx + this.tree.options.treeBoxSize / 2, (r.top + r.height) - r.scroll);
                ctx.stroke();
            }
            // Дорисовываем вертикальный соединитель, если он был пропущен в предыдущих пунктах
            let p = this.parent.children.indexOf(this);            
            if(p > 0) {                
                let prevP = this.tree.visibleNodes.indexOf(this.parent.children[p - 1]);
                if(prevP < index - 1) {
                    ctx.beginPath();
                    ctx.moveTo(tx + this.tree.options.treeBoxSize / 2, (r.top - (index - prevP) * this.tree.itemHeight) - r.scroll);
                    ctx.lineTo(tx + this.tree.options.treeBoxSize / 2, r.top - r.scroll);
                    ctx.stroke();
                }
            }
        }       
        
        lx += this.tree.options.imageSize;

        ctx.fillStyle = this.selected ? this.tree.options.textColorActive : this.tree.options.textColor;

        // Рисуем пиктограмму        
        if(this.image !== ""){
            ctx.beginPath();
            ctx.font = this.tree.options.textSize + "px " + "Icons";
            ctx.fillText(this.image, lx, (r.top + r.height - this.tree.itemPaddingY) - r.scroll);
            ctx.closePath();
            ctx.stroke();
            lx += this.tree.options.imageSize;
        }
        

        // Рисуем заголовок
        ctx.beginPath();
        ctx.font = this.tree.options.textSize + "px " + this.tree.options.fontName;
        ctx.fillText(this.caption, lx, (r.top + r.height - this.tree.itemPaddingY) - r.scroll);
        ctx.closePath();
        
        r.top += this.tree.itemHeight;

    }

}
