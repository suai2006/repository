var Apps = {    
    DocumentForms : {
        role:"1",
        icon:Icons.iconJournal(),
        name:"Бланки документов",
        run : function(param){return new DocumentForms(param);}
    },
    Orders : {
        role:"1",
        name:"Приказы",
        icon:Icons.iconJournal(),
        run : function(param){return new Orders(param);}
    },
    DocumentPrintingSettings : {
        role:"1,4",
        name:"Настройки печати документов",
        icon:Icons.iconJournal(),        
        run : function(param){return new DocumentPrintingSettings(param);}
    },
    
    IssuingBookWork : {
        role:"1",
        name:"Работа с книгой выдачи документов",
        icon:Icons.iconJournal(),
        run : function(param){return new IssuingBookWork(param);}
    },
    ArchiveIssuedDocuments : {
        role:"1",
        name:"Архив выданных документов",
        icon:Icons.iconJournal(),
        run : function(param){return new ArchiveIssuedDocuments(param);}
    }
};

class studyDocsApplication {
    
    constructor(id) {
        
        $("#menu-ow-title .menu-app").html("");
        this.id = id;
        this.curApps = null;
        this.listData = null;
        this.appInitList = [];
        
    }
    
    initializeApplication() {
        
        this.userRole = userApps.filter(c => c.name === appManager.currentApp)[0].role;
        
        document.title = userApps.filter(c => c.name === appManager.currentApp)[0].title;
        $("#menu-ow-title .menu-app").html("<i class='print icon'></i>&nbsp;" + document.title);        
        $("body").addClass("study_docs");
        let app = $("<div class='app-study_docs'></div>");
        let menu = $(`<div class='app_menu disabled'>
                        <div class='ui mini menu' style='display: flex;'>                                     
                            <div id='tabs' class='ui pointing dropdown link item'>
                                <input type='hidden' name='ou_level'>
                                <span class='text'>Уровень образования</span>
                                <i class='dropdown icon'></i>
                                <div class='menu'></div>
                            </div>
                            <a id='returnBtn' class='item' title='Возврат в основное меню ' style='margin-left: auto;'><i class='icon reply'></i></a>
                        </div>                        
                    </div>`);
        app.append(menu);
        
        
        let cards = $("<div id='appContainer' class='app-container' data-app='' style='width:100%;'><div class='ui active loader'></div></div>");
        app.append(cards);
        $("#app-ow").append(app);
        
        $("body.study_docs #app-ow #returnBtn").on("click",(e)=>{
            if($(cards).attr("data-app")==="" || this.listData === null) return;
            $(cards).attr("data-app","");
            $(cards).html("<div class='ui active loader'></div>");
            this.curApps.finalizeApplication();
            this.renderTile(cards);   
        });
        $("body.study_docs #app-ow .app_menu #tabs.dropdown").dropdown({
            allowCategorySelection: true,
            onChange: (value, text, $selectedItem) => {                
                if(this.curApps !== null){
                    this.curApps.setParent = value;
                }
            }
        });
        
        this.appsList = Object.keys(Apps).filter(c => Apps[c].role.split(",").indexOf(this.userRole) >= 0);
        
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    menu.removeClass("disabled");
                    this.listData = JSON.parse(xhr.response);
                    
                    $("body.study_docs #app-ow .app_menu .dropdown").find(".menu").html(`${this.listData.reduce((a,c)=>{
                        return a+=` <div class='item' data-value='${c.obj_id}'>${c.name}</div>`;
                    },`<div class='item' data-value=''>Уровень образования</div>`)}`);
                    this.renderTile(cards);                    
                }else{
                    
                }
            }else{
                
            }            
        };        
        xhr.open("get","/webservice/app.study_docs/execute?action=list");
        xhr.send(null);       
        
        window.addEventListener("resize", this.workspaceResize, false);
        this.workspaceResize(null);
        
    } 
    
    renderTile(cards){
        let s = "";
        s += this.appsList.reduce((a,c)=>{
            return a += `
                <div class='tile-item animate notready' data-app="${c}">
                    <div class='icon'>${Apps[c].icon}</div>
                    <div class='title'>${Apps[c].name}</div>
                </div>
            `;  
        }, "");         
        cards.html(s);


        let count = 4;
        $("#appContainer .tile-item").each((i, elem)=> {
            let rnd = 200 * Math.floor((Math.random() * (count - 2) + 2));
            $(elem).show().css({transition: "opacity .3s ease " + rnd + "ms, transform .3s ease " + rnd + "ms", opacity: "0"});
            $(elem).css({opacity: "1", transform: "scale(1.0)"});
        });

        $("#appContainer .tile-item").on("click",(e) => {
            let target = e.currentTarget;
            
            let app = $(target).attr("data-app");
            let ouRole = $("body.study_docs #app-ow .app_menu .dropdown").find("input").val();
            if(ouRole === ""){
                let s="";
                s +="<div class='header'>Выберите уровень ОУ</div>";
                s +="<div class='ui form content' style='overflow-y: inherit;'>";
                    s+="<div class='field'>";
                        s+="<div class='ui selection fluid dropdown'>";
                            s+="<input type='hidden' name='select_ou_notice'>";
                            s+="<i class='dropdown icon'></i>";
                            s+="<div class='default text'>Выберите уровень ОУ</div>";
                            s+="<div class='menu'>";
                                s +=`${this.listData.reduce((a,c)=>{
                                    return a+=` <div class='item' data-value='${c.obj_id}'>${c.name}</div>`;
                                },`<div class='item' data-value=''>Уровень образования</div>`)}`;
                            s+="</div>";
                        s +="</div>";
                    s +="</div>";
                s +="</div>";
                s +="<div class='actions'>";
                s +="<button class='ui blue icon button button-confirm' type='button' disabled><i class='checkmark icon'></i>Подтвердить</button>";
                s +="<button class='ui black icon button button-cancel' type='button' onclick='ModalBox.cancel();'><i class='remove icon'></i>Отмена</button>";
                s +="</div>";
                let mb = new ModalBox(s,"mini","confirmDialog");
                
                $(mb.windowContainer).find(".dropdown").dropdown({
                    onChange: function(value, text, $selectedItem) {
                        $(mb.windowContainer).find(".button-confirm").removeAttr("disabled");                        
                    }
                });
                
                $(mb.windowContainer).find(".button-confirm").on("click",(e)=>{
                    let value = $(mb.windowContainer).find("input[name=select_ou_notice]").val();
                    $("body.study_docs #app-ow .app_menu .dropdown").dropdown("set selected", value);
                    mb.close(true);
                    this.launchSelectedApp(app, cards, value);                     
                }); 
            }else{
                this.launchSelectedApp(app, cards, ouRole);
            }            
        });
    }
    
    launchSelectedApp(app,container,parent){
        $(container).attr("data-app", app);
        let story = this.appInitList.filter(c => c.constructor.name === app);
        if(story.length === 0){
            this.curApps = Apps[app].run();    
            this.appInitList.push(this.curApps);
        }else{
            this.curApps = story[0];
        }     
        $(container).html( "<div class='ui active loader'></div>"); 
        this.curApps.init(container,parent);
    }
    
    finalizeApplication() {
        $("body").removeClass("study_docs");
         window.removeEventListener("resize", this.workspaceResize);
         $("#app-ow").html("");
    }
    
    workspaceResize() {
        
    }
    
    getItem(elem, id){
        console.log(elem, id);
    }
}
// Главное приложение study_docs @ ee2b96b60640553d09473a3f641a0cfd
let studyDocsInstance = new studyDocsApplication("ee2b96b60640553d09473a3f641a0cfd");

if (typeof appManager === "undefined") {
    $("body").addClass("no-overflow");
    studyDocsInstance.initializeApplication();
} else {
    appManager.registerApplication(studyDocsInstance, studyDocsInstance.id);
}