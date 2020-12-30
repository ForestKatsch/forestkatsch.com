
import {Page, html, TemplateResult} from '../../deps.ts';

type HTMLTemplateParameters = {
  page: Page,
  title?: string,
  head?: TemplateResult,
  body: TemplateResult
};

export function twitterCardMetaTags(page: Page, imageUrl?: string): TemplateResult {
  return html`
<meta name="twitter:card" content="summary" />
<meta name="twitter:site" content="@ForestKatsch" />
<meta name="twitter:title" content="${page.meta.title}" />
<meta name="twitter:description" content="${page.meta.summary}" />
${imageUrl ? html`<meta name="twitter:image" content="${imageUrl}" />` : ''}
`;  
}

export function metaEmbed(page: Page, imageUrl?: string): TemplateResult {
  return twitterCardMetaTags(page, imageUrl);
}

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
    <meta charset="utf-8">
    <meta name="author" content="Forest Katsch" />
    ${page.meta.summary ? html`<meta name="description" content="${page.meta.summary}" />` : ''}
    <meta name="keywords" content="${page.tags.filter((tag) => !tag.startsWith('@')).join(',')}" />
    <meta name="theme-color" content="#38f" />
    <meta name="color-scheme" content="dark light" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, viewport-fit=cover" />
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

