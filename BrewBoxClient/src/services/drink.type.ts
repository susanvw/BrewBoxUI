/**
 * Represents the available types of drinks in the BrewBox application.
 *
 * - `'Espresso'`: A strong coffee brewed by forcing hot water under pressure through finely-ground coffee beans.
 * - `'Latte'`: A coffee drink made with espresso and steamed milk.
 * - `'Cappuccino'`: A coffee drink consisting of espresso, steamed milk, and milk foam.
 * - `'Americano'`: Espresso diluted with hot water, resulting in a lighter flavour.
 * - `'Mocha'`: A chocolate-flavoured variant of a latte, combining espresso, steamed milk, and chocolate.
 */
export type EDrinkType =
  | 'Espresso'
  | 'Latte'
  | 'Cappuccino'
  | 'Americano'
  | 'Mocha';

/**
 * Represents the available drink sizes.
 * 
 * - `'Small'`: A small-sized drink.
 * - `'Medium'`: A medium-sized drink.
 * - `'Large'`: A large-sized drink.
 */
export type EDrinkSize = 'Small' | 'Medium' | 'Large';

/**
 * Represents a drink item in an order.
 *
 * @property id - Unique identifier for the drink.
 * @property orderId - Identifier of the order this drink belongs to.
 * @property type - The type of drink, as defined by the `EDrinkType` enum.
 * @property size - The size of the drink, as defined by the `EDrinkSize` enum.
 * @property price - The price of the drink.
 */
export interface IDrink {
  id: string;
  orderId: string;
  type: EDrinkType,
  size: EDrinkSize;
  price: number;
}
