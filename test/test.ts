import * as path from 'path';
import * as BusybeeHtmlReporter from '../dist/index.js';
import {test, TestContext} from 'ava-ts';

//let testFilesDir = path.join(process.cwd(), 'test/config/busybeeTests');

test(async (t: TestContext) => {
    let resultJson = require(path.join(process.cwd(), 'test', 'test-suite-result.json'));
    let reporter = new BusybeeHtmlReporter({outputDir: path.join(process.cwd(), 'output')});
    reporter.run(resultJson);
    t.pass();
});
