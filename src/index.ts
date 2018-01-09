import * as Handlebars from 'handlebars';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as _ from 'lodash';
import * as randomID from 'random-id';
import * as moment from 'moment';
const jsondiffpatch = require('jsondiffpatch');
const _jsondiffpatch = jsondiffpatch.create();
const _jsondiffpatchFormatters = jsondiffpatch.formatters;

// remove any fns that may be passed
_jsondiffpatch.processor.pipes.diff.before('trivial', (context) => {
  if (typeof context.left === 'function' || typeof context.right === 'function' ) {
    context.setResult(undefined);
    context.exit();
  }
});

export class BusybeeHtmlReporter {

  outputDir: string;
  projectName: string;

  constructor(opts: any) {
    this.outputDir = opts.outputDir;
    this.projectName = opts.projectName;
  }

  run(testSuiteResults: any) {
    // read the index out first...
    let filenames = fs.readdirSync(path.join(__dirname, 'templates'));
    let templateSrcs: any = {};
    filenames.forEach(f => {
      let name = path.basename(f).replace('.hbs', '');
      templateSrcs[name] = fs.readFileSync(path.join(__dirname, 'templates', f), 'utf8');
    });

    // 1. save off indexFile while partials are read and registered
    let indexFile = templateSrcs.index;
    delete templateSrcs.index;

    // 2. register partials
    Object.keys(templateSrcs).forEach(key => {
      Handlebars.registerPartial(key, templateSrcs[key]);
    });

    // 3. register helpers
    this.registerHelpers();

    try {
      // 4. compile the index template
      let indexTemplate = Handlebars.compile(indexFile);
      let data = {
        projectName: this.projectName,
        testSuites: this.decorateTestSuites(testSuiteResults)
      };

      // 5. generate html
      let html = indexTemplate(data);

      // 6. recreate output dir.
      fs.removeSync(this.outputDir);
      fs.mkdirSync(this.outputDir);

      fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
      fs.copySync(path.join(__dirname, 'assets'), path.join(this.outputDir, 'assets'));
    } catch (e) {
      console.log(e.message);
    }

  }

  /*
    adds metadata helpful for building html
   */
  decorateTestSuites(testSuiteResults: any[]): any {
    // filter out non-REST suites.

    let restSuites = _.filter(testSuiteResults, ts => { return ts.type === 'REST'; });

    console.log(restSuites.length);
    restSuites.forEach(testSuite => {
      testSuite.htmlID = testSuite.id.replace(/[^a-zA-Z0-9]/g,'');
      testSuite.testSets.forEach(testSet => {
        testSet.htmlID = testSet.id.replace(/[^a-zA-Z0-9]/g,'');
        testSet.tests.forEach(test => {
          test.htmlID = `${testSet.htmlID}${test.id.replace(/[^a-zA-Z0-9]/g,'')}`;
        });
      });
    });

    return restSuites;
  }

  registerHelpers() {
    Handlebars.registerHelper('json', (context:any) => {
      return JSON.stringify(context, null, '\t');
    });

    Handlebars.registerHelper('diff', context => {
      if (!context.expected) {
        context.expected = "A custom assertion function was used and no specific error was thrown.";
      }

      let delta = _jsondiffpatch.diff(context.expected, context.actual);
      return new Handlebars.SafeString(_jsondiffpatchFormatters.html.format(delta, context.expected));
    });

    Handlebars.registerHelper('sideBySide', context => {
      let expectedId = randomID(5,"aA");
      let actualId = randomID(5,"aA");
      let leftHtml = `<div class="compare-left col-6" id="${expectedId}"></div>`;
      let rightHtml = ` <div class="compare-right col-6" id="${actualId}"></div>`;

      if (!context.expected) {
        leftHtml = `<div class="compare-left col-6">A custom assertion function was used and no specific error was thrown.</div>`;
      } else {
        leftHtml += `
          <script>
            $(function() {
              new PrettyJSON.view.Node({
                el:$('#${expectedId}'),
                data: ${JSON.stringify(context.expected)}
              }).expandAll();
            });
          </script>
        `;
      }

      rightHtml += `
        <script>
        $(function() {
          new PrettyJSON.view.Node({
            el:$('#${actualId}'),
            data: ${JSON.stringify(context.actual)}
          }).expandAll();
        });
        </script>
      `;

      let html = `
        <div class="row">
            <div class="col-6"><h4>expected</h4></div>
            <div class="col-6"><h4>actual</h4></div>
        </div>
        <div class="row">
            ${leftHtml}
            ${rightHtml}
        </div>
      `;

      return new Handlebars.SafeString(html);
    });

    Handlebars.registerHelper('jsonPretty', json => {

      let id = randomID(5,"aA");
      let div = `<div id="${id}"></div>`;
      let script =
        `<script>
            $(function() {
              new PrettyJSON.view.Node({
                el:$('#${id}'),
                data: ${JSON.stringify(json)}
              }).expandAll();
            });
          </script>`;

      let html = `${div}${script}`;

      return new Handlebars.SafeString(html);
    });

    Handlebars.registerHelper('jsonRaw', json => {
      let html = `<pre>${JSON.stringify(json, null, '\t')}</pre>`;

      return new Handlebars.SafeString(html);
    });


    Handlebars.registerHelper('currentTime', context => {
      return moment().format();
    });
  }

}

export default BusybeeHtmlReporter;
