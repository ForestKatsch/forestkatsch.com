
import {Page, html, TemplateResult} from '../../deps.ts';
import {markdown} from './markdown.ts';

export function pageHeader(page: Page): TemplateResult {
  
  return html`
<header class="page-header">
  <a href="${page.link('/')}" class="plain page-header__home">
    <img src="${page.static("identity/avatar-header.jpg")}"class="page-header__home-avatar" alt="An edited photograph of Forest wearing glasses, trying to look slightly mysterious, and failing." />
    <span class="page-header__home-message">Hi, I'm Forest!</span>
  </a>
  <div class="page-header__links">
    <a href="${page.link('/feed')}">Feed</a>
    <a href="${page.link('/#featured')}" class="featured">Featured Projects</a>
  </div>
</header>
`;
}

export function pageFooter(page: Page): TemplateResult {
  let pageLicense: TemplateResult = 'All rights reserved.';

  if(page.meta.license) {
    pageLicense = markdown(`The contents of this page are licensed under the [${page.meta.license.name}](${page.meta.license.url}) license.`);
  }
  
  return html`
<footer class="page-footer">
  <div class="page-footer__container horizontal">
    <span class="page-footer__copyright">&copy; Copyright ${new Date().getFullYear()} Forest Katsch. ${pageLicense}</span>
    <span class="page-footer__contact"><a href="${page.link('/contact')}">Contact me</a></span>
  </div>
  <div class="page-footer__container horizontal secondary">
    <span class="page-footer__generation">This page was generated from <code>${page.contentPath ? page.contentPath : '@internal'}</code>
  by <a href="${page.link('/software/apogee')}">Apogee SSG</a> on <code>${new Date().toISOString()}</code></span>
    <span class="page-footer__tags">${page.meta.tags.join(' • ')}</span>
  </div>
</footer>
`;
}
