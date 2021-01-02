
import objectPath from 'https://cdn.skypack.dev/object-path';

import {Page, TextContentHandler, html, TemplateResult} from '../deps.ts';

import {htmlPage} from './templates/html.ts';
import {pageHeader, pageFooter} from './templates/page.ts';
import {markdown, markdownInline} from './templates/markdown.ts';

import {listingPublishDate} from './templates/date.ts';

export default class ListingContentHandler extends TextContentHandler {

  async register() {
    this.addRenderVariant('@page', this.renderPage);
    this.addRenderVariant('listing', this.renderListing);

    this.meta = {
      static: true
    };
  }

  pagesInListing(page: Page): Page[] {
    let pages = objectPath.get(page.meta, 'pages');

    if(pages) {
      return pages.map((path: string) => page.site.getPageFrom(page, path));
    }
    
    return page.site.getPages(page.meta.criteria);
  }

  renderHomeLinks(page: Page): TemplateResult {
    let homePages = page.meta.infobox.links.map((path: string) => page.site.getPage(path));

    return html`
<section class="infobox-home-links">
${homePages.map((p: Page) => p.render('listing', page))}
</section>
`;
  }

  renderInfobox(page: Page): TemplateResult {
    return html`
<section class="listing__infobox text">
${this.options.home ? '' : html`<h1>${markdownInline(page.meta.title)}</h1>`}
  <div class="listing__infobox-content">${markdown(page.contents)}</div>
${this.options.home ? this.renderHomeLinks(page) : ''}
</section>
`;
  }

  renderListing(page: Page, variant: string, listingPage: Page): TemplateResult {
    return html`
<section class="page-listing-entry page-listing-entry--text page-listing-entry--listing effect__lift effect__shine effect__lift--listing">
  <a class="page-listing-entry__text-wrapper plain"
     href="${listingPage.link(page.path)}">
    <header class="page-listing-entry__header">
      <span class="page-listing-entry__header-title">${page.meta.title}</span>
      ${listingPublishDate(page)}
    </header>
    <section class="page-listing-entry__caption">${markdown(page.meta.summary)}</section>
  </a>
</section>
`;
  }
  
  renderPage(page: Page): TemplateResult {
    let pages = this.pagesInListing(page);

    let infoboxStyle = (page.meta.infobox && page.meta.infobox.style) ? page.meta.infobox.style : 'regular';

    let homeHeader = html`
<header class="home-header">
  <div class="home-header__info">
    <img src="${page.static("identity/avatar-home.jpg")}"class="home-header__avatar" alt="An edited photograph of Forest wearing glasses, trying to look slightly mysterious, and failing." />
    <span class="home-header__message">← Forest Katsch</span>
  </div>
  <div class="home-header__links">
    <a href="${page.link('/feed')}">Feed</a>
  </div>
</header>
`;

    let homeLinksMarkdown = `
# **Email:** [hey@forestkatsch.com](mailto:hey@forestkatsch.com)

# **Twitter:** [@ForestKatsch](https://twitter.com/ForestKatsch)

***

# **GitHub:** [github.com/ForestKatsch](https://github.com/ForestKatsch)

# **ArtStation:** [artstation.com/forestkatsch](https://artstation.com/forestkatsch)

# **LinkedIn:** [linkedin.com/in/forest-katsch](https://linkedin.com/in/forest-katsch)
`;
    let homeLinks = html`
<div class="home-page-listing-message" id="personal-links">${markdown("Find me online:")}</div>
<section class="home-profile-links">
${markdown(homeLinksMarkdown)}
</section>
`;

    return htmlPage({
      page: page,
      
      head: html``,
      body: html`
${this.options.home ? homeHeader : pageHeader(page)}
<main class="page-content page-content--listing infobox-style--${infoboxStyle}">
  ${this.renderInfobox(page)}
${this.options.home ? homeLinks : ''}
${this.options.home ? html`<div class="home-page-listing-message" id="featured">${markdown("Here are some projects I'm proud of:")}</div>` : ''}
  <section class="page-listing">
  ${pages.map((p) => p.render('listing', page))}
  </section>
</main>
${pageFooter(page)}
`
    });
  }

}
