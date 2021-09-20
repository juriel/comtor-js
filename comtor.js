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
        for (const sele of selectss) {
            pojo[sele.name] = sele.value;
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
        pojo = comtor.node2object(evt.target);
        if (evt.submitter instanceof HTMLInputElement) {
            pojo[evt.submitter.name] = evt.submitter.value;
        }

        console.log(pojo);
        return false;        
    }
};



window.onload = function (){
    comtor.hello();
    document.getElementById("myform").addEventListener("submit",comtor.submitListener);

}