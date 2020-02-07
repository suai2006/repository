class Orders{
    
    constructor() {   
        
        this.gridOrders = null;
        this.container = null;
        this.parent = null;
    }
    
    init(container,parent){
        this.container = container;
        this.parent = parent;        
        $(this.container).html("");
        
        this.gridOrders = new AppGrid({
            name: "",
            editable: true,
            selectable: false,
            sorted: true,
            filtered: true,
            scaled: true,
            resizeable: false,
            customized: false,
            closeEdit: true,
            noAdd:true,
            parentElem: this.container,
            editTitle: "Приказы",
            parentId: this.parent,
            getItemSuffix:"get_order",
            editSuffix:"set_order",
            errorHandler : (jqxhr, text, error, parentElem)=>{
                
                let es = jqxhr.responseText;
                if(es.substr(0, 1) == "{") es = JSON.parse(es).text;          
                s = `<div class='grid-data_error'>
                    <div class='ui icon error message error_msg'>
                        <i class="exclamation triangle icon"></i>
                        <div class="content">                                
                            <div class="header">${error}</div>
                            <pre>${es}</pre>                                                                    
                        </div>
                    </div>
                </div>`;               
                $(parentElem).html(s);
            }
        });
        
        this.gridOrders.gridForm = (item_data)=>{
            this.itemData = item_data;
            let s = "";
            s += `<div class='three fields'>
                    <div class='field'>
                        <label>Номер приказа</label>
                        <input type='text' name='num' placeholder='Номер приказа'>
                    </div>
                    <div class='field'>
                        <label>Примечание</label>
                        <input type='text' name='comments' placeholder='Примечание'>
                    </div>
                    <div class='field calendar date'>
                        <label>Дата приказа</label>
                        <input type='text' name='issue_date' placeholder='Дата поставки'>
                    </div>                   
                </div>`;
            return s;
        };
        
        this.gridOrders.gridClickHandler = (id, event, currentTarget) =>{
            
        };
        
        this.gridOrders.gridFormShowing = (obj) =>{
            
        };
        
        this.gridOrders.gridFromBeforeSubmit = (grid, submit_object, data)=>{
            return true;
        };
        
        this.gridOrders.grid_fetch("/webservice/app.study_docs/execute?action=list_orders", 0, "", "");
        
    }
    
    finalizeApplication(){
        this.gridOrders = null;
        this.container = null;
        this.parent = null;
    }
    
    set setParent(parent){
        this.parent = parent;
        setTimeout(() => {
            if(this.gridOrders !== null && this.gridOrders.constructor.name === "AppGrid"){
                this.gridOrders.setParentId = parent;
                this.gridOrders.grid_fetch("/webservice/app.study_docs/execute?action=list_orders", 0, "", "");
            }
        }, 0);  
    }
    
    get getParent () {
        return this.parent;
    }
}