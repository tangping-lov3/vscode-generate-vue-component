import MagicString from 'magic-string';
import * as vscode from 'vscode'
import { promises as fs } from 'fs'
import { join } from 'path'

export function injectClassName(content: string, className: string) {
  className = transfrom(className)
  const s = new MagicString(content);
  const matched = content.match(/class="([^"]*)"/);
  if (matched) {
    const [_] = matched;
    const index = matched.index!
    s.overwrite(index, index + _.length, `class="${className}"`);
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
    s.overwrite(index, index + _.length, `<script${group ? group : ''} lang="${lang}">`);
    return s.toString();
  }
  return content.replace(/<script/, `<script lang="${lang}"`);

}

export function injectStyleLang(content: string, lang: string, className: string) {
  className = transfrom(className)
  const s = new MagicString(content);
  const matched = content.match(/<style[^>]+>/);
  const append = `<style${ lang ? ` lang="${lang}"` : '' }>
  .${className} {
  
  }
`
  if (matched) {
    const [_] = matched;
    const index = matched.index!
    s.overwrite(index, index + _.length, append);
    return s.toString();
  }
  return content.replace(/<style>/, append);
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

export async function resolveUserTemplate() {
  const config = vscode.workspace.getConfiguration('generateVueComponent')
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri
  const template = config.get<string>('template')
  if (template && workspaceFolder) {
    try {
      const userTemplate = await fs.readFile(join(workspaceFolder.path, template), 'utf-8')
      return userTemplate
    } catch (err) {
      return null
    }
  }
}

function transfrom(name: string) {
  return name.replace(/[A-Z]/g, (_) => '-' + _.toLocaleLowerCase()).replace(/^-/, '')
}