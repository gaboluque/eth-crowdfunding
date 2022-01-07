import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x2925e6c4262ceA468330628c1290cF2Ab9C87159'
)

export default instance;