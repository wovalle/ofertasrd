import IParser from './IParser';
import Deal, { DealProvider } from '../Models/Deal';
import ITime from '../ITime';

// TODO: classify by categories. Probably will have to make n requests
export default class ViagrupoParser implements IParser {
  constructor(private cheerio: any, private iTime: ITime) {}

  isApplicable(url: string) {
    return /viagrupo.com/.test(url);
  }

  parse(htmlBody: string): Deal[] {
    const $ = this.cheerio.load(htmlBody);
    const domList = $('.alld_deal');
    console.info(`PARSER: got ${domList.length} deals parsing started`);

    return domList.get().map((e: any) => {
      const $e = this.cheerio(e);
      const header = $e.find('.alldeal_content .noir');
      const description = $e.find('.alld_desc h3').text();
      const details = $e.find('.alld_details');

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

      const dateString = details.find('.small_details script').html();
      const dateRegex = dateString.match(
        /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/i
      );
      const endDate = dateRegex.length ? new Date(dateRegex[0]) : null;
      const slug = header.attr('href');

      // TODO: add static 'viagrupo' to Provider. Enum?
      return {
        provider: DealProvider.Viagrupo,
        title: header.text().trim(),
        id: slug.split('/').slice(-1)[0],
        slug,
        description,
        price: Number(priceText),
        originalPrice: Number(priceText) + Number(originalPriceText),
        endDate,
        requestDate: this.iTime.getCurrent(),
      };
    });
  }
}
