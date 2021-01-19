
import * as path from 'https://deno.land/std@0.82.0/path/mod.ts';
import {copy, ensureDir} from 'https://deno.land/std@0.82.0/fs/mod.ts';
import _ from 'https://cdn.skypack.dev/lodash@4.17.19';
import objectPath from 'https://cdn.skypack.dev/object-path';
import exifr from 'https://cdn.skypack.dev/exifr';

import {headerPublishDate, listingPublishDate} from './templates/date.ts';

import {unsafe, ApogeeError, Page, TextContentHandler, html, TemplateResult} from '../deps.ts';

import {htmlPage, metaEmbed} from './templates/html.ts';
import {pageHeader, pageFooter} from './templates/page.ts';
import {markdown} from './templates/markdown.ts';

// TODO: fix this.
type ExifData = any;

async function copyNeeded(source: string, dest: string): Promise<boolean> {
  try {
    let sourceStat = await Deno.stat(source);
    let destStat = await Deno.stat(dest);
    
    if(!sourceStat.mtime || !destStat.mtime) {
      return true;
    }

    if(sourceStat.mtime > destStat.mtime) {
      return true;
    }

    return false;
  } catch(err) {
    return true;
  }

}

async function readExif(filename: string): Promise<ExifData> {
  try {
    let contents = await Deno.readFile(filename);
    return await exifr.parse(contents);
  } catch(err) {
    throw new ApogeeError(`cannot read exif data from '${filename}'`, err);
  }
}

async function getImageSize(filename: string): Promise<number[]> {
  try {
    const results = new TextDecoder().decode(await Deno.run({
      cmd: ['file', filename],
      stdout: 'piped',
    }).output());
    
    let size = results.match(/, ([0-9]+)\s?x\s?([0-9]+)/);

    if(!size) {
      throw new Error(`no image size found in 'file' output`);
    }

    return [parseInt(size[1]), parseInt(size[2])];
  } catch(err) {
    throw new ApogeeError(`cannot read image size from '${filename}'`, err);
  }
}

// Returns `true` if the operation was run.
async function convert(source: string, dest: string, args: string = ''): Promise<boolean> {
  if(!(await copyNeeded(source, dest))) {
    return false;
  }
  
  const results = await Deno.run({
    cmd: ['convert', ...args.split(/\s/g), source, dest],
  }).status();

  return true;
}

async function watermark(image: string): Promise<void> {
  const results = await Deno.run({
    cmd: ['composite', path.join(Deno.cwd(), 'handlers/tools/watermark.png'), '-dissolve', '50', '-gravity', 'southeast', image, image],
  }).status();
}

async function convertResize(source: string, dest: string, width: number, height: number, args: string = ''): Promise<boolean> {
  return await convert(source, dest, `-resize ${width}x${height} ` + args);
}

// If `value` is in `subs`, return the value of `subs[value]`; otherwise, return `value` as-is.
function resolve(subs: {[key: string]: string}, value: string): string {
  if(subs.hasOwnProperty(value)) {
    return subs[value];
  }

  return value;
}

function resolveCameraMake(make: string) {
  return resolve({
    'SONY': 'Sony'
  }, make);
}

function resolveCameraModel(model: string) {
  return resolve({
    'ILCE-6400': 'α6400'
  }, model);
}

// The image content handler class itself.
export default class ImageContentHandler extends TextContentHandler {

  async register() {
    this.addTransformOperation('media-metadata-read', this.mediaReadExif);
    this.addTransformOperation('media-copy', this.mediaCopy);
    
    this.addRenderVariant('@page', this.renderPage);
    this.addRenderVariant('listing', this.renderListing);
    this.addRenderVariant('inline', this.renderInline);
    this.addRenderVariant('listing-album', this.renderListing);
    this.addRenderVariant('cover', this.renderCover);

    this.meta.static = true;
    this.meta.watermark = true;
  }

  async _ingest(page: Page): Promise<void> {
    
    try {
      await this.loadMetadataFile(page);
      
      if(page._meta.static === undefined) {
        page._meta.static = false;
      }
    } catch(err) {
      page._meta.title = path.basename(page.path);
      page._meta.tags = [];
      // No big deal.
    }

    page.addTag('@image');
  }

  // Returns the output-relative media path.
  getMediaOutputPath(page: Page, variant?: string, preserveExtension = false): string {
    let p = path.parse(page.path);
    let extension = path.extname(page.contentPath);

    // Always export jpg for images other than the original.
    if(!preserveExtension) {
      extension = '.jpg';
    }
    
    variant = variant ? `-${variant}` : '';

    return path.join(page.path, `${p.name}${variant}${extension}`);
  }

  getThumbnailPath(page: Page): string {
    return this.getMediaOutputPath(page, 'thumbnail');
  }

  getCoverPath(page: Page): string {
    return this.getMediaOutputPath(page, 'cover');
  }

  getListingPath(page: Page): string {
    return this.getMediaOutputPath(page, 'listing');
  }

  getOrigPath(page: Page): string {
    return this.getMediaOutputPath(page, 'orig', true);
  }

  getFilesystemMediaOutputPath(page: Page, variant?: string, preserveExtension = false): string {
    return path.join(this.site.outputRoot, this.getMediaOutputPath(page, variant, preserveExtension));
  }

  async mediaReadExif(page: Page): Promise<void> {
    page.addTag('@media');

    let exif: {[key: string]: any} = {};
    let exifMeta: {[key: string]: any} | null = null;

    let imageType = 'image';

    let imageSize = await getImageSize(page.contentFilename);

    try {
      exif = await readExif(page.contentFilename);

      if(!exif) {
        // Do nothing if the exif is null.
      } else if(!exif.ExposureTime) {
        imageType = 'image';
      } else {
        page.addTag('@photo');
        imageType = 'photo';
        
        exifMeta = {
          camera: {
            make: resolveCameraMake(exif.Make ?? objectPath.get(page.meta, 'image.exif.camera.make', null)),
            model: resolveCameraModel(exif.Model ?? objectPath.get(page.meta, 'image.exif.camera.model', null)),
          },

          lens: {
            model: exif.LensModel
          },

          capture: {
            fstop: exif.FNumber,
            exposure: exif.ExposureTime,
            iso: exif.ISO,
            focalLength: exif.FocalLength,
            focalLength35Equivalent: exif.FocalLengthIn35mmFormat,
          }
        };
        
        if(page.meta.publishDate < new Date(3600)) {
          page._meta.publishDate = exif.DateTimeOriginal;
        }
        
      }
    } catch(err) {
      this.site.log.warn(`error while reading exif data in '${page.sourcePath}':`, err);
    }

    //if(exif) {
    //let imageSize = [exif ? exif.ExifImageWidth : 0, exif ? exif.ExifImageHeight : 0];
    //}

    page._meta.image = _.merge(page.meta.image, {
      type: imageType,

      width: imageSize[0],
      height: imageSize[1],

      exif: exifMeta
    });
  }

  // Copies the media from the content folder to the output folder, unmodified.
  async mediaCopy(page: Page): Promise<void> {
    await ensureDir(path.dirname(this.getFilesystemMediaOutputPath(page)));

    const source = page.contentFilename;
    
    if(!(await copyNeeded(source, this.getFilesystemMediaOutputPath(page)))) {
      // Remove the following line to force a complete conversion for every image no matter what (will be very slow!)
      return;
    }
    
    this.site.log.debug(`copying/converting image '${page.sourcePath}'`);

    await copy(source, this.getFilesystemMediaOutputPath(page, 'orig', true), {overwrite: true});
    
    await convertResize(source, this.getFilesystemMediaOutputPath(page), 3840, 2160, '-quality 98 -strip -interlace Plane');
    await watermark(this.getFilesystemMediaOutputPath(page));

    // 'cover' image is a small-ish image used as the primary image on most places.
    // It can be shown full-width, so we need to keep it rather big, but we keep quality lowish.
    await convertResize(source, this.getFilesystemMediaOutputPath(page, 'cover'), 2560, 1440, '-quality 98 -strip -interlace Plane');

    // This is the version that appears in listings, etc. at a fixed size, so it can be quite small.
    await convertResize(source, this.getFilesystemMediaOutputPath(page, 'listing'), 840, 640, '-quality 90 -strip -interlace Plane');
    
    // This is the version that appears in listings, etc. at a fixed size, so it can be quite small.
    await convert(source, this.getFilesystemMediaOutputPath(page, 'thumbnail'), '-resize 256x256^ -gravity Center -extent 256x256 -quality 65 -strip -interlace Plane');
  }

  // Returns `true` if the image has no useful information, and the image can be linked to directly.
  shouldBeDirectLink(page: Page): boolean {
    if((page.meta.static || !page.hasPublishDate || !page.title) && !page.meta.summary) {
      return true;
    }

    return false;
  }

  imageLink(page: Page): string {
    if(this.shouldBeDirectLink(page)) {
      return this.getMediaOutputPath(page);
    }

    return page.path;
  }

  // Called with each content file we're supposed to handle.
  addContent(filename: string) {
    this.site.createPageFromFilename(filename, this);
  }

  renderListing(page: Page, variant: string, listingPage: Page): TemplateResult {
    let imagePath = listingPage.link(this.getMediaOutputPath(page, 'listing'));

    // We always want to go to the page from a listing, never the image direct link.

    return html`
<section class="page-listing-entry page-listing-entry--image page-listing-entry--media ${variant === 'listing-album' ? 'page-listing-entry--in-album' : ''}">
  <a class="page-listing-entry__media-wrapper plain ${variant === 'listing-album' ? '' : 'effect__lift effect__shine'} effect__frame"
     title="Click to visit image page"
     href="${listingPage.link(variant === 'listing-album' ? this.imageLink(page) : page)}">
    <img src="${imagePath}"
         loading="lazy"
         class="content-media__media"
         width="${page.meta.image.width}"
         height="${page.meta.image.height}" />
    <header class="page-listing-entry__header">
      <span class="title">${page.meta.title}</span>
      ${listingPublishDate(page)}
    </header>
    <div class="page-listing-entry__caption">${markdown(page.meta.summary)}</div>
  </a>
</section>
`;
  }

  renderInline(page: Page, variant: string, listingPage: Page): TemplateResult {
    let imagePath = listingPage.link(this.getMediaOutputPath(page, 'listing'));

    return html`
<a class="inline-image plain"
   title="Click to visit image page"
   href="${listingPage.link(this.imageLink(page))}">
  <img src="${imagePath}"
       loading="lazy"
       class="inline-image__image"
       width="${page.meta.image.width}"
       height="${page.meta.image.height}" />
</a>
`;
  }

  renderCover(page: Page, variant: string, listingPage: Page): TemplateResult {
    let imagePath = listingPage.link(this.getMediaOutputPath(page, 'cover'));

    return html`
<section class="page-content__cover page-content__cover--image page-content__cover--image effect__frame">
  <a class="page-content__cover-wrapper plain"
     title="Click to visit image page"
     href="${listingPage.link(this.imageLink(page))}">
    <img src="${imagePath}"
         class="content-media__media"
         width="${page.meta.image.width}"
         height="${page.meta.image.height}" />
  </a>
</section>
`;
  }

  renderPage(page: Page): TemplateResult {
    let details: TemplateResult = markdown(`(No EXIF data detected in image)`);

    if(page.meta.image.type === 'photo' && page.meta.image.exif) {
      let exif = page.meta.image.exif;

      let exposure = exif.capture.exposure;

      // Get exposure time in a human readable format.
      if(exposure > 1) {
        exposure = exposure.toFixed(1).replace('.0', '');
      } else {
        exposure = `1/${Math.round(1.0 / exposure)}`;
      }

      let camera = `${exif.camera.make || '???'} ${exif.camera.model || '???'}`;

      if(!exif.camera.make || !exif.camera.model) {
        camera = exif.camera.name || '(unknown camera)';
      }

      details = markdown(`
# Camera 

Taken with ${camera} and a ${exif.lens.model} lens

# Photo Settings

**Aperture**: ƒ/${exif.capture.fstop}

**Exposure**: ${exposure}s

**Focal Length**: ${exif.capture.focalLength}mm (~${exif.capture.focalLength35Equivalent}mm @ 35mm)

**ISO**: ${exif.capture.iso}
`);
    } else {
      details = null;
    }

    let imagePath = this.getMediaOutputPath(page);

    let shareScript = html`
let share = document.getElementById(${unsafe('"share-button"')});

async function shareImage() {
  await navigator.share({
    title: "${page.meta.title}",
    url: "${imagePath}"
  });
}

if(navigator.canShare) {
  share.style.display = 'block';
  share.addEventListener('click', shareImage);
}

`;

    let coverImagePath = page.link(this.getMediaOutputPath(page, 'cover'));
    
    return htmlPage({
      page: page,

      head: metaEmbed(page, page.link(this.getMediaOutputPath(page, 'cover'), true)),

      body: html`
${pageHeader(page)}
<main class="page-content page-content--image page-content--media page-content--fullwidth">
  <section class="content-media content-media--image">
    <section class="content-media__wrapper effect__frame">
      <header class="content-media__header">
        <h1 class="content-media__header-title">${page.meta.title}</h1>
        ${headerPublishDate(page, '')}
      </header>
      <a href="${page.link(this.getMediaOutputPath(page))}" class="plain" title="Open Full Resolution">
        <img src="${coverImagePath}"
             class="content-media__media"
             width="${page.meta.image.width}"
             height="${page.meta.image.height}" />
      </a>
      <header class="content-media__infobar">
        <span class="content-media__infobar-links">
          <a href="${page.link(this.getMediaOutputPath(page))}" title="Open Full Resolution">Open Full Resolution</a>
          <a id="share-button" style="display:none;">Share</a>
          <!--<a href="${page.link(this.getMediaOutputPath(page))}">Buy Prints</a>-->
        </span>
      </header>
    </section>

    <div class="content-media__description text page-content__text">
      ${markdown(page.contents || page.meta.summary)}
    </div>
${details ? html`<div class="content-media__details text page-content__text"><hr/>${details}</div>` : ''}
  </section>

  <script>${shareScript}</script>

</main>
${pageFooter(page)}
`
    });
  }

}
