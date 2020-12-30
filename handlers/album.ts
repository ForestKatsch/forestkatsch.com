
import objectPath from 'https://cdn.skypack.dev/object-path';

import {Page, TextContentHandler, html, TemplateResult} from '../deps.ts';

import {htmlPage} from './templates/html.ts';
import {pageHeader, pageFooter} from './templates/page.ts';
import {markdown} from './templates/markdown.ts';

import {headerPublishDate, listingPublishDate} from './templates/date.ts';

export default class ListingContentHandler extends TextContentHandler {

  async register() {
    this.addTransformOperation('album-reference', (page) => {
      this.mediaPagesInAlbum(page)
        .forEach((imagePage) => {
          imagePage.addTag('@in-album');
        });
    });
    
    this.addRenderVariant('@page', this.renderPage);
    this.addRenderVariant('listing', this.renderListing);
  }

  inheritPage(page: Page) {
    page.addTag('@album');
  }

  mediaPagesInAlbum(page: Page): Page[] {
    return this.pagesInAlbum(page)
      .filter((page) => page.hasTag('@media'))
      .filter((page) => !page.hasTag('@album'));
  }

  pagesInAlbum(page: Page): Page[] {
    let order = objectPath.get(page.meta, 'album.order');

    if(order) {
      return order.map((path) => page.site.getPageFrom(page, path));
    }
    
    return page.site.getPages(page.meta.criteria).reverse();
  }

  renderListing(page: Page, variant: string, listingPage: Page): TemplateResult {
    // Get up to 6 pages.
    let mediaPages = this.mediaPagesInAlbum(page);

    let mediaPageCount = mediaPages.length;
    
    mediaPages = mediaPages.slice(0, 8).reverse();

    let mediaPageCountMore = mediaPageCount - mediaPages.length;

    return html`
<section class="page-listing-entry page-listing-entry--album effect__lift effect__shine">
  <a href="${listingPage.link(page.path)}" class="page-listing-entry__wrapper plain">
    <header class="page-listing-entry__header">
      <span class="page-listing-entry__header-title">${page.meta.title}</span>
      <span class="page-listing-entry__header-media-count">${mediaPageCount} ${mediaPageCount === 1 ? 'item' : 'items'}</span>
      ${listingPublishDate(page)}
    </header>
    <div class="page-listing-entry__caption">${markdown(page.meta.summary)}</div>
    <div class="page-listing-entry__album-preview">
${mediaPageCountMore > 0 ? html`
      <div class="preview preview-more"><span class="text">+${mediaPageCountMore}</span></div>
      ` : ''}
${mediaPages.map((mediaPage) => html`
      <img class="preview" src="${listingPage.link(mediaPage.handler.getThumbnailPath(mediaPage))}" />
`)}
    </div>
  </a>
</section>
`;
  }

  renderPage(page: Page): TemplateResult {
    let pages = this.pagesInAlbum(page);
    
    return htmlPage({
      page: page,
      
      head: html``,
      body: html`
${pageHeader(page)}
<main class="page-content page-content--listing">
  <header class="page-content__header">
    <h1 class="page-content__header-title">${page.meta.title}</h1>
    ${headerPublishDate(page, 'collected')}
  </header>

  <div class="page-content__description text page-content__text">
    ${markdown(page.contents)}
  </div>

  <section class="page-listing">
  ${pages.map((p) => p.render('listing-album', page))}
  </section>
</main>
${pageFooter(page)}
`
    });
  }

}
