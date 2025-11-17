<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

let currentLang = "zh_CN";
let isOpen = false;

const languages = [
	{ code: "zh_CN", name: "简体中文", icon: "🇨🇳" },
	{ code: "en", name: "English", icon: "🇺🇸" },
];

onMount(() => {
	// 从 localStorage 读取保存的语言设置
	const savedLang = localStorage.getItem("blogLanguage");
	if (savedLang) {
		currentLang = savedLang;
	}

	// 应用语言到页面
	applyLanguageToPage(currentLang);
});

function applyLanguageToPage(lang: string) {
	// 更新 HTML lang 属性
	document.documentElement.lang = lang.replace("_", "-");

	// 触发自定义事件通知其他组件语言已更改
	window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

function toggleDropdown(event: MouseEvent) {
	event.stopPropagation();
	isOpen = !isOpen;
}

function selectLanguage(lang: string) {
	if (lang !== currentLang) {
		currentLang = lang;
		localStorage.setItem("blogLanguage", lang);
		applyLanguageToPage(lang);

		// 重新加载页面以应用新语言
		window.location.reload();
	}
	isOpen = false;
}

// 点击外部关闭下拉菜单
function handleClickOutside(event: MouseEvent) {
	const target = event.target as HTMLElement;
	if (!target.closest(".language-switch")) {
		isOpen = false;
	}
}

onMount(() => {
	document.addEventListener("click", handleClickOutside);
	return () => {
		document.removeEventListener("click", handleClickOutside);
	};
});

function getCurrentLanguage() {
	return languages.find((l) => l.code === currentLang) || languages[0];
}
</script>

<div class="language-switch relative">
	<button
		on:click={toggleDropdown}
		class="btn-language flex items-center gap-2 px-2 py-2 rounded-lg transition-colors
               hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]"
		aria-label="Switch Language / 切换语言"
		title="Switch Language / 切换语言"
	>
		<Icon icon="material-symbols:translate" class="text-[1.25rem]" />
	</button>

	{#if isOpen}
		<div
			class="language-dropdown absolute right-0 mt-2 w-48 rounded-lg shadow-lg
                   bg-[var(--card-bg)] border border-[var(--line-divider)]
                   overflow-hidden z-50"
		>
			{#each languages as lang}
				<button
					on:click={() => selectLanguage(lang.code)}
					class="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors
                           hover:bg-[var(--btn-plain-bg-hover)]
                           {lang.code === currentLang ? 'bg-[var(--btn-plain-bg-active)]' : ''}"
				>
					<span class="text-xl">{lang.icon}</span>
					<span class="flex-1 text-sm">{lang.name}</span>
					{#if lang.code === currentLang}
						<Icon icon="material-symbols:check" class="text-[var(--primary)]" />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-switch {
		display: inline-block;
	}

	.btn-language {
		cursor: pointer;
		border: none;
		background: transparent;
		color: var(--text-color);
		width: 2.75rem;
		height: 2.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.language-dropdown {
		min-width: 160px;
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	button {
		font-family: inherit;
	}
</style>
