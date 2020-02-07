class IssuingBookWork {
    
    constructor() {
        this.gridIssuingBookWork = null;
        this.container = null;
        this.parent = null;
        
    }
    
    init(container,parent){
        
        this.container = container;
        this.parent = parent;
        $(this.container).html("");
        console.log(this);
    }
    
    finalizeApplication(){
        this.gridIssuingBookWork = null;
        this.container = null;
        this.parent = null;
    }
    
    set setParent(parent){
        this.parent = parent;
    }
    
    get getParent () {
        return this.parent;
    }
}