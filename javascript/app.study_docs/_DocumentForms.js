class DocumentForms{
   
    constructor() {
       
        this.gridDocForm = null;
        this.container = null;
        this.parent = null;
   }
   
   init(container,parent){
       
       this.container = container;
       this.parent = parent;
       $(this.container).html("");    
       
       this.gridDocForm = new AppGrid({
            name: "",
            editable: true,
            selectable: false,
            sorted: true,
            filtered: true,
            scaled: true,
            resizeable: false,
            customized: false,
            closeEdit: true,
            parentElem: this.container,
            editTitle: "Бланки документов",
            parentId: this.parent,
            getItemSuffix:"get_bp",
            editSuffix:"set_bp",
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
       //$('#appContainer #gridview .grid-nav .stub .right-buttons').html("<div class='ui add-grid-button mini primary labeled icon button'><i class='icon add'></i>Добавить</div>");
       
        this.gridDocForm.gridForm = (item_data)=>{
            this.itemData = item_data;
            let s = "";
            s += `<div class='five fields'>
                    <div class='field'>
                        <label>Серия</label>
                        <input type='text' name='serie' placeholder='Серия'>
                    </div>
                    <div class='field'>
                        <label>Начальный номер бланка</label>
                        <input type='text' name='num_from' placeholder='Начальный номер бланка'>
                    </div>
                    <div class='field'>
                        <label>Конечный номер бланка</label>
                        <input type='text' name='num_to' placeholder='Конечный номер бланка'>
                    </div>
                    <div class='field'>
                        <label>Поставщик</label>
                        <input type='text' name='accept_from' placeholder='Поставщик'>
                    </div>
                    <div class='calendar date field'>
                        <label>Дата поставки</label>
                        <input type='text' name='accept_date' placeholder='Дата поставки'>
                    </div>
                </div>`;
            s += ` <div class='field' id='type_id'>
                        <label>Вид документа об образовании </label>
                        <select class='ui fluid dropdown' multiple name='type_id'>
                            <option value=''>Вид документа об образовании</option>
                        </select>
                    </div>
                    <div class='field' id='stage_id'>
                        <label>Уровень образования</label>
                        <select class='ui fluid dropdown' name='stage_id' disabled>
                            <option value=''>Уровень образования</option>
                        </select>
                    </div>`;
            return s;
        };
       
       this.gridDocForm.gridClickHandler = (id, event, currentTarget)=>{           
           
       };
       
       this.gridDocForm.gridFormShowing = (obj)=>{
           
            
            $("#gridDialog").addClass("medium mb-doc_form");
            $("#gridDialog .content").append("<div id='currentDocForm'></div>");
            
            $("#gridDialog.mb-doc_form").find(".selection.dropdown").each((i,dropdown)=>{
                let name = $(dropdown).find("select").attr("name");
                $(dropdown).dropdown("set selected",this.itemData["_"+name].split(","));             
            });
            let $selection1 = $("#gridDialog.mb-doc_form").find("#type_id .selection.dropdown");
            let $selection2 = $("#gridDialog.mb-doc_form").find("#stage_id .selection.dropdown");
            function unique(arr) {
                let result = [];

                for (let str of arr) {
                  if (!result.includes(str)) {
                    result.push(str);
                  }
                }

                return result;
            }
            $selection1.dropdown({
                action:"combo",
                onChange: (value, text, $selectedItem) => {
                    let name = $selection1.find("select").attr("name");
                    let stage_id_val = value.filter((c)=>{
                        console.log(c,this.itemData[name].selection,);
                        return c;
                    });
                    
                    console.log(value, text, $selectedItem,stage_id_val,$selection2);
                }
            });
            this.curentBlank =new AppGrid({
                name: "",
                editable: false,
                selectable: false,
                sorted: true,
                filtered: true,
                scaled: true,
                resizeable: false,
                customized: false,
                closeEdit: true,
                noAdd:true,
                parentElem: $("#gridDialog .content").find("#currentDocForm"),
                editTitle: "Бланки документов",
                parentId: this.parent,    
                id: "_DocForm",
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
           
           this.curentBlank.grid_fetch("/webservice/app.study_docs/execute?action=list_blanks&id="+obj.selectedId, 0, "", "_DocForm");
       };
       
       this.gridDocForm.gridFromBeforeSubmit = (grid, submit_object, data)=>{
            return false;
       };
       
       this.gridDocForm.grid_fetch("/webservice/app.study_docs/execute?action=list_bp", 0, "", "");
       
   }
   
    finalizeApplication(){
        this.gridDocForm = null;
        this.container = null;
        this.parent = null;
    }   
    
    set setParent(parent){
        this.parent = parent;
        setTimeout(() => {
            if(this.gridDocForm !== null && this.gridDocForm.constructor.name === "AppGrid"){
                this.gridDocForm.setParentId = parent;
                this.gridDocForm.grid_fetch("/webservice/app.study_docs/execute?action=list_bp", 0, "", "");
            }
        }, 0);        
    }
    
    get getParent () {
        return this.parent;
    }
   
}