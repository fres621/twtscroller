let reglist = new Set();
window.registerStyles = function (styles) {
    if (reglist.has(styles)) return;
    reglist.add(styles);
    let stylesheet = new CSSStyleSheet();
    for (let className in styles) {
        let item = stylesheet.cssRules.item(stylesheet.insertRule(`.${className} {}`))! as any as CSSStyleRule;
        for (let prop in styles[className]) {
            // console.log(prop, (styles[className] as any)[prop]);
            item.style[prop as any] = (styles[className] as any)[prop] + '';
        }
    }
    document.adoptedStyleSheets.push(stylesheet);
}