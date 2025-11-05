const networkConfig = {
  'Base Mainnet': {
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
  },
  'Base Sepolia': {
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
  },
};

exports.handler = async function(event, context) {
  try {
    const { network, method, params, id } = JSON.parse(event.body);
    const config = networkConfig[network] || networkConfig['Base Sepolia']; // Fallback to Base Sepolia
    const rpcUrl = config.rpcUrl;

    const proxyRequest = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: id,
      }),
    };

    const response = await fetch(rpcUrl, proxyRequest);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error: ' + error.message })
    };
  }
};
