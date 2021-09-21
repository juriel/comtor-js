const comtor = {
    hello: function () {
        console.log("Hello World");
    },
    node2object: function (node) {
        pojo = {};
        elements = [];
        inputs = node.getElementsByTagName("input");
        selects = node.getElementsByTagName("select");
        texareas = node.getElementsByTagName("textarea");
        for (const ele of inputs) {
            elements.push(ele);
        }
        for (const ele of selects) {
            elements.push(ele);
        }
        for (const ele of texareas) {
            elements.push(ele);
        }
        for (const ele of elements) {
            
            if (ele.type != "submit") {
                if (!ele.disabled) {
                    if (ele.name) {
                        pojo[ele.name] = ele.value;
                    }
                    else if (ele.id) {
                        pojo[ele.id] = ele.value;
                    }
                }
            }
        }
        return pojo;
    },
    object2x_www_form_urlencoded : function(pojo){
        resp = "";
        for(var key in pojo){
            resp += encodeURIComponent(key)+"="+encodeURIComponent(pojo[key])+"&";
        }
        return resp;

    },
    array2x_www_form_urlencoded : function(pojo){
        resp = "";
        
        for(i = 0 ; i < pojo.length ; i += 2){
            key = pojo[i];
            value = pojo[i+1];
            resp += encodeURIComponent(key)+"="+encodeURIComponent(value)+"&";
        }
        return resp;

    },
    object2xFormData: function(pojo){
        var resp = new FormData();
        for (var key in pojo){
            resp.append(key,pojo[key]);
        }
        return resp;
    },
    array2xFormData: function(pojo){
        var resp = new FormData();
        for(i = 0 ; i < pojo.length ; i += 2){
            key = pojo[i];
            value = pojo[i+1];
            resp.append(key,value);
        }
        return resp;
    },
    form2FormData: function(form){
        return new FormData(form);
    },
    get_payload: function (content_type,pojo) {  /* POJO could be object , array  */

        is_object = typeof pojo === "object" && !Array.isArray(pojo) && pojo !== null;
        if (is_object && content_type === "x-www-form-urlencode"){
            return comtor.object2x_www_form_urlencoded(pojo);
        }
        if (Array.isArray(pojo)   && content_type === "x-www-form-urlencode" ){
            return comtor.array2x_www_form_urlencoded(pojo);
        }
        if (is_object && content_type === "multipart/form-data"){
            return comtor.object2xFormData(pojo);
        }
        if (Array.isArray(pojo) && content_type ==="multipart/form-data"){
            return comtor.array2xFormData(pojo);
        }
        if ((is_object ||Array.isArray(pojo))  && content_type === "application/json"){
            return JSON.stringify(pojo);
        }
        return "PAILA +++ "+content_type+"  ";
    },
    http_post_json: function(url,pojo, params  = {},  callback = null, error_callback){
        console.log("Step1");
        var client = new XMLHttpRequest();
        handler = function(){
            console.log("Handler");
            if (callback == null){
                return;
            }
            if (this.status == 200) {
                if (callback.length == 0){
                    callback();
                }
                else if (callback.length == 1){
                    callback(this.response);
                }
                else if (callback.length == 2){
                    callback(this.response, this);
                }
            } else {
                if (error_callback ) {
                    if (error_callback.length == 0){
                        error_callback();
                    }
                    else if (error_callback.length == 1){
                        error_callback(this.status);
                    }
                    else if (error_callback.length == 2){
                        error_callback(this.status, this.response);
                    }
                    else if (error_callback.length == 3){
                        error_callback(this.status, this.response,this);
                    }
                }    
                else{
                    console.log("comtor.http_post_json "+url +" " +this.status);
                }
            } 
        };
        
        client.onloadend = handler;
        client.open("POST", url);
        client.setRequestHeader("Content-Type", "application/json");
        if (params.headers){
            for (i = 0; i < params.headers.length ; i = i +2){
                client.setRequestHeader(params.headers[i],params.headers[i+1]);
                console.log("ADD HEADER "+params.headers[i]+":"+params.headers[i+1]);
            }
            console.log("contains headers");    
        }
        try{
            client.send(JSON.stringify(pojo));
        }catch(error){
            console.log(error);
        }
    },

    xhr: function(url,pojo = null,xhrparams = {}){
        console.log("XHR Step 1");
        is_null = pojo === null;
        is_object = typeof pojo === "object" && !Array.isArray(pojo) && pojo !== null;
        is_string = typeof pojo === 'string' || pojo instanceof String;
        default_method = "POST";
        if (xhrparams.method){
            default_method = xhrparams.method;
        }
        if(xhrparams.content_type){
            content_type = xhrparams.content_type;
        }
        else{ /* select best encoding depending pojo type */
            if (is_object || Array.isArray(pojo)){  
                content_type = "application/json";
            }
            else if (is_string){
                content_type = "text/plain";
            }            
        }


        console.log("XHR Step 2 "+content_type+" "+default_method);
        var client = new XMLHttpRequest();        
        onloadend_handler = function(){
            console.log("Handler");
            if (this.status == 200) {

                if (xhrparams.callback == null){
                    return;
                }
                else if (xhrparams.callback.length == 0){
                    xhrparams.callback();
                }
                else if (xhrparams.callback.length == 1){
                    xhrparams.callback(this.response);
                }
                else if (xhrparams.callback.length == 2){
                    xhrparams.callback(this.response, this);
                }
            } 
            else { // status != 200
                if (!xhrparams.error_callback ) {
                    console.log("xhr "+url +" " +this.status);
                    return;
                }
                else if (xhrparams.error_callback.length == 0){
                    xhrparams.error_callback();
                }
                else if (xhrparams.error_callback.length == 1){
                    xhrparams.error_callback(this.status);
                }
                else if (xhrparams.error_callback.length == 2){
                    xhrparams.error_callback(this.status, this.response);
                }
                else if (xhrparams.error_callback.length == 3){
                    error_callback(this.status, this.response,this);
                }
            }    
        };
        
        client.onloadend = onloadend_handler;
       
        if (xhrparams.headers){
            for (i = 0; i < params.headers.length ; i = i +2){
                client.setRequestHeader(params.headers[i],params.headers[i+1]);
            }
        }
        if (xhrparams.timeout){
            client.timeout = xhrparams.timeout;
        }
        if (xhrparams.ontimeout){
            client.ontimeout = xhrparams.ontimeout;
        }
        if (xhrparams.withCredentials){
            client.withCredentials = xhrparams.withCredentials;
        }
        console.log("XHR Step 3 open ");
        client.open(default_method, url);
        client.setRequestHeader("Content-Type", content_type);
        
        if (default_method === "GET" && !is_null){
            client.send(comtor.get_payload(content_type, pojo));
        }
        else {
            console.log("XHR Step 4 open ");
            console.log(comtor.get_payload(content_type,pojo));
            client.send(comtor.get_payload(content_type,pojo));
        }
        return client;
    },
    
    formSubmitListener: function (evt) {
        evt.preventDefault(); // Evita que el navegador envíe el formulario
        console.log(evt.target);
        form  = evt.target;
        pojo = comtor.node2object(form);
        if (evt.submitter instanceof HTMLInputElement) {
            pojo[evt.submitter.name] = evt.submitter.value;
        }
        //console.log(pojo);
        xhrparams = {};
        if (form.method){
            xhrparams.method = form.method;
        }
        if (form.enctype){
            xhrparams.content_type = form.enctype;
        }
        return false;
    }
};



function send_ok(resp){

    console.log("SEND OK");
    console.log(resp);
}

function test_any (){
    //console.log("TEST");
    //ejemplo = {perro:'San Bernardo',mama: 'TEst'};
    //console.log(ejemplo);
    //comtor.http_post_json('https://jsonplaceholder.typicode.com/posts/1',ejemplo, {headers: ["header1","valye"]} ,function (response) {console.log(response)}, function (){console.log("esto saliio muy mal")}  );
    //comtor.xhr('https://jsonplaceholder.typicode.com/posts/1',ejemplo,{timeout:1    , ontimeout: function(resultado){console.log("PAILA"); console.log(resultado);}    });
    console.log("NODE 2 OBJECT ");
    obj = comtor.node2object(document.getElementById("myform"));
    console.log(obj);

    console.log(" OBJECT 2 x_www_form_urlencoded");
    str = comtor.object2x_www_form_urlencoded(obj);
    console.log(str);

    console.log("TEST XHR");
    comtor.xhr("https://jsonplaceholder.typicode.com/posts/1",obj,{timeout:30000, callback: send_ok, method: "PUT" });
  //  formdata = comtor.form2FormData(document.getElementById("myform"));
  //  console.log("FORM _DATA");
  //  console.log(formdata);
}

window.onload = function () {
    document.getElementById("myform").addEventListener("submit", comtor.formSubmitListener);
}