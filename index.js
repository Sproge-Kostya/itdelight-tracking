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
  mcApi.get('/city/list', (req, res) => {
    const client = Magento2Client(config.magento2.api);
    let url = '/novaposhta/city/list/' +
      '?searchCriteria[filter_groups][0][filters][0][field]=city_id' +
      '&searchCriteria[filter_groups][0][filters][0][value]=0' +
      '&searchCriteria[filter_groups][0][filters][0][condition_type]=from';

    client.addMethods('sendCitys', (restClient) => {
      let module = {};
      module.getBlock = function () {
        return restClient.get(url);
      }
      return module;
    })
    client.sendCitys.getBlock().then((result) => {
      apiStatus(res, result, 200); // just dump it to the browser, result = JSON object
    }).catch(err => {
      apiStatus(res, err, 500);
    });
  });
  mcApi.get('/warehouse/list/:cityId', (req, res) => {
    const client = Magento2Client(config.magento2.api);
    let url = '/novaposhta/warehouse/list/' +
      '?searchCriteria[filter_groups][0][filters][0][field]=city_id' +
      '&searchCriteria[filter_groups][0][filters][0][value]=' + req.params.cityId;

    client.addMethods('sendWarehouse', (restClient) => {
      let module = {};
      module.getBlock = function () {
        return restClient.get(url);
      }
      return module;
    })
    client.sendWarehouse.getBlock().then((result) => {
      apiStatus(res, result, 200); // just dump it to the browser, result = JSON object
    }).catch(err => {
      apiStatus(res, err, 500);
    });
  });

  return mcApi;
}
