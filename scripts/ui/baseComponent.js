// when adding components use UIBase.add(e)

// component refers to the objects in js that have custom properties like update
// element refers to the html element each object is using
class BaseComponent {
    constructor(elementName = "div", updateFunc = function () {}) {
        this.element = dMake(elementName);
        this.update = updateFunc;
        this.children = [];
    }

    set class(c) {
        this.element.className = c;
    }
    get class() {
        return this.element.className;
    }
}

BaseComponent.prototype.displayStyle = "block";

BaseComponent.prototype.delete = function () {
    this.parent.element.removeChild(this.element);
    this.parent.children.splice(this.parent.children.indexOf(this), 1);
};

BaseComponent.prototype.add = function (component) {
    component.parent = this;
    this.element.appendChild(component.element);
    this.children.push(component);
};

BaseComponent.prototype.hide = function () {
    this.element.style.display = "none";
};

BaseComponent.prototype.show = function () {
    this.element.style.display = this.displayStyle;
};

BaseComponent.prototype.toggleVisibility = function () {
    if (this.element.style.display === "none") {
        this.show();
    } else {
        this.hide();
    }
};

var UIBase = new BaseComponent("div", function () {
    this.element.style.width = `${cw}px`;
    this.element.style.height = `${ch}px`;
});
UIBase.element.id = "UIBase";
document.body.appendChild(UIBase.element);

function updateUIComponents() {
    UIBase.update();
    updateChildren(UIBase);
}

function updateChildren(component) {
    var children = component.children;
    for (var i = 0, l = children.length; i < l; i++) {
        children[i].update();
        updateChildren(children[i]);
    }
}

var a = new BaseComponent("button");
a.element.innerText = "asdasd";
UIBase.add(new BaseComponent());
UIBase.add(a);
a.add(new BaseComponent("button"));