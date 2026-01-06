import { fillIn, visit } from '@ember/test-helpers';

import { setupMirage } from 'ember-cli-mirage/test-support';
import { vizzlyScreenshot } from '@vizzly-testing/ember/test-support';
import { module, test } from 'qunit';

import { click, setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

module('Acceptance | settings | account information page', hooks => {
    setupOSFApplicationTest(hooks);
    setupMirage(hooks);

    // primary email exists
    test('primary email exists', async function(assert) {
        server.create('user', 'loggedIn', 'withSettings');

        await visit('/settings/account');
        await vizzlyScreenshot('settings-account-primary-email-exists', {
            feature: 'settings',
            page: 'connected-emails',
            scenario: 'primary-email-displayed',
        });

        assert.dom('[data-test-primary-email]').exists();
    });

    // empty alternate/unconfirmed emails list
    test('empty email lists', async function(assert) {
        server.create('user', 'loggedIn', 'withSettings');

        await visit('/settings/account');
        await vizzlyScreenshot('settings-account-empty-email-lists', {
            feature: 'settings',
            page: 'connected-emails',
            scenario: 'empty-alternate-unconfirmed-lists',
        });

        assert.dom('[data-test-alternate-email-item]').doesNotExist();
        assert.dom('[data-test-unconfirmed-email-item]').doesNotExist();
    });

    test('email lists have emails', async function(assert) {
        server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail', 'withUnconfirmedEmail');

        await visit('/settings/account');
        await vizzlyScreenshot('settings-account-email-lists-populated', {
            feature: 'settings',
            page: 'connected-emails',
            scenario: 'alternate-and-unconfirmed-emails',
        });

        assert.dom('[data-test-alternate-email-item]').exists({ count: 1 });
        assert.dom('[data-test-unconfirmed-email-item]').exists({ count: 1 });
    });

    // add new email
    test('add new email', async function(assert) {
        server.create('user', 'loggedIn', 'withSettings');
        const emailAddress = 'testAccount@gmail.com';

        await visit('/settings/account');

        assert.dom('[data-test-unconfirmed-email-item]').doesNotExist();

        await fillIn('[data-test-add-email] input', emailAddress);
        await click('[data-test-add-email-button]');
        await vizzlyScreenshot('settings-account-add-new-email', {
            feature: 'settings',
            page: 'connected-emails',
            scenario: 'new-email-added-unconfirmed',
        });

        assert.dom(`[data-test-unconfirmed-email-item='${emailAddress}']`).exists();
    });

    // remove alternate email
    test('delete alternate email', async function(assert) {
        const user = server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail');

        const { emailAddress } = user.emails.models[1];

        await visit('/settings/account');

        assert.dom(`[data-test-alternate-email-item='${emailAddress}']`).exists();

        await click(`[data-test-alternate-email-item='${emailAddress}']
            [data-test-alternate-delete] [data-test-delete-button]`);

        await vizzlyScreenshot('settings-account-delete-email-confirm', {
            feature: 'settings',
            page: 'connected-emails',
            scenario: 'delete-alternate-email-dialog',
        });
        await click('[data-test-confirm-delete]');

        assert.dom(`[data-test-alternate-email-item='${emailAddress}']`).doesNotExist();
    });

    // make primary
    test('make email primary', async function(assert) {
        const user = server.create('user', 'loggedIn', 'withSettings', 'withAlternateEmail');

        const { emailAddress } = user.emails.models[1];

        await visit('/settings/account');
        assert.dom(`[data-test-alternate-email-item='${emailAddress}']`).exists();

        await click('[data-test-make-primary]');
        await vizzlyScreenshot('settings-account-make-email-primary', {
            feature: 'settings',
            page: 'connected-emails',
            scenario: 'alternate-promoted-to-primary',
        });
        assert.dom('[data-test-primary-email]').hasText(emailAddress);
    });

    // test resend_confirmation url
    test('resend confirmation', async function(assert) {
        assert.expect(2);

        const done = assert.async();

        const user = server.create('user', 'loggedIn', 'withSettings', 'withUnconfirmedEmail');

        const { emailAddress } = user.emails.models[1];

        server.namespace = '/v2';
        server.get('/users/:parentID/settings/emails/:emailID/', (_, request) => {
            assert.equal(request.queryParams.resend_confirmation, 'true');
            done();
        });

        await visit('/settings/account');

        await click(`[data-test-unconfirmed-email-item='${emailAddress}']
        [data-test-resend-confirmation-button]`);

        await vizzlyScreenshot('settings-account-resend-confirmation-dialog', {
            feature: 'settings',
            page: 'connected-emails',
            scenario: 'resend-email-confirmation',
        });
        await click('[data-test-resend-confirmation]');
    });
});
