import { click as untrackedClick, currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { vizzlyScreenshot } from '@vizzly-testing/ember/test-support';
import faker from 'faker';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

const moduleName = 'Acceptance | meetings | index';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('meetings index', async function(assert) {
        server.createList('meeting', 15);
        server.create('meeting', { name: faker.lorem.paragraph() });
        await visit('/meetings');
        assert.equal(currentURL(), '/meetings', "Still at '/meetings'.");
        await vizzlyScreenshot('meetings-index-initial-view', {
            feature: 'meetings',
            page: 'index',
            scenario: 'initial-load',
        });
        await untrackedClick('[data-test-register-button]');
        await untrackedClick('[data-test-upload-button]');
        await click('[data-test-next-page-button]');
        await vizzlyScreenshot('meetings-index-panels-expanded-page-2', {
            feature: 'meetings',
            page: 'index',
            scenario: 'panels-open-paginated',
        });
    });
});
