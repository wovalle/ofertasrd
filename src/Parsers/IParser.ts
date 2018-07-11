import Deal from '../Models/Deal';

export default interface Parser {
  parse(htmlBody: string): Deal[];
  isApplicable(url: string): Boolean;
}
