
import {templateToString, Page, TextContentHandler, html, TemplateResult, ApogeeError} from '../deps.ts';

import ImageContentHandler from './image.ts';

import {htmlPage, metaEmbed} from './templates/html.ts';
import {pageHeader, pageFooter} from './templates/page.ts';
import {markdown} from './templates/markdown.ts';

import {listingPublishDate, headerPublishDate} from './templates/date.ts';

export default class MarkdownContentHandler extends TextContentHandler {

  interpolators: {[key: string]: Function} = {};

  async register() {
    this.addTransformOperation('content-interpolation', this.contentInterpolation);
    
    // Tell Apogee how we want to be rendered.
    this.addRenderVariant('@page', this.renderPage);
    
    this.addRenderVariant('listing', this.renderListing);

    this.meta.header = {
      show: true
    };

    // This is how interpolators are defined.
    /*
    this.interpolators['random'] = (): number => {
      return Math.random();
    };
    */
    
    this.interpolators['media'] = (page: Page, mediaPath: string): TemplateResult => {
      let mediaPage = page.site.getPageFrom(page, mediaPath);
      return mediaPage.render('inline', page);
    };
  }

  // Replaces `{{foobar}}` with the JS-evaluated value of `foobar`.
  // The variable 'page' refers to the current page.
  async contentInterpolation(page: Page): Promise<any> {
    page.contents = page.contents.replace(/\{\{(.*?)\}\}/g, (match: string, group: string) => {
      try {
        let result = Function('page', 'site', '$', '"use strict";return (' + group + ')')(page, this.site, this.interpolators);

        // Properly handle template strings here. It's kind of hacky, but it's better than ignoring them (and inserting [object Object] into the strings.)
        return templateToString(result);
      } catch(err) {
        throw new ApogeeError(`cannot execute code '${group}' for page '${page.sourcePath}'`, err);
      }
    });
  }

  renderListingAlbum(page: Page, variant: string, listingPage: Page): TemplateResult {
    return html`
<section class="page-listing-entry page-listing-entry__embed text">${markdown(page.contents)}</section>
`;
  }
  
  renderListing(page: Page, variant: string, listingPage: Page): TemplateResult {

    let cover: TemplateResult = '';

    if(page.meta.cover) {
      let coverMedia = this.site.getPageFrom(page, page.meta.cover);
      let coverImage = listingPage.link((coverMedia.handler as ImageContentHandler).getCoverPath(coverMedia));
      
      cover = html`
<img class="page-listing-entry__image" src="${coverImage}" />
`;
    }
      
    return html`
<section class="page-listing-entry page-listing-entry--text effect__lift effect__shine effect__lift--subtle" data-category="${page.meta.category}">
  <a class="page-listing-entry__text-wrapper plain"
     href="${listingPage.link(page.path)}">
    <header class="page-listing-entry__header">
      <span class="page-listing-entry__header-title">${page.meta.title}</span>
      ${listingPublishDate(page)}
    </header>
${cover}
    <div class="page-listing-entry__caption">${markdown(page.meta.summary)}</div>
    <div class="page-listing-entry__footer">
      <span class="page-listing-entry__footer-category">in <span class="category">${page.meta.category}</span></span>
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
    let coverElement: TemplateResult = '';
    
    if(page.meta.cover) {
      coverElement = html`
${this.site.getPageFrom(page, page.meta.cover).render('cover', page)}
`;
    }

    let coverImage: string | undefined;

    if(page.meta.cover) {
      let coverMedia = this.site.getPageFrom(page, page.meta.cover);
      coverImage = coverMedia.link((coverMedia.handler as ImageContentHandler).getCoverPath(coverMedia), true);
    }

    let postedIn = html``;

    if(page.meta.category) {
      postedIn = html`<span class="page-content__header-category">filed in <a href="/category/${page.meta.category}">${page.meta.category}</a></span>`;
    }
    
    return htmlPage({
      page: page,
      
      head: metaEmbed(page, coverImage),

      body: html`
${pageHeader(page)}
<main class="page-content page-content--markdown ${page.meta.longform ? 'page-content__longform' : ''}">
${page.meta.header.show ? html`
  <header class="page-content__header">
        <h1 class="page-content__header-title">${page.meta.title}${postedIn}</h1>
${headerPublishDate(page)}
  </header>
  ` : ''}
  ${coverElement}
  <section class="page-content__text text">${markdown(page.contents)}</section>
</main>
${pageFooter(page)}
`
    });
  }

}
