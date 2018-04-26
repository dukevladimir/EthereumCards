App = {
  web3Provider: null,
  contracts: {},

  init: function() {
      
      console.log("init");

    App.initWeb3(); // which initialises the contract
    var ids = App.getCardIds();

  },

  getCardIds: function () {
      web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.CardGame.deployed().then(function(instance) {
        
        CardGameInstance = instance;
        var ids = CardGameInstance.getCardIds.call().then(function(result){
        ids = result.map(Number) 
        var InsertHere = $('#insert_here');
        var CardTemplate = $('#CardTemplate');
          
          // Loop through each card id in the contract and draw to the screen

          for (var i = 0; i <ids.length; i++) {

            var tmp = i;
            var attrs = CardGameInstance.getCardById.call(ids[i]).then(function(result){

              CardTemplate.find('.card-title').text(result[0]);
              CardTemplate.find('.pic').attr('src',"https://ipfs.io/ipfs/".concat(result[4]))  
              CardTemplate.find('.Power').text(Number(result[1]));
              CardTemplate.find('.Health').text(Number(result[2]));
              CardTemplate.find('.btn').attr('data-id',result[0]);

              InsertHere.append(CardTemplate.html());

            });

          }
          return ids;
        });  
      }).catch(function(err) {
        console.log(err.message);
      });

    });
  },

  initWeb3: function() {
    
    console.log("initWeb3");
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

    console.log("initContract");
    
    $.getJSON('CardGame.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var CardGameArtifact = data;
      App.contracts.CardGame = TruffleContract(CardGameArtifact);

      // Set the provider for our contract
      App.contracts.CardGame.setProvider(App.web3Provider);

      // Bind events
      console.log("binding events");
      return App.bindEvents();

    });

  },


  bindEvents: function() {
    console.log("Bind events running");
    $(document).on('click', '.btn-create', App.handleCreate);
    $(document).on('click', '.btn-issue', App.handleIssue);
    
  },

  handleIssue: function(event){

    console.log("issue");

    var cardId = $(event.target).attr('data-id');
    console.log(cardId);

     web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.CardGame.deployed().then(function(instance) {
        CardGameInstance = instance;

        // Issue cards to owners
        return CardGameInstance.PrintCards(cardId,1);
      
      }).catch(function(err) {
        console.log(err.message);
      });
    });   

  },


  handleCreate: function(event) {
    event.preventDefault();
    console.log("clicked");    
    
    var CardTitle = $(".card_name").val();
    var Power = parseInt($(".power").val());
    var Health = parseInt($(".health").val());
    var Meta = $(".meta").val();
    var IPFS = $(".ipfs-hash").val();

    var CardGameInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.CardGame.deployed().then(function(instance) {
        CardGameInstance = instance;

        console.log("contract is deployed!");
        console.log(CardTitle);
        console.log(Power);
        console.log(Health);
        console.log(Meta);
        console.log(IPFS);

        // Execute adopt as a transaction by sending account
        return CardGameInstance.CreateCard(CardTitle,Power,Health,Meta,IPFS);
      
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
