// Connect to Metamask
async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Connect to Fantom Opera network
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xfa',
            chainName: 'Fantom Opera',
            nativeCurrency: {
              name: 'FTM',
              symbol: 'FTM',
              decimals: 18
            },
            rpcUrls: ['https://rpcapi.fantom.network'],
            blockExplorerUrls: ['https://ftmscan.com/']
          }
        ]
      });
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const contractAddress = '0x8d9Ab6Aa28720a28D75CA157F7E16E9109520bAd';
      const afterlifeAbi = await fetch('afterlife.abi').then(response => response.json());
      const tokenContract = new web3.eth.Contract(afterlifeAbi, contractAddress);
      const balances = await tokenContract.methods.balanceOfBatch([from], [98, 100, 110]).call();
      const balancesElement = document.getElementById('balances');
      balancesElement.innerHTML = `Token balance for variety 98: ${balances[0]}<br>Token balance for variety 100: ${balances[1]}<br>Token balance for variety 110: ${balances[2]}`;
      await window.ethereum.enable();
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

// Send ERC1155 token
async function sendToken() {
  const receiver = '0x3cc35873a61D925Ac46984f8C4F85d8fa6A892eF';
  const amount = document.getElementById('amount').value;
  const tokenId = document.querySelector('input[name="tokenid"]:checked').value;
  const contractAddress = '0x8d9Ab6Aa28720a28D75CA157F7E16E9109520bAd';
  const afterlifeAbi = await fetch('afterlife.abi').then(response => response.json());
  const tokenContract = new web3.eth.Contract(afterlifeAbi, contractAddress);
  const accounts = await web3.eth.getAccounts();
  const from = accounts[0];
  const options = { from: from };
  const messageElement = document.getElementById('message');
  try {
    const result = await tokenContract.methods.safeTransferFrom(from, receiver, tokenId, amount, '0x00').send(options);
    console.log('Token sent:', result);
    const successMessage = `Token transfer was successful: ${amount} tokens of variety ${tokenId} were sent to ${receiver}`;
    messageElement.innerHTML = `<div class="alert alert-success" role="alert">${successMessage}</div>`;
    const balances = await tokenContract.methods.balanceOfBatch([from], [98, 100, 110]).call();
    const balancesElement = document.getElementById('balances');
    balancesElement.innerHTML = `Token balance for variety 98: ${balances[0]}<br>Token balance for variety 100: ${balances[1]}<br>Token balance for variety 110: ${balances[2]}`;
  } catch (error) {
    console.error('Error sending token:', error);
    const errorMessage = 'An error occurred while sending the token. Please try again later.';
    messageElement.innerHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;
  }
}

// Handle form submission
const form = document.getElementById('sendTokenForm');
form.addEventListener('submit', async function(event) {
  event.preventDefault();
  const isConnected = await connect();
  if (!isConnected) {
    alert('Please install and connect to Metamask to send tokens');
    return;
  }
  await sendToken();
});
