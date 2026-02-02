import { getState, reRunPlugin, saveState } from './stateManager';
import { onEvent, customEvents, addEvent, getById } from './utils';
import enTabs from '../translations/en_tabs.json';
import en from '../translations/en.json';

const CHANGE_EVENT = 'change';

/** @type {HTMLInputElement} */
const tabsCheckbox = getById('pm-tabs');

/**
 * Update translations based on tabs mode
 * @param {boolean} useTabs
 * @param {object} state
 */
function updateTranslationsForTabs(useTabs, state) {
    const translations = state._cookieConsentConfig.language.translations;

    // Update English translation
    if (useTabs) {
        translations.en = enTabs;
    } else {
        translations.en = en;
    }
}

addEvent(tabsCheckbox, CHANGE_EVENT, function() {
    const useTabs = this.checked;
    const state = getState();

    state._useTabsLayout = useTabs;
    updateTranslationsForTabs(useTabs, state);

    saveState(state);
    reRunPlugin(state, 2); // Show preferences modal to see the change
});

onEvent(customEvents._INIT, () => {
    const state = getState();
    tabsCheckbox.checked = state._useTabsLayout || false;

    // Ensure translations are in sync with tabs state
    if (state._useTabsLayout) {
        updateTranslationsForTabs(true, state);
        saveState(state);
    }
});

onEvent(customEvents._RESET, () => {
    tabsCheckbox.checked = false;
});
