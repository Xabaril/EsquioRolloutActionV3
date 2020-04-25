import * as core from '@actions/core';
import url =  require('url'); 
const https = require('https');

async function run() {  
  try {
    const esquioUrl = core.getInput('esquio-url');
    const esquioApiKey = core.getInput('esquio-api-key');
    const productName = core.getInput('product-name');
    const featureName = core.getInput('feature-name');

    await rolloutFeature(url.parse(esquioUrl), esquioApiKey, productName, featureName);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function rolloutFeature(esquioUrl: url.UrlWithStringQuery, esquioApiKey: string, productName: string, featureName: string) {
  const options = {
      hostname: esquioUrl.host,
      path: `/api/products/${productName}/features/${featureName}/Rollout?apikey=${esquioApiKey}`,
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': esquioApiKey,
          'x-api-version': '3.0'
      }
  }
  const req = https.request(options, (res: any) => {
      if (res.statusCode === 200) {
          console.log('Feature rollout succesful');
      }

      res.on('data', (data: any) => {
          if (res.statusCode != 200) {
              const responseData = JSON.parse(data);
              core.setFailed(`Error in feature rollout ${responseData.detail} HttpCode: ${res.statusCode}`);
          }
      });
  });
  req.on('error', (error: any) => {
    core.setFailed(error);
  });

  req.end();
}

run();
