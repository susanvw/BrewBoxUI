/**
 * Represents the available drink sizes.
 * 
 * @enum {string}
 * @property {string} Small - A small-sized drink.
 * @property {string} Medium - A medium-sized drink.
 * @property {string} Large - A large-sized drink.
 */
export enum EDrinkSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

/**
 * Enum representing the different types of drinks available in the BrewBox application.
 *
 * @remarks
 * This enum is used to specify the type of coffee drink selected or available.
 *
 * @example
 * ```typescript
 * const myDrink: EDrinkType = EDrinkType.Latte;
 * ```
 */
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
