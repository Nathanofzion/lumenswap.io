const rootUrl = {
  obm: '/obm',
  reward: '/reward',
  amm: '/amm',
};

if (process.env.REACT_APP_MODE === 'OBM') {
  rootUrl.obm = '';
} else if (process.env.REACT_APP_MODE === 'REWARD') {
  rootUrl.reward = '';
} else if (process.env.REACT_APP_MODE === 'AMM') {
  rootUrl.amm = '';
}

const urlMaker = {
  root: () => '/',
  swap: {
    root: () => `${rootUrl.obm}/swap`,
    tokens: (tokenA, tokenB) => `${rootUrl.obm}/swap/${tokenA}-${tokenB}`,
    custom: (assetACode, assetAIssuer, assetBCode, assetBIssuer) => {
      const rootPath = `${rootUrl.obm}/swap/`;
      const partA = `${[assetACode, assetAIssuer].filter((i) => i).join('-')}`;
      const partB = `${[assetBCode, assetBIssuer].filter((i) => i).join('-')}`;

      return `${rootPath}${partA}/${partB}`;
    },
  },
  spot: {
    root: () => `${rootUrl.obm}/spot`,
    tokens: (tokenA, tokenB) => `${rootUrl.obm}/spot/${tokenA}-${tokenB}`,
    custom: (assetACode, assetAIssuer, assetBCode, assetBIssuer) => {
      const rootPath = `${rootUrl.obm}/spot/`;
      const partA = `${[assetACode, assetAIssuer].filter((i) => i).join('-')}`;
      const partB = `${[assetBCode, assetBIssuer].filter((i) => i).join('-')}`;

      return `${rootPath}${partA}/${partB}`;
    },
  },
  market: {
    root: () => `${rootUrl.obm}/market`,
  },
  reward: {
    root: () => `${rootUrl.reward}/reward`,
  },
  wallet: {
    root: () => `${rootUrl.obm}/wallet`,
  },
  order: {
    root: () => `${rootUrl.obm}/order`,
  },
  pool: {
    root: () => `${rootUrl.amm}/pool`,
    tokens: (tokenA, tokenB) => `${rootUrl.amm}/pool/${tokenA}/${tokenB}`,
  },
  stats: {
    root: () => `${rootUrl.amm}/stats`,
    tokens: (tokenA, tokenB) => `${rootUrl.amm}/stats/${tokenA}/${tokenB}`,
  },
};

export default urlMaker;
