
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

export function openGraphMetaTags(page: Page, imageUrl?: string): TemplateResult {
  return html`
<meta property="og:url" content="${page.link(page.path, true)}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${page.title}" />
<meta property="og:description" content="${page.meta.summary}" />
${imageUrl ? html`<meta property="og:image" content="${imageUrl}" />` : ''}
`;
}

export function metaEmbed(page: Page, imageUrl?: string): TemplateResult {
  return html`
${openGraphMetaTags(page, imageUrl)}
${twitterCardMetaTags(page, imageUrl)}
  `
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

    <link rel="icon" href="${page.link('/favicon.ico')}">
    <link rel="icon" href="${page.link('/icon.svg')}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${page.link('/apple-touch-icon.png')}">
    <link rel="manifest" href="${page.link('/manifest.webmanifest')}">

    <meta name="author" content="Forest Katsch" />
    ${page.meta.summary ? html`<meta name="description" content="${page.meta.summary}" />` : ''}
    <meta name="keywords" content="${page.tags.filter((tag) => !tag.startsWith('@')).join(',')}" />
    <meta name="theme-color" content="#3388ff" />
    <meta name="color-scheme" content="light dark" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, viewport-fit=cover" />
    <link rel="stylesheet" href="${page.static('style.css')}" />
    <title>${title ?? page.meta.title}</title>
    <style>
@font-face {
  font-family: 'Salsa Blueprint';
  
  src: url("${page.static('SalsaBlueprint-Regular.woff2')}") format("woff2"),
       url("${page.static('SalsaBlueprint-Regular.ttf')}") format("truetype");
}

${page.meta.longform ? html`
@font-face {
  font-family: 'Literata';
  
  src: url("${page.static('Literata-Variable.woff2')}") format("woff2"),
       url("${page.static('Literata-Variable.ttf')}") format("truetype");
}

@font-face {
  font-family: 'Literata';
  font-style: italic;
  
  src: url("${page.static('Literata-Variable-Italic.woff2')}") format("woff2"),
       url("${page.static('Literata-Variable-Italic.ttf')}") format("truetype");
}
  ` : ''}
  </style>
${head}
  </head>
  <body data-handler="${page.handler.name}">
${body}
  </body>
</html>
`;
}

