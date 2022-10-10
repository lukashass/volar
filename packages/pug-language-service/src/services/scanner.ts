import type * as html from 'vscode-html-languageservice';
import type { PugDocument } from '../pugDocument';

export function register(htmlLs: html.LanguageService) {
	return (pugDoc: PugDocument, initialOffset = 0) => {

		const htmlOffset = pugDoc.sourceMap.mappings
			.find(mapping => initialOffset >= mapping.sourceRange[0] && !mapping.data?.isEmptyTagCompletion)
			?.generatedRange[0];
		if (htmlOffset === undefined)
			return;

		const htmlScanner = htmlLs.createScanner(pugDoc.htmlTextDocument.getText(), htmlOffset);

		// @ts-expect-error
		const scanner: html.Scanner = {
			scan: () => {
				return htmlScanner.scan();
			},
			getTokenOffset: () => {
				return pugDoc.sourceMap.toSourceOffset(htmlScanner.getTokenOffset())?.[0] ?? -1;
			},
			getTokenEnd: () => {
				return pugDoc.sourceMap.toSourceOffset(htmlScanner.getTokenEnd())?.[0] ?? -1;
			},
			getTokenText: htmlScanner.getTokenText,
			getTokenLength: htmlScanner.getTokenLength,
			getTokenError: htmlScanner.getTokenError,
			getScannerState: htmlScanner.getScannerState,
		};

		return scanner;
	};
}
