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
    }
    ,
    formSubmitListener: function (evt) {
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


window.onload = function () {
    comtor.hello();
    document.getElementById("myform").addEventListener("submit", comtor.formSubmitListener);

}