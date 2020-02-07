class DocumentPrintingSettings{
    
    constructor() {
        
        this.container = null;
        this.parent = null;
        this.studyDocsInstance = appManager.appList.filter(c => c.id === appManager.currentId)[0];
    }
    
    init(container,parent){
        
        this.container = container;
        this.parent = parent;
        
        
        let $PrintSetFolder = $("<div id='printSetFolder' class='folder'></div>");
        let $leftSide = $("<div id='leftSide' class='side left'></div>");
        let $rightSide = $("<div id='rightSide' class='side right'><div class='ui active loader'></div></div>");
        $PrintSetFolder.append($leftSide);
        $PrintSetFolder.append($rightSide);        
        $(this.container).html($PrintSetFolder);
        
        this.leftSideGetContent($leftSide);
        
    }
    
    leftSideGetContent(folder, data){
        
        let $dataContent = "";
        
        let selected = this.studyDocsInstance.listData.filter(c => this.parent === c.obj_id)[0];
        
        this.tree = new dgTree(folder[0]);
        this.tree.globalResize = (e)=>{
            this.tree.resize();
        };
        
        window.addEventListener("resize", this.tree.globalResize, false);
        for (let row of this.studyDocsInstance.listData) {
            let flag = selected.obj_id === row.obj_id ? true:false;
            let n = this.tree.root.addChild(row.name, dgTree.folderImage(), row);
            // Сразу добавляем ноду с текстом Загрузка данных... чтобо появился +
            this.createFakeNode(n);
            // ставим в конец очереди и затем распахиваем ноду
            setTimeout(()=>{
                if(flag){       
                    n.selected = true;
                    this.tree.selectedNode = n;
                    n.expand();
                    this.nodeGetRequest(n, $("#rightSide"));
                }
            },0);            
        }
        
        this.tree.onExpand = (treeNode) => {                        
            if (treeNode.userData.has_children === "1"){
                this.treeRowExpand(treeNode);
            }            
            return true;
        };
        
        this.tree.onSelect = (treeNode) => {
            this.nodeGetRequest(treeNode,$("#rightSide"));
            return true;
        };
        
        this.tree.onCollapse = (treeNode) => {            
            this.createFakeNode(treeNode);
            return true;
        };        
    }
    
    nodeGetRequest(treeNode, block){
        console.log(treeNode, block,"запрос");
        block.html("<div class='ui active loader'></div>");
        /*
         * Запрос библиотек
         * пока их нет 
         * формирование формы
         */
        
        let s="";
        s+="<div class='appendice'>";
            
        s+="</div>";
        
        block.html(s);
    }
    
    createFakeNode(node) {
        
        if (node.userData.hasOwnProperty("has_children") && node.userData.has_children !== "0")
            node.addChild("Загружаем данные...", "\uf1c0", {});
    }
    
     treeRowExpand(treeNode){
         
         treeNode.tree.treeRequest = false;
         var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.response);                    
                    if(Array.isArray([]) && data.length > 0){
                        treeNode.tree.treeRequest = null;
                        for (let row of data) {                            
                            let n = treeNode.addChild(row.name ,dgTree.folderImage(), row);
                            this.createFakeNode(n);
                        }
                    }                    
                }
            }else {
                
            }
        };
        xhr.open("GET","/webservice/app.study_docs/execute?action=list&id="+treeNode.userData.obj_id+"&level="+treeNode.userData.level_id);
        xhr.send();    
     }
    
    finalizeApplication(){
        
        this.container = null;
        this.parent = null;
    }
    
    set setParent(parent){
        
        this.parent = parent;
        this.leftSideGetContent($("#leftSide"));
    }
    get getParent () {
        return this.parent;
    }
}