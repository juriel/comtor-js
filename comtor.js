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
    object2x_www_form_urlencoded = function(pojo){
        resp = "";
        for(var key in pojo){
            resp = encodeURIComponent(key)+"&"+encodeURI(pojo[key]);
        }
        return resp;

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
        is_null = pojo === null;
        is_object = typeof pojo === "object" && !Array.isArray(pojo) && pojo !== null;
        is_string = typeof pojo === 'string' || pojo instanceof String;
        default_method = "POST";
        if (!xhrparams.content_type){
            if (is_object || Array.isArray(pojo)){  
                content_type = "application/json";
            }
            else if (is_string){
                content_type = "text/plain";
            }            
        }
        else {
            content_type = xhrparams.content_type;
        }

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
        if (!xhrparams.method){
            default_method = xhrparams.method;            
        }
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
        if (content_type == "application/json" && (is_object || Array.isArray(pojo)) && default_method != "GET"){
            client.open(default_method, url);
            client.setRequestHeader("Content-Type", content_type);
            client.send(JSON.stringify(pojo));
        }
        else if (content_type === "application/x-www-form-urlencoded" && default_method === "POST" ){
            payload = "";


        }




        else if (is_null){
            client.open(default_method, url);
            client.setRequestHeader("Content-Type", content_type);
        }
        else if (default_method == "GET" || Array.isArray(pojo)){

        }
        else {
            client.open(default_method, url);
            client.setRequestHeader("Content-Type", content_type);
        }

        return client;
    },
    
    formSubmitListener: function (evt) {
        evt.preventDefault();
        
        console.log(evt.target);
        pojo = comtor.node2object(evt.target);
        if (evt.submitter instanceof HTMLInputElement) {
            pojo[evt.submitter.name] = evt.submitter.value;
        }
        console.log(pojo);
        return false;
    }
};

function cl (){
    console.log("TEST");
    ejemplo = {perro:'San Bernardo',mama: 'TEst'};
    console.log(ejemplo);
    //comtor.http_post_json('https://jsonplaceholder.typicode.com/posts/1',ejemplo, {headers: ["header1","valye"]} ,function (response) {console.log(response)}, function (){console.log("esto saliio muy mal")}  );
    comtor.xhr('https://jsonplaceholder.typicode.com/posts/1',ejemplo,{timeout:1    , ontimeout: function(resultado){console.log("PAILA"); console.log(resultado);}    });
}

window.onload = function () {
    document.getElementById("myform").addEventListener("submit", comtor.formSubmitListener);
}