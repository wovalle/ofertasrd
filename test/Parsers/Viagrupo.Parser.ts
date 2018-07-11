import * as cheerio from 'cheerio';
import { assert } from 'chai';

import { DealProvider } from '../../src/Models/Deal';
import ViagrupoParser from '../../src/Parsers/Viagrupo';
import viagrupoFixture from '../Fixtures/viagrupo.html';

describe('Viagrupo Handler', () => {
  describe('parse', () => {
    it('should parse viagrupo page', () => {
      const requestDate = new Date();
      const viagrupoParser = new ViagrupoParser(cheerio, {
        getCurrent: () => requestDate,
      });
      const deals = viagrupoParser.parse(viagrupoFixture);

      const firstDeal = {
        provider: DealProvider.Viagrupo,
        title:
          '¡El Regalo perfecto para Papá! Aprovecha y paga RD$2,895 en vez de RD$6,000 por Tablet Amazon Fire 7 con Alexa de 8 GB',
        id: 'el-regalo-perfecto-aprovecha-y-paga-desde-rd28t4l',
        slug:
          '/santo-domingo/el-regalo-perfecto-aprovecha-y-paga-desde-rd28t4l',
        description: '¡Tablet Amazon Fire 7 con Alexa de 8 GB!',
        price: 2895,
        originalPrice: 6000,
        endDate: new Date('2018-07-17T04:00:00.000Z'),
        requestDate,
        url: '',
      };

      assert.equal(deals.length, 4);
      assert.deepEqual(firstDeal, { ...deals[0], url: '' });
    });
  });
});
