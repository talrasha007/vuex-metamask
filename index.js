import { Web3Wrapper } from '@0x/web3-wrapper';

const STATE = {
  WRONG_NETWORK: 'WRONG_NETWORK',
  NO_METAMASK: 'NO_METAMASK',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED'
};

export { STATE };

export default {
  state: {
    state: null,
    error: null,
    networkId: null,
    account: null
  },
  mutations: {
    setNetworkId(state, network) {
      state.networkId = network;
    },
    setAccount(state, acc) {
      state.account = acc;
    },
    setState(state, st) {
      state.state = st;
    },
    setError(state, err) {
      state.error = err;
    }
  },
  actions: {
    async init(ctx, networkRequired) {
      ctx.commit('setState', STATE.CONNECTING);

      const { ethereum } = window;
      if (!ethereum) return ctx.commit('setError', STATE.NO_METAMASK);

      try {
        const accounts = await ethereum.enable();
        const web3Wrapper = new Web3Wrapper(ethereum);
        const networkId = await web3Wrapper.getNetworkIdAsync();
        // ropsten
        if (networkRequired && networkId !== networkRequired)
          return ctx.commit('setError', STATE.WRONG_NETWORK);

        ctx.commit('setNetworkId', networkId);
        ctx.commit('setAccount', accounts[0]);
        ctx.commit('setState', STATE.CONNECTED);
      } catch (e) {
        console.error(e);
        ctx.commit('setError', { msg: e.message || e.toString(), critical: true });
      }
    }
  }
};