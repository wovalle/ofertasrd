import * as functions from 'firebase-functions';
import * as cheerio from 'cheerio';
import ViagrupoParser from './Parsers/Viagrupo';
import IHttp from './IHttp';

// Foreach parser, make an async call. Call parser.isApplicable afterwards.
export default (http: IHttp) => ({
  viagrupo: functions.https.onRequest(async (req, res) => {
    const html = await http.get('http://www.viagrupo.com/santo-domingo/active');
    const viagrupoParser = new ViagrupoParser(cheerio);

    res.send(viagrupoParser.parse(html.data));
  }),
});
