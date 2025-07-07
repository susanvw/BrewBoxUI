export enum EDrinkSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

export enum EDrinkType {
  Espresso = 'Espresso',
  Latte = 'Latte',
  Cappuccino = 'Cappuccino',
  Americano = 'Americano',
  Mocha = 'Mocha',
}

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
  type: EDrinkType;
  size: EDrinkSize;
  price: number;
}
