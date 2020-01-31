var fileTypes = [
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document','file word outline icon'],
    ['application/msword','file word outline icon'],
    ['application/vnd.ms-excel','file excel outline icon'],
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','file excel outline icon'],
    ['application/vnd.ms-powerpoint','file powerpoint outline icon'],
    ['application/vnd.openxmlformats-officedocument.presentationml.presentation','file powerpoint outline icon'],
    ['application/pdf','file pdf outline icon']
];
var icon = "";
var fileBuffer = [];

function getFilePreview(e){
    var input_file = e.target;
    let curFiles = input_file.files;
    if(curFiles.length > 5 || (fileBuffer.length + curFiles.length) > 5){
        uiNotification("Прикрепить можно не более 5-и файлов","negative","2500");
        input_file.value = "";
        return false;
    }
    
    if (curFiles.length === 0) {
        
    }
    else{
       
        for (let i = 0; i < curFiles.length; i++) {
            if (validFileType(curFiles[i])) {
                fileBuffer.push(curFiles[i]);
                $(".file_preview").append("<div class='preview' title='"+curFiles[i].name+"'><i class='"+icon+"'></i><i class='close icon' title='Отменить отправку этого файла'></i></div>");
                
            }else{
                $(".file_preview").append("<div class='preview error'><i class='file alternate outline icon'></i></div>");
                
            }
        }
        
        if(fileBuffer.length === 0){
            uiNotification("Не выбрано ни одного файла подходящего для отправки", "negative",2500);
        }
        if(removeErr!==undefined) clearTimeout(removeErr);
        var removeErr = setTimeout(function(){
            $(".file_preview").find(".preview.error").fadeOut(250,function(){
                $(".file_preview").find(".preview.error").remove();
            });
            
        },2500);
        $(".file_preview").find(".preview .close").each(function(idx,close){
            close.onclick = function(){
                fileBuffer.splice($(close).closest(".preview").index(), 1);
                $(close).closest(".preview").remove();
            };
        });
    }
    input_file.value = "";
}

function validFileType(file) {
    for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i][0]) {
            icon = fileTypes[i][1];
            return true;
        }
    }
    return false;
}

function uiNotification(title,cls,timeout){
    var notification = "";
    notification += '<div class="ui icon message notification '+cls+'">';
    notification += '<i class="envelope outline icon"></i>';
    notification += '<div class="content">';
    notification += '<div class="header">' + title + '</div>';
    notification += '</div>';
    notification += '</div>';
    if(timeout !== undefined){
        $("body").addClass("overflow-hidden");
        $("body").append(notification);
        var closeNotice = setTimeout(function(){
            $("body").find('.notification').remove();
            $("body").removeClass("overflow-hidden");
            clearTimeout(closeNotice);
        },timeout);
    }
}

function sendMessage(e){
    var target = $(e.target).closest("form");
    var formData = new FormData();
    $($(target).get(0).elements).each(function(idx,elem){
        if(elem.files === null || elem.files === undefined){
            formData.append(elem.name, elem.value);
        }
        else{
            fileBuffer.forEach(function(file){
                if (validFileType(file)) {
                    formData.append(elem.name, file, file.name);
                }
            });
        }
        
    });
    
    var xhr = new XMLHttpRequest();
    var notification = "";
    notification += '<div class="ui icon message notification">';
    notification += '<i class="envelope outline icon"></i>';
    notification += '<div class="content">';
    notification += '<div class="header">Отправка сообщения</div>';
    notification += '</div>';
    notification += '</div>';
    $("body").addClass("overflow-hidden");
    $("body").append(notification);
    
    try{           
        xhr.open("post","otpravit-soobshhenie.php");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.onreadystatechange=function (){
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if(xhr.status === 200){
                    var data = JSON.parse(xhr.response);
                    if(data.hasOwnProperty("error")){      
                        if(data.error.hasOwnProperty("field")){
                            var input = null;  
                            $($(target).get(0).elements).each(function(idx,elem){
                                if($(elem).attr("name") === data.error.field.name){
                                    input = elem;
                                }
                            });
                            $("body").find('.notification').addClass("negative");
                            $("body").find('.notification .content').html("<div class='header'>Ошибка при отправке сообщения</div><p>"+data.error.field.msg+"</p>").delay(1500).queue(function(){                        
                                $("body").find('.notification').fadeOut(500,function(){
                                    $(this).remove();
                                    $("body").removeClass("overflow-hidden");
                                    $(input).closest(".field").addClass("error").delay(1500).queue(function(){
                                        $(this).removeClass("error").dequeue();
                                    });
                                });
                            });
                        }
                        else{
                            $("body").find('.notification').addClass("negative");
                            $("body").find('.notification .content').html("<div class='header'>Ошибка при отправке сообщения</div><p>"+data.error.msg+"</p>").delay(1500).queue(function(){                        
                                $("body").find('.notification').fadeOut(500,function(){
                                    $(this).remove();
                                    $("body").removeClass("overflow-hidden");
                                    if(data.error.hasOwnProperty("name") && data.error.name==="Reply-To"){
                                       $(target).find("input[name='email']").addClass("error").delay(1500).queue(function(){
                                            $(this).removeClass("error").dequeue();
                                        }); 
                                    }
                                });
                            });
                        }
                        
                        return;
                    }
                    $(target)[0].reset(); 
                    $(".file_preview").html("");
                    fileBuffer = [];
                    $(target).find('.dropdown').dropdown('clear');                   
                    $("body").find('.notification .header').text(data.success.txt).delay(1000).queue(function(){                        
                        $("body").find('.notification').fadeOut(500,function(){
                            $(this).remove();
                            $("body").removeClass("overflow-hidden");
                        });
                    });
                }
                else{
                    var err = JSON.parse(xhr.response);     
                    $("body").find('.notification').addClass("negative");
                    $("body").find('.notification .content').html("<div class='header'>Ошибка при отправке сообщения</div><p>"+err.error.field.msg+"</p>").delay(1000).queue(function(){                        
                        $("body").find('.notification').fadeOut(500,function(){
                            $(this).remove();
                            $("body").removeClass("overflow-hidden");
                        });
                    });
                }
            }else{
                
            }
        };
        xhr.send(formData);
    }catch(e){
        console.log(e);
    }
    
}