import { test, expect } from 'playwright-test-coverage';
import {
    CONFIG_FILES,
    SIDEBAR_CLIP,
    SIDEBAR_NARROW_CLIP
} from './constants';
import {
    haConfigRequest,
    fulfillJson,
    changeToMobileViewport
} from './utilities';
import { SELECTORS } from './selectors';

test.beforeAll(async () => {
    await haConfigRequest(CONFIG_FILES.BASIC);
});

test('a new item with notification should behave propely when the sidebar is collapsed', async ({ page }) => {

    await fulfillJson(page, {
        order: [
            {
                new_item: true,
                item: 'Integrations',
                href: '/config/integrations',
                icon: 'mdi:puzzle',
                notification: '2'
            }
        ]
    });

    await page.goto('/');
    await expect(page.locator(SELECTORS.HA_SIDEBAR)).toBeVisible();
    await expect(page.locator(SELECTORS.HUI_VIEW)).toBeVisible();

    await page.locator(SELECTORS.SIDEBAR_HA_ICON_BUTTON).click();

    await expect(page).toHaveScreenshot('01-sidebar-new-item-notification-collapsed.png', {
        clip: {
            ...SIDEBAR_CLIP,
            width: 55
        }
    });

    await page.locator(SELECTORS.SIDEBAR_HA_ICON_BUTTON).click();

});

test('If sidebar_mode is set to "narrow" the sidebar should be visible in narrow mode in mobile', async ({ page }) => {

    await fulfillJson(page, {
        sidebar_mode: 'narrow'
    });

    await changeToMobileViewport(page);

    await page.goto('/');

    await expect(page.locator(SELECTORS.HA_SIDEBAR)).not.toHaveAttribute('narrow');

    await expect(page).toHaveScreenshot('02-sidebar-mode-narrow.png', {
        clip: SIDEBAR_NARROW_CLIP
    });

});

test('If sidebar_mode is set to "extended" the sidebar should be visible in extended mode in mobile', async ({ page }) => {

    await fulfillJson(page, {
        sidebar_mode: 'extended'
    });

    await changeToMobileViewport(page);

    await page.goto('/');

    await expect(page.locator(SELECTORS.HA_SIDEBAR)).not.toHaveAttribute('narrow');

    await expect(page).toHaveScreenshot('03-sidebar-mode-extended.png', {
        clip: {
            ...SIDEBAR_NARROW_CLIP,
            width: 255
        }
    });

});

test('If sidebar_mode is set to "hidden" the sidebar should not be visible in desktop', async ({ page }) => {

    await fulfillJson(page, {
        sidebar_mode: 'hidden'
    });

    await page.goto('/');

    await expect(page.locator(SELECTORS.HUI_VIEW)).toBeVisible();

    await expect(page.locator(SELECTORS.HA_SIDEBAR)).not.toBeVisible();

});