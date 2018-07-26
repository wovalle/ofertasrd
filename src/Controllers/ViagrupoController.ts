import IHttp from '../IHttp';
import DealRepository from '../Repositories/DealRepository';
import ViagrupoParser from '../Parsers/Viagrupo';
import Deal from '../Models/Deal';

export default (http: IHttp, dealRepository: DealRepository) => ({
  parseDeals: async () => {
    const html = await http.get('http://www.viagrupo.com/santo-domingo/active');
    console.info('HANDLER: html downloaded, starting parser');
    const viagrupoParser = new ViagrupoParser(cheerio, {
      getCurrent: () => new Date(),
    });

    const parsedDeals = viagrupoParser.parse(html.data);
    console.info(
      `HANDLER: html downloaded. Deals parsed: ${parsedDeals.length}.`
    );

    const activeDealsIds = await dealRepository.getAllActiveIds();
    const dealIsSaved = (deal: Deal) => activeDealsIds.some(d => d === deal.id);

    const remainingDeals = parsedDeals.filter(d => !dealIsSaved(d));
    console.info(`Saving ${remainingDeals.length} new deals`);

    return dealRepository.saveAll(remainingDeals);
  },
});
