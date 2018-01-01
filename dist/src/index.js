"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handlebars = require("handlebars");
var fs = require("fs-extra");
var path = require("path");
var _ = require("lodash");
var randomID = require("random-id");
var jsondiffpatch = require('jsondiffpatch');
var _jsondiffpatch = jsondiffpatch.create();
var _jsondiffpatchFormatters = jsondiffpatch.formatters;
// remove any fns that may be passed
_jsondiffpatch.processor.pipes.diff.before('trivial', function (context) {
    if (typeof context.left === 'function' || typeof context.right === 'function') {
        context.setResult(undefined);
        context.exit();
    }
});
var BusybeeHtmlReporter = /** @class */ (function () {
    function BusybeeHtmlReporter(opts) {
        this.outputDir = opts.outputDir;
        this.projectName = opts.projectName;
    }
    BusybeeHtmlReporter.prototype.run = function (testSuiteResults) {
        // read the index out first...
        var filenames = fs.readdirSync(path.join(__dirname, 'templates'));
        var templateSrcs = {};
        filenames.forEach(function (f) {
            var name = path.basename(f).replace('.hbs', '');
            templateSrcs[name] = fs.readFileSync(path.join(__dirname, 'templates', f), 'utf8');
        });
        // 1. save off indexFile while partials are read and registered
        var indexFile = templateSrcs.index;
        delete templateSrcs.index;
        // 2. register partials
        Object.keys(templateSrcs).forEach(function (key) {
            Handlebars.registerPartial(key, templateSrcs[key]);
        });
        // 3. register helpers
        this.registerHelpers();
        try {
            // 4. compile the index template
            var indexTemplate = Handlebars.compile(indexFile);
            var data = {
                projectName: this.projectName,
                testSuites: this.decorateTestSuites(testSuiteResults)
            };
            // 5. generate html
            var html = indexTemplate(data);
            // 6. recreate output dir.
            fs.removeSync(this.outputDir);
            fs.mkdirSync(this.outputDir);
            fs.writeFileSync(path.join(this.outputDir, 'index.html'), html);
            fs.copySync(path.join(__dirname, 'assets'), path.join(this.outputDir, 'assets'));
        }
        catch (e) {
            console.log(e.message);
        }
    };
    /*
      adds metadata helpful for building html
     */
    BusybeeHtmlReporter.prototype.decorateTestSuites = function (testSuiteResults) {
        // filter out non-REST suites.
        var restSuites = _.filter(testSuiteResults, function (ts) { return ts.type === 'REST'; });
        console.log(restSuites.length);
        restSuites.forEach(function (testSuite) {
            testSuite.htmlID = testSuite.id.replace(/[^a-zA-Z0-9]/g, '');
            testSuite.testSets.forEach(function (testSet) {
                testSet.htmlID = testSet.id.replace(/[^a-zA-Z0-9]/g, '');
                testSet.tests.forEach(function (test) {
                    test.htmlID = "" + testSet.htmlID + test.id.replace(/[^a-zA-Z0-9]/g, '');
                });
            });
        });
        return restSuites;
    };
    BusybeeHtmlReporter.prototype.registerHelpers = function () {
        Handlebars.registerHelper('json', function (context) {
            return JSON.stringify(context, null, '\t');
        });
        Handlebars.registerHelper('diff', function (context) {
            if (!context.expected) {
                context.expected = "A custom assertion function was used. Unable to displayed 'expected'";
            }
            var delta = _jsondiffpatch.diff(context.expected, context.actual);
            return new Handlebars.SafeString(_jsondiffpatchFormatters.html.format(delta, context.expected));
        });
        Handlebars.registerHelper('sideBySide', function (context) {
            var expectedId = randomID(5, "aA");
            var actualId = randomID(5, "aA");
            var leftHtml = "<div class=\"compare-left col-6\" id=\"" + expectedId + "\"></div>";
            var rightHtml = " <div class=\"compare-right col-6\" id=\"" + actualId + "\"></div>";
            if (!context.expected) {
                leftHtml = "<div class=\"compare-left col-6\">A custom assertion function was used. Unable to displayed 'expected'</div>";
            }
            else {
                leftHtml += "\n          <script>\n            $(function() {\n              new PrettyJSON.view.Node({\n                el:$('#" + expectedId + "'),\n                data: " + JSON.stringify(context.expected) + "\n              });\n            });\n          </script>\n        ";
            }
            rightHtml += "\n        <script>\n        $(function() {\n          new PrettyJSON.view.Node({\n            el:$('#" + actualId + "'),\n            data: " + JSON.stringify(context.actual) + "\n          });\n        });\n        </script>\n      ";
            var html = "\n        <div class=\"row\">\n            <div class=\"col-6\"><h4>expected</h4></div>\n            <div class=\"col-6\"><h4>actual</h4></div>\n        </div>\n        <div class=\"row\">\n            " + leftHtml + "\n            " + rightHtml + "\n        </div>\n      ";
            return new Handlebars.SafeString(html);
        });
    };
    return BusybeeHtmlReporter;
}());
exports.BusybeeHtmlReporter = BusybeeHtmlReporter;
exports.default = BusybeeHtmlReporter;
//# sourceMappingURL=index.js.map