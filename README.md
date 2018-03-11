# busybee-html-reporter
-------
A Busybee 'REST' TestSuite reporter that reports results as a static HTML site.

## Quickstart

**Requires NodeJS 8 or higher**

```
# include the BusybeeHtmlReporter at the top of your busybee conf.js
const BusybeeHtmlReporter = require('busybee-html-reporter').BusybeeHtmlReporter;

...

# add the following property at the top-level of your busybee conf.js
reporters: [
    new BusybeeHtmlReporter({
      projectName: '<YOUR_PROJECT_NAME>',
      outputDir: path.join(process.cwd(), 'busybee-html-output'),
      skipInLocalMode: false
    })
]
```

