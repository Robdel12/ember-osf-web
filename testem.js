/* eslint-env node */

const DotReporter = require('testem/lib/reporters/dot_reporter');
const { configure } = require('@vizzly-testing/ember');

module.exports = configure({
    framework: 'qunit',
    test_page: 'tests/index.html?hidepassed&dockcontainer&nocontainer',
    disable_watching: true,
    reporter: new DotReporter(),
    parallel: 2,
    launch_in_ci: ['Chrome'],
    launch_in_dev: ['Chrome'],
    browser_start_timeout: 120,
});
