// web3Engine.js — com leitura do contrato + preço ETH em USD via CoinGecko

const CONTRACT_ADDRESS = "0x9ff1e4CD11E55A89720BFE54F4B7c084e31005A4";
const INITIAL_PRICE = 0.0025; // ETH por TNX
const TOKENS_PER_ROUND = 1_000_000;

let account = null;
let provider, signer, contract;

// ABI mínima necessária para interagir com o contrato
const CONTRACT_ABI = [
  "function tokensSold() public view returns (uint256)"
];

window.connectWallet = async function () {
  if (!window.ethereum) {
    alert("MetaMask não encontrada");
    return;
  }
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const [addr] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    account = addr;
    return addr;
  } catch (err) {
    console.error("Erro ao conectar carteira:", err);
  }
};

window.getTokensSold = async function () {
  if (!contract) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  }
  const sold = await contract.tokensSold();
  return parseInt(ethers.utils.formatUnits(sold, 18));
};

window.calculatePrice = function (tokensSold) {
  const rounds = Math.floor(tokensSold / TOKENS_PER_ROUND);
  return INITIAL_PRICE * Math.pow(1.025, rounds);
};

window.estimateTNX = function (ethValue, tokensSold) {
  const price = window.calculatePrice(tokensSold);
  return parseFloat(ethValue || 0) / price;
};

window.sendETHAndBuyTNX = async function (ethAmount) {
  if (!account || !ethAmount) {
    alert("Preencha todos os campos e conecte a carteira");
    return false;
  }
  try {
    const tx = await signer.sendTransaction({
      to: CONTRACT_ADDRESS,
      value: ethers.utils.parseEther(ethAmount.toString())
    });

    await tx.wait();
    return true;
  } catch (error) {
    console.error("Erro na transação:", error);
    alert("Erro ao enviar transação");
    return false;
  }
};

window.getETHPriceUSD = async function () {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const data = await res.json();
    return data.ethereum.usd;
  } catch (err) {
    console.error("Erro ao buscar preço do ETH:", err);
    return null;
  }
};
