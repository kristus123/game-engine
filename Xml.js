export default class Xml {
    static parse(xml) {
        const root = { name: null, attributes: {}, children: [] };
        const stack = [root];

        const tokens = xml.match(/<[^>]+>|[^<]+/g) || [];

        for (const token of tokens) {
            if (token.startsWith('<?') || token.startsWith('<!')) continue;

            if (token.startsWith('</')) {
                stack.pop();
                continue;
            }

            if (token.startsWith('<')) {
                const selfClosing = token.endsWith('/>');
                const content = token.slice(1, selfClosing ? -2 : -1).trim();
                const name = content.match(/^[^\s/]+/)[0];
                const attributes = {};

                const regex = /([^\s=]+)="([^"]*)"/g;
                let match;

                while ((match = regex.exec(content))) {
                    attributes[match[1]] = match[2];
                }

                const node = {
                    name,
                    attributes,
                    children: [],
                    text: null
                };

                stack.at(-1).children.push(node);

                if (!selfClosing) stack.push(node);

                continue;
            }

            const text = token.trim();

            if (text) {
                stack.at(-1).text = text;
            }
        }

        return root.children[0];
    }

	static findAll(node, name, result = []) {
		if (node.name === name) result.push(node);

		for (const child of node.children || []) {
			Xml.findAll(child, name, result);
		}

		return result;
	}

	static find(node, name) {
		return Xml.findAll(node, name)[0] || null;
	}


}
