import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

let cachedPage;

export function getSiteMarkup(selector) {
  if (!cachedPage) {
    const source = fs.readFileSync(path.join(process.cwd(), 'content', 'site.html'), 'utf8');
    cachedPage = load(source);
  }

  const element = cachedPage(selector).first();
  if (!element.length) throw new Error(`Missing source markup for ${selector}`);
  element.find('*').addBack().each((_, node) => {
    ['src', 'poster', 'href', 'data-preview'].forEach((attribute) => {
      const value = cachedPage(node).attr(attribute);
      if (value?.startsWith('media/')) cachedPage(node).attr(attribute, `/${value}`);
      else if (attribute === 'src' && value === '') cachedPage(node).removeAttr(attribute);
    });
  });
  return cachedPage.html(element);
}