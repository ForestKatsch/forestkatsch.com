
import {Page, html, TemplateResult} from '../../deps.ts';

type HTMLTemplateParameters = {
  page: Page,
  title?: string,
  head?: TemplateResult,
  body: TemplateResult
};

export function htmlPage({
  page,
  title = undefined,
  head = undefined,
  body
}: HTMLTemplateParameters): TemplateResult {
  
  return html`
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, viewport-fit=cover">
    <link rel="stylesheet" href="${page.static('style.css')}" />
    <title>${title ?? page.meta.title}</title>
${head}
  </head>
  <body data-handler="${page.handler.name}">
${body}
  </body>
</html>
`;
}
