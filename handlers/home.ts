
import {Page, TextContentHandler, html, TemplateResult} from '../deps.ts';

import {htmlPage} from './templates/html.ts';
import {pageHeader, pageFooter} from './templates/page.ts';
import {markdown} from './templates/markdown.ts';

export default class ListingContentHandler extends TextContentHandler {

  async register() {
    this.addRenderVariant('@page', this.renderPage);
  }

  pagesInListing(page: Page): Page[] {
    return page.site.getPages(page.meta.criteria);
  }

  renderPage(page: Page): Promise<TemplateResult> {
    let pages = this.pagesInListing(page);
    
    return htmlPage({
      page: page,
      
      head: html``,
      body: html`
${pageHeader(page)}
<main class="page-content page-content--listing">
  <section class="page-content__infobox text">
    <h1>${markdown(page.meta.title)}</h1>
    ${markdown(page.contents)}
  </section>

  <section class="page-listing">
  ${pages.map((p) => p.render('listing', page))}
  </section>
</main>
${pageFooter(page)}
`
    });
  }

}
