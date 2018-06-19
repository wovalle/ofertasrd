import * as functions from 'firebase-functions';
import axios from 'axios';

import ViagrupoParser from './Parsers/Viagrupo';

// Foreach parser, make an async call. Call parser.isApplicable afterwards.
export const Viagrupo = functions.https.onRequest(async (req, res) => {
  const html = await axios('http://www.viagrupo.com/santo-domingo/active');
  const viagrupoParser = new ViagrupoParser();
  res.send(viagrupoParser.parse(html.data));
});
