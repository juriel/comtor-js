
function prepare(evt){
    console.log("Prepare");
    console.log(evt.type);
}
function send_ok(resp){

    console.log("SEND OK");
    console.log(resp);
}

function test_any (param){
    //console.log("TEST");
    //ejemplo = {perro:'San Bernardo',mama: 'TEst'};
    //console.log(ejemplo);
    //comtor.http_post_json('https://jsonplaceholder.typicode.com/posts/1',ejemplo, {headers: ["header1","valye"]} ,function (response) {console.log(response)}, function (){console.log("esto saliio muy mal")}  );
    //comtor.xhr('https://jsonplaceholder.typicode.com/posts/1',ejemplo,{timeout:1    , ontimeout: function(resultado){console.log("PAILA"); console.log(resultado);}    });


    console.log(param);




    llog = comtor.getfunctionByName("console.log");
    llog("HOLA MUNDO");

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
/*
window.onload = function () {
    document.getElementById("myform").addEventListener("submit", comtor.onSubmitDefaultListener);
}*/