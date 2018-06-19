import IParser from './IParser';
import Deal from '../Models/Deal';
import * as cheerio from 'cheerio';

// TODO: classify by categories. Probably will have to make n requests

export default class ViagrupoParser implements IParser {
  isApplicable(url: string) {
    return /viagrupo.com/.test(url);
  }

  parse(htmlBody: string): Deal[] {
    const $ = cheerio.load(htmlBody);
    const domList = $('.alld_deal');

    return domList.get().map(e => {
      const $e = cheerio(e);
      const header = $e.find('.alldeal_content .noir');
      const description = $e.find('.alld_desc h3').text();
      const details = $e.find('.alld_details');

      const url = `http://viagrupo.com${header.attr('href')}`;

      const priceText = details
        .find('.alld_v')
        .text()
        .trim()
        .replace('RD$', '');

      const originalAmountDescription = details
        .find('.alld_save')
        .first()
        .text();

      const originalPriceText = originalAmountDescription
        .trim()
        .split(' ')
        .slice(-1)[0]
        .replace('RD$', '');

      //TODO: parse date
      const dateString = details.find('.small_details script').html();

      return {
        title: header.text().trim(),
        url,
        description,
        price: Number(priceText),
        originalPrice: Number(priceText) + Number(originalPriceText),
        endDate: new Date(),
        requestDate: new Date(),
      };
    });
  }
}
