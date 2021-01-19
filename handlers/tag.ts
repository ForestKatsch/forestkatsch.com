
import objectPath from 'https://cdn.skypack.dev/object-path';

import {Page, TextContentHandler, html, TemplateResult} from '../deps.ts';

import {htmlPage} from './templates/html.ts';
import {pageHeader, pageFooter} from './templates/page.ts';
import {markdown, markdownInline} from './templates/markdown.ts';

import {listingPublishDate} from './templates/date.ts';

import ListingContentHandler from './listing.ts'

export default class TagContentHandler extends ListingContentHandler {

  async register() {
    await super.register();

    this.addGlobalTransformOperation('tag-generate', this.createTagPages);
  }

  async createTagPages() {
    let tags = new Set<string>();
    
    for(let page of this.site.getPages()) {
      for(let tag of page.tags) {
        tags.add(tag);
      }
    }

    this.site.log.info(`creating ${tags.size} tag page(s)...`);

    for(let tag of [...tags.values()]) {
      this.createPage(tag);
    }
    
  }

  createPage(tag: string) {
    let page = this.site.createPage(this.getPagePath(tag), this);
    
    page._meta.criteria = {
      include: {
        tags: [tag]
      }
    };

    let count = this.pagesInListing(page).length;
    
    page.title = `pages tagged '${tag}'`;
    page.contents = `
This auto-generated listing selected ${count} ${count === 1 ? 'page' : 'pages'} tagged with '${tag}'.
`;
  }

  getPagePath(tag: string): string {
    return `/tags/${tag}`;
  }
  
}
