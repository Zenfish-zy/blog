import { visit } from "unist-util-visit";


const languageAliasMap = new Map([
    ["bash", "bash"],
    ["shell", "bash"],
    ["sh", "bash"],
    ["powershell", "powershell"],
    ["ps1", "powershell"],
    ["plaintext", "text"],
    ["plain", "text"],
    ["text", "text"],
    ["toml", "toml"],
]);

export function remarkNormalizeCodeLang() {
    return (tree) => {
        visit(tree, "code", (node) => {
            if (!node.lang) {
                return;
            }

            const normalized = languageAliasMap.get(node.lang.trim().toLowerCase());
            if (normalized) {
                node.lang = normalized;
            }
        });
    };
}
