import * as path from 'path';
import {BusybeeHtmlReporter} from '../src';
import {test, TestContext} from "ava";

//let testFilesDir = path.join(process.cwd(), 'test/config/busybeeTests');

test(async (t: TestContext) => {
    let resultJson = require(path.join(process.cwd(), 'test', 'test-suite-result.json'));
    let reporter = new BusybeeHtmlReporter({outputdir: path.join(process.cwd(), 'output')});
    reporter.run(resultJson);
    t.pass();
});
