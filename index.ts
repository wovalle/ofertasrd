import axios from 'axios';
import cheerio from 'cheerio';

class Deal {
  title!: string;
  description!: string;
  url!: string;
  price!: Number;
  originalPrice!: Number;
  endDate!: Date;
}

const url: string = 'http://www.viagrupo.com/santo-domingo/active';

async function foo(url: string): Promise<void> {
  const result = await axios.get(url);
  const $ = cheerio.load(result.data);
  const domList = $('.alld_deal');

  const deals = domList.get().map(e => {
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

    const dateString = details.find('.small_details script').html();

    return {
      title: header.text().trim(),
      url,
      description,
      price: Number(priceText),
      discountedPrice: Number(priceText) + Number(originalPriceText),
      dateString,
    };
  });
}

foo(url);
