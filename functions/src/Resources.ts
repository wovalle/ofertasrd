export default {
  en: {
    telegram: {
      afterStart:
        "Thank you for using ofertasrd bot. You'll now receive all the great offers in Dominican Republic.",
      invalidCommand: 'Invalid Command',
      invalidUser: 'Invalid User',
      // TODO: refactor into a presenter (ViagrupoDealPresenter -> IDealPresenter)
      dealToText: (deal: any): string => {
        const savings = 100 - (deal.price / deal.originalPrice) * 100;
        const link = `http://viagrupo.com${deal.slug}`;
        return [
          `[${deal.title}](${link})`,
          `*Price:* ${deal.price} (from ${deal.originalPrice})`,
          `*Savings:* *${savings.toFixed(2)}%*`,
          `*Valid until:* ${deal.endDate}`,
        ].join('\n');
      },
    },
  },
};
