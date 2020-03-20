class Component {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.parent = null;
        this.children = [];
        // position in parent's children array
        this.position;

        // what parts should be drawn
        this.showBorder = true;
        this.showShadow = true;
        this.show = true;

        // colors
        this.backgroundColor = colors.background;
        this.borderColor = colors.border;

        // if children should be able to be focused
        this.ignoreChildUpdate = false;

        // if this shouldn't be moved by parent component
        this.absolutePosition = false;
        // index of when added
        this.idNumber = idCount++;

        // id name set by user
        this.id = "";

        
    }
}
Component.prototype.update = function() {}

Component.prototype.handleFocus = function() {
    if(componentPoint(this,mousePos)) {
        focusedComponent = this.idNumber;
    }
}

// draws overtop base draw
Component.prototype.draw = function() {}

// draw for every component, draws a box
Component.prototype.baseDraw = function() {
    if(this.showShadow) {UICtx.toggleShadow(true);}
    UICtx.fillStyle = this.backgroundColor;
    UICtx.fillRect(this.x,this.y,this.w,this.h);
    if(this.showShadow) {UICtx.toggleShadow(false);}
    if(this.showBorder) {
        UICtx.strokeStyle = this.borderColor;
        UICtx.beginPath();
        UICtx.rect(this.x,this.y,this.w,this.h);
        UICtx.stroke();
    }
}

// add child
Component.prototype.addChild = function(component) {
    component.position = this.children.length;
    component.parent = this;
    this.children.push(component);
}

// delete
Component.prototype.delete = function() {
    this.parent.removeChild(this.position);
}

// remove child
Component.prototype.removeChild = function(position) {
    this.children.splice(position,1);
    for(let i=0;i<this.children.length;i++) {
        this.children[i].position = i;
    }
}

// get component
function getComponentById(id) {
    for(let i=0;i<components.length;i++) {
        if(components[i].id === id) {
            return components[i];
        }
        let comp = searchForComponent(components[i],id);
        if(comp !== null) {
            return comp;
        }
    }
    return null;
}
function searchForComponent(component,id) {
    for(let i=0;i<component.children.length;i++) {
        if(component.children[i].id === id) {
            return component.children[i];
        }
        let comp = searchForComponent(component.children[i],id);
        if(comp !== null) {
            return comp;
        }
    }
    return null;
}

// draw
function drawComponents() {
    for(var i=0;i<components.length;i++) {
        if(components[i].show) {
            components[i].baseDraw();
            components[i].draw();
            drawChildren(components[i]);
        }
    }
}
function drawChildren(component) {
    for(let i=0;i<component.children.length;i++) {
        if( component.children[i].show) {
            component.children[i].baseDraw();
            component.children[i].draw();
            drawChildren(component.children[i]); 
        }
    }
}

// update
function updateComponents() {
    focusedComponent = null;
    for(var i=0;i<components.length;i++) {
        if(components[i].show) {
            components[i].handleFocus();
            handleFocusChild(components[i]);
        }
    }
    for(var i=0;i<components.length;i++) {
        components[i].update();
        updateChildren(components[i]);
    }
}
function handleFocusChild(component) {
    if(!component.ignoreChildUpdate) {
        for(let i=0;i<component.children.length;i++) {
            if(component.children[i].show) {
                component.children[i].handleFocus();
                handleFocusChild(component.children[i]);
            }
        }
    }
}
function updateChildren(component) {
    for(let i=0;i<component.children.length;i++) {
        component.children[i].update();
        updateChildren(component.children[i]);
    }
}

// rect point collision for ui
function componentPoint(rect,point) {
    if(rect.x + rect.w >= point.x &&
       rect.x <= point.x &&
       rect.y + rect.h >= point.y &&
       rect.y <= point.y ) {
        return true;
    } else {
        return false;
    }
}
