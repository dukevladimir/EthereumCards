pragma solidity ^0.4.19;

/**
 * The Owned contract does this and that....
 */
contract Owned {
	
	address owner;

	constructor() public {
		
		owner = msg.sender;

	}
}

/**
 * CardGame contractd
 */
contract CardGame is Owned {
	
	uint next_id = 1; // used to assign unique id to each card

	struct Card{

		string name; // name shown on the card
		uint power; // power
		uint health; // health
		string meta; // a json format string - used to hold complex card definitions and js readable
	}


	/**
	*  Define OwnerOnly modifier to restrict function calls to owner
	*/
	modifier OwnerOnly() { 
		require (msg.sender == owner); 
		_; 
	}


	/**
	* 	Define array to store all card definitions
	*/
	mapping(uint => Card) cards; // mapping from card id to card definition
	uint[] ids; // list of all card ids
	mapping(string => uint) names; // mapping from card name to id


	/**
	*	Collection of cards struct
	*/ 
	struct Collection{
		mapping(uint => uint) collection;
	}


	/**
	* 	Who owns what
	*/
	mapping(address => Collection) holdings;


	/**
	*	Print cards and give them to the owner
	*/
	function PrintCards(uint id,uint quantity) public OwnerOnly{
		holdings[owner].collection[id] += quantity;
	}

	/**
	* 	Transfer single card
	*/
	function TransferSingle(address to,uint id) public {
		require(holdings[msg.sender].collection[id] > 1);
		holdings[to].collection[id] += 1;
		holdings[msg.sender].collection[id] -=1;
	}


	/**
	* 	Get the number of defined cards in existance
	*/
	function numberOfCards() public view returns (uint){
		return ids.length;
	}


	/**
	* 	Contract constructor
	*/
	constructor() public {

	}


	/**
	*	Create card
	*/
	function CreateCard(
			string _name,
			uint _power,
			uint _health,
			string _meta) public OwnerOnly {

		cards[next_id] = Card(_name,_power,_health,_meta);
		ids.push(next_id);
		names[_name] = next_id;
		next_id++;

	}


	/**
	* 	Get card by id
	*/
	function getCardById(uint id) public view returns (string,uint,uint,string) {
		return (cards[id].name,cards[id].power,cards[id].health,cards[id].meta);
	}

	/**
	*	Get card by name
	*/
	function getCardByName (string name) public view returns (string,uint,uint,string) {
		uint id = names[name];
		return getCardById(id);
	}
	

	/**
	*	Get names
	*/
	function getCardIds() public view returns (uint[]){
		return ids;
	}


	/**
	*  Delete card
	*/

}

