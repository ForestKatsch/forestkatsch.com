
import {DateTime} from 'https://cdn.skypack.dev/luxon';

import {Page, TemplateResult, html} from '../../deps.ts';

export function toDisplayDate(date: Date): string {
  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL);
}

export function publishDate(page: Page, classes: string = '', before: string = ''): TemplateResult {
  // Hide the date if it's unset.
  if(page.meta.publishDate < new Date(3600)) {
    return '';
  }
  
  return html`<time datetime="${page.meta.publishDate.toISOString()}" class="${classes}">${before} ${toDisplayDate(page.meta.publishDate)}</time>`;
}

export function headerPublishDate(page: Page, before = 'published'): TemplateResult {
  return publishDate(page, 'page-content__header-date', before);
}

export function listingPublishDate(page: Page): TemplateResult {
  return publishDate(page, 'page-listing-entry__header-date');
}

