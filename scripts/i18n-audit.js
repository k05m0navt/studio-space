const fs = require('fs');
const path = require('path');

const root = process.cwd();
const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
const ignoreDirs = new Set(['node_modules', '.next', 'out', 'dist', 'public/messages', 'messages', '.git']);

function walk(dir) {
	let results = [];
	for (const name of fs.readdirSync(dir)) {
		const full = path.join(dir, name);
		const stat = fs.statSync(full);
		if (stat.isDirectory()) {
			if (ignoreDirs.has(name)) continue;
			results = results.concat(walk(full));
		} else if (exts.includes(path.extname(name))) {
			results.push(full);
		}
	}
	return results;
}

function findStringsInFile(file) {
	const content = fs.readFileSync(file, 'utf8');
	const lines = content.split(/\r?\n/);
	const stringRegex = /(['\"])((?:(?=(\\?)).){3,}?)\1/g;
	const jsxTextRegex = />\s*([^<>{}\n]{3,})\s*</g;
	let matches = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		let m;
		while ((m = stringRegex.exec(line)) !== null) {
			const raw = m[2];
			// skip import/export/module specifiers and simple tokens
			if (/^\s*\w+:\/\//.test(raw)) continue;
			if (/^[A-Za-z0-9_\-]+$/i.test(raw)) continue;
			matches.push({ line: i + 1, text: raw.trim() });
		}
		while ((m = jsxTextRegex.exec(line)) !== null) {
			const raw = m[1];
			matches.push({ line: i + 1, text: raw.trim() });
		}
	}
	// Filter duplicates
	const unique = [];
	const seen = new Set();
	for (const it of matches) {
		const key = `${it.line}:${it.text}`;
		if (!seen.has(key)) {
			seen.add(key);
			unique.push(it);
		}
	}
	return unique;
}

function run() {
	console.log('Scanning for potential hard-coded strings...');
	const files = walk(root);
	const report = [];
	for (const file of files) {
		try {
			const matches = findStringsInFile(file);
			if (matches.length) {
				report.push({ file: path.relative(root, file), matches });
			}
		} catch (err) {
			// ignore
		}
	}
	if (!fs.existsSync('.reports')) fs.mkdirSync('.reports');
	fs.writeFileSync('.reports/i18n-audit.json', JSON.stringify(report, null, 2));
	console.log(`Found ${report.length} files with candidate strings. Report written to .reports/i18n-audit.json`);
	for (const entry of report) {
		console.log('\n' + entry.file);
		for (const m of entry.matches.slice(0, 10)) {
			console.log(`  L${m.line}: ${m.text}`);
		}
		if (entry.matches.length > 10) console.log(`  ... +${entry.matches.length - 10} more`);
	}
}

run();
