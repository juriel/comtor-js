const comtor = {
    ENABLE_LOGS  : false,
    hello: function () {
        console.log("Hello World");
    },
    log: function(o){
		console.log(o);
    },
    function_invoke: function(func, params){
        if (!func){
            return;
        }
        if (func.length == 0 ){
            return func();
        }
        else if (func.length ==1 ){
            return func(params[0]);
        }
        else if (func.length ==2 ){
            return func(params[0],params[1]);
        }
        else if (func.length == 3){
            return func(params[0],params[1],params[2]);
        }
        else if (func.length == 4){
            return func(params[0],params[1],params[2],params[3]);
        }
    },
    //Returns true if it is a DOM node
    isDOMNode: function(o){
        return (
            typeof Node === "object" ? o instanceof Node : 
            o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
        );
    },
  
    //Returns true if it is a DOM element    
    isDOMElement: function (o){
        return (
            (typeof HTMLFormElement === "object" || typeof HTMLFormElement === "function") ? o instanceof Node : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    },
    isHTMLFormElement:  function(o){
        console.log(" ----> "+(typeof HTMLFormElement));
        console.log("  typeof HTMLFormElement === object ", (typeof HTMLFormElement === "object"));

        console.log(" o instanceof HTMLFormElement ", (o instanceof HTMLFormElement));
        console.log(" o .nodetype ", o.nodeType);
        return (
            (typeof HTMLFormElement === "object" || typeof HTMLFormElement === "function") ? o instanceof HTMLFormElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    },


    _2object: function(o){
        if ( o === null){
            return null;
        }
        if (comtor.isDOMNode(o)){
            return comtor.node2object(o);
        }
        if (o instanceof FormData){
            return comtor.formData2object(o);
        }
        if (o instanceof Event){
            form = o.target.form;
            return comtor.formData2object(comtor.form2FormData(form));
        }
        if (Array.isArray(o)){
            return o;
        }
        if (typeof o === "string"){
            try{
                obj = JSON.parse(o);
                return obj;
            }
            catch(ex){                
            }
        }
        return o;
    },

    _2formData: function(o){
        if ( o === null){
            return new FormData();
        }
        if (comtor.isHTMLFormElement(o)){
            return comtor.form2FormData(o);
        }
        if (comtor.isDOMNode(o)){
            return comtor.node2formData(o);
        }
        if (o instanceof FormData){
            return o;
        }
        if (o instanceof Event){
            form = o.target.form;
            return comtor.form2FormData(form);
        }
        if (o instanceof Object && !Array.isArray(o)){
            return comtor.object2FormData(o);
        }
        if (Array.isArray(o)){
            return comtor.array2FormData(o);
        }
        return o;   
    },


    _2x_www_form_urlencoded: function(o){
        if ( o === null){
            return "";
        }
        if (comtor.isHTMLFormElement(o)){
            return comtor.formData2x_www_form_urlencoded(comtor.form2FormData(o));
        }
        if (comtor.isDOMNode(o)){
            return comtor.formData2x_www_form_urlencoded(comtor.node2formData(o));
        }
        if (o instanceof FormData){
            return comtor.formData2x_www_form_urlencoded(o);
        }
        if (o instanceof Event){
            form = o.target.form;
            fd =  comtor.form2FormData(form);
            return comtor.formData2x_www_form_urlencoded(fd);
        }
        if (o instanceof Object && !Array.isArray(o)){
            return comtor.object2x_www_form_urlencoded(o);
        }
        if (Array.isArray(o)){
            return comtor.array2x_www_form_urlencoded(o);
        }
        return o;   

    },

    node2elementArray: function(node){
        elements = [];
        inputs   = node.getElementsByTagName("input");
        selects  = node.getElementsByTagName("select");
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
        return elements;
    },
    /*
    Extract from inputs, selects and textareas values to create a object 
    node:  node is DOM element
    */
    node2object: function (node) {  
        pojo     = {};
        elements = comtor.node2elementArray(node);
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
    /*
    Extract from inputs, selects and textareas values to create a object 
    node:  node is DOM element
    */
    node2formData: function (node) {  
        formData     = new FormData();        
        elements = comtor.node2elementArray(node);
        for (const ele of elements) {
            if (ele.type != "submit") {
                if (!ele.disabled) {
                    if (ele.name) {
                        formData.append(ele.name, ele.value);
                    }
                    else if (ele.id) {
                        formData.append(ele.id, ele.value);                        
                    }
                }
            }
        }
        return pojo;
    },
    /*
    Receives a function name and returns a pointer to this function
    */
    getfunctionByName: function (functionName){
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        context = window;
        for(var i = 0; i < namespaces.length; i++) {
          context = context[namespaces[i]];
        }
        return context[func];
    },
    encodeURIComponent2: function(str){
        return encodeURIComponent(str).replace(/%20/g,'+');
    },
    /*
    converts js object to application/x-www-form-urlencoded payload
    */
    object2x_www_form_urlencoded : function(pojo){
        var resp = "";
        for(var key in pojo){
            resp += (resp?'&':'') + comtor.encodeURIComponent2(key)+"="+comtor.encodeURIComponent2(pojo[key]);
        }
        return resp;
    },
    /*
    converts FormData object to application/x-www-form-urlencoded payload
    */
    formData2x_www_form_urlencoded : function(formData){
        var resp  = '';
        for(var pair of formData.entries()){
            if(typeof pair[1]=='string'){
               resp += (resp?'&':'') + comtor.encodeURIComponent2(pair[0])+'='+comtor.encodeURIComponent2(pair[1]);
            }
        }
        return resp;
    },
    /*
    Converts JS array to application/x-www-form-urlencoded payload
    */
    array2x_www_form_urlencoded : function(pojo){
        var resp = "";
        
        for(i = 0 ; i < pojo.length ; i += 2){
            key = pojo[i];
            value = pojo[i+1];
            resp += (resp?'&':'') + encodeURIComponent(key)+"="+encodeURIComponent(value);
        }
        return resp;

    },
    /*
    Creates a FormData from a JS plain object
    */
    object2FormData: function(pojo){
        var resp = new FormData();
        for (var key in pojo){
            resp.append(key,pojo[key]);
        }
        return resp;
    },
    /*
    Creates a FormData from JS array.  ["key1","value1","key2","value2"]
     */
    array2FormData: function(pojo){
        var resp = new FormData();
        for(i = 0 ; i < pojo.length ; i += 2){
            key = pojo[i];
            value = pojo[i+1];
            resp.append(key,value);
        }
        return resp;
    },
    /*
    Creates a FormData from a form
    */
    form2FormData: function(form){
        return new FormData(form);
    },
    /*
    Creates a JS plain object from formData
    */
    formData2object: function(formData){
        pojo     = {};
        for(var pair of formData.entries()){
            if(typeof pair[1]=='string'){
                key = pair[0];
                value = pair[1];
                pojo[key] = value;
            }
        }
        return pojo;
    },
    /*
    Creates a valid payload to use in XHR send method
    valid input_obj are object, array or FormData
    */
    get_payload: function (content_type,input_obj) {
        if (input_obj == null){
            return;
        }  
        is_array    = Array.isArray(input_obj);
        is_object   = typeof input_obj === "object"   && !Array.isArray(input_obj) && input_obj !== null;
        is_formdata = input_obj instanceof FormData && !Array.isArray(input_obj) && input_obj !== null;

        /*   x-www-form-urlencoded */
        if (is_formdata && content_type === "application/x-www-form-urlencoded"){
			comtor.log("get_payload is_formdata:"+is_formdata);
			comtor.log(input_obj);
			return comtor.formData2x_www_form_urlencoded(input_obj);
		}
        if (is_object && content_type === "application/x-www-form-urlencoded"){
            return comtor.object2x_www_form_urlencoded(input_obj);
        }
        if (Array.isArray(input_obj)   && content_type === "application/x-www-form-urlencoded" ){
            return comtor.array2x_www_form_urlencoded(input_obj);
        }
        /* multipart/form-data */
        if (is_formdata && content_type === "multipart/form-data"){
            return input_obj;
        }
        if (is_object && content_type === "multipart/form-data"){
            return comtor.object2FormData(input_obj);
        }
        if (Array.isArray(input_obj) && content_type ==="multipart/form-data"){
            return comtor.array2FormData(input_obj);
        }

        /* application/json */
        if ((is_object || is_array)  && content_type === "application/json"){
            return JSON.stringify(input_obj);
        }
        if (is_formdata){
            obj = comtor.formData2object(input_obj);
            return JSON.stringify(obj);
        }
        return "get_payload error  "+content_type+"  "+input_obj;
    },
    http_post_json: function(url,pojo, params  = {},  callback = null, error_callback){
        //console.log("Step1");
        var client = new XMLHttpRequest();
        handler = function(){
            //console.log("http_post_json handler");
            
            if (this.status == 200) {
                if (callback){
                    comtor.function_invoke(callback,[this.response,this]);
                }
               
            } else {
                if (error_callback ) {
                    comtor.function_invoke(error_callback,[this.status,this.response,this]);
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
                //console.log("ADD HEADER "+params.headers[i]+":"+params.headers[i+1]);
            }
            //console.log("contains headers");    
        }
        try{
            client.send(JSON.stringify(pojo));
        }catch(error){
            console.log(error);
        }
    },

    /*
       pojo could be a javascript object or FormData
 
    */ 
    xhr: function(url,pojo = null,xhrparams = {}, evt=null){
        comtor.log("============ XHR =============");
        comtor.log(url);
        comtor.log(pojo);
        comtor.log(xhrparams);
        comtor.log(evt);
        comtor.log("------------------------------");
        if (xhrparams.function_pre){ // Invokes funtion pre xhr
            pre_pojo = comtor.function_invoke(xhrparams.function_pre,[evt,pojo,xhrparams]);
            if (pre_pojo){
                pojo  = pre_pojo;
            }
        }
        //console.log("XHR Step 1");
        pojo_is_null = pojo === null;
        pojo_is_object = typeof pojo === "object" && !Array.isArray(pojo) && pojo !== null;
        pojo_is_string = typeof pojo === 'string' || pojo instanceof String;
		pojo_is_formdata = pojo instanceof FormData;
        default_method = "POST";
        if (xhrparams.method){
            default_method = xhrparams.method;
        }
        if(xhrparams.content_type){
            content_type = xhrparams.content_type;
        }
        else{ /* select best encoding depending pojo type */
            if (pojo_is_formdata){
                content_type = "multipart/form-data";
            }
            else if (pojo_is_object || Array.isArray(pojo)){  
                content_type = "application/json";
            }
            else if (pojo_is_string){
                content_type = "text/plain";
            }            
        }
        comtor.log("XHR Step 2 "+content_type+" "+default_method);
        var client = new XMLHttpRequest();        
        onloadend_handler = function(){
            //console.log("Handler");
            if (this.status == 200) {
                if (xhrparams.function_post){
                    comtor.function_invoke(xhrparams.function_post,[this.response,this]);
                }
            } 
            else { // status != 200
                if (xhrparams.function_post_error ) {
                    comtor.function_invoke(xhrparams.function_post_error,[this.status, this.response,this]);
                    return;
                }                
            }    
        };        
        client.onloadend = onloadend_handler;
        if (xhrparams.headers && Array.isArray(xhrparams.headers) ){
            for (i = 0; i < params.headers.length ; i = i +2){
                client.setRequestHeader(params.headers[i],params.headers[i+1]);
            }
        }
        if (xhrparams.headers && typeof xhrparams.headers === "object" ){
            for (var key in xhrparams.headers){
                client.setRequestHeader(key,xhrparams.headers[key]);
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
        
        
        
        if (default_method.toUpperCase() === "GET" || default_method.toUpperCase() === "DELETE" || default_method.toUpperCase() === "HEAD"  ){                
            params = comtor.get_payload("application/x-www-form-urlencoded", pojo);
            url = url +"?"+params;
            client.open(default_method, url);            
            client.send();
        }
        else if (default_method.toUpperCase() === "POST" || default_method.toUpperCase() === "PUT"  ) {            
            client.open(default_method, url);
            client.setRequestHeader("Content-Type", content_type);
            comtor.log("XHR Step 4 open "+content_type+" "+pojo);
            comtor.log(comtor.get_payload(content_type,pojo));            
            client.send(comtor.get_payload(content_type,pojo));
        }        
        else {
            console.log("XHR Step 3.3 open "+default_method+" "+url);
        }
        return client;
    },
    
    onSubmitDefaultListener: function (evt) {
        evt.preventDefault(); // Evita que el navegador envíe el formulario
        //console.log(evt.target);
        form  = evt.target;
        onsubmitprepare = form.getAttribute("comtor-onsubmit-prepare");
        if (onsubmitprepare){
            onsubmitprepare_fn = comtor.getfunctionByName(onsubmitprepare);
            onsubmitprepare_fn(evt);
        }

        pojo = comtor.node2object(form);
    
        if (evt.submitter instanceof HTMLInputElement) {
            pojo[evt.submitter.name] = evt.submitter.value;
        }
/*
        if (form.hasAttributes()) {
            var attrs = form.attributes;
            var output = "";
            for(var i = attrs.length - 1; i >= 0; i--) {
              output += attrs[i].name + "->" + attrs[i].value+"\n";
            }
            //console.log(output);
          } else {
            console.log("No attributes to show");
          }
*/       
        //console.log(pojo);
        xhrparams = {};
        comtor.log("METHOD "+form.method);
        if (form.method){
            xhrparams.method = form.method;
        }
        if (form.getAttribute("comtor-enctype")){
            //console.log("ENCTYPE1 "+form.getAttribute("comtor-enctype") );
            xhrparams.content_type = form.getAttribute("comtor-enctype");
        }
        else if (form.enctype) {
            //console.log("ENCTYPE2 "+form.enctype );
            xhrparams.content_type = form.enctype;
        }

        onsubmitpre = form.getAttribute("comtor-onsubmit-pre");
        if (onsubmitpre){
            xhrparams.function_pre = comtor.getfunctionByName(onsubmitpre);            
        }


        onsubmitpost_ok = form.getAttribute("comtor-onsubmit-post-ok");
        if (onsubmitpost_ok){
            xhrparams.function_post = comtor.getfunctionByName(onsubmitpost_ok);            
        }

        onsubmitpost_error = form.getAttribute("comtor-onsubmit-post-error");
        if (onsubmitpost_error){
            xhrparams.function_post_error = comtor.getfunctionByName(onsubmitpost_error);            
        }
        url = null;
        if (form.action){
            url = form.action;
        }
        pojo = null;
        if (xhrparams.content_type && xhrparams.content_type === "application/x-www-form-urlencoded"){
            pojo = new FormData(form);
        }
        else {
            pojo = comtor.node2object(form);
        }
        comtor.xhr(url,pojo,xhrparams,evt);
        return false;
    },
    init : function(){
        const all_nodes = document.querySelectorAll("form");
        all_nodes.forEach(
            function(node){
                attr = node.getAttribute("comtor-onsubmit");
                if (attr){
                    node.addEventListener("submit", comtor.onSubmitDefaultListener);
                }
            }
        );
    } 
};
document.addEventListener("DOMContentLoaded", function(event) { 
    const all_nodes = document.querySelectorAll("form");
    all_nodes.forEach(
        function(node){
            attr = node.getAttribute("comtor-onsubmit");
            if (attr){
                node.addEventListener("submit", comtor.onSubmitDefaultListener);
            }
        }
    );
});
