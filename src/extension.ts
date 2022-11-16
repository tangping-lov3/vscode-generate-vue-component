
import { injectClassName, injectScriptLang, injectStyleLang, resolveParams, resolveUserTemplate } from './utils'
import { defaultTemplate } from './template'
import { dirname } from 'path'
import { promises as fs, statSync } from 'fs'
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand('generate-vue-component.generate', async (editor) => {

		const dir = statSync(editor.path).isFile() ? dirname(editor.path) : editor.path;
		const name = await vscode.window.showInputBox({
			value: "",
			prompt: "Component name",
			ignoreFocusOut: true,
			valueSelection: [-1, -1],
		})
		if (!name) {
			return;
		}
		const { scriptLang, styleLang, name: _name } = resolveParams(name);
		const filename = `${dir}/${_name}.vue`;
		let content = await resolveUserTemplate() || defaultTemplate
		content = injectClassName(content, _name)
		content = injectScriptLang(content, scriptLang)
		content = injectStyleLang(content, styleLang, _name)
		await fs.writeFile(filename, content);
		const doc = await vscode.workspace.openTextDocument(filename)
		await vscode.window.showTextDocument(doc)
	
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
