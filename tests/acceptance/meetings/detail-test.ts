import { currentURL, visit } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { vizzlyScreenshot } from '@vizzly-testing/ember/test-support';
import faker from 'faker';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

const moduleName = 'Acceptance | meetings | detail';

module(moduleName, hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    test('meetings detail', async function(assert) {
        const longTitleSubmission = server.create('meeting-submission', {
            title: faker.lorem.paragraph(),
        });
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            submissions: server.createList('meeting-submission', 15).concat(longTitleSubmission),
        });
        await visit('/meetings/testmeeting');
        assert.equal(currentURL(), '/meetings/testmeeting', "Still at '/meetings/testmeeting'.");
        await vizzlyScreenshot('meetings-detail-initial-view', {
            feature: 'meetings',
            page: 'detail',
            scenario: 'initial-load',
        });
        await click('[data-test-meeting-toggle-panel-button]');
        await click('[data-test-next-page-button]');
        await vizzlyScreenshot('meetings-detail-panel-expanded-page-2', {
            feature: 'meetings',
            page: 'detail',
            scenario: 'panel-open-paginated',
        });
    });
});
