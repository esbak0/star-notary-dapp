import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;
    console.log(web3);
    console.log(starNotaryArtifact);
    try {
      // get contract instance
      console.log('asdfasdf');
      const networkId = await web3.eth.net.getId();
      console.log(networkId);
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.log(error);
      console.error("Could not connect to contract or chain.");
    }
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    App.setStatus("Creating star: " + name);
    const id = document.getElementById("starId").value;
    try {
      await createStar(name, id).send({from: this.account});
      App.setStatus("New Star Owner is " + this.account + ".");
    } catch (e) {
      App.setStatus("Error " + e.message + ".");
    }
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function (){
    App.setStatus("Searching star info");
    const {lookUptokenIdToStarInfo} = this.meta.methods;
    const starId = document.getElementById("lookid").value;
    const starName = await lookUptokenIdToStarInfo(starId).call();
    App.setStatus("Star name for id " + starId + " is " + starName);
  }

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});
