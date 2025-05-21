// Use require instead of import
var XmlDomParser = require("xmldom").DOMParser;

var xmlCode = "<xml xmlns=\"http://www.w3.org/1999/xhtml\">\n  <variables></variables>\n  <block type=\"control_if\" id=\"bR?Xn6-)t*BrCEDO[$j@\" x=\"405\" y=\"77\">\n    <value name=\"CONDITION\">\n      <block type=\"digital_digital\" id=\"7hfIsI`SxU(4=L4EMt)k\">\n        <value name=\"PORT\">\n          <shadow type=\"math_number\" id=\"LIW+!U{MA3Wlxd`9`Y]M\">\n            <field name=\"NUM\">0</field>\n          </shadow>\n        </value>\n      </block>\n    </value>\n  </block>\n</xml>";
// Function to parse the XML into a DOM object
var parseXml = function (xml) {
    var parser = new XmlDomParser();
    return parser.parseFromString(xml, "application/xml");
};
function isElement(node) {
    return node.nodeType === 1; // Node.ELEMENT_NODE
}
function parseBlockXml(blockElem) {
    var _a;
    var isShadow = blockElem.tagName === "shadow";
    var type = blockElem.getAttribute("type") || "unknown";
    var fields = {};
    var children = [];
    var nextBlock = null; // Variable to hold the next block
    // Iterate over child nodes
    for (var _i = 0, _b = Array.from(blockElem.childNodes); _i < _b.length; _i++) {
        var node = _b[_i];
        if (!isElement(node))
            continue;
        switch (node.tagName) {
            case "field": {
                var name_1 = node.getAttribute("name") || "";
                fields[name_1] = node.textContent || "";
                break;
            }
            case "value":
            case "statement": {
                var role = (_a = node.getAttribute("name")) === null || _a === void 0 ? void 0 : _a.toLowerCase(); // e.g., "condition", "substack"
                var blockChild = Array.from(node.childNodes).find(function (child) { return isElement(child) && child.tagName === "block"; }) || Array.from(node.childNodes).find(function (child) { return isElement(child) && child.tagName === "shadow"; });
                if (blockChild) {
                    var parsedChild = parseBlockXml(blockChild);
                    if (role)
                        parsedChild.role = role; // attach role
                    children.push(parsedChild);
                }
                break;
            }
            case "next": {
                // Handle the next block separately by parsing the block inside <next>
                var blockChild = Array.from(node.childNodes).find(function (child) { return isElement(child) && child.tagName === "block"; });
                if (blockChild) {
                    nextBlock = parseBlockXml(blockChild); // Store the next block separately
                }
                break;
            }
        }
    }
    // Construct the result object
    var result = { type: type };
    if (isShadow)
        result.shadow = true;
    if (Object.keys(fields).length > 0)
        result.fields = fields;
    if (children.length > 0)
        result.children = children;
    if (nextBlock)
        result.next = nextBlock; // Attach the next block if available
    return result;
}
module.exports = { parseXml: parseXml, parseBlockXml: parseBlockXml };
