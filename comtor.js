const comtor =  {
    hello: function(){
        console.log("Hello World");
    },
    node2object: function(node){
        pojo = {};
        elements = node.getElementsByTagName("input");

        for (const input of elements) {
            if (input.type != "submit"){
                pojo[input.name] = input.value;
            }
        }

        selectss = node.getElementsByTagName("select");
        for (const selects of selectss) {
            pojo[input.name] = input.value;
        }
        texareas = node.getElementsByTagName("texarea");
        return pojo;
    }
    ,
    submitListener: function(evt){
        evt.preventDefault();
        console.log(evt);   
        console.log("Target");
        console.log(evt.target);
        pojo = evt.target;
        if (evt.submitter instanceof HTMLInputElement) {
            pojo[evt.submitter.name] = evt.submitter.value;
        }
        return false;        
    }
};



window.onload = function (){
    comtor.hello();
    document.getElementById("myform").addEventListener("submit",comtor.submitListener);

}