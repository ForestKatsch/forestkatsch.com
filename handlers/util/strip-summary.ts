
import {Page, ContentHandler} from '../../deps.ts';

export default class StripSummaryHandler extends ContentHandler {

  async register() {
    this.addGlobalTransformOperation('strip-summary', this.stripSummary);
  }

  async stripSummary(): Promise<void> {
    this.site.getPages().forEach((page) => {
      page._meta.summary = (page.meta.summary ?? '').replace(/\s+/g, ' ');
    });
  }

}
