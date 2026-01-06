import { currentRouteName } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { vizzlyScreenshot } from '@vizzly-testing/ember/test-support';
import { module, test } from 'qunit';

import { Permission } from 'ember-osf-web/models/osf-model';
import { currentURL, visit } from 'ember-osf-web/tests/helpers';
import { setupEngineApplicationTest } from 'ember-osf-web/tests/helpers/engines';

module('Registries | Acceptance | overview.comments', hooks => {
    setupEngineApplicationTest(hooks, 'registries');
    setupMirage(hooks);

    test('it renders', async function(assert) {
        const registration = server.create(
            'registration',
            { currentUserPermissions: [Permission.Admin] },
            'withComments',
        );

        await visit(`/${registration.id}/comments`);
        await vizzlyScreenshot('registries-comments-list-view', {
            properties: { feature: 'registries', page: 'comments', scenario: 'list-with-comments' },
        });

        assert.equal(currentURL(), `/${registration.id}/comments`, 'At the guid URL');
        assert.equal(currentRouteName(), 'registries.overview.comments', 'At the expected route');
    });
});
