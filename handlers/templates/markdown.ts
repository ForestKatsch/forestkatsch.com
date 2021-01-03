
import {html, TemplateResult, unsafe} from '../../deps.ts';

import marked from 'https://cdn.skypack.dev/marked@1.2.7';

const OPTIONS = {
  smartypants: true
};

export function markdown(md: string): TemplateResult {
  return unsafe(marked(md || '', OPTIONS));
}

export function markdownInline(md: string): TemplateResult {
  return unsafe(marked.parseInline(md || '', OPTIONS));
}
