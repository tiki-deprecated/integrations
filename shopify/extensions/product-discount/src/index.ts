import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
} from "../generated/api";

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

type Configuration = {};

export default (input: InputQuery): FunctionResult => {
  const configuration: Configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );
  return EMPTY_DISCOUNT;
};