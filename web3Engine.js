<script src="https://cdn.ethers.io/lib/ethers-5.2.umd.min.js"></script>
<script type="module">
  import { connectWallet, estimateTNX, sendETHAndBuyTNX } from './web3Engine.js';

  // Exemplo de uso
  document.getElementById("connectBtn").onclick = async () => {
    const addr = await connectWallet();
    document.getElementById("walletAddress").innerText = addr;
  };

  document.getElementById("ethAmount").oninput = () => {
    const eth = document.getElementById("ethAmount").value;
    const tnx = estimateTNX(eth, 0); // Substitui 0 pelo total de tokens vendidos reais
    document.getElementById("tnxEstimate").innerText = tnx.toFixed(2);
  };

  document.getElementById("buyBtn").onclick = async () => {
    const eth = document.getElementById("ethAmount").value;
    const ok = await sendETHAndBuyTNX(eth);
    if (ok) alert("Compra efetuada com sucesso!");
  };
</script>
