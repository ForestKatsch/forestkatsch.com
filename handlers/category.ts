
import {Page, html} from '../deps.ts';

import ListingContentHandler from './listing.ts'

export default class CategoryContentHandler extends ListingContentHandler {

  async register() {
    await super.register();

    this.addGlobalTransformOperation('category-generate', this.createCategoryPages);
  }

  async createCategoryPages() {
    let categories = new Set<string>();
    
    for(let page of this.site.getPages()) {
      if(page.meta.category) {
        categories.add(page.meta.category);
      }
    }
    
    this.site.log.info(`creating ${categories.size} category page(s)...`);

    for(let category of categories) {
      this.createPage(category);
    }
  }

  createPage(category: string) {
    let page = this.site.createPage(this.getPagePath(category), this);
    
    page._meta.criteria = {
      include: {
        category: category
      }
    };

    let count = this.pagesInListing(page).length;
    
    page.title = `Category: ${category}`;
    page.contents = `
This auto-generated listing selected ${count} ${count === 1 ? 'page' : 'pages'} in the '${category}' category.
`;
  }

  getPagePath(category: string): string {
    return `/category/${category}`;
  }
  
}
