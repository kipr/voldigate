const { DOMParser: XmlDomParser } = require("xmldom");

const modules = [
  "wait_for",
  "time",
  "motor",
  "servo",
  "digital",
  "analog",
  "Control",
  "Operators",
  "Variables",
];

type BlockNode = {
  type: string;
  shadow?: boolean;
  fields?: Record<string, string>;
  children?: BlockNode[];
  role?: string;
  next?: BlockNode; // Added next property
};

// Function to parse the XML into a DOM object
const parseXml = (xml: string) => {
  const parser = new XmlDomParser();
  return parser.parseFromString(xml, "application/xml");
};

function isElement(node: Node): node is Element {
  return node.nodeType === 1; // Node.ELEMENT_NODE
}

function parseBlockXml(blockElem: Element): BlockNode {
  const isShadow = blockElem.tagName === "shadow";
  const type = blockElem.getAttribute("type") || "unknown";

  const fields: Record<string, string> = {};
  const children: BlockNode[] = [];
  let nextBlock: BlockNode | null = null; // Variable to hold the next block

  // Iterate over child nodes
  for (const node of Array.from(blockElem.childNodes)) {
    if (!isElement(node)) continue;

    switch (node.tagName) {
      case "field": {
        const name = node.getAttribute("name") || "";
        fields[name] = node.textContent || "";
        break;
      }
      case "value":
      case "statement": {
        const role = node.getAttribute("name")?.toLowerCase(); // e.g., "condition", "substack"
        const blockChild = Array.from(node.childNodes).find(
          (child): child is Element => isElement(child) && child.tagName === "block"
        ) || Array.from(node.childNodes).find(
          (child): child is Element => isElement(child) && child.tagName === "shadow"
        );
        if (blockChild) {
          const parsedChild = parseBlockXml(blockChild);
          if (role) parsedChild.role = role; // attach role
          children.push(parsedChild);
        }
        break;
      }
      case "next": {
        // Handle the next block separately by parsing the block inside <next>
        const blockChild = Array.from(node.childNodes).find(
          (child): child is Element => isElement(child) && child.tagName === "block"
        );
        if (blockChild) {
          nextBlock = parseBlockXml(blockChild); // Store the next block separately
        }
        break;
      }
    }
  }

  // Construct the result object
  const result: BlockNode = { type };
  if (isShadow) result.shadow = true;
  if (Object.keys(fields).length > 0) result.fields = fields;
  if (children.length > 0) result.children = children;
  if (nextBlock) result.next = nextBlock; // Attach the next block if available

  return result;
}



module.exports = { parseXml, parseBlockXml };