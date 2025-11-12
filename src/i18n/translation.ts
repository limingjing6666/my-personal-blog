// import { siteConfig } from "../config";
import type I18nKey from "./i18nKey";

import { zh_CN } from "./languages/zh_CN";
// import { zh_TW } from "./languages/zh_TW";

export type Translation = {
	[K in I18nKey]: string;
};

const defaultTranslation = zh_CN;

const map: { [key: string]: Translation } = {

	zh_cn: zh_CN,
	
};

export function getTranslation(lang: string): Translation {
	return map[lang.toLowerCase()] || defaultTranslation;
}

export function i18n(key: I18nKey): string {
	// // 优先使用 localStorage 中的语言设置
	// let lang = siteConfig.lang || "en";
	// if (typeof window !== "undefined") {
	// 	const savedLang = localStorage.getItem("blogLanguage");
	// 	if (savedLang) {
	// 		lang = savedLang;
	// 	}
	// }
	// return getTranslation(lang)[key];
	return getTranslation("zh_CN")[key];
}
