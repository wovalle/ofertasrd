import Deal from './Models/Deal';

export default {
  en: {
    telegram: {
      afterStart:
        "Thank you for using ofertasrd bot. You'll now receive all the great offers in Dominican Republic.",
      invalidCommand: 'Invalid Command',
      invalidUser: 'Invalid User',
      emptyDeals: 'Sorry, right now there is no deals available.',
      // TODO: refactor into a presenter (ViagrupoDealPresenter -> IDealPresenter)
      dealToText: (deal: Deal): string => {
        const savings = 100 - (deal.price / deal.originalPrice) * 100;
        return [
          `[${deal.title}](${deal.url})`,
          `*Price:* ${deal.price} (from ${deal.originalPrice})`,
          `*Savings:* *${savings.toFixed(2)}%*`,
          `*Valid until:* ${deal.endDate}`,
        ].join('\n');
      },
    },
  },
};
