import * as React from "react";
import {createHighlighterCore, type GrammarState, type HighlighterCore} from "shiki/core";
import {createCssVariablesTheme} from "shiki/core";
import {createJavaScriptRegexEngine} from "shiki/engine/javascript";

// Token colors are CSS variables (--kk-code-*), mapped to Termicolor syntax roles in kernelkit.css,
// so highlighted code follows mode, contrast and scopes without re-highlighting.
const kernelkitTheme = createCssVariablesTheme({name: "kernelkit", variablePrefix: "--kk-code-", fontStyle: true});

// Add the languages you need. Each one loads the first time it is used.
const languages = {
    bash: () => import("shiki/langs/shellscript.mjs"),
    css: () => import("shiki/langs/css.mjs"),
    diff: () => import("shiki/langs/diff.mjs"),
    html: () => import("shiki/langs/html.mjs"),
    javascript: () => import("shiki/langs/javascript.mjs"),
    json: () => import("shiki/langs/json.mjs"),
    jsx: () => import("shiki/langs/jsx.mjs"),
    markdown: () => import("shiki/langs/markdown.mjs"),
    python: () => import("shiki/langs/python.mjs"),
    sql: () => import("shiki/langs/sql.mjs"),
    tsx: () => import("shiki/langs/tsx.mjs"),
    typescript: () => import("shiki/langs/typescript.mjs"),
    yaml: () => import("shiki/langs/yaml.mjs"),
};

const aliases: Record<string, keyof typeof languages> = {
    js: "javascript",
    md: "markdown",
    py: "python",
    sh: "bash",
    shell: "bash",
    shellscript: "bash",
    ts: "typescript",
    yml: "yaml",
    zsh: "bash",
};

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
    highlighter ??= createHighlighterCore({
        themes: [kernelkitTheme],
        langs: [],
        engine: createJavaScriptRegexEngine({forgiving: true}),
    });

    return highlighter;
}

function getLanguage(language: string) {
    const name = language.toLowerCase();

    if (name === "ansi") {
        return name;
    }

    if (name in languages) {
        return name as keyof typeof languages;
    }

    return aliases[name] ?? null;
}

// Loads a language and returns a highlighter for it, or null for a language
// that is not listed.
export async function loadHighlighter(language: string) {
    const lang = getLanguage(language);

    if (!lang) {
        return null;
    }

    const shiki = await getHighlighter();

    if (lang !== "ansi" && !shiki.getLoadedLanguages().includes(lang)) {
        await shiki.loadLanguage(languages[lang]);
    }

    return {
        // Returns one React node per line, and the grammar state after the last
        // line. Pass that state back to continue where the code left off.
        highlight(code: string, state?: GrammarState) {
            const tokenize = (text: string) =>
                shiki.codeToTokens(text, {
                    lang,
                    theme: "kernelkit",
                    grammarState: state,
                }).tokens;

            // ANSI has no grammar state, so each line is tokenized on its own and
            // gets the same colors whether it arrives in one piece or streams.
            const tokens = lang === "ansi" ? code.split("\n").flatMap((line) => tokenize(line)) : tokenize(code);

            return {
                lines: tokens.map((line) =>
                    line.map((token, index) => (
                        <span
                            key={index}
                            style={{
                                color: token.color,
                                fontStyle: token.fontStyle && token.fontStyle & 1 ? "italic" : undefined,
                                fontWeight: token.fontStyle && token.fontStyle & 2 ? "bold" : undefined,
                            }}
                        >
                            {token.content}
                        </span>
                    )),
                ),
                state: shiki.getLastGrammarState(tokens),
            };
        },
    };
}

// Returns one React node per line, or null for a language that is not listed.
export async function highlightCode(code: string, language: string) {
    const highlighter = await loadHighlighter(language);

    return highlighter ? highlighter.highlight(code).lines : null;
}
