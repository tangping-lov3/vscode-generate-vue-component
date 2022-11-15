import MagicString from 'magic-string';

export function injectClassName(content: string, className: string) {
  const s = new MagicString(content);
  const matched = content.match(/class="([^"]*)"/);
  if (matched) {
    const [_] = matched;
    const index = matched.index!
    s.overwrite(index, index + _.length, className);
    return s.toString();
  }
  return content.replace(/<div/, `<div class="${className}"`);
}

export function injectScriptLang(content: string, lang: string) {
  if (!lang) return content;
  const s = new MagicString(content);
  const matched = content.match(/<script([^>]*)>/);
  if (matched) {
    const [_, group] = matched;
    const index = matched.index!
    s.overwrite(index, index + _.length, `<script${group ? group : ' '} lang="${lang}">`);
    return s.toString();
  }
  return content.replace(/<script/, `<script lang="${lang}"`);

}

export function injectStyleLang(content: string, lang: string, className: string) {
  const s = new MagicString(content);
  const matched = content.match(/<style.*>/);
  const append = `<style${ lang ? ` lang="${lang}"` : '' }>
  .${className} {
  
  }`
  if (matched) {
    const [_] = matched;
    const index = matched.index!
    s.overwrite(index, index + _.length, append);
    return s.toString();
  }
  return content.replace(/<style/, append);
}

export function resolveParams(filename: string) {
  const [name, ...ext] = filename.split('.');
  let scriptLang = ''
  let styleLang = ''
  for (const v of ext) {
    if (v === 'vue') {
      scriptLang = 'vue';
    }
    if (v === 'tsx') {
      scriptLang = 'tsx';
    }
    if (v === 'jsx') {
      scriptLang = 'jsx';
    }
    if (v === 'ts') {
      scriptLang = 'ts';
    }
    if (v === 'scss') {
      styleLang = 'scss';
    }
    if (v === 'less') {
      styleLang = 'less';
    }
    if (v === 'stylus') {
      styleLang = 'stylus';
    }
  }
  return {
    scriptLang,
    styleLang,
    name
  }
}