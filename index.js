import { apiStatus } from '../../../lib/util';
import { Router } from 'express';
const Magento2Client = require('magento2-rest-client').Magento2Client

module.exports = ({ config }) => {
  let mcApi = Router();

  mcApi.post('/novaposhta/tracker', (req, res) => {
    const client = Magento2Client(config.magento2.api);

    client.addMethods('sendDetails', (restClient) => {
      let module = {};

      module.formData = function (data) {
        return restClient.post('/novaposhtaTracker/', data);
      }
      return module;
    })
    client.sendDetails.formData(req.body).then((result) => {
      apiStatus(res, result, 200); // just dump it to the browser, result = JSON object
    }).catch(err => {
      apiStatus(res, err, 500);
    });
  });

  return mcApi;
}
