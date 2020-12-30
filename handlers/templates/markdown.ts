
import {html, TemplateResult, unsafe} from '../../deps.ts';

import marked from 'https://cdn.skypack.dev/marked@1.2.7';

export function markdown(md: string): TemplateResult {
  return unsafe(marked(md || ''));
}

export function markdownInline(md: string): TemplateResult {
  return unsafe(marked.parseInline(md || ''));
}
