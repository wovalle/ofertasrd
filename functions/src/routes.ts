import * as functions from 'firebase-functions';
import * as cheerio from 'cheerio';
import ViagrupoParser from './Parsers/Viagrupo';

import IHttp from './IHttp';
import IRepository from './Repositories/IRepository';
import Deal from './Models/Deal';

// Foreach parser, make an async call. Call parser.isApplicable afterwards.
export default (http: IHttp, dealRepository: IRepository<Deal>) => ({
  viagrupo: functions.https.onRequest(async (req, res) => {
    const html = await http.get('http://www.viagrupo.com/santo-domingo/active');
    const viagrupoParser = new ViagrupoParser(cheerio);

    const deals = viagrupoParser.parse(html.data);

    await dealRepository.saveAll(deals);

    res.send(deals);
  }),
});
