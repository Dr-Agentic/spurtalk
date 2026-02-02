import fs from 'fs';
import path from 'path';

const FORBIDDEN_COLORS = [
    { regex: /#ff0000/gi, name: 'Stark Red (#FF0000)' },
    { regex: /\bred\b/gi, name: 'Literal "red"' },
    { regex: /#ffffff/gi, name: 'Stark White (#FFFFFF)' },
    { regex: /\bwhite\b/gi, name: 'Literal "white"' },
];

const FORBIDDEN_WORDS = [
    'overdue',
    'late',
    'urgent',
];

const IGNORE_DIRS = [
    'node_modules',
    '.next',
    '.git',
    'dist',
    '.context',
    'scripts',
    'test-results',
    'playwright-report',
    'coverage',
];

const IGNORE_FILES = [
    'design-scanner.ts',
    'package-lock.json',
    'package.json',
];

const EXTENSIONS = ['.ts', '.tsx', '.css', '.scss', '.html'];

interface Violation {
    file: string;
    line: number;
    content: string;
    type: 'color' | 'word';
    match: string;
}

function scanFile(filePath: string): Violation[] {
    const violations: Violation[] = [];
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let inBlockComment = false;
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Handle Block Comments
        if (!inBlockComment && trimmedLine.includes('/*')) {
            inBlockComment = true;
        }

        const currentlyInBlock = inBlockComment;

        if (inBlockComment && trimmedLine.includes('*/')) {
            inBlockComment = false;
        }

        // Skip comments, imports, logs, and explicit ignore comments
        if (
            currentlyInBlock ||
            trimmedLine.startsWith('//') ||
            trimmedLine.startsWith('*') ||
            trimmedLine.startsWith('/*') ||
            trimmedLine.startsWith('import') ||
            trimmedLine.includes('console.') ||
            trimmedLine.includes('design-ignore')
        ) {
            return;
        }

        // Strip inline comments for the check, but preserve original for ignore-check
        const lineWithoutInlineComments = line.split('//')[0];

        // Check Colors
        FORBIDDEN_COLORS.forEach(({ regex, name }) => {
            const matches = lineWithoutInlineComments.match(regex);
            if (matches) {
                violations.push({
                    file: filePath,
                    line: index + 1,
                    content: line.trim(),
                    type: 'color',
                    match: name,
                });
            }
        });

        // Check Words
        FORBIDDEN_WORDS.forEach((word) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = lineWithoutInlineComments.match(regex);
            if (matches) {
                violations.push({
                    file: filePath,
                    line: index + 1,
                    content: line.trim(),
                    type: 'word',
                    match: word,
                });
            }
        });
    });

    return violations;
}

function walk(dir: string, allViolations: Violation[]) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                walk(fullPath, allViolations);
            }
        } else {
            if (EXTENSIONS.includes(path.extname(file)) && !IGNORE_FILES.includes(file)) {
                allViolations.push(...scanFile(fullPath));
            }
        }
    });
}

function main() {
    console.log('🚀 Starting Anti-Guilt Design Scanner...');
    const allViolations: Violation[] = [];
    const rootDir = process.cwd();

    const targetDirs = ['web', 'backend', 'shared', 'mobile'];
    targetDirs.forEach(dir => {
        const fullPath = path.join(rootDir, dir);
        if (fs.existsSync(fullPath)) {
            walk(fullPath, allViolations);
        }
    });

    if (allViolations.length === 0) {
        console.log('✅ No design violations found! Your project is psychologically safe.');
        process.exit(0);
    }

    console.log(`❌ Found ${allViolations.length} violations:`);
    allViolations.forEach((v) => {
        console.log(`[${v.type.toUpperCase()}] ${v.file}:${v.line}`);
        console.log(`  Match: ${v.match}`);
        console.log(`  Line:  ${v.content}`);
        console.log('');
    });

    process.exit(1);
}

main();
