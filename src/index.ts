import * as Handlebars from 'handlebars';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as _ from 'lodash';
import * as randomID from 'random-id';
const jsondiffpatch = require('jsondiffpatch');
const _jsondiffpatch = jsondiffpatch.create();
const _jsondiffpatchFormatters = jsondiffpatch.formatters;

export class BusybeeHtmlReporter {

  outputDir: string;
  projectName: string;

  constructor(opts: any) {
    this.outputDir = opts.outputDir;
    this.projectName = opts.projectName;
  }

  run(testSetResults: any) {
    // read the index out first...
    let filenames = fs.readdirSync(path.join(__dirname, 'templates'));
    let templateSrcs: any = {};
    filenames.forEach(f => {
      let name = path.basename(f).replace('.hbs', '');
      templateSrcs[name] = fs.readFileSync(path.join(__dirname, 'templates', f), 'utf8');
    });

    console.log(JSON.stringify(templateSrcs));
    // 1. save off indexFile while partials are read and registered
    let indexFile = templateSrcs.index;
    delete templateSrcs.index;

    // 2. register partials
    Object.keys(templateSrcs).forEach(key => {
      Handlebars.registerPartial(key, templateSrcs[key]);
    });

    // 3. register helpers
    this.registerHelpers();

    // 4. compile the index template
    let indexTemplate = Handlebars.compile(indexFile);


    let data = {
      projectName: this.projectName,
      testSuites: this.decorateTestSuites(testSetResults)
    };

    let html = indexTemplate(data);

    try {
      fs.statSync(this.outputDir);
      fs.rmdir(this.outputDir);
    } catch (e) {
      fs.mkdirSync(this.outputDir);
    }

    fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
    fs.copySync(path.join(__dirname, 'assets'), path.join(this.outputDir, 'assets'));
  }

  /*
    adds metadata helpful for building html
   */
  decorateTestSuites(testSuiteResults: any[]): any {
    // filter out non-REST suites.

    let restSuites = _.filter(testSuiteResults, ts => { return ts.type === 'REST'; });

    restSuites.forEach(testSuite => {
      testSuite.htmlID = testSuite.id.replace(/[^a-zA-Z0-9]/g,'');
      testSuite.testSets.forEach(testSet => {
        testSet.htmlID = testSet.id.replace(/[^a-zA-Z0-9]/g,'');
        testSet.tests.forEach(test => {
          test.htmlID = `${testSet.htmlID}${test.id.replace(/[^a-zA-Z0-9]/g,'')}`;
        });
      });
    });

    return testSuiteResults;
  }

  registerHelpers() {
    Handlebars.registerHelper('json', (context:any) => {
      return JSON.stringify(context, null, '\t');
    });

    Handlebars.registerHelper('diff', context => {
      if (!context.expected) {
        context.expected = "A custom assertion function was used. Unable to displayed 'expected'";
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
        leftHtml = `<div class="compare-left col-6">A custom assertion function was used. Unable to displayed 'expected'</div>`;
      } else {
        leftHtml += `
          <script>
            $(function() {
              new PrettyJSON.view.Node({
                el:$('#${expectedId}'),
                data: ${JSON.stringify(context.expected)}
              });
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
          });
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
  }

}

export default BusybeeHtmlReporter;
