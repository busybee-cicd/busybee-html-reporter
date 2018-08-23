import * as fs from 'fs-extra';
import * as path from 'path';
export default class BusybeeHtmlReporter {

  outputDir: string;
  projectName: string;
  skipInLocalMode: boolean;

  constructor(opts: any) {
    this.outputDir = opts.outputDir;
    this.projectName = opts.projectName;
    this.skipInLocalMode = opts.skipInLocalMode;
  }

  run(testResults:any) {
    if (this.skipInLocalMode) { return; }

    let page = `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="utf-8">
                <title> ${'Busybee Results'} </title>
              </head>
              <body>
                <div class="content">
                   <div id="app" class="wrap-inner">
                   </div>
                </div>
                <script>
                  window.busybeeResults = ${JSON.stringify(testResults)}
                </script>
                <script src="assets/bundle.js"></script>
              </body>
              </html>
              `;

    // 6. recreate output dir.
    fs.removeSync(this.outputDir);
    fs.mkdirSync(this.outputDir);

    fs.writeFileSync(path.join(this.outputDir, 'index.html'), page);
    fs.copySync(path.join(__dirname, 'assets'), path.join(this.outputDir, 'assets'));
  }

}
