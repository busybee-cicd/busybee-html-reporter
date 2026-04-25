import * as path from 'path';
import * as fs from 'fs';
import { beforeAll, afterAll, test, expect } from 'vitest';
import BusybeeHtmlReporter from '../dist/index.js';
import resultJson from './test-suite-result.json';

const outputDir = path.join(process.cwd(), 'output');

beforeAll(() => {
    const reporter = new BusybeeHtmlReporter({ outputDir });
    reporter.run(resultJson);
});

afterAll(() => {
    fs.rmSync(outputDir, { recursive: true, force: true });
});

test('generates index.html with React mount point and bundle reference', () => {
    const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
    expect(html).toContain('id="app"');
    expect(html).toContain('src="assets/bundle.js"');
});

test('embeds test results as window.busybeeResults for the React component', () => {
    const html = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
    const match = html.match(/window\.busybeeResults = ([\s\S]+?)\s*<\/script>/);
    expect(match).not.toBeNull();
    const embedded = JSON.parse(match![1]);
    expect(embedded).toEqual(resultJson);
});

test('copies assets/bundle.js so the busybee-results-react component loads', () => {
    const bundlePath = path.join(outputDir, 'assets', 'bundle.js');
    expect(fs.existsSync(bundlePath)).toBe(true);
    expect(fs.statSync(bundlePath).size).toBeGreaterThan(0);
});
