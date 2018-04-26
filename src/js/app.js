App = {
  web3Provider: null,
  contracts: {},

  init: function() {
      
      console.log("init");

      //var CardsLoad = $('#CardsLoad');
      //var CardTemplate = $('#CardTemplate');

      //  CardTemplate.find('.card-title').text("My first card");
      //  CardTemplate.find('img').attr('src', "./images/default.png");
      //  CardTemplate.find('.Power').text("2");
      //  CardTemplate.find('.Health').text("3");

      //  CardsLoad.append(CardTemplate.html());
      

    //return App.initWeb3();
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
          for (var i = 0; i <ids.length; i++) {
            CardTemplate.find('.card-title').text(ids[i]);
            CardTemplate.find('.img').attr('src',"./images/default.png");
            CardTemplate.find('.Power').text("4");
            CardTemplate.find('.Health').text("5");

            InsertHere.append(CardTemplate.html());
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
    $(document).on('click', '.btn-create', App.handleCreate);
    console.log("clicked");
  },


  handleCreate: function(event) {
    
    console.log("clicked");
    
    event.preventDefault();

    var CardTitle = $(".card_name").val();
    var Power = parseInt($(".power").val());
    var Health = parseInt($(".health").val());
    var Meta = $(".meta").val();

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

        // Execute adopt as a transaction by sending account
        return CardGameInstance.CreateCard(CardTitle,Power,Health,Meta);
      
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
