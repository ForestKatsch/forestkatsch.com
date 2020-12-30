
import {Page, TextContentHandler, html, TemplateResult} from '../deps.ts';

import {htmlPage} from './templates/html.ts';
import {pageHeader, pageFooter} from './templates/page.ts';
import {markdown} from './templates/markdown.ts';

import {listingPublishDate, headerPublishDate} from './templates/date.ts';

export default class MarkdownContentHandler extends TextContentHandler {

  async register() {
    // Tell Apogee how we want to be rendered.
    this.addRenderVariant('@page', this.renderPage);
    
    this.addRenderVariant('listing', this.renderListing);
    this.addRenderVariant('listing-album', this.renderListingAlbum);

    this.meta.header = {
      show: true
    };
  }

  renderListingAlbum(page: Page, variant: string, listingPage: Page): TemplateResult {
    if(page.embed) {
      return html`
<section class="page-listing-entry page-listing-entry__embed text">${markdown(page.contents)}</section>
`;
    }
  }
  
  renderListing(page: Page, variant: string, listingPage: Page): TemplateResult {
      
    return html`
<section class="page-listing-entry page-listing-entry--text effect__lift effect__shine effect__lift--subtle" data-category="${page.meta.category}">
  <a class="page-listing-entry__text-wrapper plain"
     href="${listingPage.link(page.path)}">
    <header class="page-listing-entry__header">
      <span class="page-listing-entry__header-title">${page.meta.title}</span>
      ${listingPublishDate(page, 'page-listing-entry__header-date', '')}
    </header>
    <div class="page-listing-entry__caption">${markdown(page.meta.summary)}</div>
    <div class="page-listing-entry__footer">
      <span class="page-listing-entry__footer-category">${page.meta.category}</span>
      <a class="plain page-listing-entry__read-more">Read more →</a>
    </div>
  </a>
</section>
`;
  }

  // Called with each content file we're supposed to handle.
  addContent(filename: string) {
    // Create our page! Our beautiful, beautiful page!
    this.site.createPageFromFilename(filename, this);
  }
  
  renderPage(page: Page): TemplateResult {
    return htmlPage({
      page: page,
      
      head: html``,
      body: html`
${pageHeader(page)}
<main class="page-content">
${page.meta.header.show ? html`
  <header class="page-content__header">
    <h1 class="page-content__header-title">${page.meta.title}</h1>
${headerPublishDate(page)}
  </header>
  ` : ''}
  <section class="page-content__text text">${markdown(page.contents)}</section>
</main>
${pageFooter(page)}
`
    });
  }

}