/**
 * Primary bootstrapping of the frontend JS. This entrypoint should be the last once executed.
 *
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import { onContent, getMeta, _executeReady } from "@library/utility/appUtils";
import { logDebug, logError, debug } from "@vanilla/utils";
import { translationDebug } from "@vanilla/i18n";
import apiv2 from "@library/apiv2";
import { mountInputs } from "@library/forms/mountInputs";
import { onPageView } from "@library/pageViews/pageViewTracking";
import { History } from "history";
import { _mountComponents } from "@library/utility/componentRegistry";
import { blotCSS } from "@rich-editor/quill/components/blotStyles";
import { bootstrapLocales } from "@library/locales/localeBootstrap";

if (!getMeta("featureFlags.useFocusVisible.Enabled", true)) {
    document.body.classList.add("hasNativeFocus");
}

// Inject the debug flag into the utility.
const debugValue = getMeta("context.debug", getMeta("debug", false));
debug(debugValue);

const translationDebugValue = getMeta("context.translationDebug", false);
translationDebug(translationDebugValue);

bootstrapLocales();

// Export the API to the global object.
window.gdn.apiv2 = apiv2;

// Record the page view.
onPageView((params: { history: History }) => {
    // Low priority so put a slight delay so other network requests run first.
    setTimeout(() => {
        void apiv2.post("/tick").then(() => {
            window.dispatchEvent(new CustomEvent("analyticsTick"));
        });
    }, 50);
});

logDebug("Bootstrapping");
_executeReady()
    .then(() => {
        logDebug("Bootstrapping complete.");
        // Mount all data-react components.
        onContent(e => {
            _mountComponents(e.target as HTMLElement);
            blotCSS();
            mountInputs();
        });

        const contentEvent = new CustomEvent("X-DOMContentReady", { bubbles: true, cancelable: false });
        document.dispatchEvent(contentEvent);
    })
    .catch(error => {
        logError(error);
    });
