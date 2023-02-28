const tokenContractAddress = '0x8d9Ab6Aa28720a28D75CA157F7E16E9109520bAd';

// Instantiate the contract object
const afterlife = web3.eth.contract(afterlifeAbi);
const tokenContract = afterlife.at(tokenContractAddress);

window.addEventListener('load', async () => {
  // Wait for MetaMask to load
  if (typeof window.ethereum !== 'undefined') {
    // Add event listener for connect button
    document.getElementById('connectButton').addEventListener('click', async () => {
      try {
        // Check if the user is connected to the correct network
        const chainId = await ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0xfa') {
          document.getElementById('alert_message').innerHTML = '<div class="alert alert-danger" role="alert">Please connect to the Fantom Opera network to use this dApp.</div>';
          return;
        } else {
	         document.getElementById('connectButton').innerHTML = 'Show total balance';
	      }
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Set up web3 object
        web3 = new Web3(window.ethereum);
        initApp();
      } catch (error) {
        console.error(error);
        document.getElementById('alert_message').innerHTML = '<div class="alert alert-danger" role="alert">Failed to connect to MetaMask.</div>';
      }
    });
  } else {
    // If MetaMask is not installed or not running, display an error
    document.getElementById('alert_message').innerHTML = '<div class="alert alert-danger" role="alert">Please install and connect to MetaMask to use this dApp.</div>';
  }
});

// Handle form submission
document.getElementById('sendTokenForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const chainId = await ethereum.request({ method: 'eth_chainId' });
  // Get the selected token ID
  const selectedTokenId = document.querySelector('input[name="tokenid"]:checked').value;
  // Get the recipient address
  const recipientAddress = document.querySelector('input[name="rcvaddress"]').value;
  // Get the amount
  const amount = event.target.elements.amount.value;
  // Call the transfer function of the ERC1155 token contract
  if(chainId !== '0xfa') {
        tokenContract.safeTransferFrom(web3.eth.defaultAccount, recipientAddress, selectedTokenId, amount, [], function(err, res) {
            if(!err) {
                var txHash = res.transaction.Hash;
                document.getElementById('alert_message').innerHTML = '<div class="alert alert-success" role="alert">Transfer successful! <a href="https://ftmscan.com/tx/'+txhash+'">'+txhash+'</a></div>';
            } else
                document.getElementById('alert_message').innerHTML = '<div class="alert alert-danger" role="alert">Transfer failed.</div>';
        });
  } else {
      document.getElementById('alert_message').innerHTML = '<div class="alert alert-danger" role="alert">Wrong chain, switch to Fantom</div>';
  }
});

// Initialize the app
async function initApp() {
   // Get the balances of the three token types
  tokenContract.balanceOf(web3.eth.defaultAccount, '98', function (err, res){document.getElementById('pennycount').innerHTML = res.c[0];});
  tokenContract.balanceOf(web3.eth.defaultAccount, '100', function (err, res){document.getElementById('shillcount').innerHTML = res.c[0];});
  tokenContract.balanceOf(web3.eth.defaultAccount, '110', function (err, res){document.getElementById('koincount').innerHTML = res.c[0];});
  var pennies = parseInt(document.getElementById('pennycount').textContent, 10);
  var shills = parseInt(document.getElementById('shillcount').textContent, 10)*2;
  var koins = parseInt(document.getElementById('koincount').textContent, 10)*20;
  var total = pennies + shills + koins;
  if(!isNaN(total)) { document.getElementById('totalcount').innerHTML = total; }
}
