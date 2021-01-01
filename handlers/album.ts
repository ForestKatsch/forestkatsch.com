
import objectPath from 'https://cdn.skypack.dev/object-path';

import {Page, TextContentHandler, html, TemplateResult} from '../deps.ts';

import {htmlPage, metaEmbed} from './templates/html.ts';
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
    let pages = objectPath.get(page.meta, 'album.pages');

    if(pages) {
      return pages.map((path) => page.site.getPageFrom(page, path));
    }
    
    return page.site.getPages(page.meta.criteria).reverse();
  }

  getCoverMediaPage(page: Page): Page {
    if(objectPath.get(page.meta, 'album.cover')) {
      return this.site.getPageFrom(page, page.meta.album.cover);
    }

    return this.pagesInAlbum(page)[0];
  }

  renderListing(page: Page, variant: string, listingPage: Page): TemplateResult {
    let coverMediaPage = this.getCoverMediaPage(page);

    let mediaPages = this.mediaPagesInAlbum(page)
      .filter((mediaPage) => coverMediaPage !== mediaPage);

    mediaPages = [
      coverMediaPage,
      ...mediaPages
    ];

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
      <img class="preview" src="${listingPage.link(mediaPage.handler.getThumbnailPath(mediaPage))}"
               loading="lazy"/>
`)}
    </div>
  </a>
</section>
`;
  }

  renderPage(page: Page): TemplateResult {
    let pages = this.pagesInAlbum(page);

    let coverMedia = this.getCoverMediaPage(page);

    return htmlPage({
      page: page,
      
      head: metaEmbed(page, coverMedia.link(coverMedia.handler.getCoverPath(coverMedia), true)),

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
