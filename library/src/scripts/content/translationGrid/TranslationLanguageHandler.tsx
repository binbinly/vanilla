import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { TranslationGrid } from "@library/content/translationGrid/TranslationGrid";
import { ITranslationGrid } from "./TranslationGrid";
import { panelListClasses } from "@library/layout/panelListStyles";
import { translationGridClasses } from "@library/content/translationGrid/TranslationGridStyles";
import LanguagesDropDown from "@library/layout/LanguagesDropDown";
import { AlertIcon } from "@library/icons/common";
import { useUniqueID } from "@library/utility/idUtils";
import SelectBox, { ISelectBoxItem } from "@library/forms/select/SelectBox";
import { useLocaleInfo, LocaleDisplayer, ILocale, loadLocales } from "@vanilla/i18n";
import { ILoadable, LoadStatus } from "@library/@types/api/core";
import { ToolTip, ToolTipIcon } from "@library/toolTip/ToolTip";
import DateTime from "@library/content/DateTime";
import Translate from "@library/content/Translate";
import { ILanguageItem } from "@library/layout/LanguagesDropDown";

export interface ITranslation {
    id: string;
    source: string;
    translation: string;
    multiLine?: boolean; // We'll default to a textarea, that looks like a single line, but it would be much better to know.
    maxLength?: number; // Please add maximum character counts where possible.
}

export interface ITranslationDummy {
    // for storybook
    key: string;
    locale: string;
    source: string;
    translation: string;
    translationStatus: string;
    multiLine?: boolean;
    maxLength?: number;
}
export interface ITranslationLanguageHandler {
    data: ITranslation[];
    inScrollingContainer?: boolean;
    otherLanguages: ILanguageItem[];
    i18nLocales: ILocale[];
    dateUpdated?: string;
    newtranslationData: ITranslationDummy[]; // for storybook
}

export function TranslationLanguageHandler(props: ITranslationLanguageHandler) {
    const classesPanelList = panelListClasses();
    const id = useUniqueID("articleOtherLanguages");
    const currentLocale = "en";
    const classes = translationGridClasses();
    let selectedIndex = 0;
    let { newtranslationData } = props;

    const handleOnChange = (name: string) => {
        const filteredData = newtranslationData.filter(v => v.locale === name);
        setData(filteredData);
    };
    useEffect(() => {
        const filteredData = newtranslationData.filter(v => v.locale === "ca");
        setData(filteredData);
    }, [newtranslationData]);
    let [newData, setData] = useState(newtranslationData);

    const selectBoxItems: ISelectBoxItem[] = props.otherLanguages.map((data, index) => {
        const isSelected = data.locale === currentLocale;
        if (isSelected) {
            selectedIndex = index;
        }
        return {
            selected: isSelected,
            name: data.locale,
            icon: data.translationStatus === "not-translated" && (
                <ToolTip
                    label={
                        <Translate
                            source="This article was edited in source locale on <0/>. Edit this article to update its translation and clear this message."
                            c0={<DateTime timestamp={props.dateUpdated} />}
                        />
                    }
                    ariaLabel={"This article was editied in its source locale."}
                >
                    <span tabIndex={0}>
                        <AlertIcon className={"selectBox-selectedIcon"} />
                    </span>
                </ToolTip>
            ),
            content: (
                <>
                    <LocaleDisplayer displayLocale={data.locale} localeContent={data.locale} />
                </>
            ),
        };
    });
    return (
        <TranslationGrid
            {...props}
            newtranslationData={newData}
            rightHeaderCell={
                <div className={classes.languageDropdown}>
                    <div className={classNames("otherLanguages", "panelList", classesPanelList.root)}>
                        <LanguagesDropDown
                            titleID={id}
                            widthOfParent={true}
                            className="otherLanguages-select"
                            renderLeft={true}
                            data={props.otherLanguages}
                            currentLocale={currentLocale}
                            dateUpdated={props.dateUpdated}
                            selcteBoxItems={selectBoxItems}
                            selectedIndex={selectedIndex}
                            handleOnChange={handleOnChange}
                        />
                    </div>
                </div>
            }
            leftHeaderCell={<Translate source="<0/> (Source)" c0={"English"} />}
        />
    );
}