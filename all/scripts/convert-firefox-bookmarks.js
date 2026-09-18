const fs = require('fs');
const path = require('path');

function extractAttributeValue(attrs, name) {
  const match = attrs.match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (!match) return '';
  return match[1] || match[2] || match[3] || '';
}

function decodeHtmlEntity(value) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/&nbsp;/gi, ' ');
}

function convertFirefoxJsonToJson(node, isRoot = false) {
  const converted = {
    name: isRoot ? 'Bookmarks' : node.title || 'Untitled folder',
    type: 'folder',
    children: [],
  };

  for (const child of node.children || []) {
    if (child.type === 'text/x-moz-place-container') {
      converted.children.push(convertFirefoxJsonToJson(child));
    } else if (child.type === 'text/x-moz-place' && child.uri) {
      converted.children.push({
        name: child.title || 'Untitled bookmark',
        type: 'bookmark',
        url: child.uri,
      });
    }
  }

  return converted;
}

function convertFirefoxHtmlToJson(html) {
  let normalized = html
    .replace(/<\s*\/\s*p\s*>/gi, '')
    .replace(/<\s*p[^>]*>/gi, '')
    .replace(/<\s*\/\s*dl\s*>/gi, '\n[/DL]\n')
    .replace(/<\s*dl[^>]*>/gi, '\n[DL]\n')
    .replace(/<\s*\/\s*dt\s*>/gi, '\n')
    .replace(/<\s*dt[^>]*>/gi, '\n')
    .replace(/<\s*\/\s*h3\s*>/gi, '\n')
    .replace(/<\s*h3[^>]*>/gi, '\n[FOLDER]');

  normalized = normalized.replace(/<\s*a\b([^>]*)>\s*([\s\S]*?)\s*<\s*\/\s*a\s*>/gi, (_, attrs, text) => {
    const href = decodeHtmlEntity(extractAttributeValue(attrs, 'href'));
    const title = decodeHtmlEntity((text || '').replace(/<[^>]+>/g, '').trim());
    const safeTitle = title || 'Untitled bookmark';
    return `\n[LINK]${safeTitle} | ${href}\n`;
  });

  normalized = normalized.replace(/<[^>]+>/g, '');

  const root = { name: 'Bookmarks', type: 'folder', children: [] };
  const stack = [root];

  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (line === '[DL]') continue;
    if (line === '[/DL]') {
      if (stack.length > 1) {
        stack.pop();
      }
      continue;
    }

    if (line.startsWith('[FOLDER]')) {
      const name = line.replace(/^\[FOLDER\]/, '').trim();
      const folder = { name, type: 'folder', children: [] };
      stack[stack.length - 1].children.push(folder);
      stack.push(folder);
      continue;
    }

    if (line.startsWith('[LINK]')) {
      const entry = line.replace(/^\[LINK\]/, '').trim();
      const separatorIndex = entry.lastIndexOf('|');
      const title = separatorIndex >= 0 ? entry.slice(0, separatorIndex).trim() : entry.trim();
      const url = separatorIndex >= 0 ? entry.slice(separatorIndex + 1).trim() : '';

      if (url) {
        stack[stack.length - 1].children.push({
          name: title || 'Untitled bookmark',
          type: 'bookmark',
          url,
        });
      }
    }
  }

  return root;
}

function main() {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3] || 'data/bookmarks.json';

  if (!inputPath) {
    console.error('Usage: node convert-firefox-bookmarks.js <firefox-export.html> [output.json]');
    process.exit(1);
  }

  const absoluteInputPath = path.resolve(inputPath);
  const absoluteOutputPath = path.resolve(outputPath);

  if (!fs.existsSync(absoluteInputPath)) {
    console.error(`Input file not found: ${absoluteInputPath}`);
    process.exit(1);
  }

  const input = fs.readFileSync(absoluteInputPath, 'utf8');
  let converted;

  if (path.extname(absoluteInputPath).toLowerCase() === '.json') {
    converted = convertFirefoxJsonToJson(JSON.parse(input), true);
  } else {
    converted = convertFirefoxHtmlToJson(input);
  }

  const json = JSON.stringify(converted, null, 2);

  fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
  fs.writeFileSync(absoluteOutputPath, `${json}\n`);

  console.log(`Converted Firefox bookarks export into ${absoluteOutputPath}`);
}

main();
