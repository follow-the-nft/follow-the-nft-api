'use strict';

const axios = require('axios');
require('dotenv').config();

const express = require('express');
const publicRouter = express.Router();

const OPENSEA_API_URL = process.env.OPENSEA_API_URL || 'https://api.opensea.io/api/v1/';

// Get NFT by NFT token address

class Router {
  
}

const getId = async (id) => {

  publicRouter.get('/nft/:id', async (req, res, next) => {
    try {
      if(!/^[0-9]{77}$/g.test(req.params.id)) {
        throw new Error("Please enter an id .e.g '/nft/20512672236384795134598454803080694359308106914252699625353424791001018400769'");
      }
      let response = await axios.get(`${OPENSEA_API_URL}/assets?order_direction=desc&offset=0&token_ids=${req.params.id}`);
      res.status(200).json(response.data.assets);
    } catch(err) {
      next(err);
    }
  });
}

// Get NFTs owned by wallet address
publicRouter.get('/address/:address', async (req, res, next) => {
  try {
    if(!/^0x[a-fA-F0-9]{40}$/g.test(req.params.address)) {
      throw new Error("Please enter an address e.g. '/address/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270'");
    }
    let response = await axios.get(`${OPENSEA_API_URL}/assets?owner=${req.params.address}&order_direction=desc&offset=0`);
    res.status(200).json(response.data);
  } catch (err) {
    next(err);
  }
});

// Get multiple wallet addresses passed as '/addresses/:addresses,:addresses,:addresses...
publicRouter.get('/addresses/:addresses', async (req, res, next) => {
  try {
    if(!/[0xa-fA-F0-9]{42},?/g.test(req.params.addresses)) {
      throw new Error("Please enter an addresses separated by commas e.g. '/address/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270,0x495f947276749ce646f68ac8c248420045cb7b5e'");
    }
    // TODO validate address before splitting
    let addressList = req.params.addresses.split(',').map(address => address.toLowerCase());
    let uniqueAddress = [...new Set(addressList)];
    
    // Push all addresses to string
    let addressesString = '';
    uniqueAddress.map(address => {
      if(!/^0x[a-fA-F0-9]{40}$/g.test(address)) {
        throw new Error(`Invalid address ${address}`);
      }
      addressesString += `&asset_contract_addresses=${address}`;
    });
    let response = await axios.get(`${OPENSEA_API_URL}/assets?order_direction=desc&offset=0&${addressesString}`);
    res.status(200).json(response.data);
  } catch (err) {
    next(err);
  }
});

// Get a collection by collection slug
publicRouter.get('/collection/:slug', async (req, res, next) => {
  try {
    // TODO add some validation and return 404 when nothing is found
    let response = await axios.get(`${OPENSEA_API_URL}/collection/${req.params.slug}`);
    res.status(200).json(response.data);
  } catch (err) {
    next(err);
  }
});

module.exports = publicRouter;

// For Testing
// Sample NFT Token = 20512672236384795134598454803080694359308106914252699625353424791001018400769
// Sample Address = 0x495f947276749ce646f68ac8c248420045cb7b5e
// Sample Collection Slug = kumo-resident-y9rbt6bibp
